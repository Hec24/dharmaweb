// backend/server.ts
import express, { Request, Response } from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

import { upsertEvento, cancelarEvento, _debugImpersonationAndAccess } from "./googleCalendar";
import { Reserva } from "./types";

// ========= Config =========
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const ALT_FRONTEND = "http://127.0.0.1:5173"; // por si el navegador usa 127.0.0.1
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

// Protege la ruta de debug si quieres: /api/debug/gcal?token=XYZ
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";

// Usa la versión por defecto de tu cuenta de Stripe (estable)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const app = express();

// ====== CORS ======
const ORIGINS = (process.env.CORS_ORIGINS || FRONTEND_URL || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true); // permite Postman/CLI
    const allowed = ORIGINS.includes(origin) || origin === ALT_FRONTEND;
    return cb(allowed ? null : new Error("Not allowed by CORS"), allowed);
  },
  credentials: false,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  optionsSuccessStatus: 204,
}));


// (Opcional) logs de NO-GET
app.use((req, _res, next) => {
  if (req.method !== "GET") {
    console.log(`${req.method} ${req.path}`, {
      origin: req.headers.origin,
      contentType: req.headers["content-type"],
    });
  }
  next();
});

app.set("trust proxy", 1);

// ========= Healthcheck =========
app.get("/api/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));

// ========= Ruta de DEBUG GCAL =========
// Llama en producción: GET /api/debug/gcal?token=TU_TOKEN
app.get("/api/debug/gcal", async (req: Request, res: Response) => {
  if (ADMIN_TOKEN && req.query.token !== ADMIN_TOKEN) {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }
  try {
    console.log("[GCAL] IMPERSONATED_USER:", process.env.GCAL_IMPERSONATED_USER || "(no definido)");
    console.log("[GCAL] CALENDAR_ID:", process.env.GCAL_CALENDAR_ID || "primary");
    const out = await _debugImpersonationAndAccess();
    return res.json(out);
  } catch (e: any) {
    console.error("[GCAL] /api/debug/gcal error:", e?.message || e);
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
});

// ========= Stripe webhook (RAW antes del json) =========
app.post(
  "/api/pagos/stripe-webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const reservaId = session.metadata?.reservaId;
        if (!reservaId) {
          console.error("Webhook sin reservaId en metadata");
          return res.json({ received: true });
        }
        const r = getReserva(reservaId);
        if (!r) {
          console.error("Reserva no encontrada en webhook:", reservaId);
          return res.json({ received: true });
        }

        const previa = { ...r };
        const actualizada = updateReserva(reservaId, { estado: "pagada" })!;
        updateReserva(reservaId, { estado: "pagada", holdExpiresAt: undefined });
        console.log("Reserva marcada como PAGADA desde webhook:", reservaId);
        try {
          const normalized: Reserva & { eventId?: string } = {
            ...actualizada,
            duracionMin: actualizada.duracionMin ?? 60,
          };

          // 🔎 Log antes de sincronizar con Calendar
          console.log("[GCAL] WEBHOOK upsertEvento() ←", {
            reservaId,
            fecha: normalized.fecha,
            hora: normalized.hora,
            email: normalized.email,
            acompanante: normalized.acompanante,
            acompananteEmail: normalized.acompananteEmail,
            duracionMin: normalized.duracionMin,
          });

          const result = await upsertEvento(normalized) as { eventId?: string } | undefined;
          if (result && typeof result === "object" && "eventId" in result && result.eventId) {
            updateReserva(actualizada.id, { eventId: result.eventId });
          }
          console.log("Reserva confirmada y evento Calendar ok:", {
            reservaId,
            eventId: result && typeof result === "object" && "eventId" in result ? result.eventId : undefined,
          });
        } catch (err: any) {
          console.error("Error sincronizando con Calendar desde webhook:", err?.message || err);
        }
      }

      res.json({ received: true });
    } catch (err: any) {
      console.error("Error en webhook Stripe:", err?.message || err);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);

// ========= JSON normal para el resto =========
app.use(express.json());

// ========= “DB” en memoria =========
const reservas: Reserva[] = [];

function getReserva(id: string) {
  return reservas.find((r) => r.id === id);
}
function updateReserva(id: string, patch: Partial<Reserva>): Reserva | null {
  const i = reservas.findIndex((r) => r.id === id);
  if (i === -1) return null;
  reservas[i] = { ...reservas[i], ...patch };
  return reservas[i];
}
function deleteReserva(id: string) {
  const i = reservas.findIndex((r) => r.id === id);
  if (i === -1) return false;
  reservas.splice(i, 1);
  return true;
}

const EVENT_RELEVANT_FIELDS: Array<keyof Reserva> = [
  "fecha", "hora", "duracionMin", "email", "acompananteEmail", "nombre", "apellidos", "acompanante"
];
function hasEventRelevantChanges(prev: Reserva, next: Reserva) {
  return EVENT_RELEVANT_FIELDS.some((k) => prev[k] !== next[k]);
}

function slotKey(fecha: string, hora: string, profName: string) {
  return `${fecha}T${hora}__${profName}`; // clave simple
}

// Considera tomadas las reservas pagadas y las pendientes con hold no expirado
function isSlotTaken(fecha: string, hora: string, profName: string) {
  const now = Date.now();
  return reservas.some(r =>
    r.fecha === fecha &&
    r.hora === hora &&
    r.acompanante === profName &&
    (
      r.estado === "pagada" ||
      (r.estado === "pendiente" && !!r.holdExpiresAt && r.holdExpiresAt > now)
    )
  );
}

// Opcional: limpia holds caducados de vez en cuando (cada X min)
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  for (const r of reservas) {
    if (r.estado === "pendiente" && r.holdExpiresAt && r.holdExpiresAt < now) {
      // simplemente eliminamos la marca (sigue existiendo la reserva, pero ya no bloquea)
      delete r.holdExpiresAt;
      cleaned++;
    }
  }
  if (cleaned) console.log(`[HOLD] Limpiados ${cleaned} holds caducados`);
}, 60_000); // cada minuto


// ========= Pagos =========
app.post("/api/pagos/checkout-session", async (req: Request, res: Response) => {
  try {
    const { reservaId, precioCts } = req.body as { reservaId: string; precioCts?: number };
    if (!reservaId) return res.status(400).json({ error: "reservaId requerido" });

    const reserva = getReserva(reservaId);
    if (!reserva) return res.status(404).json({ error: "Reserva no encontrada" });

    const amount = Number.isFinite(precioCts) ? Number(precioCts) : 6000;
    const productName = `Sesión 1:1 (${reserva.duracionMin ?? 60} min) – ${reserva.nombre} ${reserva.apellidos}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "es",
      customer_email: reserva.email,
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "eur",
          unit_amount: amount,
          product_data: { name: productName, description: "Acompañamiento Dharma en Ruta" },
        },
        quantity: 1,
      }],
      success_url: `${FRONTEND_URL}/gracias?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/pasarela/${reserva.id}?cancelled=1`,
      metadata: { reservaId: reserva.id },
    });

    return res.json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error("Error creando Checkout Session:", err?.message || err);
    return res.status(500).json({ error: "No se pudo crear la sesión de pago" });
  }
});

app.get("/api/pagos/checkout-session/:id", async (req: Request, res: Response) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id);
    return res.json(session);
  } catch {
    return res.status(404).json({ error: "Sesión no encontrada" });
  }
});

// ========= Reservas =========
app.post("/api/reservas", (req: Request, res: Response) => {
  try {
    console.log("POST /api/reservas body:", req.body);
    const {
      nombre, apellidos, email, telefono,
      acompanante, acompananteEmail, fecha, hora, duracionMin,
    } = (req.body || {}) as Partial<Reserva>;

    if (!nombre || !apellidos || !email || !telefono || acompanante === undefined || !fecha || !hora) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    // ⛔️ Evitar doble booking del mismo slot para ese profesor
    if (isSlotTaken(fecha, hora, acompanante)) {
      return res.status(409).json({ error: "SLOT_TAKEN", message: "Ese horario ya no está disponible." });
    }

    const HOLD_MINUTES = Number(process.env.BOOKING_HOLD_MIN || 15);
    const nueva: Reserva = {
      id: uuidv4(),
      nombre, apellidos, email, telefono,
      acompanante,
      acompananteEmail: acompananteEmail ?? "",
      fecha, hora, duracionMin,
      estado: "pendiente",
    };

    reservas.push(nueva);
    return res.status(201).json({ id: nueva.id });
  } catch (err: any) {
    console.error("Error en POST /api/reservas:", err?.message || err);
    return res.status(500).json({ error: "RESERVA_CREATE_FAILED" });
  }
});

app.get("/api/reservas", (_req: Request, res: Response) => res.json(reservas));

app.get("/api/reservas/:id", (req: Request, res: Response) => {
  const r = getReserva(req.params.id);
  if (!r) return res.status(404).json({ error: "Reserva no encontrada." });
  return res.json(r);
});

app.patch("/api/reservas/:id", async (req: Request, res: Response) => {
  const actual = getReserva(req.params.id);
  if (!actual) return res.status(404).json({ error: "Reserva no encontrada." });

  const patch = req.body as Partial<Reserva>;
  const previa = { ...actual };
  const actualizada = updateReserva(actual.id, patch)!;
  if (patch.estado === "pagada") {
    updateReserva(actualizada.id, { holdExpiresAt: undefined });
  }  console.log("PATCH /api/reservas/:id", { id: actualizada.id, patch });

  let calendar: any = null;
  let calendarError: string | null = null;

  const justPaid = patch.estado === "pagada" && previa.estado !== "pagada";
  const relevantChanges = hasEventRelevantChanges(previa, actualizada);

  if (justPaid || relevantChanges) {
    try {
      const normalized: Reserva & { eventId?: string } = {
        ...actualizada,
        duracionMin: actualizada.duracionMin ?? 60,
      };

  

      // 🔎 Log antes de sincronizar con Calendar
      console.log("[GCAL] PATCH upsertEvento() ←", {
        reservaId: normalized.id,
        fecha: normalized.fecha,
        hora: normalized.hora,
        email: normalized.email,
        acompanante: normalized.acompanante,
        acompananteEmail: normalized.acompananteEmail,
        duracionMin: normalized.duracionMin,
        justPaid,
        relevantChanges,
      });

      const result = await upsertEvento(normalized) as { eventId?: string } | undefined;
      if (result?.eventId) {
        updateReserva(actualizada.id, { eventId: result.eventId });
        actualizada.eventId = result.eventId;
      }
      calendar = result;
    } catch (err: any) {
      const status = err?.code || err?.response?.status;
      const data = err?.response?.data || err?.errors || err?.message || err;
      console.error("Error sincronizando con Google Calendar:", { status, data });
      calendarError = JSON.stringify({ status, data });
    }
  }

  return res.json({ ok: true, reserva: actualizada, calendar, calendarError });
});

app.delete("/api/reservas/:id", async (req: Request, res: Response) => {
  const r = getReserva(req.params.id);
  if (!r) return res.status(404).json({ error: "Reserva no encontrada." });

  try {
    await cancelarEvento({ reservaId: r.id, eventId: r.eventId, notify: true });
  } catch (err: any) {
    console.error("Error cancelando en Google Calendar:", err?.message || err);
  }
  deleteReserva(r.id);
  return res.json({ ok: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor Express en puerto ${PORT}`);
  // Logs rápidos del entorno GCAL (útiles para verificar que Render está leyendo bien las vars)
  console.log("[GCAL] IMPERSONATED_USER:", process.env.GCAL_IMPERSONATED_USER || "(no definido)");
  console.log("[GCAL] CALENDAR_ID:", process.env.GCAL_CALENDAR_ID || "primary");
  console.log("[CORS] ORIGINS:", ORIGINS);
});

// Slots ocupados (pagados o pendientes con hold) para un profe entre fechas
app.get("/api/ocupados", (req: Request, res: Response) => {
  const prof = String(req.query.profesor || "").trim();
  const from = String(req.query.from || "");
  const to   = String(req.query.to || "");

  if (!prof) return res.status(400).json({ error: "profesor requerido" });

  const now = Date.now();
  const items = reservas.filter(r => {
    if (r.acompanante !== prof) return false;
    const bloquea = r.estado === "pagada" || (r.estado === "pendiente" && r.holdExpiresAt && r.holdExpiresAt > now);
    if (!bloquea) return false;
    if (from && r.fecha < from) return false;
    if (to && r.fecha > to) return false;
    return true;
  });

  // devolvemos como "YYYY-MM-DD HH:mm"
  const out = items.map(r => ({ fecha: r.fecha, hora: r.hora }));
  return res.json({ ocupados: out });
});
