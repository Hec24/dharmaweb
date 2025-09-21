// src/Components/ui/AeraHero.tsx
import React from "react";

type AreaHeroProps = {
  heroImg: string;
  titulo: string;
  descripcion?: string;
  bullets?: string[];
  /** Ajuste fino vertical base (se aplican extras en XL si activas boostXL) */
  translateY?: string;           // ej: "translate-y-6 md:translate-y-14"
  /** Altura mínima del hero (también se amplía en XL si activas boostXL) */
  minH?: string;                 // ej: "min-h-[56vh] md:min-h-[70vh]"
  /** Padding top para despegar del nav flotante */
  padTop?: string;               // ej: "pt-24 md:pt-40"
  /** Opacidad del overlay final hacia blanco (0–100 tailwind “/xx”) */
  overlayToWhite?: number;       // ej: 60
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
  translateY = "translate-y-6 md:translate-y-14",
  minH = "min-h-[56vh] md:min-h-[70vh]",
  padTop = "pt-24 md:pt-40",
  overlayToWhite = 60,
  density = "compact",
  boostXL = true,
}) => {
  // Presets mobile-first
  const boxPadBase = density === "compact" ? "p-5 sm:p-6 md:p-8" : "p-6 sm:p-7 md:p-10";
  const titleBase  = density === "compact" ? "text-2xl sm:text-3xl md:text-4xl" : "text-3xl md:text-4xl";
  const descBase   = density === "compact" ? "text-base sm:text-[17px] md:text-lg" : "text-[17px] md:text-lg";
  const boxWBase   = density === "compact" ? "max-w-3xl md:max-w-5xl" : "max-w-4xl md:max-w-5xl";

  // Boost específico para 1920+ y 2560+
  const xlPad    = boostXL ? "2xl:p-12 min-[2560px]:p-16" : "";
  const xlTitle  = boostXL ? "2xl:text-5xl min-[2560px]:text-6xl" : "";
  const xlDesc   = boostXL ? "2xl:text-xl min-[2560px]:text-2xl" : "";
  const xlWidth  = boostXL ? "2xl:max-w-6xl min-[2560px]:max-w-7xl" : "";
  const xlShift  = boostXL ? "2xl:translate-y-16 min-[2560px]:translate-y-20" : "";
  const xlMinH   = boostXL ? "2xl:min-h-[72vh] min-[2560px]:min-h-[68vh]" : ""; // un poco más alto en pantallas grandes

  return (
    <section
      className={`relative isolate ${minH} ${xlMinH} flex items-center ${padTop}`}
      aria-labelledby="area-hero-heading"
    >
      {/* Fondo imagen */}
      <div
        className="absolute inset-0 -z-10 bg-center bg-cover"
        style={{ backgroundImage: `url(${heroImg})` }}
        aria-hidden
      />
      {/* Overlay degradado suave */}
      <div
        className={`absolute inset-0 -z-10 bg-gradient-to-b from-black/5 via-black/5 to-white/${overlayToWhite}`}
        aria-hidden
      />

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
            <div className="mt-5 flex flex-wrap gap-2.5">
              {bullets.map((b, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-full bg-[var(--color-linen)] text-asparragus px-3 py-1 text-sm sm:text-[15px] shadow-sm"
                >
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AreaHero;
