// src/Components/shared/Header/Header.tsx
import React, { ReactNode } from "react";

interface HeaderProps {
  bgImage?: string;
  bgColor?: string;
  nav: React.ReactNode;
  children?: ReactNode;
  className?: string;
  align?: "top" | "bottom" | "center";
  /** Muestra “escalón” (overlay + hairline) al final del header para separar del siguiente bloque */
  withBottomStep?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  bgImage,
  bgColor = "transparent",
  nav,
  children,
  className = "",
  align = "top",
  withBottomStep = false,
}) => {
  const backgroundStyles = bgImage
    ? { backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { backgroundColor: bgColor };

  let contentPositionClass = "relative w-full z-20 flex flex-col items-center pt-20 pb-8";
  if (align === "center") contentPositionClass = "relative w-full z-20 flex flex-col items-center justify-center flex-1 py-20";
  if (align === "bottom") contentPositionClass = "relative w-full z-20 flex flex-col items-center justify-end flex-1 pb-0";

  return (
    <div className={`relative w-full flex flex-col min-h-screen ${className}`} style={backgroundStyles}>
      {/* Nav siempre arriba */}
      <div className="relative z-50">{nav}</div>

      {/* Contenido del hero */}
      {children && <div className={contentPositionClass}>{children}</div>}

      {/* Escalón inferior opcional (overlay + hairline) */}
      {withBottomStep && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 md:h-7 bg-gradient-to-t from-black/15 to-transparent"
          />
          <div
            aria-hidden
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent"
          />
        </>
      )}
    </div>
  );
};

export default Header;

