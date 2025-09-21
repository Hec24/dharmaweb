import React, { useState } from "react";
import NewsletterForm from "../ui/NewsletterForm";

export default function NewsletterContainer({
  variant = "leadmagnet",
  buttonText = "Sí quiero",
  showName = false,
  showTerms = true,
  className = "",
  source = "landing",     // <-- identifica origen (landing/footer/leadmagnet)
}: {
  variant?: "footer" | "leadmagnet";
  buttonText?: string;
  showName?: boolean;
  showTerms?: boolean;
  className?: string;
  source?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubscribe = async ({ email, name }: { email: string; name?: string }) => {
    try {
      setError(null);
      setStatus("loading");
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, source }),
      });
      const data = await res.json();
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
  };

  return (
    <NewsletterForm
      onSubscribe={onSubscribe}
      status={status}
      error={error}
      setStatus={setStatus}
      variant={variant}
      buttonText={buttonText}
      showName={showName}
      showTerms={showTerms}
      className={className}
    />
  );
}