// src/hooks/useNewsletterSubscription.ts
import { useState, useCallback } from "react";

type Status = "idle" | "loading" | "success" | "error";

/**
 * Hook para suscripciones a la newsletter.
 * Envia los datos al backend (/api/subscribe) en lugar de exponer MailerLite en el frontend.
 */
export function useNewsletterSubscription(source: string = "web") {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const subscribe = useCallback(
    async ({ email, name }: { email: string; name?: string }) => {
      setStatus("loading");
      setError(null);

      try {
        const res = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name, source }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data?.ok) {
          throw new Error(data?.error || "No se pudo suscribir");
        }

        setStatus("success");
      } catch (e: unknown) {
        const errorMessage =
          e instanceof Error ? e.message : "Error desconocido";
        setError(errorMessage);
        setStatus("error");
      }
    },
    [source]
  );

  return { subscribe, status, error, setStatus };
}
