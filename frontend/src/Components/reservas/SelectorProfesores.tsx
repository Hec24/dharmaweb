// src/Components/wizard/SelectorProfesores.tsx
import React, { useEffect, useRef, useState } from "react";
import SectionHeader from "../ui/SectionHeader";
import ProfesorCard from "../ui/ProfesorCard";

interface Profesor {
  id: number;
  name: string;
  title?: string;
  image: string;
  description?: string;
  specialties?: string[];
  calendlyLink: string;
  acompananteEmail: string;
}

interface Props {
  profesores: Profesor[];
  value: Profesor | null;
  onChange: (prof: Profesor) => void;
  selected?: Profesor | null;
}

const SelectorProfesores: React.FC<Props> = ({ profesores, value, onChange }) => {
  const [seleccionado, setSeleccionado] = useState<Profesor | null>(value);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => { setSeleccionado(value); }, [value]);

  const handleSelect = (p: Profesor, idx: number) => {
    setSeleccionado(p);
    onChange(p);
    requestAnimationFrame(() => { itemRefs.current[idx]?.focus(); });
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const p = profesores[idx];
      if (p) handleSelect(p, idx);
      return;
    }
    const cols = window.matchMedia("(min-width: 640px)").matches ? 2 : 1; // sm:grid-cols-2
    const total = profesores.length;
    let next = idx;
    switch (e.key) {
      case "ArrowRight": if (cols > 1) next = (idx + 1) % total; break;
      case "ArrowLeft":  if (cols > 1) next = (idx - 1 + total) % total; break;
      case "ArrowDown":  next = Math.min(idx + cols, total - 1); break;
      case "ArrowUp":    next = Math.max(idx - cols, 0); break;
      default: return;
    }
    e.preventDefault();
    itemRefs.current[next]?.focus();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      <SectionHeader
        title="Elige tu acompañante"
        subtitle="Selecciona a la persona que te acompañará en tu proceso. Todos los perfiles han sido elegidos por su profesionalidad y calidad humana."
        align="center"
        size="sm"   // igual que el resto
        color="asparragus"
        className="mb-5"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
        {profesores.map((p, idx) => {
          const isSelected = seleccionado?.id === p.id;
          return (
            <button
              key={p.id}
              ref={(el) => { itemRefs.current[idx] = el; }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-posinset={idx + 1}
              aria-setsize={profesores.length}
              aria-label={p.name}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onClick={() => handleSelect(p, idx)}
              className={[
                "group relative text-sm leading-snug",
                "rounded-2xl border border-raw/20 bg-white",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-asparragus focus-visible:ring-offset-2 focus-visible:ring-offset-linen",
                "transition-shadow duration-150",
                isSelected ? "ring-2 ring-asparragus/60 shadow-sm" : "hover:shadow-xs"
              ].join(" ")}
            >
              <div className="p-3 sm:p-3.5">
                <div className="scale-[0.965] origin-top-left">
                  <ProfesorCard
                    name={p.name}
                    image={p.image}
                    specialties={p.specialties}
                    variant="selector-minimal"
                    /* Si ProfesorCard acepta className, puedes compactar aún más:
                    className="text-[0.95rem] sm:text-sm"
                    */
                  />
                </div>
              </div>

              {/* Indicador minimal de selección */}
              <span
                aria-hidden="true"
                className={[
                  "pointer-events-none absolute top-2 right-2 inline-flex h-4 w-4 items-center justify-center rounded-full border",
                  isSelected ? "border-asparragus bg-asparragus" : "border-raw/30 bg-white"
                ].join(" ")}
              >
                <span
                  className={[
                    "block h-2 w-2 rounded-full",
                    isSelected ? "bg-white" : "bg-transparent"
                  ].join(" ")}
                />
              </span>
            </button>
          );
        })}
      </div>
      {/* El botón Siguiente lo gestiona el wizard padre */}
    </div>
  );
};

export default SelectorProfesores;