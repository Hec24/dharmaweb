// src/Components/landing/Leadmagnet/LeadMagnet.tsx
import React from "react";
import NewsletterForm from "../../ui/NewsletterForm";
import { useNewsletterSubscription } from "../../../hooks/useNewsletterSubscription";

const LeadMagnet: React.FC = () => {
  const { subscribe, status, error, setStatus } = useNewsletterSubscription("leadmagnet");

  return (
    <section
      id="leadmagnet"
      className="relative bg-raw-100"
      aria-labelledby="leadmagnet-heading"
    >
      {/* Overlay superior (escalón oscuro) para coherencia con RuedaVida */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 right-0 h-5 md:h-6 bg-gradient-to-b from-black/15 to-transparent"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Heading accesible */}
        <h2 id="leadmagnet-heading" className="sr-only">
          Suscríbete a la DharmaLetter
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
          {/* Imagen a la izquierda (en desktop) */}
          <figure className="order-2 lg:order-1">
            <div className="h-full w-full flex items-center justify-center">
              <img
                alt="Dharma en Ruta — Encuentra tu camino"
                src="/img/TestPics/leadmagnet.png"
                className="w-full max-w-xl lg:max-w-none rounded-2xl lg:rounded-l-2xl lg:rounded-r-none object-cover max-h-[500px]"
                loading="lazy"
              />
            </div>
            <figcaption className="sr-only">Imagen editorial inspiradora de Dharma en Ruta.</figcaption>
          </figure>

          {/* Card texto + formulario */}
          <div className="order-1 lg:order-2 rounded-2xl lg:rounded-r-2xl lg:rounded-l-none border border-gold/10 bg-linen p-6 md:p-8">
            <div className="max-w-prose">
              <h3 className="font-gotu text-asparragus text-2xl md:text-3xl leading-tight">
                Da el paso y únete a la <span className="text-gold">DharmaLetter</span>
              </h3>
              <p className="mt-3 text-asparragus/90 font-degular text-sm md:text-base">
                Inspo práctica, herramientas y noticias para vivir en coherencia con tu camino.
                Sin ruido. Solo lo esencial.
              </p>
            </div>

            {/* Feedback accesible */}
            <div className="sr-only" role="status" aria-live="polite">
              {status === "loading" && "Enviando…"}
              {status === "success" && "¡Gracias! Revisa tu correo para confirmar la suscripción."}
              {status === "error" && (error || "Se produjo un error. Inténtalo de nuevo.")}
            </div>

            <div className="mt-5">
              <NewsletterForm
                onSubscribe={subscribe}
                status={status}
                error={error}
                setStatus={setStatus}
                variant="leadmagnet"
                buttonText="Quiero entrar en la DharmaLetter"
                showTerms={true}
              />
            </div>

            <p className="mt-3 text-[13px] text-asparragus/60">Sin spam. Puedes darte de baja cuando quieras.</p>
          </div>
        </div>
      </div>

      {/* Hairline inferior (separación fina hacia la siguiente sección) */}
      
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent"
      />
      
    </section>
  );
};

export default LeadMagnet;
