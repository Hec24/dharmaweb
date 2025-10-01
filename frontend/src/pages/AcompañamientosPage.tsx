// src/pages/AcompañamientosPage.tsx
import React from "react";
import { FiArrowRight, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

import GenericNav from "../Components/shared/GenericNav";
import Header from "../Components/shared/Header";
import SectionHeader from "../Components/ui/SectionHeader";
import ProfesorCard from "../Components/ui/ProfesorCard";
import ButtonLink from "../Components/ui/ButtonLink";
import ReservaWizard from "../Components/reservas/ReservaWizard";

import { profesores } from "../data/profesores";
import { faqs } from "../data/faqs";
import { areas, leftLinks, rightLinks, acercaLinks } from "../data/navLinks";
import type { Profesor } from "../data/types";

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
      </Helmet>

      {/* HERO */}
      <Header
        bgImage="/img/Backgrounds/background5.jpg"
        align="center"
        withBottomStep
        nav={
          <GenericNav
            title="Dharma En Ruta"
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
        <div className="w-full text-center flex flex-col items-center justify-start pt-10 md:pt-12 pb-6 min-h-[320px]">
          <SectionHeader
            title="Acompañamiento Espiritual Personalizado"
            subtitle="Encuentra la guía perfecta para tu camino interior"
            subtitleClassName="text-base md:text-lg text-black mt-2"
            align="center"
            size="lg"
            color="black"
            className="mb-4"
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
            Reservar ahora
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

      <div className="font-sans overflow-x-hidden">
        {/* CÓMO FUNCIONA — con “escalón” coherente desde el Header */}
        <section
          id="como-funciona"
          className="relative w-full bg-raw overflow-hidden"
          aria-labelledby="como-funciona-heading"
        >
          {/* Overlay superior: recoge el hairline del Header */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 right-0 h-6 md:h-7 bg-gradient-to-b from-black/15 to-transparent"
          />
          <div className="relative z-10 max-w-6xl mx-auto py-10 md:py-14 w-full px-4 sm:px-6">
            <h2 id="como-funciona-heading" className="sr-only">
              ¿Cómo funciona nuestro acompañamiento?
            </h2>

            <SectionHeader
              title="¿Cómo funciona?"
              subtitle="Tres pasos sencillos para empezar hoy"
              subtitleClassName="text-sm md:text-base text-linen/90 mt-2"
              align="center"
              size="md"
              color="linen"
              className="mb-6 md:mb-8"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8 md:mb-10">
              {[
                { n: "1", t: "Elige", d: "Conecta con quien resuene contigo." },
                { n: "2", t: "Reserva", d: "Elige día y hora cómodamente." },
                { n: "3", t: "Conecta", d: "Recibe los detalles de tu sesión." },
                { n: "4", t: "Transforma", d: "Da tu siguiente paso con guía." },
              ].map((s) => (
                <div key={s.n} className="bg-linen p-6 md:p-7 rounded-xl shadow-sm ring-1 ring-black/5">
                  <span className="text-gold text-3xl md:text-4xl font-bold mb-2 block">{s.n}</span>
                  <h3 className="text-lg md:text-xl font-semibold mb-2 text-mossgreen">{s.t}</h3>
                  <p className="text-sm md:text-base text-asparragus/90">{s.d}</p>
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

          {/* Hairline inferior hacia la sección de FAQ */}
          <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        </section>

        {/* FAQ — accesible */}
        <section
          id="faq"
          className="relative w-full bg-mossgreen"
          aria-labelledby="faq-heading"
        >
          {/* Escalón superior desde 'Cómo funciona' */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 right-0 h-6 md:h-7 bg-gradient-to-b from-black/15 to-transparent"
          />
          <div className="relative z-10 max-w-5xl mx-auto py-10 md:py-14 w-full px-4 sm:px-6">
            <h2 id="faq-heading" className="sr-only">
              Preguntas frecuentes
            </h2>

            <SectionHeader
              title="Preguntas Frecuentes"
              align="center"
              size="md"
              color="linen"
              className="mb-6 md:mb-8"
            />

            <div className="space-y-3 sm:space-y-4 w-full">
              {faqs.map((faq, index) => {
                const isOpen = expandedFaq === index;
                const contentId = `faq-content-${index}`;
                const buttonId = `faq-button-${index}`;
                return (
                  <div
                    key={index}
                    className={`bg-white rounded-xl overflow-hidden transition-all duration-300 ${
                      isOpen ? "shadow-lg" : "shadow-md"
                    } w-full`}
                  >
                    <button
                      id={buttonId}
                      onClick={() => toggleFaq(index)}
                      aria-expanded={isOpen}
                      aria-controls={contentId}
                      className="flex justify-between items-center w-full text-left p-4 sm:p-6 hover:bg-pale transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2"
                    >
                      <span className="text-lg sm:text-xl md:text-2xl font-semibold text-mossgreen pr-2">
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
                      className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                        isOpen ? "max-h-[480px]" : "max-h-0"
                      }`}
                    >
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-sm md:text-base text-asparragus/90">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hairline inferior hacia “Acompañadores” */}
          <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        </section>

        {/* LISTADO ACOMPAÑADORES */}
        <section
          id="agendar"
          className="relative scroll-mt-24 w-full bg-linen"
          aria-labelledby="agendar-heading"
        >
          {/* Escalón superior desde FAQ */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 right-0 h-6 md:h-7 bg-gradient-to-b from-black/10 to-transparent"
          />
          <div className="relative z-10 max-w-7xl mx-auto py-8 md:py-12 w-full px-4 sm:px-6">
            <h2 id="agendar-heading" className="sr-only">
              Encuentra al Acompañador Ideal
            </h2>
            <SectionHeader
              title="Encuentra al Acompañador Ideal"
              align="center"
              size="md"
              color="asparragus"
              className="mb-6 md:mb-8"
              subtitle="Profesionales que te acompañarán con respeto y claridad."
              subtitleClassName="text-sm md:text-base text-asparragus/80 mt-2"
            />
            <div className="sr-only" role="status" aria-live="polite">
              {modalOpen && "Asistente de reserva abierto."}
            </div>

            {/* Cards de acompañadores */}
            <div className="space-y-8 md:space-y-10">
              {profesores.map((profesor) => (
                <section
                  key={profesor.id}
                  id={`acompanador-${profesor.id}`}
                  className="bg-transparent"
                  aria-label={`Acompañador ${"name" in profesor ? profesor.name : "perfil"}`}
                >
                  <ProfesorCard
                    {...profesor}
                    variant="acompanamientos"
                    onAgendar={() => handleAgendar(profesor)}
                  />
                </section>
              ))}
            </div>
          </div>

          {/* Hairline inferior hacia CTA final */}
          <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        </section>

        {/* CTA FINAL — retoque visual */}
        <section
          id="cta-final"
          className="relative w-full bg-gradient-to-r from-asparragus to-mossgreen overflow-hidden"
          aria-labelledby="cta-final-heading"
        >
          {/* Escalón superior desde Acompañadores */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 right-0 h-6 md:h-7 bg-gradient-to-b from-black/15 to-transparent"
          />
          <div className="relative z-10 max-w-5xl mx-auto text-center w-full px-4 sm:px-6 py-12 md:py-16">
            <h2 id="cta-final-heading" className="font-gotu text-linen text-3xl sm:text-4xl md:text-5xl leading-tight">
              ¿Preparado para tu transformación?
            </h2>
            <p className="mt-3 text-linen/90 text-base sm:text-lg md:text-xl font-light">
              El mejor momento es ahora.
            </p>

            <div className="mt-6">
              <ButtonLink
                href="https://dashboard.mailerlite.com/forms/779309/143072527599535592/share"
                external
                variant="secondary"
                size="md"
                icon={<FiArrowRight aria-hidden />}
                className="focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2"
                aria-label="Comenzar mi viaje ahora"
              >
                Comenzar mi viaje
              </ButtonLink>
            </div>
          </div>

          {/* Hairline inferior final (por si después hay footer claro) */}
          <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        </section>
      </div>
    </>
  );
};

export default AcompañamientosPage;
