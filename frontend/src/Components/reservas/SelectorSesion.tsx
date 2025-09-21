// src/Components/modalwizard/SelectorSesion.tsx
import React, { useEffect, useRef, useState } from "react";
import { FiCircle, FiCheckCircle } from "react-icons/fi";
import SectionHeader from "../ui/SectionHeader";

interface SelectorSesionProps {
  servicios: string[];
  value: string | null;
  onChange: (servicio: string) => void;
  onBack?: () => void; // la expone el Wizard padre (no se usa aquí)
}

const SelectorSesion: React.FC<SelectorSesionProps> = (props) => {
  const { servicios, value, onChange } = props; // mantenemos onBack en props para compatibilidad
  const [seleccionado, setSeleccionado] = useState<string | null>(value);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => setSeleccionado(value), [value]);

  const handleSelect = (servicio: string, idx: number) => {
    setSeleccionado(servicio);
    onChange(servicio);
    requestAnimationFrame(() => itemRefs.current[idx]?.focus());
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    const total = servicios.length;
    let next = idx;
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        handleSelect(servicios[idx], idx);
        return;
      case "ArrowDown":
        e.preventDefault();
        next = Math.min(idx + 1, total - 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        next = Math.max(idx - 1, 0);
        break;
      default:
        return;
    }
    itemRefs.current[next]?.focus();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      <SectionHeader
        title="Elige el tipo de sesión"
        subtitle="Selecciona la modalidad de acompañamiento que deseas reservar."
        align="center"
        size="sm"    // títulos compactos como el resto de pasos
        color="asparragus"
        className="mb-5"
      />

      {/* Lista de opciones (CTA = seleccionar opción) */}
      <div className="mx-auto max-w-md grid gap-3">
        <h3 id="selector-sesion-title" className="sr-only">Tipos de sesión</h3>
        <p id="selector-sesion-help" className="sr-only">
          Usa las flechas arriba y abajo para moverte, y Enter o Espacio para seleccionar.
        </p>

        {servicios.map((servicio, idx) => {
          const isSelected = seleccionado === servicio;
          return (
            <button
              key={servicio}
              ref={(el) => { itemRefs.current[idx] = el; }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-posinset={idx + 1}
              aria-setsize={servicios.length}
              aria-labelledby={`op-sesion-${idx}`}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onClick={() => handleSelect(servicio, idx)}
              className={[
                "w-full inline-flex items-center justify-between gap-3",
                "rounded-xl border bg-white",
                isSelected ? "border-asparragus ring-2 ring-asparragus/60" : "border-raw/20",
                "px-3 py-2",
                "text-sm leading-snug",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-asparragus focus-visible:ring-offset-2 focus-visible:ring-offset-linen",
                "transition-shadow duration-150 hover:shadow-xs",
              ].join(" ")}
            >
              <span className="flex items-center gap-2">
                {isSelected ? (
                  <FiCheckCircle aria-hidden className="h-4 w-4" />
                ) : (
                  <FiCircle aria-hidden className="h-4 w-4" />
                )}
                <span id={`op-sesion-${idx}`} className="font-medium">{servicio}</span>
              </span>

              <span aria-hidden className="text-[0.8125rem] uppercase tracking-wide font-semibold text-asparragus">
                Seleccionar
              </span>
            </button>
          );
        })}
      </div>

      {/* Estado accesible */}
      <p role="status" aria-live="polite" className="sr-only">
        {seleccionado ? `Has seleccionado ${seleccionado}.` : "Ninguna sesión seleccionada."}
      </p>
    </div>
  );
};

export default SelectorSesion;