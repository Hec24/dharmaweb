import React from "react";

type Size = "sm" | "md" | "lg" | "xl" | "custom";

interface SectionHeaderProps {
  title: React.ReactNode;
  subtitle?: string | React.ReactNode;
  subtitleClassName?: string;
  titleClassName?: string;              // ya lo tenías
  align?: "center" | "left";
  size?: Size;                          // <-- ahora acepta "custom"
  color?: "asparragus" | "gold" | "raw" | "linen" | "white" | "black";
  className?: string;
  decoration?: React.ReactNode;
  children?: React.ReactNode;
}

const sizes: Record<Exclude<Size, "custom">, string> = {
  sm: "text-2xl sm:text-3xl md:text-4xl mb-4",
  md: "text-3xl sm:text-4xl md:text-5xl mb-6",
  lg: "text-4xl sm:text-5xl md:text-6xl mb-8",
  xl: "text-5xl sm:text-6xl lg:text-7xl mb-10",
};

// helper para no aplicar nada cuando size="custom"
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
}) => (
  <header
    className={[
      align === "center" ? "text-center items-center" : "text-left items-start",
      "flex flex-col justify-center w-full",
      className,
    ].join(" ")}
  >
    <h2
      className={[
        sizeClasses(size),            // <-- aplica vacío si size="custom"
        colors[color],
        "font-gotu leading-tight",
        decoration ? "relative" : "",
        titleClassName || "",         // <-- tú controlas el tamaño aquí
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
