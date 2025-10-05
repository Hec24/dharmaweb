// src/pages/ComingSoonPage.tsx
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import GenericNav from "../Components/shared/GenericNav";
import { leftLinks, rightLinks, areas, acercaLinks } from "../data/navLinks";
import { FiTool, FiArrowRight } from "react-icons/fi";

// Puedes cambiar esta imagen si quieres un hero específico:
const HERO_BG = "/img/Backgrounds/background5.jpg";

const ComingSoonPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Estamos creando esta parte | Dharma en Ruta</title>
        <meta
          name="description"
          content="Estamos preparando esta sección con mucho cariño. Muy pronto podrás explorarlo en Dharma en Ruta."
        />
        <meta property="og:title" content="Estamos creando esta parte | Dharma en Ruta" />
        <meta
          property="og:description"
          content="Estamos preparando esta sección con mucho cariño. Muy pronto podrás explorarlo en Dharma en Ruta."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* HERO con imagen de fondo + degradado suave */}
      <header className="relative isolate min-h-[100svh] flex flex-col">
        {/* Fondo imagen */}
        <div
          className="absolute inset-0 -z-10 bg-center bg-cover"
          style={{ backgroundImage: `url(${HERO_BG})` }}
          aria-hidden="true"
        />
        {/* Overlay degradado suave hacia blanco/linen */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/10 via-black/10 to-linen/90" />

        {/* NAV (translúcido) */}
        <div className="absolute inset-x-0 top-0 z-40">
          <GenericNav
            title="Dharma en Ruta"
            logoSrc="/img/Logos/Logos-08.png"
            leftLinks={leftLinks}
            rightLinks={rightLinks}
            areas={areas}
            acercaLinks={acercaLinks}
            variant="transparent"
            containerWidth="110rem"
            barWidth="110rem"
            innerPx="px-[min(6vw,3rem)]"
            barHeight="h-16"
          />
        </div>

        {/* 👇 Espaciador bajo el NAV para que en mobile no quede pegado arriba */}
        <div className="h-16 sm:h-20" aria-hidden="true" />

        {/* Contenido centrado */}
        <main className="flex-1 grid place-items-center px-4 sm:px-6 py-10 sm:py-14">
          <div className="w-full max-w-3xl">
            {/* Tarjeta principal */}
            <section
              aria-labelledby="comingsoon-title"
              className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg ring-1 ring-black/5 p-6 md:p-8"
            >
              {/* Ribbon estado */}
              <div className="absolute -top-3 left-5 select-none" aria-hidden="true">
                <span className="inline-flex items-center gap-1 rounded-full bg-gold text-white text-[0.75rem] font-medium tracking-wide px-3 py-1 shadow">
                  <FiTool aria-hidden />
                  En construcción
                </span>
              </div>

              <h1
                id="comingsoon-title"
                className="text-2xl md:text-3xl font-semibold text-asparragus font-gotu"
              >
                Estamos creando esta parte de la web
              </h1>

              <p className="mt-3 text-[0.95rem] md:text-base text-asparragus/80 leading-relaxed font-degular">
                Muy pronto verás el resultado. Gracias por tu paciencia y por ser parte de este
                camino 🌿
              </p>

              {/* Bullets suaves */}
              <ul role="list" className="mt-5 space-y-2 text-asparragus/80">
                <li role="listitem" className="flex items-start gap-2 text-[0.95rem]">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-mossgreen" aria-hidden="true" />
                  <span className="font-degular">
                    Contenido alineado con nuestras áreas de conocimiento.
                  </span>
                </li>
                <li role="listitem" className="flex items-start gap-2 text-[0.95rem]">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
                  <span className="font-degular">Diseño limpio, moderno y accesible.</span>
                </li>
                <li role="listitem" className="flex items-start gap-2 text-[0.95rem]">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-raw" aria-hidden="true" />
                  <span className="font-degular">Actualizaciones constantes para ofrecer más valor.</span>
                </li>
              </ul>

              {/* CTA buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-mossgreen text-white px-4 py-2.5 text-[0.95rem] font-medium transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                >
                  Volver al inicio
                  <FiArrowRight aria-hidden />
                </Link>
                <Link
                  to="/acompanamientos"
                  className="inline-flex items-center justify-center rounded-xl bg-white text-asparragus px-4 py-2.5 text-[0.95rem] font-medium ring-1 ring-asparragus/20 hover:bg-linen transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                >
                  Ver acompañamientos
                </Link>
                <Link
                  to="/areas/elsenderodelyo"
                  className="inline-flex items-center justify-center rounded-xl bg-white text-asparragus px-4 py-2.5 text-[0.95rem] font-medium ring-1 ring-asparragus/20 hover:bg-linen transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                >
                  Explorar áreas
                </Link>
              </div>

              {/* Estado accesible para lectores de pantalla */}
              <div role="status" aria-live="polite" className="sr-only">
                Esta sección está en construcción. Pronto habrá novedades.
              </div>
            </section>

            {/* Nota sutil abajo */}
            <p className="text-center mt-5 text-sm text-asparragus/60 font-degular">
              Si has llegado aquí desde un enlace, es posible que esa sección aún no esté publicada.
            </p>
          </div>
        </main>

        {/* Franja inferior con degradado suave */}
        <div className="h-16 bg-gradient-to-t from-linen to-transparent" aria-hidden="true" />
      </header>
    </>
  );
};

export default ComingSoonPage;
