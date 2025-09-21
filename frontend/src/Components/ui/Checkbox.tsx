import React, { forwardRef } from "react";

interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
  className?: string;
  variant?: "footer" | "leadmagnet";
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      className = "",
      variant = "leadmagnet",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    // Estilos coherentes con NewsletterForm
    const baseCheckbox =
      "h-4 w-4 rounded mt-1 focus:ring-gold transition-all";
    const variantCheckbox =
      variant === "footer"
        ? "text-gold border-gold/50 bg-asparragus"
        : "text-gold border-asparragus/40 bg-white";

    return (
      <div className={`flex items-start ${className}`}>
        <input
          type="checkbox"
          id={inputId}
          ref={ref}
          className={`${baseCheckbox} ${variantCheckbox}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {label && (
          <label
            htmlFor={inputId}
            className={`ml-3 ${
              variant === "footer"
                ? "text-xs font-degular text-linen/90"
                : "text-sm font-degular font-medium text-asparragus/90"
            }`}
          >
            {label}
          </label>
        )}
        {error && (
          <span
            id={`${inputId}-error`}
            className="text-xs text-red-600 mt-1 ml-2"
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
