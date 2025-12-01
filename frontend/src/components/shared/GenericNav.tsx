// src/Components/shared/GenericNav.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DropdownMenu from "../ui/DropdownMenu";
import MobileMenu from "../ui/MobileMenu";
import { acercaLinks as acercaLinksData } from "../../data/navLinks";
import { useAuth } from "../../contexts/AuthContext";

interface NavLink { label: string; href: string; highlighted?: boolean; }
type WidthPreset = "viewport" | "96rem" | "110rem" | "120rem";
type Tone = "dark" | "light";
type MobileMode = "default" | "hidden" | "logoOnly";

interface GenericNavProps {
  title: string;
  logoSrc: string;
  logoSrcDark?: string;
  logoSrcLight?: string;
  leftLinks?: NavLink[];
  rightLinks?: NavLink[];
  areas?: NavLink[];
  acercaLinks?: NavLink[];
  variant?: "transparent" | "solid";
  mode?: "full" | "logoOnly";
  tone?: Tone;
  containerWidth?: WidthPreset;
  barWidth?: WidthPreset;
  innerPx?: string;
  barHeight?: "h-16" | "h-20" | "h-24";
  /** Móvil: "default" = hamburguesa; "hidden" = no se muestra; "logoOnly" = solo logo sin hamburguesa */
  mobileMode?: MobileMode;
}

const presetToClass = (p?: WidthPreset) => {
  switch (p) {
    case "viewport": return "w-full";
    case "96rem": return "max-w-[96rem] w-full";
    case "120rem": return "max-w-[120rem] w-full";
    case "110rem":
    default: return "max-w-[110rem] w-full";
  }
};

const GenericNav: React.FC<GenericNavProps> = ({
  title,
  logoSrc,
  logoSrcDark,
  logoSrcLight,
  leftLinks,
  rightLinks,
  areas,
  acercaLinks = acercaLinksData,
  variant = "transparent",
  mode = "full",
  tone = "dark",
  containerWidth = "110rem",
  barWidth = "110rem",
  innerPx = "px-3 sm:px-5 lg:px-6",
  barHeight = "h-16",
  mobileMode = "default",
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const _left = leftLinks ?? [];
  const _right = rightLinks ?? [];
  const _areas = areas ?? [];
  const _acerca = acercaLinks ?? [];

  const hasMenus =
    mode !== "logoOnly" &&
    (_left.length > 0 || _right.length > 0 || _areas.length > 0 || _acerca.length > 0);

  const effectiveTone: Tone = variant === "solid" ? "dark" : tone;
  const navText = effectiveTone === "dark" ? "text-black" : "text-white";
  const hoverColor = "hover:text-raw";

  const mobileBg =
    effectiveTone === "dark"
      ? "bg-white/70 supports-[backdrop-filter]:bg-white/50 supports-[backdrop-filter]:backdrop-blur-md shadow-sm"
      : "bg-asparragus/85 supports-[backdrop-filter]:bg-asparragus/70 supports-[backdrop-filter]:backdrop-blur-md shadow-sm";

  const wrapperBg =
    variant === "transparent"
      ? (effectiveTone === "dark"
        ? "bg-white/40 ring-1 ring-black/5 supports-[backdrop-filter]:backdrop-blur-md shadow-sm"
        : "bg-asparragus/75 ring-1 ring-white/10 supports-[backdrop-filter]:backdrop-blur-md shadow-sm")
      : "bg-white shadow-sm";

  const resolvedLogo =
    effectiveTone === "light"
      ? (logoSrcLight ?? logoSrc)
      : (logoSrcDark ?? logoSrc);

  const mobileMenuId = "global-mobile-menu";

  return (
    <nav className="w-full isolate" aria-label="Navegación principal">
      {/* WRAPPER EXTERIOR */}
      <div
        className={`${presetToClass(containerWidth)} mx-auto ${innerPx} mt-2 md:mt-3 h-16 md:h-20 flex items-center relative z-[90]`}
      >
        {/* ===================== MÓVIL ===================== */}
        {/* IMPORTANTE: ocultamos la barra móvil cuando el overlay está abierto */}
        {mobileMode !== "hidden" && (
          <div
            className={`${mobileMenuOpen ? "hidden" : "flex"} lg:hidden z-[70] ${mobileMode === "logoOnly" ? "justify-center" : "justify-between"} items-center w-full rounded-xl px-3 py-2 ring-1 ring-black/5 ${mobileBg}`}
          >
            <Link
              to="/"
              className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-raw rounded-md"
            >
              <img
                src={resolvedLogo}
                alt={title}
                className="h-8 sm:h-10 w-auto"
              />
            </Link>

            {mobileMode === "default" && hasMenus && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                className={`${navText} focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-raw rounded-md p-1`}
                aria-label={mobileMenuOpen ? "Cerrar menú móvil" : "Abrir menú móvil"}
                aria-expanded={mobileMenuOpen}
                aria-controls={mobileMenuId}
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            )}
          </div>
        )}

        {/* ===================== DESKTOP ===================== */}
        <div
          className={`hidden lg:flex ${wrapperBg} rounded-2xl ${barHeight} md:h-20 items-center mx-auto ${presetToClass(barWidth)}`}
          role="navigation"
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full px-6">
            {/* IZQUIERDA */}
            <div className="flex items-center justify-start gap-6 xl:gap-8 2xl:gap-10 min-w-0">
              {hasMenus && (_areas.length > 0) && (
                <DropdownMenu
                  label={
                    <span className={`font-degular ${navText} ${hoverColor} transition-colors text-[0.95rem]`}>
                      Áreas de Conocimiento
                    </span>
                  }
                  items={_areas}
                  menuClassName="bg-raw text-sm md:text-[0.95rem]"
                />
              )}
              {hasMenus && _left.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className={`font-degular ${navText} ${hoverColor} transition-colors text-[0.95rem] whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-raw rounded-md`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* LOGO CENTRADO */}
            <div className="flex items-center justify-center">
              <Link
                to="/"
                className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-raw rounded-md"
              >
                <img
                  src={resolvedLogo}
                  alt={title}
                  className="h-14 md:h-16 w-auto"
                  style={{ maxHeight: 80 }}
                />
              </Link>
            </div>

            {/* DERECHA */}
            <div className="flex items-center justify-end gap-6 xl:gap-8 2xl:gap-10 min-w-0">
              {hasMenus && (() => {
                const { user, logout } = useAuth();
                const navigate = useNavigate();

                // Si el usuario está autenticado, mostrar menú de usuario
                if (user) {
                  return (
                    <>
                      <DropdownMenu
                        label={
                          <span className={`font-degular ${navText} ${hoverColor} transition-colors text-[0.95rem] whitespace-nowrap flex items-center gap-2`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {user.email?.split('@')[0] || 'Mi Cuenta'}
                          </span>
                        }
                        items={[
                          { label: 'Dashboard', href: '/dashboard' },
                          { label: 'Mis Reservas', href: '/dashboard/reservas' },
                          { label: 'Contenidos', href: '/dashboard/contenidos' },
                        ]}
                        align="right"
                        menuClassName="bg-raw text-sm md:text-[0.95rem]"
                      />
                      <button
                        onClick={() => {
                          logout();
                          navigate('/');
                        }}
                        className={`font-degular ${navText} ${hoverColor} transition-colors text-[0.95rem] whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-raw rounded-md flex items-center gap-2`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Salir
                      </button>
                    </>
                  );
                }

                // Si no está autenticado, mostrar botones normales
                return _right.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    className={
                      link.highlighted
                        ? "inline-flex items-center justify-center rounded-full bg-asparragus px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-asparragus/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-asparragus transition-all"
                        : `font-degular ${navText} ${hoverColor} transition-colors text-[0.95rem] whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-raw rounded-md`
                    }
                  >
                    {link.label}
                  </a>
                ));
              })()}
              {hasMenus && _acerca.length > 0 && (
                <DropdownMenu
                  label={
                    <span className={`font-degular ${navText} ${hoverColor} transition-colors text-[0.95rem] whitespace-nowrap`}>
                      Acerca de
                    </span>
                  }
                  items={_acerca}
                  align="right"
                  menuClassName="bg-raw text-sm md:text-[0.95rem]"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===================== MOBILE MENU OVERLAY ===================== */}
      {mobileMode === "default" && hasMenus && (
        <div id={mobileMenuId}>
          <MobileMenu
            open={mobileMenuOpen}
            setIsOpen={setMobileMenuOpen}
            areas={_areas}
            acercaLinks={_acerca}
            leftLinks={_left}
            rightLinks={_right}
            logoSrc={resolvedLogo}
          />
        </div>
      )}
    </nav>
  );
};

export default GenericNav;
// preview-ping
