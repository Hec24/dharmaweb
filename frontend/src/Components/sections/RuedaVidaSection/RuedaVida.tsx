// src/Components/sections/RuedaVidaSection/RuedaVida.tsx
import React, { useId, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import SectionHeader from "../../ui/SectionHeader";
import ButtonLink from "../../ui/ButtonLink";
import { AREAS } from "../../../config/areas.config";

type Area = { slug: string; nombre: string };

// Deriva tipos de AREAS sin `any`
type AreasConfig = typeof AREAS;
type AreaValueFromConfig = AreasConfig[keyof AreasConfig];
type AreaValue = AreaValueFromConfig extends { nombre: infer N }
  ? { nombre: N extends string ? N : string }
  : { nombre: string };

interface RuedaVidaProps {
  currentAreaSlug?: string;
  excludeCurrent?: boolean;
  evalHref?: string;
}

const RuedaVida: React.FC<RuedaVidaProps> = ({
  currentAreaSlug,
  excludeCurrent = false,
  evalHref = "https://dashboard.mailerlite.com/forms/779309/143072527599535592/share",
}) => {
  const headingId = useId();

  const allAreas: Area[] = useMemo(() => {
    const entries = Object.entries(AREAS) as Array<[string, AreaValue]>;
    const list = entries.map(([slug, v]) => ({ slug, nombre: v.nombre }));
    return Array.from(new Map(list.map((a) => [a.slug, a])).values());
  }, []);

  const chipAreas = useMemo(() => {
    if (excludeCurrent && currentAreaSlug) {
      return allAreas.filter((a) => a.slug !== currentAreaSlug);
    }
    return allAreas;
  }, [allAreas, excludeCurrent, currentAreaSlug]);

  return (
    <section
      id="ruedavida"
      className="relative isolate w-full bg-linen pt-10 md:pt-12 pb-14 md:pb-18 overflow-x-hidden"
      aria-labelledby={headingId}
    >
      {/* Overlay superior (gradiente suave hacia abajo) */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 right-0 h-5 md:h-6 bg-gradient-to-b from-black/10 to-transparent"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={
            <>
              Tu <span className="text-gold">Rueda de la Vida</span> Ideal
            </>
          }
          subtitle="Descubre en qué área estás hoy"
          subtitleClassName="text-sm md:text-base mb-8 md:mb-10 pb-4 md:pb-8 max-w-lg mx-auto text-asparragus/80 mt-2"
          align="center"
          size="md"
          color="asparragus"
          className="mb-6 md:mb-8"
        />

        {/* Panel editorial (patrón por detrás del cuadro) */}
        <div className="relative mx-auto max-w-5xl rounded-2xl bg-white/90 p-5 md:p-7 ring-1 ring-black/5 shadow-lg">
          {/* Patrón detrás del cuadro (más grande en desktop, sin desbordar el body) */}
          <div
            aria-hidden
            className="
              pointer-events-none select-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 rounded-3xl
              w-[calc(100%+48px)] h-[calc(100%+40px)]
              md:w-[calc(100%+460px)] md:h-[calc(100%+120px)]
              lg:w-[calc(100%+460px)] lg:h-[calc(100%+140px)]
              xl:w-[calc(100%+920px)] xl:h-[calc(100%+160px)]
            "
            style={{
              backgroundImage: "url('/img/Backgrounds/background3.jpg')",
              backgroundRepeat: "repeat",
              backgroundSize: "320px",
              backgroundPosition: "center",
              opacity: 0.45,
              filter: "saturate(0.9)",
            }}
          />
          {/* Tinte cálido por debajo del patrón (mismas dimensiones responsivas) */}
          <div
            aria-hidden
            className="
              pointer-events-none select-none absolute left-1/2 top-1/2 -z-20 -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-raw/25
              w-[calc(100%+48px)] h-[calc(100%+40px)]
              md:w-[calc(100%+460px)] md:h-[calc(100%+120px)]
              lg:w-[calc(100%+460px)] lg:h-[calc(100%+140px)]
              xl:w-[calc(100%+920px)] xl:h-[calc(100%+160px)]
            "
          />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 md:gap-8 items-center relative z-10">
            {/* Imagen con la rueda */}
            <figure className="relative">
              <div className="relative group mx-auto flex justify-center">
                <img
                  alt="Rueda de la Vida: mapa para evaluar tus 8 áreas clave"
                  src="/img/TestPics/ruedavida2.png"
                  loading="lazy"
                  className="w-full max-w-md md:max-w-lg rounded-full border-4 border-linen shadow-md transition-transform duration-500 group-hover:rotate-2"
                />
                <div className="pointer-events-none absolute inset-0 rounded-full bg-gold/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <figcaption className="sr-only">
                Representación de las 8 áreas vitales para evaluar tu equilibrio personal.
              </figcaption>
            </figure>

            {/* Bloque de texto y CTA */}
            <div className="flex flex-col items-center lg:items-start gap-3 md:gap-4">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="inline-flex items-center rounded-full bg-linen px-3 py-1 text-[12px] md:text-[13px] font-medium text-asparragus ring-1 ring-black/5">
                  8 áreas clave
                </span>
                <span className="inline-flex items-center rounded-full bg-linen px-3 py-1 text-[12px] md:text-[13px] font-medium text-asparragus ring-1 ring-black/5">
                  Feedback instantáneo
                </span>
                <span className="inline-flex items-center rounded-full bg-linen px-3 py-1 text-[12px] md:text-[13px] font-medium text-asparragus ring-1 ring-black/5">
                  DharmaLetter incluida
                </span>
              </div>

              <ul role="list" className="space-y-1.5 md:space-y-2 text-asparragus/85">
                <li className="flex items-start gap-2 text-sm md:text-[15px]">
                  <FiCheck className="mt-[2px] shrink-0" aria-hidden />
                  <span>Evalúa tu momento vital de forma sencilla.</span>
                </li>
                <li className="flex items-start gap-2 text-sm md:text-[15px]">
                  <FiCheck className="mt-[2px] shrink-0" aria-hidden />
                  <span>Recibe ideas prácticas en tu correo.</span>
                </li>
                <li className="flex items-start gap-2 text-sm md:text-[15px]">
                  <FiCheck className="mt-[2px] shrink-0" aria-hidden />
                  <span>Empieza a diseñar tu próximo paso.</span>
                </li>
              </ul>

              <ButtonLink
                as="a"
                size="md"
                variant="secondary"
                icon={<FiArrowRight aria-hidden />}
                aria-label="Descarga Gratis tu Mapa del Dharma"
                href={evalHref}
                className="focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Descarga Gratis tu Mapa del Dharma
              </ButtonLink>
            </div>
          </div>
        </div>

        {/* Chips de áreas */}
        <nav aria-label="Explora otras áreas" className="mt-8 md:mt-20">
          <SectionHeader
            title="Explora otras áreas"
            align="center"
            size="sm"
            color="asparragus"
            className="mb-4 pt-6 md:pt-8"
            decoration={
              <span className="mx-auto block h-[2px] w-14 rounded-full bg-gold/60" />
            }
          />
          <ul
            role="list"
            className="mx-auto flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-3 gap-y-2.5 px-1"
          >
            {chipAreas.map((a) => (
              <li key={a.slug} role="listitem">
                <Link
                  to={`/areas/${a.slug}`}
                  className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white text-asparragus font-degular text-sm whitespace-nowrap shadow-sm ring-1 ring-black/5 transition hover:bg-gold hover:text-white focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2 focus-visible:ring-offset-linen"
                  aria-label={`Ir al área ${a.nombre}`}
                >
                  {a.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Hairline inferior (transición limpia a LeadMagnet) */}
      <div
        aria-hidden
        className="mt-12 md:mt-16 h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent"
      />
    </section>
  );
};

export default RuedaVida;
