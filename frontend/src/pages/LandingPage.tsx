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

export const LandingPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Dharma en Ruta | Escuela de Vida y Realización Personal</title>
        <meta
          name="description"
          content="Descubre cursos, herramientas y acompañamiento para tu autoconocimiento y bienestar integral en Dharma en Ruta."
        />
        <meta
          property="og:title"
          content="Dharma en Ruta | Escuela de Vida y Realización Personal"
        />
        <meta
          property="og:description"
          content="Descubre cursos, herramientas y acompañamiento para tu autoconocimiento y bienestar integral en Dharma en Ruta."
        />
        <meta property="og:type" content="website" />
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