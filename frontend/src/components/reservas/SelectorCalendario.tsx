// src/Components/modalwizard/SelectorCalendario.tsx
import React, { useEffect, useMemo, useRef } from "react";
import SectionHeader from "../ui/SectionHeader";
import { disponibilidadProfesoresConfig } from "../../data/disponibilidad";
import { generateAvailability } from "../../utils/availability";
import type { FechaHora } from "../../data/types"; // { fecha: 'YYYY-MM-DD', hora: 'HH:mm' }
import { api } from "../../lib/api";

interface Profesor { name: string; }

interface Props {
  profesor: Profesor;
  sesionesYaReservadas: string[]; // "YYYY-MM-DD HH:mm"
  value: FechaHora | null;
  onChange: (fh: FechaHora | null) => void;
  onBack?: () => void; // lo inyecta el Wizard (no se usa aquí)
}

const SelectorCalendario: React.FC<Props> = ({
  profesor,
  sesionesYaReservadas,
  value,
  onChange,
}) => {
  // 1) Reglas del profe
  const profConfig = useMemo(
    () => disponibilidadProfesoresConfig.find((p) => p.name === profesor.name),
    [profesor.name]
  );

  // 2) Disponibilidad (próximos N días)
  const disponibilidad = useMemo(() => {
    if (!profConfig) return [] as Array<{ fecha: string; horas: string[] }>;
    return generateAvailability(
      profConfig.rules,
      sesionesYaReservadas,
      new Date(), // desde hoy
      profConfig.rules.maxDaysAhead ?? 30
    );
  }, [profConfig, sesionesYaReservadas]);

  const selectedFecha = value?.fecha ?? "";
  const selectedHora = value?.hora ?? "";

  
  // Refs para navegación por teclado
  const dayRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const slotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!selectedFecha) return;
    const idx = disponibilidad.findIndex((d) => d.fecha === selectedFecha);
    if (idx >= 0) requestAnimationFrame(() => { dayRefs.current[idx]?.focus(); });
  }, [selectedFecha, disponibilidad]);

  useEffect(() => {
    if (!selectedHora) return;
    const horas = disponibilidad.find((d) => d.fecha === selectedFecha)?.horas ?? [];
    const idx = horas.findIndex((h) => h === selectedHora);
    if (idx >= 0) requestAnimationFrame(() => { slotRefs.current[idx]?.focus(); });
  }, [selectedHora, selectedFecha, disponibilidad]);

  const onSelectFecha = (fecha: string) => {
    if (fecha === selectedFecha) return;
    onChange({ fecha, hora: "" });
  };

  const onSelectHora = (hora: string) => {
    if (!selectedFecha) return;
    onChange({ fecha: selectedFecha, hora });
  };

  const handleDaysKeyDown = (e: React.KeyboardEvent, idx: number) => {
    const total = disponibilidad.length;
    let next = idx;
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        onSelectFecha(disponibilidad[idx].fecha);
        return;
      case "ArrowRight":
        e.preventDefault();
        next = Math.min(idx + 1, total - 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        next = Math.max(idx - 1, 0);
        break;
      default:
        return;
    }
    dayRefs.current[next]?.focus();
  };

  const handleSlotsKeyDown = (e: React.KeyboardEvent, idx: number, horas: string[]) => {
    const total = horas.length;
    let next = idx;
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        onSelectHora(horas[idx]);
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
    slotRefs.current[next]?.focus();
  };

  const fmtFecha = (iso: string) =>
    new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short" }).replace(".", "");
  const fmtFechaAria = (iso: string) =>
    new Date(iso).toLocaleDateString("es-ES", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

  const [ocupadosBackend, setOcupadosBackend] = React.useState<string[]>([]); // "YYYY-MM-DD HH:mm"const [ocupadosBackend, setOcupadosBackend] = React.useState<string[]>([]); // "YYYY-MM-DD HH:mm"

// 2) extrae tu fetch a una función reutilizable:
const fetchOcupados = React.useCallback(async () => {
  if (!profConfig) return;
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + (profConfig.rules.maxDaysAhead ?? 30));
  const fmt = (d: Date) => d.toISOString().slice(0,10);
  try {
    const { data } = await api.get<{ ocupados: { fecha: string; hora: string }[] }>(
      "/ocupados",
      { params: { profesor: profesor.name, from: fmt(start), to: fmt(end) } }
    );
    const list = (data?.ocupados ?? []).map(o => `${o.fecha} ${o.hora}`);
    setOcupadosBackend(list);
  } catch (e) {
    console.error("[SelectorCalendario] fallo cargando ocupados:", e);
    setOcupadosBackend([]);
  }
}, [profConfig, profesor.name]);

// 3) primera carga (lo que ya tenías, pero llamando a la función)
    useEffect(() => {
      (async () => {
        await fetchOcupados();
      })();
      return () => {};
    }, [fetchOcupados]);

    // 4) refresco al recuperar el foco de la pestaña
    useEffect(() => {
      const onFocus = () => { fetchOcupados(); };
      window.addEventListener("focus", onFocus);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") fetchOcupados();
      });
      return () => {
        window.removeEventListener("focus", onFocus);
        document.removeEventListener("visibilitychange", () => {});
      };
    }, [fetchOcupados]);

    // 5) polling suave (opcional pero útil si hay varias personas reservando a la vez)
    useEffect(() => {
      const id = setInterval(() => { fetchOcupados(); }, 15000); // cada 15s
      return () => clearInterval(id);
    }, [fetchOcupados]);

    // 6) tu yaOcupada ahora combina carrito + backend (como ya planteamos)
    const yaOcupada = (fecha: string, hora: string) => {
      const key = `${fecha} ${hora}`;
      return sesionesYaReservadas.includes(key) || ocupadosBackend.includes(key);
    };

  return (
    <div className="min-h-full flex flex-col">
      {/* MISMA ANCHURA QUE EL RESTO: usa el contenedor estándar del proyecto */}
      <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={`Reserva con ${profesor?.name}`}
          subtitle="Selecciona primero una fecha y luego una hora disponible."
          align="center"
          size="sm"
          color="asparragus"
          className="mb-4"
        />

        {/* FECHAS: ancho fluido dentro del contenedor principal */}
        <div className="mb-5">
          <div className="mb-2">
            <h3 id="label-fechas" className="text-xs font-semibold uppercase tracking-wide text-raw/70">
              Fechas disponibles
            </h3>
          </div>

          <div
            role="radiogroup"
            aria-labelledby="label-fechas"
            className="
              relative
              flex items-stretch gap-2
              overflow-x-auto overscroll-contain
              [scrollbar-gutter:stable_both-edges]
              py-1
            "
          >
            {/* degradados sutiles */}
            <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent" />
            <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent" />

            {disponibilidad.length === 0 && (
              <div className="text-sm text-raw/70 px-1 py-2">No hay disponibilidad por ahora.</div>
            )}

            {disponibilidad.map(({ fecha }, idx) => {
              const isSelected = fecha === selectedFecha;
              return (
                <button
                  key={fecha}
                  ref={(el) => { dayRefs.current[idx] = el; }}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={fmtFechaAria(fecha)}
                  onClick={() => onSelectFecha(fecha)}
                  onKeyDown={(e) => handleDaysKeyDown(e, idx)}
                  className={[
                    "shrink-0 rounded-xl border text-sm font-medium",
                    "px-3 py-2",
                    isSelected
                      ? "bg-mossgreen text-white border-mossgreen"
                      : "bg-linen text-asparragus border-gold hover:bg-mossgreen hover:text-white hover:border-mossgreen",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-asparragus focus-visible:ring-offset-2 focus-visible:ring-offset-linen",
                    "transition-colors",
                  ].join(" ")}
                >
                  <span className="font-gotu text-[0.95rem] leading-none">{fmtFecha(fecha)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* HORAS: grid amplia dentro del mismo contenedor */}
        <div className="mt-2">
          <div className="mb-2">
            <h3 id="label-horas" className="text-xs font-semibold uppercase tracking-wide text-raw/70">
              Horas disponibles
            </h3>
          </div>

          <div
            role="radiogroup"
            aria-labelledby="label-horas"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2"
          >
            {selectedFecha ? (
              (disponibilidad.find((d) => d.fecha === selectedFecha)?.horas ?? []).map((hora, idx, horasArr) => {
                const isSelected = hora === selectedHora;
                const disabled = yaOcupada(selectedFecha, hora);

                return (
                  <button
                    key={hora}
                    ref={(el) => { slotRefs.current[idx] = el; }}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-disabled={disabled}
                    disabled={disabled}
                    onClick={() => !disabled && onSelectHora(hora)}
                    onKeyDown={(e) => handleSlotsKeyDown(e, idx, horasArr)}
                    className={[
                      "w-full rounded-lg border text-sm leading-snug",
                      "px-3 py-2",
                      disabled
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
                        : isSelected
                        ? "bg-gold text-white border-gold"
                        : "bg-white text-asparragus border-gold hover:bg-mossgreen hover:text-white",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-asparragus focus-visible:ring-offset-2 focus-visible:ring-offset-linen",
                      "transition-colors",
                    ].join(" ")}
                  >
                    <span className="font-gotu text-[0.95rem]">{hora}</span>
                  </button>
                );
              })
            ) : (
              <p className="col-span-full text-sm text-raw/70">
                Elige primero una fecha para ver los horarios disponibles.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Estado accesible */}
      <p role="status" aria-live="polite" className="sr-only">
        {selectedFecha
          ? selectedHora
            ? `Has seleccionado ${fmtFechaAria(selectedFecha)} a las ${selectedHora}.`
            : `Has seleccionado la fecha ${fmtFechaAria(selectedFecha)}. Selecciona una hora.`
          : "Ninguna fecha seleccionada."}
      </p>
    </div>
  );
};

export default SelectorCalendario;

