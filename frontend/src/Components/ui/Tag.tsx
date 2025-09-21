import React from "react";

type TagVariant =
  | "default"
  | "gold"
  | "mossgreen"
  | "highlight"
  | "author"
  | "filter"
  | "danger"
  | "info"
  | "success";
type TagSize = "sm" | "md" | "lg" | "xl";

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: TagVariant;
  size?: TagSize;
  active?: boolean; // solo filter
  asButton?: boolean; // si es clickeable
  onClick?: () => void;
  className?: string;
}

const tagBase = "inline-flex items-center font-degular rounded-full whitespace-nowrap shadow transition-all";
const variants = {
  default: "bg-linen text-asparragus border border-gold/20",
  gold: "bg-gold text-asparragus font-semibold shadow",
  mossgreen: "bg-mossgreen text-white font-semibold",
  highlight: "bg-mossgreen text-white font-gotu shadow-md",
  author: "bg-white/90 text-asparragus border border-mossgreen/30 shadow-sm backdrop-blur-sm",
  filter: "bg-white text-asparragus border border-gold/20 cursor-pointer hover:bg-gold/10 transition",
  filterActive: "bg-mossgreen text-white border-mossgreen shadow-md",
  danger: "bg-raw text-white border border-gold/30",
  info: "bg-pale text-mossgreen border border-gold/20",
  success: "bg-gold text-white border border-mossgreen/30",
};
const sizes = {
  sm: "text-xs px-3 py-1",
  md: "text-sm px-4 py-1.5",
  lg: "text-base px-5 py-2",
  xl: "text-lg px-6 py-3",
};

const Tag: React.FC<TagProps> = ({
  children,
  variant = "default",
  size = "sm",
  active = false,
  asButton = false,
  onClick,
  className = "",
  ...rest
}) => {
  const classes =
    [
      tagBase,
      sizes[size],
      variant === "filter" && active
        ? variants.filterActive
        : variants[variant],
      asButton ? "cursor-pointer select-none" : "",
      className,
    ].join(" ");

  if (asButton) {
    return (
      <button type="button" className={classes} onClick={onClick} {...rest}>
        {children}
      </button>
    );
  }
  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
};

export default Tag;
