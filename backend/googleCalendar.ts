// backend/googleCalendar.ts
import { google, calendar_v3 } from "googleapis";
import { JWT } from "google-auth-library";
import { Reserva } from "./types";

// === Config ===
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

const SERVICE_ACCOUNT_KEY = require("./credenciales/dharmabookings-63805b9a99e5.json");
const IMPERSONATED_USER = "info@dharmaenruta.com";
const CALENDAR_ID = "primary";
const TIMEZONE = "Europe/Madrid";

// === Auth ===
const auth = new google.auth.GoogleAuth<JWT>({
  credentials: SERVICE_ACCOUNT_KEY,
  scopes: SCOPES,
  clientOptions: { subject: IMPERSONATED_USER },
});
google.options({ auth });

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
  // date: YYYY-MM-DD, time: HH:MM -> YYYY-MM-DDTHH:MM:SS
  const safeTime = /^\d{2}:\d{2}$/.test(time) ? `${time}:00` : time;
  return `${date}T${safeTime}`;
}

// Reintentos exponenciales simples para errores transitorios
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

      // Errores transitorios típicos: 429, 500, 503 o rate limits
      const isTransient =
        status === 429 ||
        status === 500 ||
        status === 503 ||
        reason?.includes("rateLimitExceeded") ||
        reason?.includes("userRateLimitExceeded");

      if (!isTransient) throw err;

      lastErr = err;
      const delay = Math.min(1000 * Math.pow(2, attempt), 12000);
      await new Promise((r) => setTimeout(r, delay));
      attempt++;
    }
  }
  throw lastErr;
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
  // Si hubiera duplicados accidentales, nos quedamos con el primero
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

// ——— Mapeo Reserva -> requestBody de Event ———
function buildAttendees(reserva: Reserva): calendar_v3.Schema$EventAttendee[] {
  const emails = [
    (reserva.email || "").trim(),
    (reserva.acompananteEmail || "").trim(),
  ].filter(Boolean);
  // Evitar duplicados exactos
  const unique = Array.from(new Set(emails));
  return unique.map((email) => ({ email }));
}

function mapReservaToEvent(reserva: Reserva): calendar_v3.Schema$Event {
  const fecha = reserva.fecha;                // "YYYY-MM-DD"
  const horaInicio = reserva.hora;            // "HH:MM"
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

// ——— Comparador para actualizar solo si hay cambios ———
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

  // Comparar asistentes por email
  const attA = (a.attendees ?? []).map((x) => (x.email || "").toLowerCase()).sort().join(",");
  const attB = (b.attendees ?? []).map((x) => (x.email || "").toLowerCase()).sort().join(",");

  return sA !== sB || eA !== eB || tzA !== tzB || sumA !== sumB || descA !== descB || attA !== attB;
}

// ——— CRUD ———
export async function añadirEvento(reserva: Reserva) {
  // 1) si ya existe, devolverlo
  const existente = await buscarEventoPorReservaId(reserva.id);
  if (existente) {
    return {
      eventId: existente.id!,
      htmlLink: existente.htmlLink!,
      status: existente.status!,
      attendees: existente.attendees || [],
      alreadyExisted: true,
    };
  }

  // 2) insertar
  const body = mapReservaToEvent(reserva);
  const insertRes = await withBackoff(() =>
    calendar.events.insert({
      calendarId: CALENDAR_ID,
      sendUpdates: "all", // notifica a asistentes
      requestBody: body,
    })
  );

  return {
    eventId: insertRes.data.id!,
    htmlLink: insertRes.data.htmlLink!,
    status: insertRes.data.status!,
    attendees: insertRes.data.attendees || [],
    alreadyExisted: false,
  };
}

/**
 * Actualiza el evento vinculado a la reserva si hay cambios
 * - Busca por reservaId (o por eventId si lo pasas)
 * - Usa PATCH para actualizar sólo campos cambiados
 */
export async function actualizarEvento(reserva: Reserva & { eventId?: string }) {
  // Preferimos eventId si tu backend lo guardó
  let evento = reserva.eventId
    ? await buscarEventoPorId(reserva.eventId)
    : await buscarEventoPorReservaId(reserva.id);

  if (!evento) {
    // No existe en Calendar: puedes recrear o devolver "not found"
    // Aquí optamos por recrear (idempotencia práctica)
    const creado = await añadirEvento(reserva);
    return { ...creado, recreated: true };
  }

  const desired = mapReservaToEvent(reserva);
  if (!needsUpdate(evento, desired)) {
    return {
      eventId: evento.id!,
      htmlLink: evento.htmlLink!,
      status: evento.status!,
      attendees: evento.attendees || [],
      updated: false,
      reason: "No hay cambios relevantes",
    };
  }

  const patchRes = await withBackoff(() =>
    calendar.events.patch({
      calendarId: CALENDAR_ID,
      eventId: evento!.id!,
      sendUpdates: "all",
      requestBody: desired,
    })
  );

  return {
    eventId: patchRes.data.id!,
    htmlLink: patchRes.data.htmlLink!,
    status: patchRes.data.status!,
    attendees: patchRes.data.attendees || [],
    updated: true,
  };
}

/**
 * Cancela (elimina) el evento vinculado a la reserva.
 * - Envía notificaciones si lo deseas con sendUpdates: "all"
 */
export async function cancelarEvento(args: { reservaId?: string; eventId?: string; notify?: boolean }) {
  const { reservaId, eventId, notify = true } = args;

  let target = eventId ? await buscarEventoPorId(eventId) : null;
  if (!target && reservaId) {
    target = await buscarEventoPorReservaId(reservaId);
  }
  if (!target) {
    return { cancelled: false, reason: "No existe evento en Calendar" };
  }

  await withBackoff(() =>
    calendar.events.delete({
      calendarId: CALENDAR_ID,
      eventId: target!.id!,
      sendUpdates: notify ? "all" : "none",
    })
  );

  return { cancelled: true, eventId: target.id! };
}

/**
 * Upsert cómodo: crea si no existe, actualiza si existe.
 */
export async function upsertEvento(reserva: Reserva & { eventId?: string }) {
  const existente = reserva.eventId
    ? await buscarEventoPorId(reserva.eventId)
    : await buscarEventoPorReservaId(reserva.id);

  if (!existente) return añadirEvento(reserva);
  return actualizarEvento({ ...reserva, eventId: existente.id! });
}
