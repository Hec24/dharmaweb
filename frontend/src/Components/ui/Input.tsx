import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  className?: string;
  variant?: "footer" | "leadmagnet";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      label,
      error,
      iconLeft,
      iconRight,
      className = "",
      variant = "leadmagnet",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    // Estilos según el "variant" igual que en NewsletterForm
    const baseInput =
      "w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 font-degular transition";
    const variantInput =
      variant === "footer"
        ? "border-gold/50 bg-asparragus/70 text-linen placeholder-linen/60 focus:ring-gold"
        : "border-asparragus/30 bg-white/80 text-asparragus placeholder-asparragus/40 focus:ring-gold";

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-1 text-lg font-gotu text-asparragus"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {iconLeft && <span className="absolute left-3">{iconLeft}</span>}
          <input
            type={type}
            id={inputId}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={[
              baseInput,
              variantInput,
              iconLeft ? "pl-10" : "",
              iconRight ? "pr-10" : "",
            ].join(" ")}
            {...props}
          />
          {iconRight && <span className="absolute right-3">{iconRight}</span>}
        </div>
        {error && (
          <span
            id={`${inputId}-error`}
            className="text-lg font-gotu text-red-600 mt-1 block"
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
