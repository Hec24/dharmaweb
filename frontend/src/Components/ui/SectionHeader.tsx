// src/Components/ui/SectionHeader.tsx
import React from "react";

type Size = "sm" | "md" | "lg" | "xl" | "custom";

interface SectionHeaderProps {
  title: React.ReactNode;
  subtitle?: string | React.ReactNode;
  subtitleClassName?: string;
  titleClassName?: string;
  align?: "center" | "left";
  size?: Size;
  color?: "asparragus" | "gold" | "raw" | "linen" | "white" | "black";
  className?: string;
  decoration?: React.ReactNode;
  children?: React.ReactNode;
  id?: string;          // NUEVO: para aria-labelledby / anclas
  eyebrow?: string;     // NUEVO: línea pequeña encima del título
}

const sizes: Record<Exclude<Size, "custom">, string> = {
  sm: "text-2xl sm:text-3xl md:text-4xl mb-4",
  md: "text-3xl sm:text-4xl md:text-5xl mb-6",
  lg: "text-4xl sm:text-5xl md:text-6xl mb-8",
  xl: "text-5xl sm:text-6xl lg:text-7xl mb-10",
};

function sizeClasses(size?: Size) {
  if (!size || size === "md") return sizes.md;
  if (size === "custom") return "";
  return sizes[size];
}

const colors = {
  asparragus: "text-asparragus",
  gold: "text-gold",
  raw: "text-raw",
  linen: "text-linen",
  white: "text-white",
  black: "text-black",
};

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  subtitleClassName,
  titleClassName,
  align = "center",
  size = "md",
  color = "asparragus",
  className = "",
  decoration,
  children,
  id,
  eyebrow,
}) => (
  <header
    className={[
      align === "center" ? "text-center items-center" : "text-left items-start",
      "flex flex-col justify-center w-full",
      className,
    ].join(" ")}
  >
    {eyebrow && (
      <p
        className={[
          "font-degular text-[11px] sm:text-xs uppercase tracking-[0.20em] mb-2",
          "text-asparragus/80",
          align === "center" ? "text-center" : "text-left",
        ].join(" ")}
      >
        {eyebrow}
      </p>
    )}

    <h2
      id={id}
      className={[
        sizeClasses(size),
        colors[color],
        "font-gotu leading-tight",
        decoration ? "relative" : "",
        titleClassName || "",
      ].join(" ")}
    >
      {title}
      {decoration && <span className="block mt-3">{decoration}</span>}
    </h2>

    {subtitle && (
      <p
        className={[
          subtitleClassName
            ? subtitleClassName
            : "text-asparragus/80 font-degular max-w-2xl text-lg mb-2",
          align === "left" ? "text-left" : "text-center",
        ].join(" ")}
      >
        {subtitle}
      </p>
    )}
    {children}
  </header>
);

export default SectionHeader;
