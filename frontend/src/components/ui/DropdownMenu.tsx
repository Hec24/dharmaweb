// src/Components/shared/DropdownMenu.tsx
// ✅ Activa el borde del ítem clicado inmediatamente (feedback instantáneo)
//    y lo mantiene activo según la URL (React Router).
import React, { useState, useRef, useEffect, ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";

interface DropdownItem {
  label: string;
  href: string;
}

interface DropdownMenuProps {
  label: ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  menuClassName?: string;
  buttonClassName?: string;
  itemClassName?: string;
  bg?: "raw" | "linen";
  activeBorderSide?: "left" | "right" | "top" | "bottom";
}

const sideToClass: Record<NonNullable<DropdownMenuProps["activeBorderSide"]>, string> = {
  left: "border-l-2",
  right: "border-r-2",
  top: "border-t-2",
  bottom: "border-b-2",
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  label,
  items,
  align = "left",
  menuClassName = "",
  buttonClassName = "",
  itemClassName = "",
  bg = "raw",
  activeBorderSide = "left",
}) => {
  const [open, setOpen] = useState(false);
  const [localSelected, setLocalSelected] = useState<string | null>(null); // ⭐ nuevo
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<HTMLAnchorElement[]>([]);
  const location = useLocation();

  // Borra selección local cuando cambia la ruta (ya manda la URL)
  useEffect(() => {
    setLocalSelected(null);
  }, [location.pathname]);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setOpen(true);
  };
  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (open && itemRefs.current[0]) itemRefs.current[0].focus();
  }, [open]);

  const onButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  };

  const onMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const idx = itemRefs.current.findIndex((el) => el === document.activeElement);
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (idx + 1) % items.length;
      itemRefs.current[next]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (idx - 1 + items.length) % items.length;
      itemRefs.current[prev]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      itemRefs.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      itemRefs.current[items.length - 1]?.focus();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  const bgClass = bg === "linen" ? "bg-linen" : "bg-raw";
  const activeSideClass = sideToClass[activeBorderSide];

  // Activo por URL
  const isActiveByPath = (href: string) => {
    const path = href.startsWith("/") ? href : `/${href}`;
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Activo final: feedback inmediato (localSelected) OR URL
  const isActive = (href: string) => localSelected === href || isActiveByPath(href);

  return (
    <div
      className="relative"
      ref={rootRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={buttonRef}
        className={`flex items-center cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded ${buttonClassName}`}
        aria-haspopup="menu"
        aria-expanded={open}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={onButtonKeyDown}
      >
        {label}
        <svg
          className={`ml-1 h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Submenú"
          onKeyDown={onMenuKeyDown}
          className={`absolute z-40 mt-2 min-w-[12rem] rounded-md shadow-lg ring-1 ring-black/5 ${bgClass} ${
            align === "right" ? "right-0" : "left-0"
          } ${menuClassName}`}
        >
          <ul role="none" className="py-1">
            {items.map((item, i) => {
              const active = isActive(item.href);
              return (
                <li role="none" key={item.href}>
                  <NavLink
                    ref={(el) => {
                      if (el) itemRefs.current[i] = el;
                    }}
                    to={item.href}
                    role="menuitem"
                    tabIndex={-1}
                    aria-current={active ? "page" : undefined}
                    className={`block px-3 py-2 text-[0.9rem] sm:text-[0.95rem] leading-5 font-degular text-linen hover:bg-asparragus/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded transition-colors ${itemClassName} ${
                      active ? `${activeSideClass} border-gold bg-asparragus/10` : ""
                    }`}
                    onClick={() => {
                      setLocalSelected(item.href); // ⭐ pinta el borde al instante
                      setOpen(false);
                    }}
                  >
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
