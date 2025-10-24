// src/Components/shared/PreFooterPicture.tsx
import React from "react";

/**
 * PreFooterPicture (ajuste extra para MacBook Air + 1366+)
 * - Sube un par de “puntos” más en 1280–1400 px (xl) y añade un escalón específico en 1366 px.
 * - Mantiene los ajustes previos para 1920+ y 2560+.
 * - No cambia nada por debajo de lg (≤1024).
 */

type PreFooterPictureProps = {
  src: string;
  alt: string; // si es decorativa, usa alt=""
  creditSrOnly?: string;
  height?: "sm" | "md" | "lg";
  overlay?: "none" | "scrim";
  fullBleed?: boolean;
  topHairline?: boolean;
  bottomHairline?: boolean;
  as?: "section" | "div";
  className?: string;
  /** Foco de la imagen (CSS object-position). */
  objectPosition?: "center" | "top" | "bottom" | "left" | "right" | string;
};

const HEIGHT_MAP: Record<NonNullable<PreFooterPictureProps["height"]>, string> = {
  // Subimos ligeramente xl y añadimos un escalón dedicado a 1366 px
  sm: [
    "h-32",
    "sm:h-36",
    "md:h-40",
    "lg:h-48",
    "xl:h-64",                 // ↑ antes h-56 → más “aire” en MacBook Air
    "min-[1366px]:h-68",       // 272px (Tailwind arbitrary OK)
    "2xl:h-72",
    "min-[1920px]:h-80",
    "min-[2560px]:h-96",
  ].join(" "),
  md: [
    "h-40",
    "sm:h-48",
    "md:h-56",
    "lg:h-64",
    "xl:h-80",                 // ↑ antes h-72 → +1 paso en 1280px
    "min-[1366px]:h-[22rem]",  // ~352px → “par de puntos” extra en Air/1366
    "2xl:h-96",
    "min-[1920px]:h-[28rem]",
    "min-[2560px]:h-[32rem]",
  ].join(" "),
  lg: [
    "h-48",
    "sm:h-56",
    "md:h-64",
    "lg:h-72",
    "xl:h-84",                 // ↑ antes h-80
    "min-[1366px]:h-[22rem]",  // ~416px
    "2xl:h-[28rem]",
    "min-[1920px]:h-[32rem]",
    "min-[2560px]:h-[36rem]",
  ].join(" "),
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const PreFooterPicture: React.FC<PreFooterPictureProps> = ({
  src,
  alt,
  creditSrOnly,
  height = "md",
  overlay = "none",
  fullBleed = false,
  topHairline = false,
  bottomHairline = false,
  as = "section",
  className,
  objectPosition = "center",
}) => {
  const Tag = as;

  return (
    <Tag
      className={cx(
        "m-0 p-0",
        topHairline && "border-t border-black/5 dark:border-white/10",
        bottomHairline && "border-b border-black/5 dark:border-white/10",
        className
      )}
      aria-label={alt || "Imagen de transición antes del pie de página"}
    >
      <div
        className={cx(
          fullBleed
            ? "w-full overflow-hidden"
            : "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 overflow-hidden"
        )}
      >
        <figure className="m-0">
          <div className={cx("relative w-full", HEIGHT_MAP[height])}>
            <img
              src={src}
              alt={alt}
              className={cx(
                "block w-full h-full max-w-full object-cover select-none",
                objectPosition === "center" && "object-center",
                objectPosition === "top" && "object-top",
                objectPosition === "bottom" && "object-bottom",
                objectPosition === "left" && "object-left",
                objectPosition === "right" && "object-right"
              )}
              style={
                ["center", "top", "bottom", "left", "right"].includes(objectPosition)
                  ? undefined
                  : { objectPosition }
              }
              draggable={false}
              loading="eager"
              decoding="async"
            />
            {overlay === "scrim" && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/10 to-transparent"
              />
            )}
          </div>
          {creditSrOnly && <figcaption className="sr-only">{creditSrOnly}</figcaption>}
        </figure>
      </div>
    </Tag>
  );
};

export default PreFooterPicture;

/* =========================
   EJEMPLO DE USO
   -------------------------
   <PreFooterPicture
     src="/images/transitions/bosque.jpg"
     alt="Bosque al atardecer"
     fullBleed
     topHairline
     height="md"  // ahora respira más en MacBook Air (xl/1366) y en 1920+
   />
   ========================= */
