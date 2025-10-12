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
const ALT_FRONTEND = "http://127.0.0.1:5173";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const app = express();

// ====== CORS ======
const ORIGINS = (process.env.CORS_ORIGINS || FRONTEND_URL || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    const allowed = ORIGINS.includes(origin) || origin === ALT_FRONTEND;
    return cb(allowed ? null : new Error("Not allowed by CORS"), allowed);
  },
  credentials: false,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  optionsSuccessStatus: 204,
}));

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

        // 1 ó varias reservas desde metadata
        const ids: string[] = (() => {
          const raw = session.metadata?.reservaIds;
          if (raw) {
            try { return JSON.parse(raw) as string[]; } catch {}
          }
          return session.metadata?.reservaId ? [session.metadata.reservaId] : [];
        })();

        if (!ids.length) {
          console.error("Webhook sin reservaId(s) en metadata");
          return res.json({ received: true });
        }

        for (const reservaId of ids) {
          const r = getReserva(reservaId);
          if (!r) {
            console.error("Reserva no encontrada en webhook:", reservaId);
            continue;
          }

          const actualizada = updateReserva(reservaId, { estado: "pagada", holdExpiresAt: undefined })!;

          try {
            const normalized: Reserva & { eventId?: string } = {
              ...actualizada,
              duracionMin: actualizada.duracionMin ?? 60,
            };

            const result = await upsertEvento(normalized) as { eventId?: string } | undefined;
            if (result?.eventId) {
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
  return `${fecha}T${hora}__${profName}`;
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

// Opcional: limpia holds caducados
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  for (const r of reservas) {
    if (r.estado === "pendiente" && r.holdExpiresAt && r.holdExpiresAt < now) {
      delete r.holdExpiresAt;
      cleaned++;
    }
  }
  if (cleaned) console.log(`[HOLD] Limpiados ${cleaned} holds caducados`);
}, 60_000);

import { existeEventoParaReserva } from "./googleCalendar";

async function reconcileCalendarVsBackend() {
  const now = Date.now();
  let freed = 0, clearedHolds = 0;

  const HORIZON_DAYS = 60;
  const horizonISO = new Date(Date.now() + HORIZON_DAYS * 86400000).toISOString().slice(0,10);

  for (const r of [...reservas]) {
    try {
      if (r.fecha > horizonISO) continue;

      const bloquea = r.estado === "pagada" || (r.estado === "pendiente" && r.holdExpiresAt && r.holdExpiresAt > now);
      if (!bloquea) continue;

      const sigue = await existeEventoParaReserva(r.id);
      if (sigue) continue;

      if (r.estado === "pagada") {
        deleteReserva(r.id);
        freed++;
      } else {
        updateReserva(r.id, { holdExpiresAt: undefined });
        clearedHolds++;
      }
    } catch (e) {
      console.error("[RECONCILE] error comprobando reserva", r.id, e);
    }
  }

  if (freed || clearedHolds) {
    console.log(`[RECONCILE] liberadas ${freed} reservas pagadas; holds limpiados: ${clearedHolds}`);
  }
}

setInterval(() => {
  reconcileCalendarVsBackend().catch(err => {
    console.error("[RECONCILE] fallo:", err?.message || err);
  });
}, 30_000);

// ========= Pagos =========
app.post("/api/pagos/checkout-session", async (req: Request, res: Response) => {
  try {
    const { reservaId, reservaIds, precioCts } = req.body as {
      reservaId?: string;
      reservaIds?: string[];
      precioCts?: number;
    };

    const ids = Array.isArray(reservaIds) && reservaIds.length
      ? reservaIds
      : (reservaId ? [reservaId] : []);

    if (!ids.length) return res.status(400).json({ error: "Faltan reservas" });

    const found = ids.map(id => getReserva(id)).filter(Boolean) as Reserva[];
    if (found.length !== ids.length) {
      return res.status(404).json({ error: "Alguna reserva no existe" });
    }
    console.log("[/checkout-session] ids recibidos:", ids);
    console.log("[/checkout-session] found:", found.map(r => ({ id: r.id, fecha: r.fecha, hora: r.hora })));

    const unitCts = Number.isFinite(precioCts) ? Number(precioCts) : 5000;

    const line_items = found.map((r) => ({
      price_data: {
        currency: "eur",
        unit_amount: unitCts,
        product_data: {
          name: `Sesión 1:1 – ${r.fecha} ${r.hora}`,
          description: `Acompañamiento con ${r.acompanante}`,
        },
      },
      quantity: 1,
    }));
    console.log("[/checkout-session] line_items count:", line_items.length);

    const first = found[0]!;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "es",
      customer_email: first.email,
      payment_method_types: ["card"],
      line_items,
      success_url: `${FRONTEND_URL}/gracias?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/pagoDatos/${ids[0]}?cancelled=1`,
      metadata: { reservaIds: JSON.stringify(ids) },
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

    if (isSlotTaken(fecha, hora, acompanante)) {
      return res.status(409).json({ error: "SLOT_TAKEN", message: "Ese horario ya no está disponible." });
    }

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

app.get("/api/reservas/find", (req, res) => {
  const { profesor, fecha, hora } = req.query as Record<string, string>;
  const list = reservas.filter(r =>
    (!profesor || r.acompanante === profesor) &&
    (!fecha || r.fecha === fecha) &&
    (!hora  || r.hora  === hora)
  );
  return res.json({ count: list.length, reservas: list });
});

app.patch("/api/reservas/:id", async (req: Request, res: Response) => {
  const actual = getReserva(req.params.id);
  if (!actual) return res.status(404).json({ error: "Reserva no encontrada." });

  const patch = req.body as Partial<Reserva>;
  const previa = { ...actual };
  const actualizada = updateReserva(actual.id, patch)!;

  let calendar: any = null;
  let calendarError: string | null = null;

  const justPaid = patch.estado === "pagada" && previa.estado !== "pagada";
  const relevantChanges = hasEventRelevantChanges(previa, actualizada);

  if (justPaid) {
    updateReserva(actualizada.id, { holdExpiresAt: undefined });
    actualizada.holdExpiresAt = undefined;
  }

  // ✅ SOLO sincronizamos con Calendar si la reserva está pagada
  if (actualizada.estado === "pagada" && (justPaid || relevantChanges)) {
    try {
      const normalized: Reserva & { eventId?: string } = {
        ...actualizada,
        duracionMin: actualizada.duracionMin ?? 60,
      };

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
  console.log("[GCAL] IMPERSONATED_USER:", process.env.GCAL_IMPERSONATED_USER || "(no definido)");
  console.log("[GCAL] CALENDAR_ID:", process.env.GCAL_CALENDAR_ID || "primary");
  console.log("[CORS] ORIGINS:", ORIGINS);
});

// Slots ocupados (pagados o pendientes con hold) para un profe entre fechas
app.get("/api/ocupados", (req: Request, res: Response) => {
  console.log("[/api/ocupados]", req.query);
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

  const out = items.map(r => ({ fecha: r.fecha, hora: r.hora }));
  return res.json({ ocupados: out });
});
