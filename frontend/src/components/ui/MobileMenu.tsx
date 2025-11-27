// src/Components/ui/MobileMenu.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

  // Bloquea scroll del body cuando el menú está abierto
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

  // Cerrar con ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setIsOpen]);

  if (!open) return null;

  return (
    <div
      className="lg:hidden fixed inset-0 z-[100] bg-linen/90 supports-[backdrop-filter]:backdrop-blur-sm flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-menu-heading"
    >
      {/* HEADER: logo (link a home) + botón cerrar (X) */}
      <div className="flex items-center justify-between px-4 sm:px-6 pt-4 pb-3">
        <div className="min-w-0 flex-1 flex justify-center">
          {logoSrc ? (
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              aria-label="Ir al inicio"
              className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-raw rounded-md"
            >
              <img src={logoSrc} alt="Dharma en Ruta" className="h-12 w-auto" />
            </Link>
          ) : (
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="font-gotu text-asparragus text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-raw rounded-md"
              aria-label="Ir al inicio"
            >
              Dharma en Ruta
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="ml-4 shrink-0 text-raw text-2xl leading-none px-2 py-1 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-raw"
          aria-label="Cerrar menú móvil"
        >
          &times;
        </button>
      </div>

      <div className="container mx-auto px-4 sm:px-6 pb-6 space-y-4 flex-1 overflow-y-auto">
        <h2 id="mobile-menu-heading" className="sr-only">
          Menú principal móvil
        </h2>

        {/* Dropdown Áreas */}
        <div className="border-b border-asparragus pb-4">
          <button
            type="button"
            onClick={() => setMobileDropdownOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={mobileDropdownOpen}
            className="flex items-center justify-between w-full font-degular text-raw text-xl"
          >
            Áreas de Conocimiento
            <svg
              className="w-6 h-6 ml-2 transition-transform"
              style={{ transform: mobileDropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {mobileDropdownOpen && (
            <div className="mt-2 pl-4" role="list" aria-label="Lista de áreas de conocimiento">
              {areas.map((area, index) => (
                <Link
                  key={index}
                  to={area.href}
                  role="listitem"
                  className="block py-2 text-raw font-degular hover:text-asparragus text-base rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-raw"
                  onClick={() => {
                    setIsOpen(false);
                    setMobileDropdownOpen(false);
                  }}
                >
                  {area.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Dropdown Acerca de */}
        <div className="border-b border-asparragus pb-4">
          <button
            type="button"
            onClick={() => setAboutDropdownOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={aboutDropdownOpen}
            className="flex items-center justify-between w-full font-degular text-raw text-xl"
          >
            Acerca de
            <svg
              className="w-6 h-6 ml-2 transition-transform"
              style={{ transform: aboutDropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {aboutDropdownOpen && (
            <div className="mt-2 pl-4" role="list" aria-label="Enlaces sobre nosotros">
              {acercaLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  role="listitem"
                  className="block py-2 text-raw font-degular hover:text-asparragus text-base rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-raw"
                  onClick={() => {
                    setIsOpen(false);
                    setAboutDropdownOpen(false);
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Links móviles (resto) */}
        <nav className="space-y-4" aria-label="Navegación principal móvil">
          {[...leftLinks, ...rightLinks].map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className="block font-degular text-raw text-xl py-2 border-b border-asparragus rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-raw"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Imagen decorativa inferior -> link a home y cierra */}
        <div className="mt-8 pt-8">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            aria-label="Volver al inicio"
            className="block rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-raw"
          >
            <img
              src="/img/Logos/Logos-13.png"
              alt=""
              aria-hidden="true"
              className="mx-auto h-40 sm:h-48 object-contain"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;

