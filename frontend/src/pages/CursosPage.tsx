// src/pages/CursosPage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import GenericNav from "../Components/shared/GenericNav";
import SectionHeader from "../Components/ui/SectionHeader";
import CursoCard from "../Components/ui/CursoCard";
import CoursesFilters from "../Components/courses/CoursesFilters";

import { areas, leftLinks, rightLinks, acercaLinks } from "../data/navLinks";
import { AREAS } from "../config/areas.config";
import { formatEUR } from "../utils/format";
import { areaSlugFromName } from "../utils/areas";
import type { Course, CourseLevel } from "../types/course";

// —————————————————————————————————————————————————————
// Config local (todo lo que viene de AREAS no trae nivel ⇒ default)
const DEFAULT_LEVEL: CourseLevel = "Inicial";

// Helpers
function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Normalización SOLO desde AREAS (sin COURSES_MOCK)
function normalizeFromAreas(): Course[] {
  const out: Course[] = [];
  Object.entries(AREAS).forEach(([areaSlug, areaCfg]) => {
    const areaName = areaCfg.nombre ?? areaSlug;
    (areaCfg.cursos ?? []).forEach((c) => {
      const baseSlug = c.titulo ? slugify(c.titulo) : c.id ?? Math.random().toString(36).slice(2);
      const id = c.id ?? `${areaSlug}-${baseSlug}`;
      out.push({
        id,
        slug: `${areaSlug}-${baseSlug}`,
        titulo: c.titulo ?? "Curso",
        descripcion: c.descripcion ?? "",
        autor: c.autor ?? "",
        imagen: c.cover ?? "/img/TestPics/imagencurso.png",
        area: areaName,
        level: DEFAULT_LEVEL, // garantizamos CourseLevel
        precioEUR: c.priceEUR ?? null,
        hotmartUrl: c.hotmartUrl,
        tags: [areaName], // temática básica = área
      });
    });
  });
  return out;
}

// Dataset final (exclusivo de AREAS)
const ALL_COURSES: Course[] = (() => {
  const byKey = new Map<string, Course>();
  normalizeFromAreas().forEach((c) => {
    const key = c.id || c.slug;
    if (!byKey.has(key)) byKey.set(key, c);
  });
  return Array.from(byKey.values());
})();

// —————————————————————————————————————————————————————
// Página principal
export default function CursosPage() {
  const [q, setQ] = useState("");
  const [area, setArea] = useState("");
  const [level, setLevel] = useState<CourseLevel | "">("");
  const [tag, setTag] = useState("");

  const resultsLiveRef = useRef<HTMLDivElement | null>(null);

  const filtered: Course[] = useMemo(() => {
    const text = q.trim().toLowerCase();
    return ALL_COURSES.filter((c) => {
      const matchQ = text
        ? `${c.titulo} ${c.descripcion} ${c.autor}`.toLowerCase().includes(text)
        : true;
      const matchArea = area ? c.area === area : true;
      const matchLevel = level ? c.level === (level as CourseLevel) : true;
      const matchTag = tag ? (c.tags ?? []).includes(tag) : true;
      return matchQ && matchArea && matchLevel && matchTag;
    });
  }, [q, area, level, tag]);

  useEffect(() => {
    if (resultsLiveRef.current) {
      resultsLiveRef.current.textContent =
        filtered.length === 1 ? "1 curso encontrado" : `${filtered.length} cursos encontrados`;
    }
  }, [filtered.length]);

  // SEO
  const seoTitle = "Cursos de yoga y bienestar | Dharma en Ruta";
  const seoDesc =
    "Explora el catálogo de cursos: yoga, anatomía aplicada, meditación y vida consciente. Filtra por área y temática para encontrar tu próxima formación.";
  const canonical = "https://dharmaenruta.com/cursos";
  const heroImg = "/img/Backgrounds/background5.jpg";

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
        className="relative h-[34vh] md:h-[42vh] flex items-end justify-center text-center overflow-hidden"
        aria-labelledby="cursos-hero-heading"
      >
        <img
          src={heroImg}
          alt="Cursos Dharma en Ruta"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-asparragus/65" aria-hidden />
        <div className="relative z-10 w-full px-6 pb-8 sm:pb-10 md:pb-12">
          <SectionHeader
            title="Todos los cursos"
            subtitle="Filtra por área, temática y nivel."
            align="center"
            color="white"
            size="custom"
            titleClassName="text-2xl sm:text-3xl md:text-[2rem] mb-3"
            subtitleClassName="max-w-2xl mx-auto text-linen/95 font-degular text-[13px] sm:text-sm md:text-base"
            decoration={<span className="mx-auto mt-3 block h-[3px] w-12 rounded-full bg-gold/80" />}
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
          className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-black/15 to-transparent"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-10 pb-12">
          {/* Filtros */}
          <section className="relative -mt-8 md:-mt-12 z-10" aria-labelledby="filtros-heading">
            <h2 id="filtros-heading" className="sr-only">
              Filtros de cursos
            </h2>

            <div className="bg-white rounded-2xl border-2 border-gold/20 shadow-lg p-4 md:p-5">
              <CoursesFilters
                all={ALL_COURSES}
                q={q}
                setQ={setQ}
                area={area}
                setArea={setArea}
                level={level || ""}
                setLevel={(v: string) => setLevel((v as CourseLevel) || "")}
                tag={tag}
                setTag={setTag}
              />
              <div ref={resultsLiveRef} className="sr-only" aria-live="polite" role="status" />
            </div>
          </section>

          <div className="h-4 md:h-6" />

          {/* Resultados */}
          {filtered.length === 0 ? (
            <div className="text-center text-asparragus/80 py-16 bg-white rounded-2xl border-2 border-gold/10">
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
            <div className="mt-3 md:mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr items-stretch">
              {filtered.map((c) => {
                const slugArea = c.area ? areaSlugFromName(c.area) : null;
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
                        precio={formatEUR(c.precioEUR ?? undefined)}
                        onComprar={() => {
                          if (c.hotmartUrl) {
                            window.open(c.hotmartUrl, "_blank", "noopener,noreferrer");
                          } else {
                            window.location.href = `/cursos/${c.slug}`;
                          }
                        }}
                      />
                    </div>

                    {slugArea && (
                      <div className="mt-3">
                        <Link
                          to={`/areas/${slugArea}`}
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
        </div>
      </main>
    </>
  );
}
