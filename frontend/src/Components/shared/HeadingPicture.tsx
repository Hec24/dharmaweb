// src/Components/shared/HeadingPicture.tsx
import React from "react";

/**
 * HeadingPicture (versión final con opción full-bleed)
 * - Por defecto: misma anchura que las secciones (max-w-7xl).
 * - Si fullBleed={true}: ocupa TODO el ancho de la pantalla sin huecos laterales.
 * - Sin scroll horizontal ni huecos entre secciones.
 */

type HeadingPictureProps = {
  src: string;
  alt: string;
  creditSrOnly?: string;
  height?: "sm" | "md" | "lg";
  overlay?: "none" | "scrim";
  as?: "section" | "div";
  className?: string;
  /** true → ancho total pantalla (sin paddings) */
  fullBleed?: boolean;
};

const HEIGHT_MAP: Record<NonNullable<HeadingPictureProps["height"]>, string> = {
  sm: "h-36 sm:h-40 md:h-44 lg:h-52",
  md: "h-44 sm:h-48 md:h-56 lg:h-64",
  lg: "h-56 sm:h-64 md:h-72 lg:h-80",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const HeadingPicture: React.FC<HeadingPictureProps> = ({
  src,
  alt,
  creditSrOnly,
  height = "md",
  overlay = "none",
  as = "section",
  className,
  fullBleed = false,
}) => {
  const Tag = as;

  return (
    <Tag className={cx("m-0 p-0", className)} aria-label={alt || "Imagen de transición"}>
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
              className="block w-full h-full max-w-full object-cover select-none"
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

export default HeadingPicture;

/* =========================
   💡 EJEMPLOS DE USO
   -------------------------
   // 1️⃣ Alineado al contenido (como el resto de secciones)
   <HeadingPicture
     src="/images/hero/templo.jpg"
     alt="Templo al amanecer"
     height="md"
   />

   // 2️⃣ Full width (sin márgenes laterales)
   <HeadingPicture
     src="/images/hero/templo.jpg"
     alt="Templo al amanecer"
     fullBleed
     height="md"
   />
   ========================= */
