import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ButtonLink from "../ui/ButtonLink";
import { api } from "../../lib/api";

export default function Gracias() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (!sessionId) return;
    api
      .get(`/pagos/checkout-session/${sessionId}`)
      .then(({ data }) => setStatus(data?.payment_status ?? ""))
      .catch(() => {});
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF2EC]">
      <div className="bg-white shadow-xl rounded-3xl p-12 max-w-lg w-full text-center">
        <h1 className="text-3xl mb-2">¡Gracias por tu compra! 🙌</h1>
        <p className="text-gray-700 mb-6">
          Hemos enviado la confirmación a tu email. Si es una sesión 1:1, recibirás una invitación de calendario.
        </p>
        {status && (
          <p className="text-sm text-gray-500 mb-6">Estado de pago (informativo): {status}</p>
        )}
        <ButtonLink href="/" className="underline text-mossgreen">
          Volver al inicio
        </ButtonLink>
      </div>
    </div>
  );
}
