// src/Components/sections/CursosSection/SeccionCursos.tsx
import React, { useId, useMemo } from "react";
import { FiArrowRight } from "react-icons/fi";
import CursoCard from "../../ui/CursoCard";
import ButtonLink from "../../ui/ButtonLink";
import SectionHeader from "../../ui/SectionHeader";
import { formatEUR } from "../../../utils/format";
import { AREAS, BEST_SELLING_COURSES } from "../../../config/areas.config";

type AreasConfig = typeof AREAS;
type AreaValueFromConfig = AreasConfig[keyof AreasConfig];
type CursoConfig = NonNullable<AreaValueFromConfig["cursos"]>[number];

type NormalizedCurso = {
  id: string;
  slug?: string;
  titulo: string;
  descripcion: string;
  autor: string;
  imagen: string;
  precio: string;
  href?: string;
};

const SAFE = {
  autor: "Patricia Holistic Yoga",
  imagen: "/assets/placeholders/curso-placeholder.jpg",
  precio: "Consultar",
};

function precioToString(price?: number): string {
  if (typeof price === "number" && !Number.isNaN(price)) return formatEUR(price);
  return SAFE.precio;
}

function normalize(c: CursoConfig, idx: number): NormalizedCurso {
  return {
    id: c.id || `curso-${idx}`,
    slug: undefined,
    titulo: c.titulo,
    descripcion: c.descripcion ?? "",
    autor: c.autor ?? SAFE.autor,
    imagen: c.cover ?? SAFE.imagen,
    precio: precioToString(c.priceEUR),
    href: c.hotmartUrl,
  };
}

const SeccionCursos: React.FC = () => {
  const headingId = useId();

  const cursos = useMemo<NormalizedCurso[]>(() => {
    const base: CursoConfig[] =
      (Array.isArray(BEST_SELLING_COURSES) && BEST_SELLING_COURSES.length > 0
        ? BEST_SELLING_COURSES
        : Object.values(AREAS).find((a) => a.cursos?.length)?.cursos ?? []
      ).slice(0, 3);
    return base.map(normalize);
  }, []);

  return (
    <section
      id="cursos"
      aria-labelledby={headingId}
      className="relative isolate overflow-x-hidden bg-linen"
    >
      {/* Hairline superior */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 right-0 h-6 md:h-7 bg-gradient-to-b from-black/15 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 md:pt-12 pb-12 md:pb-16">
        

        <SectionHeader
          title="Cursos más vistos"
          subtitle="Aquí encuentras las herramientas para conocerte, crecer y transformar tu vida."
          subtitleClassName="text-sm md:text-base max-w-2xl mx-auto text-asparragus/80 mt-2"
          align="center"
          size="md"
          color="asparragus"
          className="mb-6 md:mb-8"
        />

        {/* Contenedor blanco con patrón detrás */}
        <div
          className="relative rounded-2xlsupports-[backdrop-filter]:backdrop-blur-md p-4 sm:p-5 md:p-6 lg:p-8 shadow-sm overflow-hidden"
          role="region"
          aria-labelledby={headingId}
        >
         {/* Patrón detrás del contenido (solo desktop) */}
          <div
            aria-hidden
            className="
              hidden md:block
              absolute inset-0 -z-10 rounded-3xl
              before:absolute before:inset-0 before:rounded-3xl 
            "
            style={{
              backgroundImage: "url('/img/Backgrounds/tinified/background2.jpg')",
              backgroundRepeat: "repeat",
              backgroundSize: "320px",
              backgroundPosition: "center",
              opacity: 0.45,
              filter: "saturate(0.9)",
            }}
          />

          {/* Grid de cursos */}
          <div
            role="list"
            aria-label="Listado de cursos más vendidos"
            className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 auto-rows-fr items-stretch"
          >
            {cursos.map((c) => (
              <div
                key={c.id}
                role="listitem"
                className="rounded-xl focus-within:ring-2 focus-within:ring-raw/40 focus-within:ring-offset-2 focus-within:ring-offset-white/90 transition-shadow"
              >
                <CursoCard
                  titulo={c.titulo}
                  descripcion={c.descripcion}
                  autor={c.autor}
                  imagen={c.imagen}
                  precio={c.precio}
                  onComprar={() => (window.location.href = c.href || "/cursos")}
                />
              </div>
            ))}
          </div>

          {cursos.length === 0 && (
            <p
              className="mt-2 text-center text-sm md:text-base text-asparragus/70"
              role="status"
            >
              Estamos actualizando los cursos. Vuelve en unos minutos.
            </p>
          )}
        </div>

        {/* CTA general */}
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

      {/* Hairline inferior */}
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent"
      />
    </section>
  );
};

export default SeccionCursos;
