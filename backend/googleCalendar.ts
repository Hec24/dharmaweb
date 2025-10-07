// backend/googleCalendar.ts
import { google, calendar_v3 } from "googleapis";
import { GoogleAuth } from "google-auth-library";
import fs from "fs";
import os from "os";
import path from "path";
import { Reserva } from "./types";

// === Config ===
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

const IMPERSONATED_USER = process.env.GCAL_IMPERSONATED_USER || "info@dharmaenruta.com";
const CALENDAR_ID = process.env.GCAL_CALENDAR_ID || "primary";
const TIMEZONE = process.env.GCAL_TIMEZONE || "Europe/Madrid";

/**
 * Carga credenciales de forma segura:
 * - 1) GCP_CREDENTIALS_JSON  (contenido JSON)
 * - 2) GCP_CREDENTIALS_B64   (contenido JSON en base64)
 * - 3) GOOGLE_APPLICATION_CREDENTIALS (ruta a archivo JSON)
 * - 4) (solo dev) Fallback a ~/.secrets/dharmabookings.json
 */
function loadServiceAccountCredentials():
  | Record<string, any>
  | undefined {
  // 1) JSON plano
  if (process.env.GCP_CREDENTIALS_JSON) {
    return JSON.parse(process.env.GCP_CREDENTIALS_JSON);
  }

  // 2) JSON en base64
  if (process.env.GCP_CREDENTIALS_B64) {
    const json = Buffer.from(process.env.GCP_CREDENTIALS_B64, "base64").toString("utf8");
    return JSON.parse(json);
  }

  // 3) Ruta a archivo (Google SDK la usa si setea GOOGLE_APPLICATION_CREDENTIALS)
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Si está esta variable, GoogleAuth puede cargarlo sin pasar credentials.
    // Devolvemos undefined para dejar que GoogleAuth la use directamente.
    return undefined;
  }

  // 4) Fallback local (solo para desarrollo)
  const localPath = path.join(os.homedir(), ".secrets", "dharmabookings.json");
  if (fs.existsSync(localPath)) {
    const raw = fs.readFileSync(localPath, "utf8");
    return JSON.parse(raw);
  }

  // Sin credenciales → que falle temprano con un error claro
  throw new Error(
    "No se encontraron credenciales de Google. Define GCP_CREDENTIALS_JSON, GCP_CREDENTIALS_B64 o GOOGLE_APPLICATION_CREDENTIALS, o coloca ~/.secrets/dharmabookings.json"
  );
}

const credentials = loadServiceAccountCredentials();

// === Auth ===
// Si `credentials` es undefined y existe GOOGLE_APPLICATION_CREDENTIALS,
// GoogleAuth lo tomará de esa ruta automáticamente.
const auth = new GoogleAuth({
  credentials,
  scopes: SCOPES,
  clientOptions: { subject: IMPERSONATED_USER }, // domain-wide delegation
});
google.options({ auth: auth as any });

const calendar: calendar_v3.Calendar = google.calendar({ version: "v3" });

// === Utilidades ===
function sumarMinutos(horaHHMM: string, minutos: number) {
  const [h, m] = horaHHMM.split(":").map(Number);
  const d = new Date(2000, 0, 1, h ?? 0, (m ?? 0) + minutos);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function toRFC3339(date: string, time: string) {
  const safeTime = /^\d{2}:\d{2}$/.test(time) ? `${time}:00` : time;
  return `${date}T${safeTime}`;
}

async function withBackoff<T>(fn: () => Promise<T>, tries = 5): Promise<T> {
  let attempt = 0;
  let lastErr: any;
  while (attempt < tries) {
    try {
      return await fn();
    } catch (err: any) {
      const status = err?.code || err?.response?.status;
      const reason =
        err?.errors?.[0]?.reason ||
        err?.response?.data?.error?.errors?.[0]?.reason ||
        "";
      const isTransient =
        status === 429 ||
        status === 500 ||
        status === 503 ||
        (typeof reason === "string" && (
          reason.includes("rateLimitExceeded") ||
          reason.includes("userRateLimitExceeded")
        ));
      if (!isTransient) throw err;
      lastErr = err;
      const delay = Math.min(1000 * Math.pow(2, attempt), 12000);
      await new Promise((r) => setTimeout(r, delay));
      attempt++;
    }
  }
  throw lastErr;
}

// === Logs y helpers ===
const LOG_PREFIX = "[GCAL]";
const log = {
  info: (...a: any[]) => console.log(LOG_PREFIX, ...a),
  warn: (...a: any[]) => console.warn(LOG_PREFIX, ...a),
  error: (...a: any[]) => console.error(LOG_PREFIX, ...a),
};

function explainGoogleError(err: any) {
  const status = err?.code || err?.response?.status;
  const data = err?.response?.data || err?.errors || err?.message;
  return { status, data };
}

// ——— Búsquedas ———
export async function buscarEventoPorReservaId(reservaId: string) {
  const res = await withBackoff(() =>
    calendar.events.list({
      calendarId: CALENDAR_ID,
      privateExtendedProperty: [`reservaId=${reservaId}`],
      singleEvents: true,
      showDeleted: false,
      maxResults: 2,
    })
  );
  return res.data.items?.[0] ?? null;
}

export async function buscarEventoPorId(eventId: string) {
  try {
    const res = await withBackoff(() =>
      calendar.events.get({ calendarId: CALENDAR_ID, eventId })
    );
    return res.data;
  } catch (err: any) {
    const status = err?.code || err?.response?.status;
    if (status === 404) return null;
    throw err;
  }
}

// ——— Mapeo Reserva -> Event ———
function buildAttendees(reserva: Reserva): calendar_v3.Schema$EventAttendee[] {
  const emails = [
    (reserva.email || "").trim(),
    (reserva.acompananteEmail || "").trim(),
  ].filter(Boolean);
  const unique = Array.from(new Set(emails));
  return unique.map((email) => ({ email }));
}

function mapReservaToEvent(reserva: Reserva): calendar_v3.Schema$Event {
  const fecha = reserva.fecha;
  const horaInicio = reserva.hora;
  const duracionMin = reserva.duracionMin ?? 60;
  const horaFin = sumarMinutos(horaInicio, duracionMin);

  return {
    summary: `Acompañamiento con ${reserva.nombre} ${reserva.apellidos}`,
    description:
      `Sesión de acompañamiento Dharma en Ruta.` +
      (reserva.acompanante ? `\nAcompañante: ${reserva.acompanante}` : ""),
    start: { dateTime: toRFC3339(fecha, horaInicio), timeZone: TIMEZONE },
    end: { dateTime: toRFC3339(fecha, horaFin), timeZone: TIMEZONE },
    attendees: buildAttendees(reserva),
    guestsCanSeeOtherGuests: false,
    guestsCanInviteOthers: false,
    guestsCanModify: false,
    reminders: { useDefault: true },
    extendedProperties: { private: { reservaId: reserva.id } },
  };
}

function needsUpdate(existing: calendar_v3.Schema$Event, desired: calendar_v3.Schema$Event) {
  const a = existing;
  const b = desired;
  const sA = a.start?.dateTime ?? "";
  const sB = b.start?.dateTime ?? "";
  const eA = a.end?.dateTime ?? "";
  const eB = b.end?.dateTime ?? "";
  const tzA = a.start?.timeZone ?? "";
  const tzB = b.start?.timeZone ?? "";
  const sumA = a.summary ?? "";
  const sumB = b.summary ?? "";
  const descA = a.description ?? "";
  const descB = b.description ?? "";
  const attA = (a.attendees ?? []).map(x => (x.email || "").toLowerCase()).sort().join(",");
  const attB = (b.attendees ?? []).map(x => (x.email || "").toLowerCase()).sort().join(",");
  return sA !== sB || eA !== eB || tzA !== tzB || sumA !== sumB || descA !== descB || attA !== attB;
}

// ——— CRUD ———
export async function añadirEvento(reserva: Reserva) {
  const event = mapReservaToEvent(reserva);

  log.info("Añadir evento ←", {
    reservaId: reserva.id,
    start: event.start?.dateTime,
    end: event.end?.dateTime,
    attendees: (event.attendees || []).map(a => a.email),
  });

  try {
    const res = await withBackoff(() =>
      calendar.events.insert({
        calendarId: CALENDAR_ID,
        requestBody: event,
        sendUpdates: "all", // notifica a asistentes
      })
    );
    log.info("Evento creado →", { eventId: res.data.id, htmlLink: res.data.htmlLink });
    return res.data;
  } catch (err) {
    log.error("Error creando evento:", explainGoogleError(err));
    throw err;
  }
}

export async function actualizarEvento(reserva: Reserva & { eventId?: string }) {
  log.info("Actualizar evento ←", { reservaId: reserva.id, eventId: reserva.eventId });

  let existing: calendar_v3.Schema$Event | null = null;

  try {
    if (reserva.eventId) {
      existing = await buscarEventoPorId(reserva.eventId);
    } else {
      existing = await buscarEventoPorReservaId(reserva.id);
    }
  } catch (err) {
    log.error("Error buscando evento para actualizar:", explainGoogleError(err));
    throw err;
  }

  if (!existing) {
    log.warn("No hay evento existente → creamos nuevo");
    return añadirEvento(reserva);
  }

  const desired = mapReservaToEvent(reserva);
  const mustUpdate = needsUpdate(existing, desired);

  if (!mustUpdate) {
    log.info("Sin cambios en el evento. No se actualiza.", { eventId: existing.id });
    return existing;
  }

  try {
    const res = await withBackoff(() =>
      calendar.events.update({
        calendarId: CALENDAR_ID,
        eventId: existing!.id!,
        requestBody: {
          ...existing,
          ...desired,
          extendedProperties: {
            private: {
              ...(existing.extendedProperties?.private || {}),
              reservaId: reserva.id,
            },
          },
        },
        sendUpdates: "all",
      })
    );
    log.info("Evento actualizado →", { eventId: res.data.id });
    return res.data;
  } catch (err) {
    log.error("Error actualizando evento:", explainGoogleError(err));
    throw err;
  }
}

export async function cancelarEvento(args: { reservaId?: string; eventId?: string; notify?: boolean }) {
  const { reservaId, eventId, notify = true } = args;
  log.info("Cancelar evento ←", { reservaId, eventId, notify });

  let id = eventId;
  if (!id && reservaId) {
    const existing = await buscarEventoPorReservaId(reservaId);
    id = existing?.id || undefined;
  }

  if (!id) {
    log.warn("No se encontró eventId para cancelar.");
    return { ok: true, skipped: true };
  }

  try {
    await withBackoff(() =>
      calendar.events.delete({
        calendarId: CALENDAR_ID,
        eventId: id!,
        sendUpdates: notify ? "all" : "none",
      })
    );
    log.info("Evento cancelado →", { eventId: id });
    return { ok: true, eventId: id };
  } catch (err) {
    log.error("Error cancelando evento:", explainGoogleError(err));
    throw err;
  }
}

export async function upsertEvento(reserva: Reserva & { eventId?: string }) {
  log.info("Upsert evento ←", { reservaId: reserva.id, eventId: reserva.eventId });

  try {
    const existing =
      reserva.eventId
        ? await buscarEventoPorId(reserva.eventId)
        : await buscarEventoPorReservaId(reserva.id);

    if (!existing) {
      log.info("No había evento → crear");
      return await añadirEvento(reserva);
    }

    const desired = mapReservaToEvent(reserva);
    if (!needsUpdate(existing, desired)) {
      log.info("Evento ya coincide → sin cambios", { eventId: existing.id });
      return existing;
    }

    const res = await withBackoff(() =>
      calendar.events.update({
        calendarId: CALENDAR_ID,
        eventId: existing.id!,
        requestBody: {
          ...existing,
          ...desired,
          extendedProperties: {
            private: {
              ...(existing.extendedProperties?.private || {}),
              reservaId: reserva.id,
            },
          },
        },
        sendUpdates: "all",
      })
    );

    log.info("Upsert → actualizado", { eventId: res.data.id });
    return res.data;
  } catch (err) {
    log.error("Error en upsert:", explainGoogleError(err));
    throw err;
  }
}

// ——— DEBUG: impersonación y acceso ———
export async function _debugImpersonationAndAccess() {
  try {
    log.info("Impersonando como:", IMPERSONATED_USER);

    // userinfo (requiere oauth2 “v2” con el auth ya configurado)
    const me = await withBackoff(() => google.oauth2("v2").userinfo.get({}));
    log.info("Userinfo:", (me?.data as any)?.email || me?.data);

    // lista calendarios visibles
    const list = await withBackoff(() => calendar.calendarList.list({ maxResults: 20 }));
    const calendars = (list.data.items || []).map(i => ({
      id: i.id,
      primary: i.primary,
      accessRole: i.accessRole,
      summary: i.summary,
    }));
    log.info("Calendars visibles:", calendars);

    // acceso al calendarId configurado
    const cal = await withBackoff(() => calendar.calendars.get({ calendarId: CALENDAR_ID }));
    log.info("Acceso OK a CALENDAR_ID:", CALENDAR_ID, "→", cal.data.summary);

    return { ok: true, user: (me?.data as any)?.email, calendars, calendarId: CALENDAR_ID };
  } catch (err) {
    const e = explainGoogleError(err);
    log.error("DEBUG impersonation error:", e);
    return { ok: false, error: e };
  }
}
