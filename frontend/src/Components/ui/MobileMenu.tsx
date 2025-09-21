import React, { useEffect, useState } from "react";

interface NavLink {
  label: string;
  href: string;
}

export interface MobileMenuProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  areas: NavLink[];
  acercaLinks: NavLink[];
  leftLinks: NavLink[];
  rightLinks: NavLink[];
  logoSrc?: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  open,
  setIsOpen,
  areas,
  acercaLinks,
  leftLinks,
  rightLinks,
  logoSrc,
}) => {
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);

  // Evita el scroll del body cuando está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setMobileDropdownOpen(false);
      setAboutDropdownOpen(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50 bg-linen/90 backdrop-blur-sm flex flex-col">
      {/* Botón cerrar */}
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-5 right-5 text-raw text-2xl z-60"
        aria-label="Cerrar menú móvil"
        tabIndex={0}
      >
        &times;
      </button>

      {/* Logo arriba */}
      {logoSrc && (
        <div className="w-full flex justify-center mt-8 mb-4">
          <img src={logoSrc} alt="Logo" className="h-14 w-auto" />
        </div>
      )}

      <div className="container mx-auto px-[min(5vw,2rem)] py-6 space-y-4 flex-1">
        {/* Dropdown Áreas */}
        <div className="border-b border-asparragus pb-4">
          <button
            onClick={() => setMobileDropdownOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={mobileDropdownOpen}
            className="flex items-center justify-between w-full font-degular text-raw text-[clamp(1.25rem,4vw,1.5rem)]"
          >
            Áreas de Conocimiento
            <svg
              className="w-[1.5em] h-[1.5em] ml-2 transition-transform"
              style={{
                transform: mobileDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {mobileDropdownOpen && (
            <div className="mt-2 pl-4">
              {areas.map((area, index) => (
                <a
                  key={index}
                  href={area.href}
                  className="block py-2 text-raw font-degular hover:text-asparragus text-[clamp(1rem,3vw,1.25rem)]"
                  onClick={() => {
                    setIsOpen(false);
                    setMobileDropdownOpen(false);
                  }}
                >
                  {area.label}
                </a>
              ))}
            </div>
          )}
        </div>
        {/* Dropdown Acerca de */}
        <div className="border-b border-asparragus pb-4">
          <button
            onClick={() => setAboutDropdownOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={aboutDropdownOpen}
            className="flex items-center justify-between w-full font-degular text-raw text-[clamp(1.25rem,4vw,1.5rem)]"
          >
            Acerca de
            <svg
              className="w-[1.5em] h-[1.5em] ml-2 transition-transform"
              style={{
                transform: aboutDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {aboutDropdownOpen && (
            <div className="mt-2 pl-4">
              {acercaLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="block py-2 text-raw font-degular hover:text-asparragus text-[clamp(1rem,3vw,1.25rem)]"
                  onClick={() => {
                    setIsOpen(false);
                    setAboutDropdownOpen(false);
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
        {/* Links móvil */}
        <div className="space-y-4">
          {[...leftLinks, ...rightLinks].map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="block font-degular text-raw text-[clamp(1.25rem,4vw,1.5rem)] py-2 border-b border-asparragus"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
        {/* Imagen decorativa inferior */}
        <div className="mt-8 pt-8">
          <div
            className="w-full h-[clamp(8rem,30vw,12rem)] bg-[url('/img/Logos/Logos-13.png')] bg-contain bg-no-repeat bg-center mx-auto"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
