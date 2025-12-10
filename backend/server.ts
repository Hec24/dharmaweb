// backend/server.ts
import express, { Request, Response } from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

import { upsertEvento, cancelarEvento, _debugImpersonationAndAccess } from "./googleCalendar";
import { Reserva } from "./types";
import pool from "./database/db";

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
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
}));

app.use((req, _res, next) => {
  if (req.method !== "GET") {
    console.log(`${req.method} ${req.path} `, {
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

      // Inserta una reserva si no existe en memoria (devuelve la instancia final en memoria)
      function ensureReservaInMemory(snapshot: Partial<Reserva>): Reserva {
        const existing = getReserva(snapshot.id as string);
        if (existing) return existing;

        // Construimos con defaults sensatos y estado "pendiente" (se actualizará a "pagada" después)
        const nueva: Reserva = {
          id: snapshot.id as string,
          nombre: snapshot.nombre || "",
          apellidos: snapshot.apellidos || "",
          email: snapshot.email || "",
          telefono: snapshot.telefono || "",
          acompanante: snapshot.acompanante || "",
          acompananteEmail: snapshot.acompananteEmail || "",
          fecha: snapshot.fecha || "",
          hora: snapshot.hora || "",
          duracionMin: snapshot.duracionMin ?? 60,
          estado: "pendiente",
        };
        // Empuja a la “DB” en memoria
        (reservas as Reserva[]).push(nueva);
        return nueva;
      }

      // Busca el snapshot de una reserva dentro de la metadata del session
      function findSnapshotInSession(session: Stripe.Checkout.Session, id: string): Partial<Reserva> | null {
        const raw = session.metadata?.reservas;
        if (!raw) return null;
        try {
          const list = JSON.parse(raw) as Array<Partial<Reserva>>;
          return list.find(x => x && x.id === id) || null;
        } catch {
          return null;
        }
      }


      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const productType = session.metadata?.productType;

        // ========= NUEVO: Manejo de Test Rueda de Vida =========
        if (productType === "test-rueda-vida") {
          const email = session.customer_email || session.metadata?.email;

          if (email) {
            try {
              // Enviar email con MailerLite
              const mailerliteApiKey = process.env.MAILERLITE_API_KEY;

              if (mailerliteApiKey) {
                const emailData = {
                  to: email,
                  from: {
                    email: "info@dharmaenruta.com",
                    name: "Dharma en Ruta"
                  },
                  subject: "Tu Test de la Rueda de Vida está listo 🎯",
                  html: `
  < div style = "font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;" >
    <h2 style="color: #4A5D23;" >¡Gracias por tu compra! </h2>
      < p > Tu Test de la Rueda de Vida ya está disponible.</p>

        < div style = "background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;" >
          <p style="margin: 0; font-weight: bold;" >📥 Descarga tu PDF aquí: </p>
            < a href = "${FRONTEND_URL}/downloads/test-rueda-vida.pdf"
style = "display: inline-block; background: #4A5D23; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;" >
  Descargar PDF
    </a>
    </div>

    < p > <strong>Este PDF incluye: </strong></p >
      <ul>
      <li>Test de autoevaluación de las 8 áreas de vida </li>
        < li > Plantilla para crear tu gráfico personalizado </li>
          < li > Más de 50 páginas de ejercicios prácticos </li>
            < li > Guía paso a paso para pasar a la acción </li>
              </ul>

              < p > Recuerda que puedes imprimirlo para trabajar de forma más introspectiva.</p>

                < hr style = "border: none; border-top: 1px solid #ddd; margin: 30px 0;" >

                  <p><strong>¿Quieres profundizar más ? </strong></p >
                    <p>Descubre nuestra membresía con contenidos exclusivos, directos mensuales, comunidad y acompañamiento personalizado.</p>
                      < a href = "${FRONTEND_URL}" style = "color: #4A5D23;" > Conocer la membresía →</a>

                        < p style = "margin-top: 30px; color: #666; font-size: 14px;" >
                          Un abrazo, <br>
                            Equipo Dharma en Ruta
                              </p>
                              </div>
                                `,
                  text: `
¡Gracias por tu compra!

Tu Test de la Rueda de Vida ya está disponible.

Descarga tu PDF aquí: ${FRONTEND_URL} /downloads/test - rueda - vida.pdf

Este PDF incluye:
- Test de autoevaluación de las 8 áreas de vida
  - Plantilla para crear tu gráfico personalizado
    - Más de 50 páginas de ejercicios prácticos
      - Guía paso a paso para pasar a la acción

Recuerda que puedes imprimirlo para trabajar de forma más introspectiva.

¿Quieres profundizar más ?
  Descubre nuestra membresía: ${FRONTEND_URL}

Un abrazo,
  Equipo Dharma en Ruta
                  `
                };

                // Llamada a MailerLite API
                const response = await fetch("https://connect.mailerlite.com/api/emails", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${mailerliteApiKey} `,
                  },
                  body: JSON.stringify(emailData),
                });

                if (response.ok) {
                  console.log("[WEBHOOK] Email de test enviado correctamente a:", email);
                } else {
                  const errorText = await response.text();
                  console.error("[WEBHOOK] Error enviando email con MailerLite:", errorText);
                }
              } else {
                console.warn("[WEBHOOK] MAILERLITE_API_KEY no configurada, email no enviado");
              }
            } catch (err: any) {
              console.error("[WEBHOOK] Error enviando email de test:", err?.message || err);
            }
          }

          // Retornar early para no procesar como reserva
          return res.json({ received: true });
        }

        // ========= LÓGICA EXISTENTE: Acompañamientos =========
        // 1 ó varias reservas desde metadata
        const ids: string[] = (() => {
          const raw = session.metadata?.reservaIds;
          if (raw) {
            try { return JSON.parse(raw) as string[]; } catch { }
          }
          return session.metadata?.reservaId ? [session.metadata.reservaId] : [];
        })();

        if (!ids.length) {
          console.error("Webhook sin reservaId(s) en metadata");
          return res.json({ received: true });
        }

        for (const reservaId of ids) {
          // 1) Asegura que la reserva está en memoria
          let r = getReserva(reservaId);
          if (!r) {
            const snap = findSnapshotInSession(session, reservaId);
            if (snap) {
              r = ensureReservaInMemory(snap);
              console.log("[WEBHOOK] Reconstituida reserva en memoria desde metadata:", reservaId);
            }
          }
          if (!r) {
            console.error("[WEBHOOK] Reserva no encontrada ni en metadata:", reservaId);
            continue;
          }

          // 2) Buscar user_id por email
          let userId: string | null = null;
          try {
            const userResult = await pool.query(
              'SELECT id, stripe_customer_id FROM users WHERE email = $1 LIMIT 1',
              [r.email]
            );
            if (userResult.rows.length > 0) {
              userId = userResult.rows[0].id;
              console.log("[WEBHOOK] Usuario encontrado:", userId);

              // ✅ NUEVO: Si el usuario no tiene stripe_customer_id, guárdalo ahora
              const existingStripeId = userResult.rows[0].stripe_customer_id;
              const sessionCustomerId = session.customer as string;

              if (!existingStripeId && sessionCustomerId) {
                await pool.query(
                  'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
                  [sessionCustomerId, userId]
                );
                console.log("[WEBHOOK] Guardado stripe_customer_id para usuario:", userId);
              }
            }
          } catch (err) {
            console.error("[WEBHOOK] Error buscando usuario:", err);
          }

          // 3) Guardar/actualizar en PostgreSQL
          try {
            const upsertQuery = `
              INSERT INTO reservations (
                id, user_id, nombre, apellidos, email, telefono,
                acompanante, acompanante_email, fecha, hora, duracion_min,
                estado, stripe_session_id, precio_pagado
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
              ON CONFLICT (id) DO UPDATE SET
                estado = EXCLUDED.estado,
                user_id = COALESCE(EXCLUDED.user_id, reservations.user_id),
                stripe_session_id = EXCLUDED.stripe_session_id,
                precio_pagado = EXCLUDED.precio_pagado,
                updated_at = NOW()
              RETURNING *
            `;

            await pool.query(upsertQuery, [
              reservaId,
              userId,
              r.nombre,
              r.apellidos,
              r.email,
              r.telefono,
              r.acompanante,
              r.acompananteEmail || '',
              r.fecha,
              r.hora,
              r.duracionMin ?? 60,
              'pagada',
              session.id,
              (session.amount_total ?? 0) / 100 // Convertir de centavos a euros
            ]);

            console.log("[WEBHOOK] Reserva guardada en PostgreSQL:", reservaId);
          } catch (err: any) {
            console.error("[WEBHOOK] Error guardando en PostgreSQL:", err?.message || err);
          }

          // 4) Marcar pagada en memoria y limpiar hold
          const actualizada = updateReserva(reservaId, { estado: "pagada", holdExpiresAt: undefined })!;

          // 5) Crear/actualizar evento en Calendar
          try {
            const normalized: Reserva & { eventId?: string } = {
              ...actualizada,
              duracionMin: actualizada.duracionMin ?? 60,
            };

            const result = await upsertEvento(normalized) as { eventId?: string } | undefined;
            if (result?.eventId) {
              // Actualizar event_id en PostgreSQL
              await pool.query(
                'UPDATE reservations SET event_id = $1 WHERE id = $2',
                [result.eventId, reservaId]
              );
              updateReserva(actualizada.id, { eventId: result.eventId });
            }
            console.log("[WEBHOOK] Reserva confirmada y evento Calendar ok:", {
              reservaId,
              eventId: result && typeof result === "object" && "eventId" in result ? result.eventId : undefined,
            });
          } catch (err: any) {
            console.error("[WEBHOOK] Error sincronizando con Calendar:", err?.message || err);
          }
        }

      }

      res.json({ received: true });
    } catch (err: any) {
      console.error("Error en webhook Stripe:", err?.message || err);
      res.status(400).send(`Webhook Error: ${err.message} `);
    }
  }
);

// ========= JSON normal para el resto =========
app.use(express.json());

// ========= Import Middleware FIRST =========
import { authenticateToken, optionalAuth } from './auth/authMiddleware';

// ========= Autenticación =========
import { register, login, me, updateProfile, updatePassword } from './auth/authController';

app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/me', me);
app.put('/api/auth/profile', authenticateToken, updateProfile);
app.put('/api/auth/password', authenticateToken, updatePassword);

// ========= Vídeos =========
import { getVideos, getVideoById, saveProgress, getLastWatchedVideo } from './controllers/videoController';

app.get('/api/contenidos', optionalAuth, getVideos);
app.get('/api/contenidos/last-watched', authenticateToken, getLastWatchedVideo);
app.get('/api/contenidos/:id', optionalAuth, getVideoById);
app.post('/api/contenidos/:id/progress', authenticateToken, saveProgress);

// ========= Mis Reservas (Dashboard) =========
import { getMisReservas, cancelReservation } from './controllers/reservasController';

app.get('/api/reservas/mis-reservas', authenticateToken, getMisReservas);
app.delete('/api/reservas/:id/cancel', authenticateToken, cancelReservation);

// ========= Live Events (Directos) =========
import {
  getUpcomingEvents,
  getPastEvents,
  getEventById,
  registerForEvent,
  unregisterFromEvent,
  getMyRegistrations
} from './controllers/liveEventsController';

app.get('/api/live-events/upcoming', authenticateToken, getUpcomingEvents);
app.get('/api/live-events/past', authenticateToken, getPastEvents);
app.get('/api/live-events/my-registrations', authenticateToken, getMyRegistrations);
app.get('/api/live-events/:id', authenticateToken, getEventById);
app.post('/api/live-events/:id/register', authenticateToken, registerForEvent);
app.delete('/api/live-events/:id/unregister', authenticateToken, unregisterFromEvent);

// ========= Stripe Customer Portal =========
import { createPortalSession } from './controllers/stripeController';
import {
  createMVPCheckout,
  handleMVPPurchaseSuccess,
  createAccountFromMVP,
  activateMVPMemberships,
  handleStripeWebhook as handleMVPWebhook,
  runMigrationManually
} from './controllers/mvpController';

app.post('/api/stripe/create-portal-session', authenticateToken, createPortalSession);

// ========= Community (Comunidad) =========
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  createComment,
  updateComment,
  deleteComment,
  reportContent
} from './controllers/communityController';

app.get('/api/community/posts', authenticateToken, getPosts);
app.get('/api/community/posts/:id', authenticateToken, getPostById);
app.post('/api/community/posts', authenticateToken, createPost);
app.put('/api/community/posts/:id', authenticateToken, updatePost);
app.delete('/api/community/posts/:id', authenticateToken, deletePost);
app.post('/api/community/posts/:id/comments', authenticateToken, createComment);
app.put('/api/community/comments/:id', authenticateToken, updateComment);
app.delete('/api/community/comments/:id', authenticateToken, deleteComment);
app.post('/api/community/report', authenticateToken, reportContent);

// ========= Community Resources =========
import {
  getResources,
  getFeaturedResources,
  getResourceById
} from './controllers/resourcesController';

app.get('/api/community/resources', authenticateToken, getResources);
app.get('/api/community/resources/featured', authenticateToken, getFeaturedResources);
app.get('/api/community/resources/:id', authenticateToken, getResourceById);

// ========= Event Questions =========
import {
  getEventQuestions,
  submitQuestion,
  voteQuestion
} from './controllers/questionsController';

app.get('/api/live-events/:eventId/questions', authenticateToken, getEventQuestions);
app.post('/api/live-events/:eventId/questions', authenticateToken, submitQuestion);
app.post('/api/live-events/questions/:id/vote', authenticateToken, voteQuestion);

// ========= Admin Routes =========
import {
  runMigration,
  debugReservations,
  clearReservations,
  setUserStatus,
  migrateLiveEvents,
  migrateCommunity,
  seedEvents,
  deleteEvent,
  debugEvents,
  getReports,
  reviewReport,
  deletePostAdmin,
  deleteCommentAdmin,
  pinPost,
  migrateResources,
  createResourceAdmin,
  deleteResourceAdmin,
  migrateQuestions,
  markQuestionAnswered,
  deleteQuestionAdmin
} from './routes/adminRoutes';

app.post('/api/admin/migrate', runMigration);
app.get('/api/admin/debug/reservations', debugReservations);
app.delete('/api/admin/reservations', clearReservations);
app.post('/api/admin/users/status', setUserStatus);
app.post('/api/admin/migrate-live-events', migrateLiveEvents);
app.get('/api/admin/debug/events', debugEvents);
app.post('/api/admin/migrate-community', migrateCommunity);
app.post('/api/admin/seed-events', seedEvents);
app.delete('/api/admin/live-events/:id', deleteEvent);

// Community moderation
app.get('/api/admin/community/reports', getReports);
app.put('/api/admin/community/reports/:id', reviewReport);
app.delete('/api/admin/community/posts/:id', deletePostAdmin);
app.delete('/api/admin/community/comments/:id', deleteCommentAdmin);
app.put('/api/admin/community/posts/:id/pin', pinPost);

// Resources admin
app.post('/api/admin/migrate-resources', migrateResources);
app.post('/api/admin/resources', createResourceAdmin);
app.delete('/api/admin/resources/:id', deleteResourceAdmin);

// Questions admin
app.post('/api/admin/migrate-questions', migrateQuestions);
app.put('/api/admin/questions/:id/status', markQuestionAnswered);
app.delete('/api/admin/questions/:id', deleteQuestionAdmin);

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
  return `${fecha}T${hora}__${profName} `;
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
  const horizonISO = new Date(Date.now() + HORIZON_DAYS * 86400000).toISOString().slice(0, 10);

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
    console.log(`[RECONCILE] liberadas ${freed} reservas pagadas; holds limpiados: ${clearedHolds} `);
  }
}

setInterval(() => {
  reconcileCalendarVsBackend().catch(err => {
    console.error("[RECONCILE] fallo:", err?.message || err);
  });
}, 30_000);

// ========= Pagos =========

// ========= Endpoint para Test Rueda de Vida =========
app.post("/api/pagos/checkout-session-test", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email es requerido" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "es",
      customer_email: email,
      line_items: [{
        price_data: {
          currency: "eur",
          unit_amount: 1490, // 14.90€
          product_data: {
            name: "Test de la Rueda de Vida + Libro de Ejercicios",
            description: "PDF descargable con test y ejercicios personalizados",
          },
        },
        quantity: 1,
      }],
      success_url: `${FRONTEND_URL}/test-confirmacion?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/test-rueda-vida?cancelled=1`,
      metadata: {
        productType: "test-rueda-vida",
        email,
      },
    });

    return res.json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error("[CHECKOUT-TEST] Error creando sesión:", err?.message || err);
    return res.status(500).json({ error: "Error al crear la sesión de pago" });
  }
});

app.post("/api/pagos/checkout-session", async (req: Request, res: Response) => {
  try {
    type CarritoItem = {
      id?: string;
      profesor: string;
      fecha: string;    // "YYYY-MM-DD HH:mm"
      servicio?: string;
      precio?: number;
    };
    type Datos = {
      nombre?: string;
      apellidos?: string;
      email?: string;
      telefono?: string;
      direccion?: string;
      poblacion?: string;
      ciudad?: string;
      zipCode?: string;
      codigoPostal?: string;
      pais?: string;
    };

    const { reservaId, reservaIds, precioCts, carrito, datos } = req.body as {
      reservaId?: string;
      reservaIds?: string[];
      precioCts?: number;
      carrito?: CarritoItem[];
      datos?: Datos;
    };

    // 1) Normaliza ids iniciales (si no hay, usa el único)
    const ids: string[] = Array.isArray(reservaIds) && reservaIds.length
      ? [...reservaIds]
      : (reservaId ? [reservaId] : []);

    // 2) Fuente de carrito (opcional): si viene, podremos reconstruir ids faltantes
    const carritoArr: CarritoItem[] = Array.isArray(carrito) ? carrito : [];

    // 3) Trae las reservas existentes en memoria
    const existentes = ids.map(id => getReserva(id) || null);
    // indices de ids que faltan en memoria
    const faltantesIdx = existentes
      .map((r, i) => (r ? -1 : i))
      .filter(i => i >= 0);

    // 4) Si faltan, intenta reconstruirlas desde el carrito por posición
    const nuevosIds: string[] = [];
    if (faltantesIdx.length > 0 && carritoArr.length > 0) {
      for (const i of faltantesIdx) {
        const s = carritoArr[i] || carritoArr[0]; // fallback
        if (!s || !s.profesor || !s.fecha) continue;

        const [f, h] = String(s.fecha).split(" ");
        const body = {
          nombre: datos?.nombre || "",
          apellidos: datos?.apellidos || "",
          email: datos?.email || "",
          telefono: datos?.telefono || "",
          acompanante: s.profesor,
          acompananteEmail: "",
          fecha: f || "",
          hora: h || "",
          duracionMin: 60,
          estado: "pendiente" as const,
        };

        if (isSlotTaken(body.fecha, body.hora, body.acompanante)) {
          return res.status(409).json({ error: "SLOT_TAKEN", message: "Ese horario ya no está disponible." });
        }

        const newId = uuidv4();
        reservas.push({ id: newId, ...body });
        ids[i] = newId;      // sustituye el id faltante por el nuevo
        nuevosIds.push(newId);
      }
    }

    // 5) Si el usuario añadió MÁS sesiones en el modal (carrito > ids), crea las extra
    if (carritoArr.length > ids.length) {
      for (let i = ids.length; i < carritoArr.length; i++) {
        const s = carritoArr[i];
        if (!s || !s.profesor || !s.fecha) continue;
        const [f, h] = String(s.fecha).split(" ");
        const body = {
          nombre: datos?.nombre || "",
          apellidos: datos?.apellidos || "",
          email: datos?.email || "",
          telefono: datos?.telefono || "",
          acompanante: s.profesor,
          acompananteEmail: "",
          fecha: f || "",
          hora: h || "",
          duracionMin: 60,
          estado: "pendiente" as const,
        };

        if (isSlotTaken(body.fecha, body.hora, body.acompanante)) {
          return res.status(409).json({ error: "SLOT_TAKEN", message: "Ese horario ya no está disponible." });
        }

        const newId = uuidv4();
        reservas.push({ id: newId, ...body });
        ids.push(newId);
        nuevosIds.push(newId);
      }
    }

    if (!ids.length) return res.status(400).json({ error: "Faltan reservas" });

    // 6) Vuelve a cargar todas ya consistentes
    const found = ids.map(id => getReserva(id)).filter(Boolean) as Reserva[];
    if (found.length !== ids.length) {
      return res.status(404).json({ error: "Alguna reserva no existe y no pudo reconstruirse" });
    }

    console.log("[/checkout-session] ids finales:", ids);
    console.log("[/checkout-session] found:", found.map(r => ({ id: r.id, fecha: r.fecha, hora: r.hora })));

    // 7) Precio por línea (ajusta si quieres por servicio)
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

    // // 8) Snapshot para el webhook (por si corre en otra instancia)
    // const reservasSnapshot = found.map(r => ({
    //   id: r.id,
    //   nombre: r.nombre,
    //   apellidos: r.apellidos,
    //   email: r.email,
    //   telefono: r.telefono,
    //   acompanante: r.acompanante,
    //   acompananteEmail: r.acompananteEmail ?? "",
    //   fecha: r.fecha,
    //   hora: r.hora,
    //   duracionMin: r.duracionMin ?? 60,
    // }));

    // 7.1) Check for existing customer/user to save card
    const first = found[0]!;
    let customerId: string | undefined;
    let setupFutureUsage: Stripe.Checkout.SessionCreateParams.PaymentIntentData.SetupFutureUsage | undefined;
    const email = first.email;

    // Try to find user by email to get their stripe_customer_id
    try {
      const userResult = await pool.query('SELECT stripe_customer_id FROM users WHERE email = $1', [email]);
      if (userResult.rows.length > 0 && userResult.rows[0].stripe_customer_id) {
        customerId = userResult.rows[0].stripe_customer_id;
        setupFutureUsage = 'off_session'; // Save card for future reuse
      } else {
        // If not a registered user, we could create a customer, but typically we wait for registration.
        // HOWEVER, for MVP/Reservations, we want to save it if possible.
        // Let's create a customer if one doesn't exist to allow saving the card.
        const customers = await stripe.customers.list({ email: email, limit: 1 });
        if (customers.data.length > 0) {
          customerId = customers.data[0].id;
        } else {
          const newCustomer = await stripe.customers.create({ email: email, name: `${first.nombre} ${first.apellidos}` });
          customerId = newCustomer.id;
        }
        setupFutureUsage = 'off_session';
      }
    } catch (e) {
      console.warn("Error looking up user for Stripe customer:", e);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "es",
      customer: customerId, // If undefined, Stripe will collect email
      customer_email: customerId ? undefined : first.email, // Can't set both
      line_items,
      payment_intent_data: {
        setup_future_usage: setupFutureUsage,
      },
      success_url: `${FRONTEND_URL}/gracias?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/pagoDatos/${ids[0]}?cancelled=1`,
      metadata: {
        reservaIds: JSON.stringify(ids),
      },
    });

    return res.json({ id: session.id, url: session.url });
  } catch (err: any) {
    const status = err?.statusCode || err?.code || err?.response?.status;
    const msg = err?.raw?.message || err?.message;
    console.error("Error creando Checkout Session:", { status, msg, raw: err?.raw });
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
app.post("/api/reservas", optionalAuth, async (req: Request, res: Response) => {
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

    const newId = uuidv4();

    // Obtener user_id si el usuario está autenticado
    const userId = (req as any).userId || null;

    if (userId) {
      console.log("[RESERVAS] Creating reservation for authenticated user:", userId);
    } else {
      console.log("[RESERVAS] Creating reservation for guest user");
    }

    // Guardar en PostgreSQL
    const query = `
      INSERT INTO reservations (
        id, user_id, nombre, apellidos, email, telefono,
        acompanante, acompanante_email, fecha, hora, duracion_min,
        estado
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    await pool.query(query, [
      newId, userId, nombre, apellidos, email, telefono,
      acompanante, acompananteEmail ?? "", fecha, hora, duracionMin ?? 60,
      "pendiente"
    ]);

    // También guardar en memoria para compatibilidad con código existente
    const nueva: Reserva = {
      id: newId,
      nombre, apellidos, email, telefono,
      acompanante,
      acompananteEmail: acompananteEmail ?? "",
      fecha, hora, duracionMin,
      estado: "pendiente",
    };
    reservas.push(nueva);

    return res.status(201).json({ id: newId });
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
    (!hora || r.hora === hora)
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
  const to = String(req.query.to || "");

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

// ========= MVP Purchase Routes =========
// Create Stripe Checkout for MVP purchase
app.post('/api/mvp/checkout', createMVPCheckout);

// Handle successful MVP purchase (called after Stripe redirect)
app.post('/api/mvp/purchase-success', handleMVPPurchaseSuccess);

// Create user account after MVP purchase
app.post('/api/mvp/create-account', createAccountFromMVP);

// Activate memberships for MVP users (cron job for March 21)
app.post('/api/membership/activate-mvp-members', activateMVPMemberships);

// Manual migration endpoint (Protected)
app.get('/api/mvp/run-migration', runMigrationManually);

// MVP Stripe webhook
app.post('/api/mvp/webhook', express.raw({ type: 'application/json' }), handleMVPWebhook);
