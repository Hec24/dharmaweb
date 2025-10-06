// backend/server.ts
import express, { Request, Response } from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

import { upsertEvento, cancelarEvento } from "./googleCalendar";
import { Reserva } from "./types";

// ========= Config =========
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const ALT_FRONTEND = "http://127.0.0.1:5173"; // por si el navegador usa 127.0.0.1
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

// Usa la versión por defecto de tu cuenta de Stripe (estable)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const app = express();

// ====== CORS ======
const ORIGINS = (process.env.CORS_ORIGINS || FRONTEND_URL || "").split(",").map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true); // permite Postman/CLI
    return cb(ORIGINS.includes(origin) ? null : new Error("Not allowed by CORS"), ORIGINS.includes(origin));
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

        try {
          const normalized: Reserva & { eventId?: string } = {
            ...actualizada,
            duracionMin: actualizada.duracionMin ?? 60,
          };
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
      const result = await upsertEvento(normalized) as { eventId?: string } | undefined;
      if (result?.eventId) {
        updateReserva(actualizada.id, { eventId: result.eventId });
        actualizada.eventId = result.eventId;
      }
      calendar = result;
    } catch (err: any) {
      console.error("Error sincronizando con Google Calendar:", err?.message || err);
      calendarError = "No se pudo sincronizar el evento en Google Calendar.";
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
app.listen(PORT, () => console.log(`Servidor Express en puerto ${PORT}`));
