// src/pages/OrigenPage.tsx
import { FiArrowRight } from "react-icons/fi";
import { LuCompass, LuFeather, LuMap, LuUsers } from "react-icons/lu";
import { Helmet } from "react-helmet-async";
import GenericNav from "../Components/shared/GenericNav";
import { areas, leftLinks, rightLinks, acercaLinks } from "../data/navLinks";
import SectionHeader from "../Components/ui/SectionHeader";
import ButtonLink from "../Components/ui/ButtonLink";

type OrigenPageProps = {
  heroBgSrc?: string;
  coverImageSrc?: string;
  coverImageAlt?: string;
};

export default function OrigenPage({
  heroBgSrc = "/img/Backgrounds/background5.jpg",
  coverImageSrc = "/img/Team/patytest.webp",
  coverImageAlt = "Pat en su furgoneta junto a Thelma y Louise, en ruta",
}: OrigenPageProps) {
  const bgSrc = "/img/Backgrounds/background4.jpg";

  // SEO
  const seoTitle = "Nuestro Origen | Dharma en Ruta";
  const seoDesc =
    "Descubre la historia detrás de Dharma en Ruta: un viaje de transformación que comenzó en el Sudeste Asiático y se convirtió en una escuela colaborativa de yoga y autoconocimiento.";
  const canonical = "https://dharmaenruta.com/origen";
  const ogImage = "https://dharmaenruta.com/og/origen.jpg";

  const ABOUT_PAGE_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: canonical,
    name: seoTitle,
    description: seoDesc,
    inLanguage: "es",
    isPartOf: { "@id": "https://dharmaenruta.com/#website" },
    mainEntity: {
      "@type": "Organization",
      "@id": "https://dharmaenruta.com/#organization",
      name: "Dharma en Ruta",
      url: "https://dharmaenruta.com/",
    },
  };

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <link rel="canonical" href={canonical} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Dharma en Ruta" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDesc} />
        <meta name="twitter:image" content={ogImage} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(ABOUT_PAGE_SCHEMA)}
        </script>
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
        aria-labelledby="origen-hero-title"
      >
        <img
          src={heroBgSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />
        <div className="absolute inset-0 bg-asparragus/60" aria-hidden />
        <div className="relative z-10 w-full px-6 pb-10 sm:pb-12 md:pb-14 2xl:pb-16 min-[2560px]:pb-24">
          <SectionHeader
            title={<span id="origen-hero-title">El Origen</span>}
            subtitle="El viaje que lo cambió todo"
            size="custom"
            color="white"
            align="left"
            titleClassName="font-gotu text-3xl sm:text-4xl md:text-5xl 2xl:text-6xl leading-tight mb-2"
            subtitleClassName="font-gotu text-linen/95 text-base sm:text-lg md:text-xl"
          />
        </div>
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent"
        />
      </section>

      {/* CONTENIDO */}
      <main id="main" className="font-degular text-raw bg-linen" aria-labelledby="origen-hero-title">
        {/* P1 */}
        <section aria-labelledby="inicio-title" className="relative border-b border-raw/10 flow-root">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="grid gap-6 md:grid-cols-12 md:items-center">
              <div className="order-2 md:order-1 md:col-span-7">
                <div className="space-y-4">
                  <h2 id="inicio-title" className="font-gotu text-asparragus text-lg md:text-xl">
                    El inicio
                  </h2>
                  <p className="text-sm md:text-base leading-relaxed text-raw/90">
                    Hace unos años decidí que no iba a vivir más desde el miedo.
                    Un 31 de diciembre empaqué lo justo, compré un billete de solo ida y me lancé sola a
                    recorrer el Sudeste Asiático.
                    <br />
                    Ese viaje me quitó mil capas: aprendí a estar conmigo, a soltar lo que no me
                    servía y a darme cuenta de que sí, había otra manera de vivir. Fue el inicio de mi propio Dharma.
                  </p>
                </div>
              </div>

              <div className="order-1 md:order-2 md:col-span-5">
                <figure className="relative overflow-hidden rounded-xl bg-raw/5 ring-1 ring-raw/10">
                  <img
                    src={coverImageSrc}
                    alt={coverImageAlt}
                    className="h-56 w-full object-cover md:h-64 lg:h-72"
                    loading="lazy"
                  />
                  <figcaption className="sr-only">
                    Imagen representativa del inicio del viaje que dio origen a la escuela.
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-raw/15 to-transparent" />
        </section>

        {/* P2 */}
        <section aria-labelledby="fusion-title" className="relative border-b border-raw/10 bg-raw/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="mb-4 sm:mb-5">
              <h2 id="fusion-title" className="font-gotu text-asparragus text-lg md:text-xl">
                La fusión
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-12 md:items-start">
              <div className="md:col-span-7">
                <p className="text-sm md:text-base leading-relaxed text-raw/90">
                  De vuelta, seguí explorando y compartiendo lo que me transformaba: el yoga, la meditación,
                  la filosofía, los retiros, los viajes, la fisioterapia… Y al mismo tiempo, elegí un estilo de vida
                  nómada, viviendo en mi furgoneta con mis dos gatas, Thelma y Louise.
                  <br />
                  Así entendí que mi propósito estaba en acompañar a otras personas a emprender también
                  su ruta: hacia dentro (autoconocimiento) y hacia fuera (nuevas formas de vivir).
                </p>
              </div>
              <div className="md:col-span-5">
                <ol className="space-y-3" role="list" aria-label="Tres pilares de esta fusión">
                  <li role="listitem" className="flex items-start gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-gold)] text-white shadow-sm ring-1 ring-black/5">
                      <LuCompass aria-hidden />
                    </span>
                    <p className="text-sm leading-snug text-raw/90">
                      <span className="font-medium">Ruta interior:</span> disciplina, escucha y claridad.
                    </p>
                  </li>
                  <li role="listitem" className="flex items-start gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-asparragus)] text-white shadow-sm ring-1 ring-black/5">
                      <LuFeather aria-hidden />
                    </span>
                    <p className="text-sm leading-snug text-raw/90">
                      <span className="font-medium">Filosofía y práctica:</span> yoga, meditación y vivir con propósito.
                    </p>
                  </li>
                  <li role="listitem" className="flex items-start gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-raw)] text-white shadow-sm ring-1 ring-black/5">
                      <LuUsers aria-hidden />
                    </span>
                    <p className="text-sm leading-snug text-raw/90">
                      <span className="font-medium">Comunidad:</span> vínculos reales para sostener el cambio.
                    </p>
                  </li>
                </ol>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-raw/15 to-transparent" />
        </section>

        {/* P3 — patrón EXACTO SchoolValues + difuminado corto */}
        <section
          aria-labelledby="escuela-title"
          className="relative isolate border-b border-raw/10 overflow-hidden"
        >
          {/* Fondo base claro */}
          <div className="absolute inset-0 -z-20 bg-white" aria-hidden />

          {/* Patrón visible con mezcla cálida (imitado tal cual) */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-65"
            style={{
              backgroundImage: `url('${bgSrc}')`,
              backgroundRepeat: "repeat",
              backgroundSize: "240px",
              backgroundPosition: "center",
              mixBlendMode: "multiply",
              // incluye la opacidad dentro del filter como en tu snippet
              filter: "saturate(0.85) brightness(1.05) opacity(0.35)",
            }}
          />

          {/* Tinte suave para cohesionar (mix-blend-multiply, sin color fuerte) */}
          <div
            aria-hidden
            className="absolute inset-0 -z-[5] mix-blend-multiply"
          />

          {/* Difuminado inferior más corto (sección estrecha) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-8"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.75) 70%, rgba(255,255,255,1) 100%)",
            }}
          />

          {/* CONTENIDO */}
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="mb-4 sm:mb-5">
              <h2 id="escuela-title" className="font-gotu text-asparragus text-lg md:text-xl">
                El nacimiento de la escuela
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-12">
              <div className="md:col-span-7">
                <p className="text-sm md:text-base leading-relaxed text-raw">
                  De ahí nació{" "}
                  <a
                    href="https://patriciaholisticyoga.com/que-es-dharma-en-ruta-y-como-puedes-encontrar-tu-dharma/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 text-asparragus decoration-asparragus/30 hover:decoration-asparragus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
                  >
                    Dharma en Ruta
                  </a>
                  : una escuela colaborativa, nutrida por distintas voces y profesionales que comparten
                  su sabiduría, experiencia y recorrido personal, haciendo de cada área un espacio único y vivo.
                  <br />
                  Una escuela que no se queda en la teoría, sino que te da recursos prácticos para:
                </p>
                <ul
                  role="list"
                  className="mt-4 space-y-2 text-sm md:text-base"
                  aria-label="Recursos prácticos de la escuela"
                >
                  {[
                    "Reconocer quién eres",
                    "Gestionar tus emociones y miedos",
                    "Crear hábitos y vínculos más sanos",
                    "Vivir con más libertad y coherencia",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-raw"
                      role="listitem"
                    >
                      <span
                        aria-hidden
                        className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-asparragus)] flex-shrink-0"
                      />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-5">
                <div className="rounded-xl border border-raw/10 bg-white/80 p-4 shadow-sm backdrop-blur">
                  <div className="mb-3 flex items-center gap-2">
                    <LuMap aria-hidden className="text-asparragus" />
                    <p className="font-gotu text-asparragus text-base">8 áreas, una misma ruta</p>
                  </div>
                  <p className="text-sm leading-relaxed text-raw/90">
                    Integramos cuerpo, mente, hábitos, relaciones y propósito con una mirada clara y
                    práctica. Sin dogmas, con coherencia cotidiana.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* P4 */}
        <section aria-labelledby="vision-title" className="relative bg-[var(--color-pale)]/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <h2 id="vision-title" className="font-gotu text-asparragus text-lg md:text-xl mb-4 sm:mb-5">
              La visión
            </h2>
            <div className="grid gap-6 md:grid-cols-12 md:items-center">
              <div className="md:col-span-7">
                <p className="text-sm md:text-base leading-relaxed text-raw/90">
                  Dharma en Ruta es también comunidad: un lugar donde conectar con
                  personas afines, donde compartir, aprender y sentir que no estás sol@ en este camino.
                  <br />
                  Hoy, esta escuela es el reflejo de mi viaje y mi compromiso: mostrarte que sí, hay otra
                  manera de vivir, y que puedes empezar a caminar hacia ella ahora.
                </p>
              </div>
              <div className="md:col-span-5 flex md:justify-start">
                <ButtonLink
                  as="a"
                  size="md"
                  variant="secondary"
                  icon={<FiArrowRight aria-hidden />}
                  href="https://dashboard.mailerlite.com/forms/779309/143072527599535592/share"
                  className="focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  Da tu primer paso: Descarga Gratis tu Mapa del Dharma
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
