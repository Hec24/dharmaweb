// src/pages/CursosPage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { COURSES_MOCK } from "../data/cursos";
import { Course } from "../types/course";
import { formatEUR } from "../utils/format";
import CursoCard from "../Components/ui/CursoCard";
import CoursesFilters from "../Components/courses/CoursesFilters";
import { Link } from "react-router-dom";
import { areaSlugFromName } from "../utils/areas";
import GenericNav from "../Components/shared/GenericNav";
import { areas, leftLinks, rightLinks, acercaLinks } from "../data/navLinks";
import { Helmet } from "react-helmet";
import SectionHeader from "../Components/ui/SectionHeader";
import { AREAS } from "../config/areas.config";

export default function CursosPage() {
  const [q, setQ] = useState("");
  const [area, setArea] = useState("");
  const [level, setLevel] = useState("");
  const [tag, setTag] = useState("");

  const resultsLiveRef = useRef<HTMLDivElement | null>(null);

  const filtered: Course[] = useMemo(() => {
    const text = q.trim().toLowerCase();
    return COURSES_MOCK.filter((c) => {
      const matchQ = text ? (c.titulo + " " + c.descripcion).toLowerCase().includes(text) : true;
      const matchArea = area ? c.area === area : true;
      const matchLevel = level ? c.level === level : true;
      const matchTag = tag ? (c.tags ?? []).includes(tag) : true;
      return matchQ && matchArea && matchLevel && matchTag;
    });
  }, [q, area, level, tag]);

  useEffect(() => {
    if (!resultsLiveRef.current) return;
    resultsLiveRef.current.textContent =
      filtered.length === 1 ? "1 curso encontrado" : `${filtered.length} cursos encontrados`;
  }, [filtered.length]);

  const allAreas = useMemo(
    () => Object.entries(AREAS).map(([slug, cfg]) => ({ slug, nombre: cfg.nombre })),
    []
  );

  const seoTitle = "Cursos de yoga y bienestar | Dharma en Ruta";
  const seoDesc =
    "Explora el catálogo de cursos: yoga, anatomía aplicada, meditación y vida consciente. Filtra por área y nivel para encontrar tu próxima formación.";
  const canonical = "https://dharmaenruta.com/cursos";
  const heroImg = "https://dharmaenruta.com/og/cursos.jpg";

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />

        <link rel="canonical" href={canonical} />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Dharma en Ruta" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={heroImg} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDesc} />
        <meta name="twitter:image" content={heroImg} />
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
        className="relative h-[38vh] md:h-[46vh] flex items-end justify-center text-center overflow-hidden"
        aria-labelledby="cursos-hero-heading"
      >
        <img
          src={heroImg}
          alt="Cursos Dharma en Ruta"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-asparragus/65" aria-hidden />
        <div className="relative z-10 w-full px-6 pb-10 sm:pb-12 md:pb-14 2xl:pb-16 min-[2560px]:pb-24">
          <h1 id="cursos-hero-heading" className="sr-only">
            Todos los cursos
          </h1>
          <SectionHeader
            title="Todos los cursos"
            subtitle="Explora por áreas de conocimiento, niveles y palabras clave."
            align="center"
            color="white"
            size="custom"
            titleClassName="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl mb-3 md:mb-4"
            subtitleClassName="max-w-2xl mx-auto text-linen/95 font-degular text-[13px] sm:text-sm md:text-base 2xl:text-lg"
            decoration={<span className="mx-auto mt-3 md:mt-4 block h-[3px] w-14 rounded-full bg-gold/80" />}
          />
        </div>
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent"
        />
      </section>

      {/* CONTENIDO */}
      <main className="relative bg-raw" aria-labelledby="cursos-listado-heading">
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 right-0 h-6 md:h-7 bg-gradient-to-b from-black/15 to-transparent"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-10 md:pt-12 pb-12">
          {/* Panel de filtros */}
          <section className="relative -mt-10 md:-mt-14 z-10" aria-labelledby="filtros-heading">
            <h2 id="filtros-heading" className="sr-only">
              Filtros de cursos
            </h2>
            <div className="bg-white rounded-2xl border-2 border-gold/20 shadow-lg p-4 md:p-5">
              <CoursesFilters
                all={COURSES_MOCK}
                q={q}
                setQ={setQ}
                area={area}
                setArea={setArea}
                level={level}
                setLevel={setLevel}
                tag={tag}
                setTag={setTag}
              />
              <div ref={resultsLiveRef} className="sr-only" aria-live="polite" role="status" />
            </div>
          </section>

          {/* Aire */}
          <div className="h-4 md:h-6" />

          {/* Banner contextual (si hay área) */}
          {area && (
            <div className="mb-6 md:mb-8 rounded-xl border-2 border-gold/30 bg-white p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <span className="font-degular text-asparragus">
                Estás filtrando por <strong className="font-gotu">{area}</strong>.
              </span>
              {areaSlugFromName(area) && (
                <Link
                  to={`/areas/${areaSlugFromName(area)}`}
                  className="inline-flex items-center gap-2 rounded px-4 py-2 bg-mossgreen text-white hover:bg-[#8AB84B] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2"
                  aria-label={`Ver página del área ${area}`}
                >
                  Ver página del área →
                </Link>
              )}
            </div>
          )}

          {/* Resultados */}
          <section aria-labelledby="cursos-listado-heading" role="region" className="bg-transparent">
            <h2 id="cursos-listado-heading" className="sr-only">
              Listado de cursos
            </h2>

            {filtered.length === 0 ? (
              <div className="text-center text-asparragus/80 py-20 bg-white rounded-2xl border-2 border-gold/10">
                <p>No encontramos cursos con esos filtros.</p>
                <button
                  className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-white border border-gold/30 hover:bg-linen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2"
                  onClick={() => {
                    setQ("");
                    setArea("");
                    setLevel("");
                    setTag("");
                  }}
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="mt-4 md:mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr items-stretch">
                {filtered.map((c) => {
                  const slug = areaSlugFromName(c.area);
                  return (
                    <div key={c.id} className="h-full flex flex-col">
                      <div className="h-full flex">
                        <CursoCard
                          size="md"
                          className="flex-1"
                          titulo={c.titulo}
                          descripcion={c.descripcion}
                          autor={c.autor}
                          imagen={c.imagen}
                          precio={formatEUR(c.precioEUR)}
                          onComprar={() => {
                            if (c.hotmartUrl) {
                              window.open(c.hotmartUrl, "_blank", "noopener,noreferrer");
                            } else {
                              window.location.href = `/cursos/${c.slug}`;
                            }
                          }}
                        />
                      </div>

                      {/* CTA: Más cursos de esta área */}
                      {slug && (
                        <div className="mt-3">
                          <Link
                            to={`/areas/${slug}`}
                            className="inline-flex items-center gap-2 rounded px-4 py-2 bg-white border border-gold/30 text-asparragus hover:bg-linen transition font-degular focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2"
                            aria-label={`Ver más cursos del área ${c.area}`}
                          >
                            Más cursos de esta área
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* —— NUEVA SECCIÓN: Explora otras áreas —— */}
          <section
            id="otras-areas"
            className="relative mt-12 md:mt-14"
            aria-labelledby="otras-areas-heading"
          >
            {/* <div
              aria-hidden
              className="pointer-events-none absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-black/10 to-transparent"
            /> */}
            <h2 id="otras-areas-heading" className="sr-only">
              Explora otras áreas
            </h2>

            <SectionHeader
              title="Explora otras áreas"
              align="center"
              size="md"
              color="linen"
              className="mb-6"
              decoration={<span className="mx-auto block h-[3px] w-16 rounded-full bg-gold/60" />}
            />

            <nav aria-label="Listado de áreas">
              <ul
                role="list"
                className="
                  flex flex-wrap justify-center
                  gap-x-2.5 sm:gap-x-3
                  gap-y-2.5 sm:gap-y-3
                "
              >
                {allAreas.map((a) => (
                  <li key={a.slug} role="listitem">
                    <Link
                      to={`/areas/${a.slug}`}
                      className="
                        inline-flex items-center
                        px-5 sm:px-6 py-2.5 sm:py-3
                        rounded-full bg-[var(--color-linen)] text-asparragus
                        text-sm sm:text-[15px] whitespace-nowrap
                        hover:bg-[var(--color-gold)] hover:text-white
                        transition shadow-sm font-degular
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2
                      "
                      aria-label={`Ir al área ${a.nombre}`}
                    >
                      {a.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </section>
        </div>

        {/* Hairline inferior por si hay otro bloque debajo */}
        <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </main>
    </>
  );
}
