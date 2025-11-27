import React, { useState } from "react";
import Input from "./Input";
import Checkbox from "./Checkbox";
import ButtonLink from "./ButtonLink";

interface NewsletterFormProps {
  onSubscribe: (data: { email: string; name?: string }) => Promise<void>;
  status?: "idle" | "loading" | "success" | "error";
  error?: string | null;
  setStatus?: (status: "idle" | "loading" | "success" | "error") => void;
  variant?: "footer" | "leadmagnet";
  buttonText?: string;
  showName?: boolean;
  showTerms?: boolean;
  className?: string;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({
  onSubscribe,
  status = "idle",
  error,
  variant,
  buttonText = "Sí quiero",
  showName = false,
  showTerms = true,
  className = "",
}) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (showTerms && !acceptTerms) return;
    await onSubscribe({ email, name: showName ? name : undefined });
    setEmail("");
    setName("");
    setAcceptTerms(false);
  };

  if (status === "success") {
    return (
      <div
        className={`${
          variant === "footer"
            ? "bg-gold/10 border border-gold rounded-lg p-4 text-center"
            : "bg-mossgreen/20 border border-mossgreen rounded-lg p-6 text-center"
        }`}
      >
        <h3 className="text-lg font-gotu text-gold mb-2">¡Gracias por unirte!</h3>
        <p
          className={`${
            variant === "footer"
              ? "text-linen font-degular text-sm"
              : "text-asparragus font-degular text-base"
          }`}
        >
          Te hemos enviado un correo de confirmación.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`${className} ${variant === "footer" ? "space-y-3" : "space-y-5"}`}>
      {showName && (
        <Input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nombre (opcional)"
          variant={variant}
          />
      )}
        <Input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Tu email"
        required
        variant={variant}
        />
      {showTerms && (
        <div className="flex items-start">
          <Checkbox
          checked={acceptTerms}
          onChange={e => setAcceptTerms(e.target.checked)}
          required
          label={<>Acepto los <a href="#">términos</a> y la <a href="#">política de privacidad</a></>}
          variant={variant}
          />
        </div>
      )}

      {error && (
        <div className="text-red-600 text-sm text-center">{error}</div>
      )}

      <ButtonLink
        as="button"
        type="submit"
        variant={variant === "footer" ? "footer" : "leadmagnet"}
        loading={status === "loading"}
        disabled={status === "loading" || (showTerms && !acceptTerms)}
        fullWidth
        onClick={() => {}}              // 👈 evita el error de tipos
        className="opacity-100"         // 👈 por si el disabled aplica opacidad 0
      >
        {status === "loading" ? "Enviando..." : buttonText}
      </ButtonLink>

    </form>
  );
};

export default NewsletterForm;

