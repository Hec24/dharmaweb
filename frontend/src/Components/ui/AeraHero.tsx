// src/Components/ui/AeraHero.tsx
import React from "react";
import { Link } from "react-router-dom";

type AreaHeroProps = {
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
  /** Ajuste fino vertical base (se aplican extras en XL si activas boostXL) */
  translateY?: string;           // ej: "translate-y-4 md:translate-y-10"
  /** Altura mínima del hero (también se amplía en XL si activas boostXL) */
  minH?: string;                 // ej: "min-h-[50vh] md:min-h-[64vh]"
  /** Padding top para despegar del nav flotante */
  padTop?: string;               // ej: "pt-20 md:pt-32"
  /** Espacio inferior para no “pegarse” a la siguiente sección */
  gapBelow?: string;             // ej: "pb-12 md:pb-16"
  /** Opacidad del overlay final hacia blanco (0–100 tailwind “/xx”) */
  overlayToWhite?: number;       // ej: 70
  /** Densidad en mobile (compact = más pequeño en móviles) */
  density?: "compact" | "comfortable";
  /** ↑ Hace el bloque (tipos/paddings/ancho) más grande en 1920×1080 y 2560×1440 */
  boostXL?: boolean;
};

const AreaHero: React.FC<AreaHeroProps> = ({
  heroImg,
  titulo,
  descripcion,
  bullets = [],
  ctaLabel,
  ctaTo,
  secondaryLabel,
  secondaryTo,
  // Defaults optimizados para 100% (16px base) y mobile-first más centrado
  translateY = "translate-y-4 md:translate-y-10",
  minH = "min-h-[50vh] md:min-h-[64vh]",
  padTop = "pt-20 md:pt-32",
  gapBelow = "pb-12 md:pb-16",
  overlayToWhite = 70,
  density = "compact",
  boostXL = true,
}) => {
  // Presets mobile-first (más compactos que los defaults de Tailwind)
  const boxPadBase =
    density === "compact" ? "p-5 sm:p-6 md:p-8" : "p-6 sm:p-7 md:p-10";
  const titleBase =
    density === "compact" ? "text-2xl sm:text-3xl md:text-4xl" : "text-3xl md:text-4xl";
  const descBase =
    density === "compact" ? "text-[15px] sm:text-base md:text-[17px]" : "text-base md:text-[17px]";
  const boxWBase =
    density === "compact" ? "max-w-3xl md:max-w-4xl" : "max-w-4xl md:max-w-5xl";

  // Boost específico para 1920+ y 2560+
  const xlPad   = boostXL ? "2xl:p-12 min-[2560px]:p-16" : "";
  const xlTitle = boostXL ? "2xl:text-5xl min-[2560px]:text-6xl" : "";
  const xlDesc  = boostXL ? "2xl:text-xl min-[2560px]:text-2xl" : "";
  const xlWidth = boostXL ? "2xl:max-w-6xl min-[2560px]:max-w-7xl" : "";
  const xlShift = boostXL ? "2xl:translate-y-12 min-[2560px]:translate-y-16" : "";
  const xlMinH  = boostXL ? "2xl:min-h-[68vh] min-[2560px]:min-h-[64vh]" : "";

  return (
    <section
      className={`relative isolate ${minH} ${xlMinH} flex items-center ${padTop} ${gapBelow} bg-white`}
      aria-labelledby="area-hero-heading"
      role="region"
    >
      {/* Fondo imagen */}
      <div
        className="absolute inset-0 -z-10 bg-center bg-cover"
        style={{ backgroundImage: `url(${heroImg})` }}
        aria-hidden="true"
      />
      {/* Overlay degradado suave hacia blanco (editorial) */}
      <div
        className={`absolute inset-0 -z-10 bg-gradient-to-b from-black/10 via-black/5 to-white/${overlayToWhite}`}
        aria-hidden="true"
      />

      {/* Hairline inferior para transición limpia entre secciones */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/10" aria-hidden="true" />

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div
          className={`mx-auto ${boxWBase} ${xlWidth} rounded-3xl bg-white/95 shadow-xl ring-1 ring-black/5 ${boxPadBase} ${xlPad} transform ${translateY} ${xlShift}`}
        >
          <h1
            id="area-hero-heading"
            className={`${titleBase} ${xlTitle} font-gotu font-semibold text-asparragus leading-tight`}
          >
            {titulo}
          </h1>

          {descripcion && (
            <p className={`mt-3 ${descBase} ${xlDesc} font-degular text-asparragus/90 leading-relaxed`}>
              {descripcion}
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
