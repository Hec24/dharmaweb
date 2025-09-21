import React from "react";


type Variant = "primary" | "secondary" | "ghost" | "filter" | "danger";
type Size = "sm" | "md" | "lg" | "custom"; 

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  iconLeft?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  active?: boolean; // solo para filtros
  className?: string;
  href?: string; // opcional, si se usa como enlace
}

const baseClasses =
  "inline-flex items-center justify-center font-gotu rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold";
const variants: Record<Variant, string> = {
  primary:
    "bg-mossgreen hover:bg-gold border border-gold text-white",
  secondary:
    "bg-linen text-asparragus font-semibold border-2 border-gold hover:bg-pale shadow-md hover:shadow-lg",
  ghost:
    "bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-white shadow-none hover:shadow-md",
  filter:
    "bg-white text-asparragus border border-gold hover:bg-gold shadow-none", // activo lo añades por prop
  danger:
    "bg-raw text-white border border-gold hover:bg-pale hover:text-raw shadow-lg hover:shadow-xl",
};
const sizes: Record<Size, string> = {
  sm: "px-5 py-2 text-sm",
  md: "px-8 py-3 text-lg",
  lg: "px-10 py-5 text-2xl",
  custom: "",
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconLeft,
  loading = false,
  fullWidth = false,
  active = false,
  className = "",
  disabled,
  ...rest
}) => {
  // Clases especiales para el botón de filtro "activo"
  const filterActive =
    variant === "filter" && active
      ? "bg-mossgreen text-white shadow-md border-mossgreen"
      : "";

  return (
    <button
      className={[
        baseClasses,
        variants[variant],
        sizes[size],
        fullWidth ? "w-full" : "",
        loading || disabled ? "opacity-60 pointer-events-none" : "hover:-translate-y-1",
        filterActive,
        className,
      ].join(" ")}
      disabled={loading || disabled}
      {...rest}
    >
      {iconLeft && <span className="mr-2 flex">{iconLeft}</span>}
      {loading ? (
        <span className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-5 w-5 text-gold"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Cargando...
        </span>
      ) : (
        <>
          {children}
          {icon && <span className="ml-3 flex">{icon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
