import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ButtonLink from "../ui/ButtonLink";
import { api } from "../../lib/api";

type StripeSession = {
  id: string;
  payment_status: string; // "paid" | ...
  status: string;         // "complete" | ...
  metadata?: {
    reservaId?: string;   // fallback legacy
    reservaIds?: string;  // JSON stringified array
  };
};

// Helper: extrae ids desde metadata (soporta array o único)
function extractReservaIds(session: StripeSession | unknown): string[] {
  const s = session as StripeSession;
  const md = s?.metadata || {};
  if (md.reservaIds) {
    try {
      const arr = JSON.parse(md.reservaIds);
      return Array.isArray(arr) ? arr.filter(Boolean) : [];
    } catch {
      // ignore JSON parse errors
    }
  }
  return md.reservaId ? [md.reservaId] : [];
}

export default function Gracias() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("");
  const [reservaId, setReservaId] = useState<string | null>(null); // mostramos 1 en la UI si existe
  const [calendarLink, setCalendarLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionsCount, setSessionsCount] = useState<number>(1);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!sessionId) {
        setError("Falta el parámetro 'session_id' en la URL.");
        setLoading(false);
        return;
      }

      try {
        // 1) Recuperar la sesión desde tu backend (misma cuenta/clave que el webhook)
        const { data: session } = await api.get<StripeSession>(`/pagos/checkout-session/${sessionId}`);
        if (cancelled) return;

        setStatus(session?.payment_status || "");

        // Lee ids desde metadata (array o único)
        const ids = extractReservaIds(session);
        setSessionsCount(ids.length || 1);
        const firstId = ids[0] || null;
        setReservaId(firstId);

        // Si aún no está paid, informamos y salimos
        if (session?.payment_status !== "paid") {
          setError("El pago aún no está confirmado. Si ya has pagado, actualiza esta página en unos segundos.");
          setLoading(false);
          return;
        }

        // 🔁 FAN-OUT: parchar TODAS las reservas (idempotente) para asegurar creación en Calendar
        try {
          const idsToPatch = ids.length ? ids : (firstId ? [firstId] : []);
          const links: string[] = [];

          for (const rid of idsToPatch) {
            const { data: patchResp } = await api.patch(`/reservas/${rid}`, { estado: "pagada" });
            const link = patchResp?.calendar?.htmlLink || patchResp?.reserva?.eventHtmlLink || null;
            if (link) links.push(link);
          }

          // usa el primer link si quieres mostrar sólo uno
          if (links[0]) setCalendarLink(links[0]);
          setError(null);
        } catch (e) {
          // No bloqueamos la UX: el pago está 'paid' y el webhook pudo hacerlo ya.
          console.warn("[/gracias] PATCH de refuerzo (multi) falló en alguna reserva:", e);
          setError(null);
        }
      } catch (e: unknown) {
        console.error("[/gracias] error confirmando:", e);
        let errorMessage = "No se pudo confirmar el pago.";
        if (typeof e === "object" && e !== null) {
          const errObj = e as { response?: { data?: { error?: string } }, message?: string };
          errorMessage = errObj.response?.data?.error || errObj.message || errorMessage;
        }
        setError(errorMessage);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [sessionId]);

  // UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF2EC]">
        <div className="bg-white shadow-xl rounded-3xl p-12 max-w-lg w-full text-center">
          <h1 className="text-2xl mb-2">Procesando tu pago…</h1>
          <p className="text-gray-700">Un momento, por favor.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF2EC]">
        <div className="bg-white shadow-xl rounded-3xl p-12 max-w-lg w-full text-center space-y-4">
          <h1 className="text-3xl">No se pudo confirmar el pago</h1>
          <p className="text-gray-700">{error}</p>
          {status && (
            <p className="text-sm text-gray-500">Estado de pago (informativo): {status}</p>
          )}
          {reservaId ? (
            <ButtonLink href={`/pagoDatos/${reservaId}`} className="underline text-mossgreen">
              Volver a tus datos
            </ButtonLink>
          ) : (
            <ButtonLink href="/" className="underline text-mossgreen">
              Volver al inicio
            </ButtonLink>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF2EC]">
      <div className="bg-white shadow-xl rounded-3xl p-12 max-w-lg w-full text-center space-y-4">
        <h1 className="text-3xl mb-2">¡Gracias por tu compra! 🙌</h1>

        <p className="text-gray-700">
          {sessionsCount > 1
            ? `Hemos confirmado tu pago y creado ${sessionsCount} eventos en el calendario.`
            : `Hemos confirmado tu pago y creado el evento en el calendario.`}
          {" "}
          En unos instantes recibirás los correos de invitación.
        </p>

        {status && (
          <p className="text-sm text-gray-500">Estado de pago: {status}</p>
        )}

        {calendarLink ? (
          <a
            href={calendarLink}
            target="_blank"
            rel="noreferrer"
            className="inline-block px-4 py-2 rounded bg-emerald-600 text-white"
          >
            Ver evento en Google Calendar
          </a>
        ) : (
          <p className="text-sm text-gray-500">
            Si no ves el correo aún, revisa la carpeta de spam.
          </p>
        )}

        <div className="pt-2">
          <ButtonLink href="/" className="underline text-mossgreen">
            Volver al inicio
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
