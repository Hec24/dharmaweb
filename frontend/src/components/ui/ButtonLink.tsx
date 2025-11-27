import React from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "secondary" | "ghost" | "filter" | "danger" | "footer" | "leadmagnet";
type Size = "sm" | "md" | "lg" | "custom";

type CommonProps = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  iconLeft?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  active?: boolean; // para filtros
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
};

// ——— Variantes mutuamente excluyentes ———

// Link externo/interno por href (usa <a> o <Link> según external)
type HrefLinkProps = CommonProps & {
  href: string;
  external?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  to?: never;
  as?: "a" | undefined;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">;

// Link interno por `to` (React Router)
type ToLinkProps = CommonProps & {
  to: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  href?: never;
  external?: never;
  as?: "link" | undefined;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">;

// Botón de acción (no navega)
type ActionButtonProps = CommonProps & {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  href?: never;
  to?: never;
  external?: never;
  as?: "button" | undefined;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "type">;

export type ButtonLinkProps = HrefLinkProps | ToLinkProps | ActionButtonProps;

const baseClasses =
  "inline-flex items-center justify-center font-gotu rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold";

const variants: Record<Variant, string> = {
  primary:   "bg-mossgreen hover:bg-gold border border-gold text-white",
  secondary: "bg-linen text-asparragus font-semibold border-2 border-gold hover:bg-pale shadow-md hover:shadow-lg",
  ghost:     "bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-white shadow-none hover:shadow-md",
  filter:    "bg-white text-asparragus border border-gold hover:bg-gold shadow-none",
  danger:    "bg-raw text-white border border-gold hover:bg-pale hover:text-raw shadow-lg hover:shadow-xl",
  footer:    "w-full py-3 px-4 rounded-lg font-gotu text-white transition-colors duration-200 bg-mossgreen hover:bg-[#8AB84B] shadow-md hover:shadow-lg",
  leadmagnet:"w-full py-3 px-4 rounded-lg font-gotu text-white transition-colors duration-200 bg-mossgreen hover:bg-[#8AB84B] focus:ring-2 focus:ring-gold hover:shadow-md",
};

const sizes: Record<Size, string> = {
  sm: "px-5 py-2 text-sm",
  md: "px-8 py-3 text-lg",
  lg: "px-10 py-5 text-2xl",
  custom: ""
};

export default function ButtonLink(props: ButtonLinkProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    icon,
    iconLeft,
    loading = false,
    fullWidth = false,
    className = "",
    disabled,
    ...rest
  } = props as ButtonLinkProps;

  function isFilterVariant(p: ButtonLinkProps): p is ButtonLinkProps & { active?: boolean } {
    return p.variant === "filter";
  }

  const filterActive =
    isFilterVariant(props) && props.active
      ? "bg-mossgreen text-white shadow-md border-mossgreen"
      : "";

  const classNames = [
    baseClasses,
    variants[variant],
    sizes[size],
    fullWidth ? "w-full" : "",
    loading || disabled ? "opacity-60 pointer-events-none" : "hover:-translate-y-1",
    filterActive,
    className,
  ].join(" ");

  const content = (
    <>
      {iconLeft && <span className="mr-2 flex">{iconLeft}</span>}
      {loading ? (
        <span className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-5 w-5 text-gold"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Cargando...
        </span>
      ) : (
        <>
          {children}
          {icon && <span className="ml-3 flex">{icon}</span>}
        </>
      )}
    </>
  );

  // ——— Acción (botón) ———
  if ("onClick" in props && !("href" in props) && !("to" in props)) {
    const { onClick, type = "button", ...btnRest } = rest as ActionButtonProps;
    return (
      <button
        type={type}
        className={classNames}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        onClick={onClick}
        {...btnRest}
      >
        {content}
      </button>
    );
  }

  // ——— Link por href ———
  if ("href" in props && props.href) {
    const { href, external, onClick, ...linkRest } = rest as HrefLinkProps;
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classNames}
          aria-disabled={loading || disabled}
          tabIndex={loading || disabled ? -1 : 0}
          onClick={onClick}
          {...linkRest}
        >
          {content}
        </a>
      );
    }
    // interno por <Link> usando href como ruta
    return (
      <Link
        to={href}
        className={classNames}
        aria-disabled={loading || disabled}
        tabIndex={loading || disabled ? -1 : 0}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        {...(linkRest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </Link>
    );
  }

  // ——— Link por to (React Router) ———
  if ("to" in props && props.to) {
    const { to, onClick, ...linkRest } = rest as ToLinkProps;
    return (
      <Link
        to={to}
        className={classNames}
        aria-disabled={loading || disabled}
        tabIndex={loading || disabled ? -1 : 0}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        {...(linkRest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </Link>
    );
  }

  // Fallback seguro: botón deshabilitado si no se especificó nada
  return (
    <button
      type="button"
      className={className}
      disabled
      aria-disabled
      style={{ opacity: 0.6, cursor: "not-allowed" }}
    >
      {children}
    </button>
  );
}
