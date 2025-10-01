// src/pages/AreaPage.tsx
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import GenericNav from "../Components/shared/GenericNav";
import { leftLinks, rightLinks, areas, acercaLinks } from "../data/navLinks";

import CursoCard from "../Components/ui/CursoCard";
import SectionHeader from "../Components/ui/SectionHeader";
import AreaHero from "../Components/ui/AeraHero";

import { AREAS } from "../config/areas.config";
import { withUTM } from "../utils/utm";
import { trackBuyClick, trackListView } from "../utils/tracking";

const HOTMART_REF = "dharma-ref-prueba";

export default function AreaPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const area = AREAS[slug];

  useEffect(() => {
    if (area) trackListView(slug);
  }, [slug, area]);

  if (!area) {
    return (
      <main className="min-h-[70vh] grid place-items-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-gotu text-asparragus">Área no encontrada</h1>
          <Link
            to="/"
            className="mt-3 inline-block underline text-mossgreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2 rounded"
          >
            Volver
          </Link>
        </div>
      </main>
    );
  }

  const seoTitle = `${area.nombre} | Dharma en Ruta`;
  const seoDesc = area.descripcion || `Cursos y herramientas del área ${area.nombre} para avanzar a tu ritmo.`;
  const heroImg = area.heroImg || "https://dharmaenruta.com/og/area.jpg";
  const canonical = `https://dharmaenruta.com/areas/${slug}`;

  const allAreas = Object.entries(AREAS).map(([k, v]) => ({ slug: k, nombre: v.nombre }));
  const cursos = Array.isArray(area.cursos) ? area.cursos : [];

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
        {heroImg && <meta property="og:image" content={heroImg} />}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDesc} />
        {heroImg && <meta name="twitter:image" content={heroImg} />}
      </Helmet>


      {/* NAV sobre el hero (transparente) */}
      <header className="absolute inset-x-0 top-0 z-40">
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
      </header>

      <main className="bg-white">
        {/* HERO — mobile-first: más compacto en móvil */}
        <section id="area-hero" className="relative">
          <AreaHero
            heroImg={heroImg}
            titulo={area.nombre}
            descripcion={area.descripcion}
            bullets={area.bullets}
            /* ↓ En móvil reducimos altura y padding; crece en md+ */
            minH="min-h-[56vh] md:min-h-[70vh]"
            padTop="pt-24 md:pt-40"
            translateY="translate-y-6 md:translate-y-14"
            overlayToWhite={60}
          />
          {/* Hairline inferior (línea fina) */}
          <div
            aria-hidden
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent"
          />
        </section>

        {/* GRID cursos — mini espacio al inicio en mobile y chips no pegados */}
        <section
          id="area-cursos"
          className="relative overflow-hidden"
          aria-labelledby="area-cursos-heading"
          style={{ backgroundColor: "var(--color-linen)" }}
        >
          {/* Mini espacio visual entre hero y esta sección (solo móvil) */}
          <div aria-hidden className="h-2 md:h-0" />

          {/* Overlay superior más sutil en móvil para que se vea el “aire” */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 right-0 h-4 md:h-6 bg-gradient-to-b from-black/10 to-transparent"
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
            <h2 id="area-cursos-heading" className="sr-only">
              Cursos de esta área
            </h2>

            <SectionHeader
              title="Cursos de esta área"
              subtitle="Formación práctica para avanzar a tu ritmo."
              align="center"
              size="md"
              color="asparragus"
              className="mb-6"
            />

            {cursos.length === 0 ? (
              <div
                className="min-h-[28vh] grid place-items-center rounded-2xl bg-white border border-gold/10 px-4"
                role="status"
                aria-live="polite"
              >
                <p className="text-sm md:text-base text-asparragus/80">
                  Pronto anunciaremos nuevos cursos en esta área. 🧘‍♀️
                </p>
              </div>
            ) : (
              <div
                role="list"
                aria-label={`Listado de cursos del área ${area.nombre}`}
                className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr items-stretch"
              >
                {cursos.map((c, idx) => {
                  const urlConUtm = withUTM(c.hotmartUrl, {
                    utm_source: "web",
                    utm_medium: "organic",
                    utm_campaign: `area_${slug}`,
                    utm_content: c.id,
                    ref: HOTMART_REF,
                  });

                  return (
                    <div key={c.id ?? `curso-${idx}`} role="listitem" className="h-full">
                      <CursoCard
                        titulo={c.titulo}
                        descripcion={c.descripcion ?? "Descubre todo lo que aprenderás en este curso."}
                        autor={c.autor ?? "Dharma en Ruta"}
                        imagen={c.cover || "/img/placeholder.jpg"}
                        precio={c.priceEUR ? `${c.priceEUR} €` : "Próximamente"}
                        onComprar={() => {
                          trackBuyClick({
                            areaSlug: slug,
                            cursoId: c.id,
                            cursoTitulo: c.titulo,
                            valueEUR: c.priceEUR,
                          });
                          window.open(urlConUtm, "_blank", "noopener,noreferrer");
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Hairline inferior (transición limpia a otras áreas) */}
          <div
            aria-hidden
            className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent"
          />
        </section>

        {/* Selector de otras áreas — chips con más aire en mobile */}
        <section
          id="otras-areas"
          className="relative py-10 md:py-14 bg-white"
          aria-labelledby="otras-areas-heading"
        >
          {/* Overlay superior para coherencia visual */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 right-0 h-4 md:h-6 bg-gradient-to-b from-black/10 to-transparent"
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="otras-areas-heading" className="sr-only">
              Explora otras áreas
            </h2>

            <SectionHeader
              title="Explora otras áreas"
              align="center"
              size="md"
              color="asparragus"
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
          </div>

          {/* (Opcional) Hairline inferior si viene otra sección después */}
          {/* <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" /> */}
        </section>
      </main>
    </>
  );
}
