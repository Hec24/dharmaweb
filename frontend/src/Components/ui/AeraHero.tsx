// src/Components/ui/AreaHero.tsx
import React from "react";
import { Link } from "react-router-dom";

type AreaHeroProps = {
  /** Se usa como PATRÓN repetido (no como cover). Llega desde areas.config.ts */
  heroImg: string;
  titulo: string;
  descripcion?: string;
  bullets?: string[];
  /** CTA principal (texto + ruta). Si no se pasa, no se muestra */
  ctaLabel?: string;
  ctaTo?: string;
  /** CTA secundaria como enlace de texto */
  secondaryLabel?: string;
  secondaryTo?: string;
  /** Ajuste fino vertical del bloque de contenido */
  translateY?: string;           // ej: "translate-y-3 md:translate-y-8"
  /** Altura mínima del hero */
  minH?: string;                 // ej: "min-h-[48vh] md:min-h-[60vh]"
  /** Padding top para despegar del nav flotante */
  padTop?: string;               // ej: "pt-16 md:pt-28"
  /** Espacio inferior para no “pegarse” a la siguiente sección */
  gapBelow?: string;             // ej: "pb-10 md:pb-14"
  /** Opacidad del degradado final hacia blanco (0–100 tailwind “/xx”) */
  overlayToWhite?: number;       // ej: 80
  /** Densidad en mobile (compact = más pequeño en móviles) */
  density?: "compact" | "comfortable";
  /** ↑ Hace el bloque más grande en pantallas muy anchas */
  boostXL?: boolean;
  /** Tamaño del patrón repetido (px). Manténlo pequeño para un look pro. */
  patternSizePx?: number;        // ej: 220
  /** Intensidad del patrón (0–100 como % de opacidad visual aproximada) */
  patternOpacity?: number;       // ej: 35
  /** Texto destacado (“Qué encontrarás: …”). Opcional */
  encontraras?: string;
};

const AreaHero: React.FC<AreaHeroProps> = ({
  heroImg,
  titulo,
  descripcion,
  encontraras,
  bullets = [],
  ctaLabel,
  ctaTo,
  secondaryLabel,
  secondaryTo,
  // Defaults optimizados para 100% (16px base) y mobile-first compacto
  translateY = "translate-y-3 md:translate-y-8",
  minH = "min-h-[48vh] md:min-h-[60vh]",
  padTop = "pt-16 md:pt-28",
  gapBelow = "pb-10 md:pb-14",
  overlayToWhite = 80,
  density = "compact",
  boostXL = true,
  patternSizePx = 220,   // patrón pequeño como en SchoolValues
  patternOpacity = 35,   // ~0.35
}) => {
  // Escalas tipográficas y paddings (un paso menos que Tailwind por defecto)
  const boxPadBase =
    density === "compact" ? "p-5 sm:p-6 md:p-7" : "p-6 sm:p-7 md:p-9";
  const titleBase =
    density === "compact" ? "text-2xl sm:text-[1.75rem] md:text-4xl" : "text-3xl md:text-4xl";
  const descBase =
    density === "compact" ? "text-[15px] sm:text-base md:text-[17px]" : "text-base md:text-[17px]";
  const boxWBase =
    density === "compact" ? "max-w-3xl md:max-w-4xl" : "max-w-4xl md:max-w-5xl";

  // Boost para pantallas grandes
  const xlPad   = boostXL ? "2xl:p-12 min-[2560px]:p-16" : "";
  const xlTitle = boostXL ? "2xl:text-5xl min-[2560px]:text-6xl" : "";
  const xlDesc  = boostXL ? "2xl:text-xl min-[2560px]:text-2xl" : "";
  const xlWidth = boostXL ? "2xl:max-w-6xl min-[2560px]:max-w-7xl" : "";
  const xlShift = boostXL ? "2xl:translate-y-10 min-[2560px]:translate-y-14" : "";
  const xlMinH  = boostXL ? "2xl:min-h-[64vh] min-[2560px]:min-h-[60vh]" : "";

  // Opacidades calculadas (Tailwind no acepta variables dinámicas en clases /xx)
  const patternOpacityCss = Math.max(0, Math.min(100, patternOpacity)) / 100;
  const gradientToWhite = Math.max(0, Math.min(100, overlayToWhite));

  return (
    <section
      className={`relative isolate ${minH} ${xlMinH} flex items-center ${padTop} ${gapBelow} bg-white`}
      aria-labelledby="area-hero-heading"
      role="region"
    >
      {/* === CAPAS DE FONDO (emulan SchoolValues) === */}

      {/* 1) Fondo base claro */}
      <div className="absolute inset-0 -z-30 bg-white" aria-hidden="true" />

      {/* 2) Patrón visible con mezcla cálida (usa heroImg como patrón, NO cover) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={{
          backgroundImage: `url('${heroImg}')`,
          backgroundRepeat: "repeat",
          backgroundSize: `${patternSizePx}px`,
          backgroundPosition: "center",
          mixBlendMode: "multiply",
          // Saturación y brillo moderados; opacidad controlada
          filter: "saturate(0.85) brightness(1.05)",
          opacity: patternOpacityCss,
        }}
      />

      {/* 3) Tinte suave (cohesiona con paleta; sin añadir color fuerte) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          // Sutil velo cálido (puedes ajustar a var(--color-linen) si lo prefieres)
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.35) 100%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* 4) Degradado a blanco para legibilidad y transición editorial */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-[5]"
        style={{
          background: `linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,${gradientToWhite /
            100}) 85%, rgba(255,255,255,1) 100%)`,
        }}
      />

      {/* Hairline inferior para transición limpia entre secciones */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/10"
        aria-hidden="true"
      />

      {/* === CONTENIDO === */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div
          className={`mx-auto ${boxWBase} ${xlWidth} rounded-3xl bg-white/95 backdrop-blur-[1px] shadow-xl ring-1 ring-black/5 ${boxPadBase} ${xlPad} transform ${translateY} ${xlShift}`}
        >
          <h1
            id="area-hero-heading"
            className={`${titleBase} ${xlTitle} font-gotu font-semibold text-asparragus leading-tight`}
          >
            {titulo}
          </h1>

          {descripcion && (
            <p
              className={`mt-3 ${descBase} ${xlDesc} font-degular text-asparragus/90 leading-relaxed`}
            >
              {descripcion}
            </p>
          )}

          {encontraras && (
            <p
              className={`mt-2 ${descBase} ${xlDesc} font-degular text-asparragus/90 leading-relaxed font-semibold`}
            >
              {encontraras}
            </p>
          )}

          {!!bullets.length && (
            <div className="mt-4 flex flex-wrap gap-2.5" role="list" aria-label="Puntos clave">
              {bullets.map((b, i) => (
                <span
                  key={i}
                  role="listitem"
                  className="inline-flex items-center rounded-full bg-[var(--color-linen)] text-asparragus px-3 py-1 text-sm sm:text-[15px] shadow-sm"
                >
                  {b}
                </span>
              ))}
            </div>
          )}

          {(ctaLabel && ctaTo) || (secondaryLabel && secondaryTo) ? (
            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
              {ctaLabel && ctaTo && (
                <Link
                  to={ctaTo}
                  className="inline-flex justify-center rounded-xl bg-[var(--color-gold)] px-4 py-2 text-sm sm:text-base font-degular text-raw shadow transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  aria-label={ctaLabel}
                >
                  {ctaLabel}
                </Link>
              )}
              {secondaryLabel && secondaryTo && (
                <Link
                  to={secondaryTo}
                  className="inline-flex justify-center rounded-xl px-3 py-2 text-sm sm:text-base font-degular text-asparragus underline decoration-[var(--color-asparragus)]/30 underline-offset-4 hover:decoration-[var(--color-asparragus)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-asparragus focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  aria-label={secondaryLabel}
                >
                  {secondaryLabel}
                </Link>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default AreaHero;
