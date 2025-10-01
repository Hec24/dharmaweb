// src/pages/LandingPage.tsx
import React from "react";
import { Helmet } from "react-helmet";

import Header from "../Components/shared/Header";
import GenericNav from "../Components/shared/GenericNav";

import IntroEscuela from "../Components/sections/IntroEscuela/IntroEscuela";
import SeccionCursos from "../Components/sections/CursosSection/SeccionCursos";
import RuedaVida from "../Components/sections/RuedaVidaSection/RuedaVida";
import LeadMagnet from "../Components/sections/LeadMagnetSection/LeadMagnet";
import TeamCarousel from "../Components/sections/TeamSection/TeamCarousel";
import TestimonialsCarousel from "../Components/sections/Testimonios/TestimonialsCarousel";
import TituloEscuela from "../Components/sections/HeaderSection/TituloEscuela";

import { leftLinks, rightLinks, areas, acercaLinks } from "../data/navLinks";

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Dharma en Ruta",
  "url": "https://dharmaenruta.com/",
  "logo": "https://dharmaenruta.com/og/logo.png",
  "sameAs": [
    "https://www.instagram.com/dharmaenruta", // ajusta si procede
    "https://www.youtube.com/@dharmaenruta"   // ajusta si procede
  ]
};

export const LandingPage: React.FC = () => {
  const title = "Dharma en Ruta — Escuela online de yoga, autoconocimiento y viajes conscientes";
  const description =
    "Cursos de yoga y bienestar, acompañamientos 1:1 y yogui viajes. Aprende, practica y vive en coherencia con tu camino.";
  const canonical = "https://dharmaenruta.com/";
  const ogImage = "https://dharmaenruta.com/og/home.jpg";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />

        {/* Canonical */}
        <link rel="canonical" href={canonical} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Dharma en Ruta" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />

        {/* JSON-LD Organization */}
        <script type="application/ld+json">
          {JSON.stringify(ORG_JSON_LD)}
        </script>
      </Helmet>

      <Header
        bgImage="/img/TestPics/fondoheading.jpg"
        align="bottom"
  
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
        {/* Contenido del hero (debajo del nav) */}
        <div className="relative w-full z-20 pb-10">
          <TituloEscuela />
        </div>
      </Header>

      {/* Resto de secciones */}
      <section className="flex flex-col">
        <IntroEscuela />
        <SeccionCursos />
      </section>

      <RuedaVida />
      <LeadMagnet />
      <TeamCarousel />
      <TestimonialsCarousel />
    </>
  );
};

export default LandingPage;