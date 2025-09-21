import React, { useState } from "react";
import { Link } from "react-router-dom";
import DropdownMenu from "../ui/DropdownMenu";
import MobileMenu from "../ui/MobileMenu";
import { acercaLinks as acercaLinksData } from "../../data/navLinks";

interface NavLink { label: string; href: string; }
type WidthPreset = "viewport" | "96rem" | "110rem" | "120rem";
type Tone = "dark" | "light";

interface GenericNavProps {
  title: string;

  /** LEGACY: sigue funcionando en todas partes */
  logoSrc: string;

  /** Opcionales: variantes de logo por contraste */
  logoSrcDark?: string;   // para fondos claros (logo negro)
  logoSrcLight?: string;  // para fondos oscuros (logo blanco)

  leftLinks?: NavLink[];
  rightLinks?: NavLink[];
  areas?: NavLink[];
  acercaLinks?: NavLink[];

  /** Aspecto de fondo de la barra en desktop */
  variant?: "transparent" | "solid";

  /** full = menús (hamburguesa en móvil); logoOnly = solo logo (sin hamburguesa) */
  mode?: "full" | "logoOnly";

  /** Contraste general del nav (texto/íconos) */
  tone?: Tone; // "dark" (texto negro) o "light" (texto blanco)

  /** Layout */
  containerWidth?: WidthPreset;  // ancho del wrapper exterior
  barWidth?: WidthPreset;        // ancho de la píldora desktop
  innerPx?: string;              // padding horizontal del wrapper
  barHeight?: "h-16" | "h-20" | "h-24"; // alto barra desktop (se complementa con md:h-20)
}

const presetToClass = (p?: WidthPreset) => {
  switch (p) {
    case "viewport": return "w-full";
    case "96rem":   return "max-w-[96rem] w-full";
    case "120rem":  return "max-w-[120rem] w-full";
    case "110rem":
    default:        return "max-w-[110rem] w-full";
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
  tone = "dark", // por defecto: textos/íconos negros (fondo claro)
  containerWidth = "110rem",
  barWidth = "110rem",
  innerPx = "px-3 sm:px-5 lg:px-6", // compact y estable
  barHeight = "h-16",               // compact por defecto; en md forzamos h-20
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const _left = leftLinks ?? [];
  const _right = rightLinks ?? [];
  const _areas = areas ?? [];
  const _acerca = acercaLinks ?? [];

  // ¿Hay menús activos? (si es logoOnly, no hay menús en ningún breakpoint)
  const hasMenus =
    mode !== "logoOnly" &&
    (_left.length > 0 || _right.length > 0 || _areas.length > 0 || _acerca.length > 0);

  // Ajuste de tono: si variant es "solid" (bg blanco), forzamos "dark" para evitar blanco sobre blanco.
  const effectiveTone: Tone = variant === "solid" ? "dark" : tone;

  // Paleta por tono
  const navText = effectiveTone === "dark" ? "text-black" : "text-white";
  const hoverColor = "hover:text-raw"; // puedes cambiarlo según tu paleta

  // Fondos (con fallback si no hay backdrop-filter)
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

  // Logo por tono con fallback al legacy
  const resolvedLogo =
    effectiveTone === "light"
      ? (logoSrcLight ?? logoSrc)
      : (logoSrcDark ?? logoSrc);

  const mobileMenuId = "global-mobile-menu";

  return (
    <nav className="w-full isolate">
      {/* WRAPPER EXTERIOR (con respiro arriba) */}
      <div
        className={`${presetToClass(containerWidth)} mx-auto ${innerPx} mt-2 md:mt-3 h-16 md:h-20 flex items-center relative z-[90]`}
      >
        {/* MOBILE (logo + hamburguesa) */}
        <div className={`lg:hidden z-[70] flex items-center justify-between w-full rounded-xl px-3 py-2 ring-1 ring-black/5 ${mobileBg}`}>
          <Link to="/" className="inline-flex">
            <img
              src={resolvedLogo}
              alt={title}
              className="h-8 sm:h-10 w-auto"
            />
          </Link>
          {hasMenus && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`${navText} focus:outline-none`}
              aria-label={mobileMenuOpen ? "Cerrar menú móvil" : "Abrir menú móvil"}
              aria-expanded={mobileMenuOpen}
              aria-controls={mobileMenuId}
            >
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
        </div>

        {/* DESKTOP BAR */}
        <div
          className={`hidden lg:flex ${wrapperBg} rounded-2xl ${barHeight} md:h-20 items-center mx-auto ${presetToClass(barWidth)}`}
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full px-6">
            {/* IZQUIERDA */}
            <div className="flex items-center justify-start gap-6 xl:gap-8 2xl:gap-10 min-w-0">
              {hasMenus && _areas.length > 0 && (
                <DropdownMenu
                  label={
                    <span className={`font-degular ${navText} ${hoverColor} transition-colors text-base`}>
                      Áreas de Conocimiento
                    </span>
                  }
                  items={_areas}
                  menuClassName="bg-raw text-sm md:text-[15px]"  // <<< dropdown más pequeño
                />
              )}
              {hasMenus &&
                _left.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    className={`font-degular ${navText} ${hoverColor} transition-colors text-base whitespace-nowrap`}
                  >
                    {link.label}
                  </a>
                ))}
            </div>

            {/* LOGO CENTRADO (un pelín más grande) */}
            <div className="flex items-center justify-center">
              <Link to="/" className="inline-flex">
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
              {hasMenus &&
                _right.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    className={`font-degular ${navText} ${hoverColor} transition-colors text-base whitespace-nowrap`}
                  >
                    {link.label}
                  </a>
                ))}
              {hasMenus && _acerca.length > 0 && (
                <DropdownMenu
                  label={
                    <span className={`font-degular ${navText} ${hoverColor} transition-colors text-base whitespace-nowrap`}>
                      Acerca de
                    </span>
                  }
                  items={_acerca}
                  align="right"
                  menuClassName="bg-raw text-sm md:text-[15px]"  // <<< dropdown más pequeño
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div id={mobileMenuId}>
        {hasMenus && (
          <MobileMenu
            open={mobileMenuOpen}
            setIsOpen={setMobileMenuOpen}
            areas={_areas}
            acercaLinks={_acerca}
            leftLinks={_left}
            rightLinks={_right}
            logoSrc={resolvedLogo}
          />
        )}
      </div>
    </nav>
  );
};

export default GenericNav;

