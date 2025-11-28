// src/pages/TuTestimonioPage.tsx
import React from "react";
import SimplePageLayout from "../layouts/SimplePageLayout";
import Input from "../components/ui/Input";
import Checkbox from "../components/ui/Checkbox";
import Button from "../components/ui/Button";
import { FiStar } from "react-icons/fi";

type Status = "idle" | "loading" | "success" | "error";

export default function TuTestimonioPage() {
  const [status, setStatus] = React.useState<Status>("idle");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const [nombre, setNombre] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [titulo, setTitulo] = React.useState("");
  const [mensaje, setMensaje] = React.useState("");
  const [rating, setRating] = React.useState(5);
  const [consent, setConsent] = React.useState(false);

  // Honeypot para bots
  const [website, setWebsite] = React.useState("");

  const disabled = status === "loading" || !mensaje.trim() || !consent;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disabled) return;
    if (website.trim().length > 0) return; // honeypot

    setStatus("loading");
    setErrorMsg(null);

    try {
      // === OPCIÓN A) Enviar a tu API y desde ahí a MailerLite/Email ===
      // const payload = { nombre, email, titulo, mensaje, rating, consent };
      // await api.post("/testimonios", payload);

      // === OPCIÓN B) Enviar directo a un endpoint de MailerLite (webhook/automation) ===
      // await fetch(import.meta.env.VITE_ML_WEBHOOK_URL, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ nombre, email, titulo, mensaje, rating }),
      // });

      // MOCK
      await new Promise((r) => setTimeout(r, 650));

      setStatus("success");
      setNombre("");
      setEmail("");
      setTitulo("");
      setMensaje("");
      setRating(5);
      setConsent(false);
    } catch (err) {
      console.error(err);
      setErrorMsg("No hemos podido enviar tu testimonio. Inténtalo más tarde.");
      setStatus("error");
    }
  };

  return (
    <SimplePageLayout
      title="Tu Testimonio"
      subtitle="Tu voz puede inspirar a otras personas a comenzar su viaje."
      lastUpdated="14 de septiembre de 2025"
      maxWidthClass="max-w-3xl"
    >
      {status === "success" && (
        <div
          className="mb-6 rounded-xl border border-mossgreen/30 bg-mossgreen/10 text-mossgreen px-4 py-3"
          role="status"
          aria-live="polite"
        >
          ¡Gracias por compartir tu experiencia! La revisaremos antes de publicarla.
        </div>
      )}
      {errorMsg && (
        <div
          className="mb-6 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3"
          role="alert"
        >
          {errorMsg}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        {/* Honeypot (oculto) */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nombre" className="block text-sm text-gray-700 mb-1">
              Nombre
            </label>
            <Input
              id="nombre"
              name="nombre"
              inputMode="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              aria-describedby="nombre-help"
            />
            <p id="nombre-help" className="mt-1 text-xs text-gray-500">
              Puedes usar un alias si lo prefieres.
            </p>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
              Email (opcional)
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="titulo" className="block text-sm text-gray-700 mb-1">
            Título (opcional)
          </label>
          <Input
            id="titulo"
            name="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej. Transformador y cercano"
          />
        </div>

        <div>
          <label htmlFor="mensaje" className="block text-sm text-gray-700 mb-1">
            Tu testimonio <span className="text-gray-400">(requerido)</span>
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[1rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-mossgreen/40 min-h-[140px]"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="¿Qué te llevas de esta experiencia? ¿Qué te gustó más?"
            aria-required="true"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Evita datos sensibles o información de terceras personas.
          </p>
        </div>

        {/* Rating accesible como radiogroup */}
        <fieldset>
          <legend className="block text-sm text-gray-700 mb-2">Valoración</legend>
          <div
            role="radiogroup"
            aria-label="Valoración de 1 a 5 estrellas"
            className="flex items-center gap-2"
          >
            {[1, 2, 3, 4, 5].map((n) => {
              const checked = n === rating;
              return (
                <label
                  key={n}
                  className={`inline-flex items-center justify-center rounded-full p-2 transition focus-within:outline-none focus-within:ring-2 focus-within:ring-gold focus-within:ring-offset-2 ${
                    n <= rating ? "text-gold" : "text-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="rating"
                    value={n}
                    className="sr-only"
                    checked={checked}
                    onChange={() => setRating(n)}
                    aria-label={`${n} estrellas`}
                  />
                  <FiStar size={24} aria-hidden />
                </label>
              );
            })}
            <span className="ml-2 text-sm text-gray-600">{rating} / 5</span>
          </div>
        </fieldset>

        <Checkbox
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          label={
            <>
              Autorizo a <strong>Dharma en Ruta</strong> a usar mi testimonio, según la{" "}
              <a
                href="/legal/privacidad"
                className="underline text-asparragus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded"
              >
                Política de Privacidad
              </a>
              .
            </>
          }
        />

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            disabled={disabled}
            size="custom"
            className="px-5 py-2.5 text-[0.95rem]"
            aria-busy={status === "loading"}
          >
            {status === "loading" ? "Enviando…" : "Enviar testimonio"}
          </Button>
          <p className="text-xs text-gray-500">
            Al enviar, aceptas nuestra{" "}
            <a href="/legal/terminos" className="underline">
              política de reseñas
            </a>
            .
          </p>
        </div>
      </form>
    </SimplePageLayout>
  );
}
