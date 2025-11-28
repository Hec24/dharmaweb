// src/pages/AreaPage.tsx
import { useEffect, useId } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiLogIn, FiUserPlus, FiVideo, FiMic, FiCalendar } from "react-icons/fi";

import GenericNav from "../components/shared/GenericNav";
import { leftLinks, rightLinks, areas, acercaLinks } from "../data/navLinks";

import SectionHeader from "../components/ui/SectionHeader";
import AreaHero from "../components/ui/AeraHero";
import ButtonLink from "../components/ui/ButtonLink";

import { AREAS } from "../config/areas.config";
import { useMembershipStatus } from "../hooks/useMembershipStatus";
import { trackListView } from "../utils/tracking";

export default function AreaPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const area = AREAS[slug];
  const cardHeadingId = useId();
  const { isOpen } = useMembershipStatus();

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

      <main className="bg-white">
        {/* HERO */}
        <section id="area-hero" className="relative">
          <AreaHero
            heroImg={heroImg}
            titulo={area.nombre}
            descripcion={area.descripcion}
            encontraras={area.encontraras}
            bullets={area.bullets}
            minH="min-h-[56vh] md:min-h-[70vh]"
            padTop="pt-24 md:pt-40"
            translateY="translate-y-2 md:translate-y-8"
            gapBelow="pb-16 md:pb-24 2xl:pb-28"
            overlayToWhite={60}
            boostXL={false}
          />
          {/* Hairline inferior */}
          <div
            aria-hidden
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent"
          />
        </section>

        {/* SECCIÓN CTA - Layout de dos columnas */}
        <section
          id="area-contenido"
          className="relative overflow-hidden"
          aria-labelledby="area-contenido-heading"
          style={{ backgroundColor: "var(--color-linen)" }}
        >
          {/* Mini espacio extra */}
          <div aria-hidden className="h-2 md:h-0" />

          {/* Overlay superior sutil */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 right-0 h-4 md:h-6 bg-gradient-to-b from-black/10 to-transparent"
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
            <SectionHeader
              id="area-contenido-heading"
              title="Accede al contenido de esta área"
              subtitle="Únete a la membresía para acceder a todo el material exclusivo de esta área de conocimiento."
              align="center"
              size="md"
              color="asparragus"
              className="mb-10"
            />

            {/* Layout de dos columnas: Imagen + CTA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Columna 1: Imagen */}
              <div className="relative overflow-hidden rounded-2xl shadow-lg order-2 lg:order-1">
                <img
                  src={heroImg}
                  alt={`Contenido del área ${area.nombre}`}
                  className="w-full h-full object-cover aspect-[4/3]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* Columna 2: CTA Card */}
              <div className="order-1 lg:order-2">
                <div className="relative overflow-hidden rounded-2xl bg-raw text-[var(--color-linen)] shadow-lg ring-1 ring-black/5">
                  {/* Decorative background element */}
                  <div
                    aria-hidden
                    className="absolute inset-x-0 -top-16 h-32 opacity-20 bg-[radial-gradient(circle_at_top,_#F2C94C_0,_transparent_60%)]"
                  />

                  <div className="relative p-6 sm:p-8 space-y-6">
                    <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wider font-medium text-gold">
                      Contenido exclusivo
                    </div>

                    <header className="space-y-2">
                      <h3
                        id={cardHeadingId}
                        className="font-gotu text-xl sm:text-2xl leading-snug text-white"
                      >
                        Da el siguiente paso
                      </h3>
                      <p className="font-degular text-sm text-[var(--color-linen)]/80 leading-relaxed">
                        Accede si ya eres miembro o únete para recibir prioridad cuando se abran plazas.
                      </p>
                    </header>

                    <div className="space-y-3" role="group" aria-labelledby={cardHeadingId}>
                      {/* Botón Acceder */}
                      <ButtonLink
                        to="/login"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-asparragus px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-asparragus/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                      >
                        <FiLogIn aria-hidden className="h-4 w-4" />
                        <span>Ya soy miembro: Acceder</span>
                      </ButtonLink>

                      {/* Botón Registro o Lista de Espera (condicional) */}
                      <ButtonLink
                        to={isOpen ? "/registro" : "/lista-espera"}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium text-white border border-white/20 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                      >
                        <FiUserPlus aria-hidden className="h-4 w-4" />
                        <span>{isOpen ? "Quiero unirme: Registro" : "Unirme a la lista de espera"}</span>
                      </ButtonLink>
                    </div>
                  </div>
                </div>

                {/* Bloque informativo sobre contenido */}
                <div className="mt-6 space-y-3">
                  <p className="text-sm text-asparragus/90 font-degular leading-relaxed">
                    Al acceder a esta área encontrarás:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-start gap-2 text-sm text-asparragus/80">
                      <FiVideo className="h-4 w-4 mt-0.5 flex-shrink-0 text-gold" aria-hidden />
                      <span>Vídeos tutoriales</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-asparragus/80">
                      <FiMic className="h-4 w-4 mt-0.5 flex-shrink-0 text-gold" aria-hidden />
                      <span>Podcasts exclusivos</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-asparragus/80">
                      <FiCalendar className="h-4 w-4 mt-0.5 flex-shrink-0 text-gold" aria-hidden />
                      <span>Directos mensuales</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hairline inferior */}
          <div
            aria-hidden
            className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent"
          />
        </section>

        {/* Selector de otras áreas */}
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
                className="flex flex-wrap justify-center gap-x-2.5 sm:gap-x-3 gap-y-2.5 sm:gap-y-3"
              >
                {allAreas.map((a) => (
                  <li key={a.slug} role="listitem">
                    <Link
                      to={`/areas/${a.slug}`}
                      className="
                        inline-flex items-center px-5 sm:px-6 py-2.5 sm:py-3
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
        </section>
      </main>
    </>
  );
}
