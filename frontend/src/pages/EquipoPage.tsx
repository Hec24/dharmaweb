// src/pages/EquipoPage.tsx
import React, { useId } from "react";
import { Helmet } from "react-helmet-async";
import GenericNav from "../Components/shared/GenericNav";
import SectionHeader from "../Components/ui/SectionHeader";
import { profesores } from "../data/profesores";
import { areas, leftLinks, rightLinks, acercaLinks } from "../data/navLinks";

/**
 * Página de Equipo — Versión informativa con layout tipo “card horizontal profesional”
 * - Imagen grande 3:4 (como antes).
 * - Bloque blanco ancho a un lado con nombre, título, descripción y tags.
 * - En móvil: apilado (foto arriba, texto abajo).
 * - En desktop: diseño de dos columnas equilibradas (foto + cuadro blanco).
 */

type ProfesorItem = (typeof profesores)[number];

const heroBgSrc = "/img/Backgrounds/background5.jpg";

function Tag({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-gold/20 text-raw px-3 py-1 text-[0.75rem] font-medium">
      {children}
    </span>
  );
}

function ProfileRow({ p }: { p: ProfesorItem }) {
  const titleId = useId();

  return (
    <article
      className="group relative isolate rounded-3xl overflow-hidden ring-1 ring-black/5 bg-linen shadow-sm"
      aria-labelledby={titleId}
      role="listitem"
    >
      <div className="flex flex-col md:flex-row md:items-stretch md:min-h-[22rem]">
        {/* Imagen 3:4 uniforme (misma proporción que antes, ocupa la mitad en desktop) */}
        <div className="relative md:w-1/2 lg:w-[45%] aspect-[3/4] md:aspect-auto">
          <img
            src={p.image}
            alt={p.name}
            className="absolute inset-0 h-full w-full object-cover object-center md:rounded-l-3xl"
            loading="lazy"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
          />
        </div>

        {/* Bloque blanco informativo */}
        <div className="relative bg-white md:w-1/2 lg:w-[55%] flex flex-col justify-center p-6 sm:p-8 md:p-10 text-raw">
          <header className="mb-2">
            <h3
              id={titleId}
              className="font-gotu text-2xl sm:text-3xl md:text-4xl leading-tight text-raw"
            >
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
        </div>
      </div>
    </article>
  );
}

const EquipoPage: React.FC = () => {
  const heroTitleId = useId();

  return (
    <main className="bg-linen text-raw">
      <Helmet>
        <title>Equipo | Dharma en Ruta</title>
        <meta
          name="description"
          content="Conoce al equipo de Dharma en Ruta: docentes, terapeutas y guías que acompañan procesos reales de transformación."
        />
        <link rel="canonical" href="https://dharmaenruta.com/equipo" />
      </Helmet>

      {/* NAV */}
      <header className="absolute inset-x-0 top-0 z-40">
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
      </header>

      {/* HERO */}
      <section
        className="relative h-[38vh] md:h-[46vh] flex items-end overflow-hidden"
        aria-labelledby={heroTitleId}
      >
        <img
          src={heroBgSrc}
          alt="imagen fondos acerca de"
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />
        <div className="absolute inset-0 bg-asparragus/60" aria-hidden />
        <div className="relative z-10 w-full px-6 pb-10 sm:pb-12 md:pb-14">
          <SectionHeader
            title={<span id={heroTitleId}>Nuestro Equipo</span>}
            subtitle="Personas que viven lo que enseñan. Experiencia, vocación y presencia en cada acompañamiento."
            size="custom"
            color="white"
            align="left"
            titleClassName="font-gotu text-3xl sm:text-4xl md:text-5xl leading-tight mb-2"
            subtitleClassName="font-gotu text-linen/95 text-base sm:text-lg md:text-xl"
            className="text-left"
          />
        </div>
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent"
        />
      </section>

      {/* SECCIÓN EQUIPO */}
      <section
        id="directorio"
        className="relative bg-linen"
        aria-label="Directorio del equipo de Dharma en Ruta"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-12">
          <SectionHeader
            title="Conoce a las personas detrás de la escuela"
            subtitle="Cada guía aporta su experiencia, mirada y propósito al camino compartido de Dharma en Ruta."
            align="center"
            size="md"
            color="asparragus"
            className="mb-8"
            subtitleClassName="text-sm md:text-base text-asparragus/80 mt-2"
          />

          <div className="flex flex-col gap-8 md:gap-10" role="list">
            {profesores.map((p) => (
              <ProfileRow key={p.id} p={p} />
            ))}
          </div>
        </div>
        <div
          aria-hidden
          className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent"
        />
      </section>
    </main>
  );
};

export default EquipoPage;
