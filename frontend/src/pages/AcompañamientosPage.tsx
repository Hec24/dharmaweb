// src/pages/AcompañamientosPage.tsx
import React from "react";
import { FiArrowRight, FiChevronDown, FiChevronUp, FiCalendar } from "react-icons/fi";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

import GenericNav from "../components/shared/GenericNav";
import Header from "../components/shared/Header";
import SectionHeader from "../components/ui/SectionHeader";
import ButtonLink from "../components/ui/ButtonLink";
import ReservaWizard from "../components/reservas/ReservaWizard";


import { profesores } from "../data/profesores";
import { faqsAcompanamientos } from "../data/faqs";
import { areas, leftLinks, rightLinks, acercaLinks } from "../data/navLinks";
import type { Profesor } from "../data/types";



// ——— Chips de especialidad (compacto)
function Tag({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-gold/20 text-raw px-3 py-1 text-[0.75rem] font-medium">
      {children}
    </span>
  );
}

// ——— Card horizontal profesional: foto 3:4 + cuadro blanco + CTA Agendar
function ProfileRow({
  p,
  onAgendar,
}: {
  p: Profesor;
  onAgendar: (prof: Profesor) => void;
}) {
  const titleId = React.useId();
  return (
    <article
      className="group relative isolate rounded-3xl overflow-hidden ring-1 ring-black/5 bg-linen shadow-sm"
      aria-labelledby={titleId}
      role="listitem"
    >
      <div className="flex flex-col md:flex-row md:items-stretch md:min-h-[22rem]">
        {/* Imagen 3:4 uniforme */}
        <div className="relative md:w-1/2 lg:w-[45%] aspect-[3/4] md:aspect-auto">
          <img
            src={p.image}
            alt={p.name}
            className="absolute inset-0 h-full w-full object-cover object-center md:rounded-l-3xl"
            loading="lazy"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>

        {/* Cuadro blanco con info + CTA */}
        <div className="relative bg-white md:w-1/2 lg:w-[55%] flex flex-col justify-center p-6 sm:p-8 md:p-10 text-raw">
          <header className="mb-2">
            <h3 id={titleId} className="font-gotu text-2xl sm:text-3xl md:text-4xl leading-tight text-raw">
              {p.name}
            </h3>
            {p.title && (
              <p className="text-asparragus/80 text-sm md:text-base font-semibold font-degular">
                {p.title}
              </p>
            )}
          </header>

          {p.description && (
            <p className="mt-3 text-sm md:text-base text-raw/85 leading-relaxed font-degular">
              {p.description}
            </p>
          )}

          {p.specialties && p.specialties.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {p.specialties.map((s) => (
                <Tag key={`${p.id}-${s}`}>{s}</Tag>
              ))}
            </div>
          )}

          <div className="mt-5">
            <ButtonLink
              as="button"
              size="md"
              variant="primary"
              icon={<FiCalendar aria-hidden />}
              onClick={() => onAgendar(p)}
              className="focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2"
              aria-label={`Agendar sesión con ${p.name}`}
            >
              Agendar con {p.name.split(" ")[0]}
            </ButtonLink>
          </div>
        </div>
      </div>
    </article>
  );
}



const AcompañamientosPage: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedProfesor, setSelectedProfesor] = React.useState<Profesor | null>(null);

  const { hash } = useLocation();

  React.useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  const toggleFaq = React.useCallback((index: number) => {
    setExpandedFaq((prev) => (prev === index ? null : index));
  }, []);

  const handleAgendar = React.useCallback((prof: Profesor) => {
    setSelectedProfesor(prof);
    setModalOpen(true);
  }, []);

  const handleReservarAhora = React.useCallback(() => {
    setSelectedProfesor(null);
    setModalOpen(true);
  }, []);

  const handleCloseWizard = React.useCallback(() => {
    setModalOpen(false);
  }, []);

  const title = "Acompañamientos 1:1 de yoga y autoconocimiento | Dharma en Ruta";
  const description =
    "Diseña tu práctica de yoga, lecturas de carta natal y procesos de bienestar guiados. Trabajo cercano, práctico y alineado contigo.";
  const canonical = "https://dharmaenruta.com/acompanamientos";
  const ogImage = "https://dharmaenruta.com/og/acompanamientos.jpg";

  // Schema.org - FAQPage
  const FAQ_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqsAcompanamientos.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${faq.answer} ${faq.answer2 || ""}`.trim(),
      },
    })),
  };

  // Schema.org - Service
  const SERVICE_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Acompañamientos personalizados de yoga y autoconocimiento",
    provider: {
      "@type": "Organization",
      "@id": "https://dharmaenruta.com/#organization",
      name: "Dharma en Ruta",
    },
    areaServed: "ES",
    availableLanguage: "es",
    description: description,
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Dharma en Ruta" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(FAQ_SCHEMA)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(SERVICE_SCHEMA)}
        </script>
      </Helmet>

      {/* HERO */}
      <Header
        bgImage="/img/Backgrounds/tinified/background5.jpg"
        align="center"
        withBottomStep
        nav={
          <GenericNav
            title="Dharma en Ruta"
            logoSrc="/img/Logos/Logos-08.png"
            leftLinks={leftLinks}
            rightLinks={rightLinks}
            areas={areas}
            acercaLinks={acercaLinks}
            variant="transparent"
            containerWidth="120rem"
            barWidth="110rem"
            innerPx="px-[min(6vw,3rem)]"
            barHeight="h-20"
          />
        }
      >


        <div
          className="
            w-full flex flex-col items-center justify-start text-center
            px-6 sm:px-8              /* 👉 añade aire lateral en mobile */
            pt-14 md:pt-16 lg:pt-20  /* 👉 más respiro arriba */
            pb-8 md:pb-10            /* 👉 más aire abajo */
            min-h-[340px]            /* un poco más de alto base */
          "
        >
          <SectionHeader
            title="Acompañamientos Personalizados: Tu Ruta Con Guía"
            subtitle="Dharma en Ruta también es un espacio vivo, donde profundizar en tu proceso de manera personal."
            subtitleClassName="
              text-base md:text-lg text-black mt-3 md:mt-4 
              max-w-[22rem] sm:max-w-[28rem] md:max-w-[36rem] /* 👉 limita ancho del subtítulo para legibilidad */
            "
            align="center"
            size="md"
            color="black"
            className="mb-5 md:mb-6"
            decoration
          />

          <ButtonLink
            as="button"
            size="md"
            variant="primary"
            icon={<FiArrowRight aria-hidden />}
            onClick={handleReservarAhora}
            className="focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2"
            aria-label="Abrir asistente de reserva"
          >
            Reservar Ahora
          </ButtonLink>

          {/* Wizard solo cuando se abre */}
          {modalOpen && (
            <ReservaWizard
              open
              onClose={handleCloseWizard}
              preSelectedProfesor={selectedProfesor ?? undefined}
              autoAdvanceFromStep0={!!selectedProfesor}
            />
          )}
        </div>

      </Header>


      <div className="font-degular text-raw overflow-x-hidden">
        {/* CÓMO FUNCIONA */}
        <section
          id="como-funciona"
          className="relative w-full bg-raw overflow-hidden -mt-px"
          aria-labelledby="como-funciona-heading"
        >
          {/* Overlay superior */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 right-0 h-6 md:h-7 bg-gradient-to-b from-black/15 to-transparent"
          />
          <div className="relative z-10 max-w-6xl mx-auto py-10 md:py-14 w-full px-4 sm:px-6">
            <SectionHeader
              title="¿Cómo funciona?"
              subtitle="Cuatro pasos sencillos para empezar hoy"
              subtitleClassName="text-sm md:text-base text-linen/90 mt-2"
              align="center"
              size="md"
              color="linen"
              className="mb-6 md:mb-8"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8 md:mb-10">
              {[
                { n: "1", t: "Elige tu área", d: "Explora las 8 áreas de la escuela y elige la que más resuene contigo: evolución personal, bienestar, vínculos, sexualidad, finanzas, etc." },
                { n: "2", t: "Encuentra tu acompañamiento", d: "Cada profesional ofrece sesiones, lecturas o procesos guiados según su especialidad. Lee su perfil y siente con quién conectas más." },
                { n: "3", t: "Reserva y comienza", d: "Agenda tu sesión directamente desde la web. Recibirás los pasos a seguir y el acceso a tu sesión en el email que añadiste." },
                { n: "4", t: "Integra lo aprendido", d: "Los acompañamientos son el puente entre el conocimiento y la práctica. Aquí el aprendizaje se transforma en experiencia real." },
              ].map((s) => (
                <div key={s.n} className="bg-linen p-6 md:p-7 rounded-xl shadow-sm ring-1 ring-black/5">
                  <span className="text-gold text-2xl md:text-3xl font-semibold mb-2 block">{s.n}</span>
                  <h3 className="text-base md:text-lg font-semibold mb-2 text-raw">{s.t}</h3>
                  <p className="text-sm md:text-base text-asparragus">{s.d}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <ButtonLink
                as="button"
                size="md"
                variant="secondary"
                icon={<FiArrowRight aria-hidden />}
                onClick={handleReservarAhora}
                className="focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2"
                aria-label="Agendar mi sesión ahora"
              >
                Agendar mi sesión
              </ButtonLink>
            </div>
          </div>

          {/* Hairline inferior */}
          <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        </section>

        {/* LISTADO DE ACOMPAÑANTES */}
        <section
          id="agendar"
          className="relative scroll-mt-24 w-full bg-linen"
          aria-labelledby="agendar-heading"
        >
          {/* Escalón superior */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 right-0 h-6 md:h-7 bg-gradient-to-b from-black/10 to-transparent"
          />
          <div className="relative z-10 max-w-7xl mx-auto py-8 md:py-12 w-full px-4 sm:px-6">
            <SectionHeader
              title="Encuentra al Profesional Ideal para Ti"
              align="center"
              size="md"
              color="asparragus"
              className="mb-6 md:mb-8"
              subtitle="Explora los perfiles y agenda tu sesión con la persona que más resuene contigo."
              subtitleClassName="text-sm md:text-base text-asparragus/80 mt-2"
            />

            <div className="sr-only" role="status" aria-live="polite">
              {modalOpen && "Asistente de reserva abierto."}
            </div>

            <div className="flex flex-col gap-8 md:gap-10" role="list" aria-label="Listado de acompañantes">
              {profesores.map((profesor) => (
                <ProfileRow key={profesor.id} p={profesor as Profesor} onAgendar={handleAgendar} />
              ))}
            </div>
          </div>

          {/* Hairline hacia CTA */}
          <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        </section>
        {/* CTA FINAL — NUEVO esquema beige/marrón */}
        <section
          id="cta-final"
          className="relative w-full bg-raw"
          aria-labelledby="cta-final-heading"
        >
          {/* Transición superior suave */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 right-0 h-6 md:h-7 bg-gradient-to-b from-black/10 to-transparent"
          />
          <div className="relative z-10 max-w-5xl mx-auto text-center w-full px-4 sm:px-6 py-12 md:py-16">
            <SectionHeader
              title="Aquí, el conocimiento se convierte en experiencia"
              align="center"
              size="sm"
              color="linen"
              className="mb-6 md:mb-8"
              subtitle="Da el paso: te acompañamos a integrar, con coherencia cotidiana."
              subtitleClassName="text-sm md:text-base text-linen/90 mt-2"
            />

            <div className="mt-6">
              {/* Botón invertido para contrastar con fondo RAW */}
              <ButtonLink
                href="https://dashboard.mailerlite.com/forms/779309/143072527599535592/share"
                external
                variant="primary"
                size="md"
                icon={<FiArrowRight aria-hidden />}
                className="focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2"
                aria-label="Comenzar mi viaje ahora"
              >
                Comenzar mi viaje ahora
              </ButtonLink>
            </div>
          </div>

          {/* Hairline inferior (antes del bloque FAQ) */}
          <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        </section>

        {/* FAQ — ahora en fondo beige para casar con la imagen marrón/beige */}
        <section
          id="faq"
          className="relative w-full bg-linen"
          aria-labelledby="faq-heading"
        >
          {/* Escalón superior */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 right-0 h-6 md:h-7 bg-gradient-to-b from-black/10 to-transparent"
          />
          <div className="relative z-10 max-w-5xl mx-auto py-10 md:py-14 w-full px-4 sm:px-6">
            <SectionHeader
              title="Preguntas Frecuentes"
              align="center"
              size="md"
              color="asparragus"
              className="mb-6 md:mb-8"
              subtitleClassName="text-sm md:text-base text-asparragus/80"
            />

            <div className="space-y-3 sm:space-y-4 w-full">
              {faqsAcompanamientos.map((faq, index) => {
                const isOpen = expandedFaq === index;
                const contentId = `faq-content-${index}`;
                const buttonId = `faq-button-${index}`;
                return (
                  <div
                    key={index}
                    className={`bg-white/90 backdrop-blur rounded-xl overflow-hidden transition-all duration-300 ring-1 ring-raw/10 ${isOpen ? "shadow" : "shadow-sm"
                      } w-full`}
                  >
                    <button
                      id={buttonId}
                      onClick={() => toggleFaq(index)}
                      aria-expanded={isOpen}
                      aria-controls={contentId}
                      className="flex justify-between items-center w-full text-left p-4 sm:p-6 hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2 focus-visible:ring-offset-linen"
                    >
                      <span className="text-base sm:text-lg md:text-xl font-semibold text-raw pr-2">
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <FiChevronUp className="text-asparragus flex-shrink-0" size={22} aria-hidden />
                      ) : (
                        <FiChevronDown className="text-asparragus flex-shrink-0" size={22} aria-hidden />
                      )}
                    </button>
                    <div
                      id={contentId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${isOpen ? "max-h-[520px]" : "max-h-0"
                        }`}
                    >
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-sm md:text-base text-raw/90">
                        {faq.answer}<br />{faq.answer2}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hairline inferior (antes de imagen inferior/marco del footer) */}
          <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        </section>
      </div>

    </>
  );
};

export default AcompañamientosPage;

