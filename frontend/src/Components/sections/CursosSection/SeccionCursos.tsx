// src/Components/sections/CursosSection/SeccionCursos.tsx
import React, { useId, useMemo } from "react";
import CursoCard from "../../ui/CursoCard";
import ButtonLink from "../../ui/ButtonLink";
import { FiArrowRight } from "react-icons/fi";
import cursosData from "../../../data/cursos";
import SectionHeader from "../../ui/SectionHeader";
import { formatEUR } from "../../../utils/format";

interface CursoIn {
  id?: string;
  slug?: string;
  titulo: string;
  descripcion: string;
  autor?: string;
  imagen?: string;
  precio?: number | string;
}
interface CursoOut {
  id: string;
  slug?: string;
  titulo: string;
  descripcion: string;
  autor: string;
  imagen: string;
  precio: string;
}
const SAFE_DEFAULTS = {
  autor: "Patricia Holistic Yoga",
  imagen: "/assets/placeholders/curso-placeholder.jpg",
  precio: "Consultar",
};
function precioToString(p: number | string | undefined): string {
  if (typeof p === "number" && !Number.isNaN(p)) return formatEUR(p);
  if (typeof p === "string" && p.trim().length > 0) return p;
  return SAFE_DEFAULTS.precio;
}
function normalizeCurso(c: CursoIn, index: number): CursoOut {
  return {
    id: c.id ?? c.slug ?? `curso-${index}`,
    slug: c.slug,
    titulo: c.titulo,
    descripcion: c.descripcion,
    autor: c.autor ?? SAFE_DEFAULTS.autor,
    imagen: c.imagen ?? SAFE_DEFAULTS.imagen,
    precio: precioToString(c.precio),
  };
}

const SeccionCursos: React.FC = () => {
  const headingId = useId();
  const cursos = useMemo<CursoOut[]>(() => {
    const arr = (Array.isArray(cursosData) ? cursosData : []) as CursoIn[];
    return arr.slice(0, 6).map(normalizeCurso);
  }, []);

  return (
    <section
      id="cursos"
      aria-labelledby={headingId}
      className="relative overflow-hidden bg-linen"
    >
      {/* Escalón superior: overlay oscuro que recoge el hairline del Header */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 right-0 h-6 md:h-7 bg-gradient-to-b from-black/15 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 md:pt-12 pb-12 md:pb-16">
        {/* Encabezado accesible */}
        <h2 id={headingId} className="sr-only">
          Cursos Top Ventas
        </h2>

        <SectionHeader
          title="Cursos Top Ventas"
          subtitle="Programas claros y prácticos para avanzar en autoconocimiento y bienestar."
          subtitleClassName="text-sm md:text-base max-w-2xl mx-auto text-asparragus/80 mt-2"
          align="center"
          size="md"
          color="asparragus"
          className="mb-6 md:mb-8"
        />

        <div
          className="relative rounded-2xl bg-white/90 ring-1 ring-black/5 supports-[backdrop-filter]:backdrop-blur-md p-4 sm:p-5 md:p-6 lg:p-8 shadow-sm"
          role="region"
          aria-labelledby={headingId}
        >
          <div
            role="list"
            aria-label="Listado de cursos destacados"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 auto-rows-fr items-stretch"
          >
            {cursos.map((curso, index) => (
              <div
                key={curso.id ?? `curso-${index}`}
                role="listitem"
                className="rounded-xl focus-within:ring-2 focus-within:ring-raw/40 focus-within:ring-offset-2 focus-within:ring-offset-white/90 transition-shadow"
              >
                <CursoCard
                  titulo={curso.titulo}
                  descripcion={curso.descripcion}
                  autor={curso.autor}
                  imagen={curso.imagen}
                  precio={curso.precio}
                  onComprar={() => (window.location.href = "/cursos")}
                />
              </div>
            ))}
          </div>

          {cursos.length === 0 && (
            <p className="mt-2 text-center text-sm md:text-base text-asparragus/70" role="status">
              Estamos actualizando los cursos. Vuelve en unos minutos.
            </p>
          )}
        </div>

        <div className="mt-8 md:mt-10 text-center">
          <ButtonLink
            size="md"
            variant="primary"
            href="/cursos"
            icon={<FiArrowRight aria-hidden />}
            className="focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2"
            aria-label="Ver todos los cursos disponibles"
          >
            Ver todos los cursos
          </ButtonLink>
        </div>
      </div>

      {/* Hairline inferior (transición limpia a la siguiente sección) */}
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent"
      />
        <div
        aria-hidden
        className="mt-12 md:mt-16 h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent"
      />
    </section>
  );
};

export default SeccionCursos;
