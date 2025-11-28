import React from "react";
import { Helmet } from "react-helmet-async";

import GenericNav from "../components/shared/GenericNav";
import HeroContent from "../components/landing/HeroContent";

import TestimonialsCarousel from "../components/sections/Testimonios/TestimonialsCarousel";
import LandingHeader from "../components/shared/Header/LandingHeader";
import SchoolValuesSection from "../components/sections/ValoresSection/SchoolValuesSection";
import MembershipSection from "../components/sections/MembershipSection/MembershipSection";
import TestRuedaVidaSection from "../components/sections/TestRuedaVidaSection/TestRuedaVidaSection";
import AcompanamientosPreview from "../components/sections/AcompanamientosPreview/AcompanamientosPreview";
import FinalCTA from "../components/sections/FinalCTA/FinalCTA";

import { leftLinks, rightLinks, areas, acercaLinks } from "../data/navLinks";

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Dharma en Ruta",
  "url": "https://dharmaenruta.com/",
  "logo": "https://dharmaenruta.com/og/logo.png",
  "sameAs": [
    "https://www.instagram.com/dharmaenruta",
    "https://www.youtube.com/@dharmaenruta"
  ]
};

// 👇 Señales fuertes para el nombre del sitio y snippet
const WEB_SITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://dharmaenruta.com/#website",
  "url": "https://dharmaenruta.com/",
  "name": "Dharma en Ruta",
  "inLanguage": "es"
};

export const LandingPage: React.FC = () => {
  const title =
    "Dharma en Ruta — Escuela online de yoga, autoconocimiento y viajes conscientes";
  const description =
    "Cursos de yoga y bienestar, acompañamientos 1:1 y yogui viajes. Aprende, practica y vive en coherencia con tu camino.";
  const canonical = "https://dharmaenruta.com/";
  const ogImage = "https://dharmaenruta.com/og/home.jpg";

  const WEB_PAGE_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "url": canonical,
    "name": title,
    "description": description,
    "isPartOf": { "@id": "https://dharmaenruta.com/#website" },
    "inLanguage": "es"
  };

  return (
    <>
      <Helmet>
        {/* Title & Description */}
        <title>{title}</title>
        <meta name="description" content={description} />

        {/* Robots por defecto para páginas indexables */}
        <meta
          name="robots"
          content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"
        />

        {/* Canonical */}
        <link rel="canonical" href={canonical} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Dharma en Ruta" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta
          property="og:image:alt"
          content="Dharma en Ruta — Escuela online de yoga, autoconocimiento y viajes conscientes"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(WEB_SITE_JSON_LD)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(WEB_PAGE_JSON_LD)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(ORG_JSON_LD)}
        </script>
      </Helmet>

      {/* Hero with content */}
      <LandingHeader
        bgImage="/img/TestPics/fondoheading.jpg"
        align="bottom"
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
        <HeroContent />
      </LandingHeader>

      {/* Secciones reordenadas según nuevo funnel */}
      <MembershipSection />
      <TestRuedaVidaSection />
      <AcompanamientosPreview />
      <SchoolValuesSection />
      <TestimonialsCarousel />
      <FinalCTA />
    </>
  );
};

export default LandingPage;
