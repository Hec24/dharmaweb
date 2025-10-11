import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ButtonLink from "../ui/ButtonLink";
import { api } from "../../lib/api";

type StripeSession = {
  id: string;
  payment_status: string; // "paid" | ...
  status: string;         // "complete" | ...
  metadata?: { reservaId?: string };
};

export default function Gracias() {
  const [params] = useSearchParams();

  const sessionId = params.get("session_id");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("");
  const [reservaId, setReservaId] = useState<string | null>(null);
  const [calendarLink, setCalendarLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!sessionId) {
        setError("Falta el parámetro 'session_id' en la URL.");
        setLoading(false);
        return;
      }

      try {
        // 1) Recuperar la sesión desde tu backend (usa la misma clave/ cuenta que el webhook)
        const { data: session } = await api.get<StripeSession>(`/pagos/checkout-session/${sessionId}`);
        if (cancelled) return;

        setStatus(session?.payment_status || "");
        const rid = session?.metadata?.reservaId || null;
        setReservaId(rid);

        if (session?.payment_status !== "paid") {
          setError("El pago aún no está confirmado. Si ya has pagado, actualiza esta página en unos segundos.");
          setLoading(false);
          return;
        }

        if (!rid) {
          setError("No se pudo asociar el pago a una reserva (falta reservaId en metadata).");
          setLoading(false);
          return;
        }

        // tras recuperar la session:
        const rawIds = (session.metadata as { reservaIds?: string })?.reservaIds;
        let firstId = session?.metadata?.reservaId || null;
        try {
          const ids = rawIds ? JSON.parse(rawIds) as string[] : [];
          firstId = ids[0] || firstId;
        } catch {
          // intentionally ignore JSON parse errors
        }

        if (firstId) {
          await api.patch(`/reservas/${firstId}`, { estado: "pagada" }); // idempotente
        }


        // 2) Idempotente: marcar pagada (si ya lo hizo el webhook, esto no rompe nada)
        const { data: patchResp } = await api.patch(`/reservas/${rid}`, { estado: "pagada" });

        // 3) Intenta extraer un enlace al evento si tu backend lo devuelve en la respuesta
        const link =
          patchResp?.calendar?.htmlLink ||
          patchResp?.reserva?.eventHtmlLink ||
          null;
        if (link) setCalendarLink(link);

        setError(null);
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
          Hemos confirmado tu pago y creado el evento en el calendario.
          En unos instantes recibirás los correos de invitación.
        </p>

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
          <p className="text-sm text-gray-500">Si no ves el correo aún, revisa la carpeta de spam.</p>
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
