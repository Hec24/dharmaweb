// src/Components/shared/Header/LandingHeader.tsx
import React from "react";
import Header from "../Header";
import SectionHeader from "../../ui/SectionHeader";
type LandingHeaderProps = {
  /** Nav ya construido (GenericNav, etc.) */
  nav: React.ReactNode;
  /** Fondo del hero (imagen recomendada para landing) */
  bgImage?: string;
  /** Color de fondo alternativo si no hay imagen */
  bgColor?: string;
  /** Mostrar/ocultar el título integrado (true solo en la landing) */
  showTitle?: boolean;
  /** Alineación vertical del contenido del Header (reutiliza API del Header) */
  align?: "top" | "bottom" | "center";
  /** Clases extra para el contenedor raíz del Header */
  className?: string;
};

const LandingHeader: React.FC<LandingHeaderProps> = ({
  nav,
  bgImage,
  bgColor = "transparent",
  showTitle = true,
  align = "bottom",
  className = "",
}) => {
  return (
    <Header
      nav={nav}
      bgImage={bgImage}
      bgColor={bgColor}
      align={align}
      withBottomStep
      className={className}
    >
      {showTitle && (
        <div
          /* 🔧 SUBIR UN PELÍN EL TÍTULO:
             - Mobile: ajusta `max-[767px]:-translate-y-2` (más negativo = más arriba).
             - Desktop: ajusta `md:-translate-y-4` (más negativo = más arriba).
             - Si prefieres mover con margen: cambia por `max-[767px]:mb-2 md:mb-4`.
          */
          className="
            w-full px-4 text-center
            max-[767px]:-translate-y-6
            md:-translate-y-4
            motion-safe:transition-transform motion-safe:duration-300 will-change-transform
          "
          aria-labelledby="titulo-escuela-heading"
        >
          <div className="relative inline-block max-w-4xl mx-auto">
            <SectionHeader
              // Usamos SectionHeader para el título (texto negro)
              title={
                <span id="titulo-escuela-heading" className="inline-block">
                  {/* Línea 1 con subrayado suave */}
                  <span className="relative inline-block">
                    <span className="relative z-10">Una Escuela Nómada</span>
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
                  {/* Línea 2 con subrayado suave */}
                  <span className="relative inline-block mt-1 sm:mt-2">
                    <span className="relative z-10">Para Vivir Con Libertad y Coherencia</span>
                    <span
                      aria-hidden="true"
                      className="
                        absolute -inset-x-1 bottom-1 h-2 rounded-full
                        bg-gradient-to-r from-asparragus/60 via-gold/60 to-raw/60
                        blur-[1px] z-0
                      "
                    />
                  </span>
                </span>
              }
              size="custom"
              color="black"                 // ← text-black
              align="center"
              titleClassName="
                font-gotu tracking-tight leading-[1.1]
                text-3xl sm:text-4xl md:text-5xl lg:text-5xl
              "
              // sin subtítulo para este hero
              className="items-center"
            />
          </div>
        </div>
      )}
    </Header>
  );
};

export default LandingHeader;
