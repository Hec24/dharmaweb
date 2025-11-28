// src/Components/landing/TituloEscuela.tsx
import React from "react";

const TituloEscuela: React.FC = () => {
  return (
    <div
      className="
        w-full px-4 text-center
        mt-6 sm:mt-8 md:mt-8
        md:translate-y-8 lg:translate-y-4 /* empuja visualmente en md */
        motion-safe:transition-transform motion-safe:duration-300
        will-change-transform
      "
    >
      <div className="relative inline-block max-w-4xl mx-auto">
        <div className="absolute -inset-3 rounded-lg transform" />

        {/* Contenedor principal */}
        <div className="relative px-4 sm:px-6 py-3 sm:py-1">
          <h1
            className="
              font-gotu font-bold tracking-tight leading-[1.1] text-black
              text-3xl sm:text-4xl md:text-5xl lg:text-5xl 
            "
          >
            {/* Línea 1 con subrayado */}
            <span className="relative inline-block">
              <span className="relative z-10 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                Una Escuela Nómada
              </span>
              <span
                aria-hidden="true"
                className="
                  absolute -inset-x-2 bottom-1 h-2.5 rounded-full
                  bg-gradient-to-r from-gold/70 via-raw/50 to-asparragus/70
                  blur-[1.5px] z-0
                "
              />
            </span>

            <br />

            {/* Línea 2 con subrayado */}
            <span className="relative inline-block mt-1 sm:mt-2">
              <span className="relative z-10 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                Para Vivir Con Libertad y Coherencia
              </span>
              <span
                aria-hidden="true"
                className="
                  absolute -inset-x-1 bottom-1 h-2 rounded-full
                  bg-gradient-to-r from-asparragus/60 via-gold/60 to-raw/60
                  blur-[1px] z-0
                "
              />
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default TituloEscuela;
