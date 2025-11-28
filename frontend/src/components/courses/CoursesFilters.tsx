
import { useMemo } from "react";
import { Course } from "../../types/course";
import React from "react";

type Props = {
  all: Course[];
  q: string; setQ: (v: string) => void;
  area: string; setArea: (v: string) => void;
  level: string; setLevel: (v: string) => void;
  tag: string; setTag: (v: string) => void;
};

export default function CoursesFilters({ all, q, setQ, area, setArea, level, setLevel, tag, setTag }: Props) {
  const areas = useMemo(() => Array.from(new Set(all.map(c => c.area))).sort(), [all]);
  const levels = useMemo(() => Array.from(new Set(all.map(c => c.level))).sort(), [all]);
  const tags = useMemo(() => Array.from(new Set(all.flatMap(c => c.tags ?? []))).sort(), [all]);

  return (
    <form className="grid gap-3 md:grid-cols-5">
      <div className="md:col-span-2">
        <label htmlFor="q" className="sr-only">Buscar</label>
        <input
          id="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por título o descripción…"
          className="w-full rounded-xl border border-gold/30 bg-white px-4 py-2 focus:ring-2 focus:ring-[var(--color-gold)]"
        />
      </div>

      <div>
        <label htmlFor="area" className="sr-only">Área</label>
        <select
          id="area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="w-full rounded-xl border border-gold/30 bg-white px-3 py-2"
        >
          <option value="">Todas las áreas</option>
          {areas.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="level" className="sr-only">Nivel</label>
        <select
          id="level"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full rounded-xl border border-gold/30 bg-white px-3 py-2"
        >
          <option value="">Todos los niveles</option>
          {levels.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* tags en la fila de abajo si hay */}
      {tags.length > 0 && (
        <div className="md:col-span-5">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTag("")}
              className={`px-3 py-1 rounded-full border ${tag === "" ? "bg-[var(--color-linen)] border-[var(--color-gold)]" : "border-gold/30 hover:bg-[var(--color-linen)]"}`}
            >
              Todas las etiquetas
            </button>
            {tags.map(t => (
              <button
                type="button"
                key={t}
                onClick={() => setTag(tag === t ? "" : t)}
                className={`px-3 py-1 rounded-full border ${tag === t ? "bg-[var(--color-linen)] border-[var(--color-gold)]" : "border-gold/30 hover:bg-[var(--color-linen)]"}`}
                aria-pressed={tag === t}
              >
                #{t}
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
