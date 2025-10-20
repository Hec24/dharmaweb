// src/Components/sections/TestimonialsCarousel.tsx
import React, { useEffect, useId, useMemo, useState } from "react";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { testimonialsData, programFilters } from "../../../data/testimonios";
import TestimonialCard from "../../ui/TestimonialCard";
import ButtonLink from "../../ui/ButtonLink";
import Tag from "../../ui/Tag";
import SectionHeader from "../../ui/SectionHeader";

type Testimonial = (typeof testimonialsData)[number];

/** Hook: devuelve 1 en mobile y 2 a partir de 1024px, sin librerías. */
function usePerPage(lgWidth = 1024): 1 | 2 {
  const getMatches = (): 1 | 2 =>
    typeof window !== "undefined" && window.matchMedia(`(min-width:${lgWidth}px)`).matches ? 2 : 1;

  const [perPage, setPerPage] = useState<1 | 2>(getMatches);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(`(min-width:${lgWidth}px)`);
    const handler = (e: MediaQueryListEvent) => setPerPage(e.matches ? 2 : 1);

    if (typeof mql.addEventListener === "function") mql.addEventListener("change", handler);
    else mql.addListener(handler as unknown as (this: MediaQueryList, ev: MediaQueryListEvent) => void);

    setPerPage(mql.matches ? 2 : 1);

    return () => {
      if (typeof mql.removeEventListener === "function") mql.removeEventListener("change", handler);
      else mql.removeListener(handler as unknown as (this: MediaQueryList, ev: MediaQueryListEvent) => void);
    };
  }, [lgWidth]);

  return perPage;
}

const TestimonialsCarousel: React.FC = () => {
  const headingId = useId();
  const [activeFilter, setActiveFilter] = useState<string>("Todos");
  const perPage = usePerPage(1024);
  const [page, setPage] = useState<number>(0);

  const filtered: Testimonial[] = useMemo(() => {
    return activeFilter === "Todos"
      ? testimonialsData
      : testimonialsData.filter((t) => t.program === activeFilter);
  }, [activeFilter]);

  const totalPages: number = Math.max(1, Math.ceil(filtered.length / perPage));
  const clampedPage: number = Math.min(page, totalPages - 1);
  const startIndex: number = clampedPage * perPage;
  const visible: Testimonial[] = filtered.slice(startIndex, startIndex + perPage);

  useEffect(() => {
    // reset de página al cambiar filtros o layout (perPage)
    setPage(0);
  }, [activeFilter, perPage]);

  return (
    <section
      id="testimonios"
      className="relative bg-[var(--color-linen)] overflow-hidden"
      aria-labelledby={headingId}
      role="region"
    >
      {/* Hairline superior */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-black/10" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 md:pt-12 pb-12 md:pb-16">
        {/* sr-only por redundancia con SectionHeader */}
        <h2 id={headingId} className="sr-only">
          Nuestr@s Alumn@s Dicen
        </h2>

        <SectionHeader
          title="Voces de nuestros participantes"
          subtitle="Experiencias reales que inspiran acción."
          subtitleClassName="text-sm md:text-base max-w-xl mx-auto text-asparragus/80 mt-2"
          align="center"
          size="md"
          color="asparragus"
          className="mb-6 md:mb-8"
        />

        {/* Filtros */}
        <nav aria-label="Filtrar testimonios por programa" className="mb-8 md:mb-10">
          <ul role="list" className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
            {programFilters.map((program) => (
              <li key={program} role="listitem">
                <Tag
                  variant="filter"
                  size="xl"
                  active={activeFilter === program}
                  asButton
                  onClick={() => setActiveFilter(program)}
                  aria-pressed={activeFilter === program}
                >
                  {program}
                </Tag>
              </li>
            ))}
          </ul>
        </nav>

        {/* GRID paginada:
            - Mobile-first: 1 columna (perPage=1)
            - >=1024px: 2 columnas (perPage=2)
            - Solo se renderizan `perPage` cards por página (1 o 2).
        */}
        <div className="rounded-2xl bg-white/90 ring-1 ring-black/5 supports-[backdrop-filter]:backdrop-blur-md p-4 md:p-6">
          {/* Controles tipo “flechas” (coherentes con TeamCarousel) */}
          <div className="hidden lg:flex justify-end mb-4 gap-2" aria-hidden={totalPages <= 1}>
            <IconPager
              page={clampedPage}
              totalPages={totalPages}
              onPrev={() => setPage((p) => Math.max(0, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            />
          </div>

          <div role="list" aria-label="Testimonios" className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
            {visible.length === 0 ? (
              <div role="status" className="col-span-full text-center text-asparragus/70 font-degular text-sm">
                No hay testimonios para este filtro.
              </div>
            ) : (
              visible.map((t) => (
                <div key={t.id} role="listitem">
                  <TestimonialCard {...t} date={t.date ?? ""} />
                </div>
              ))
            )}
          </div>

          {/* Controles en mobile, también con flechas para coherencia */}
          {totalPages > 1 && (
            <div className="mt-5 flex items-center justify-center lg:hidden">
              <IconPager
                page={clampedPage}
                totalPages={totalPages}
                onPrev={() => setPage((p) => Math.max(0, p - 1))}
                onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              />
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-8 md:mt-10 text-center">
          <SectionHeader
            title="¿Listo para tu transformación?"
            subtitle="Estas historias son solo el comienzo. Tu viaje personal hacia el autoconocimiento te espera."
            subtitleClassName="text-asparragus/80 text-sm md:text-base font-degular max-w-2xl mx-auto mt-2"
            align="center"
            size="sm"
            color="asparragus"
            className="mb-5 md:mb-6"
          />
          <ButtonLink
            size="md"
            variant="primary"
            href="/cursos"
            icon={<FiArrowRight aria-hidden />}
            className="focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2"
            aria-label="Ir a los cursos para comenzar tu camino"
          >
            Comienza tu camino
          </ButtonLink>
        </div>
      </div>

      {/* Hairlines inferiores */}
      <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      <div aria-hidden className="mt-12 md:mt-16 h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
    </section>
  );
};

const IconPager: React.FC<{
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}> = ({ page, totalPages, onPrev, onNext }) => {
  const isPrevDisabled = page === 0;
  const isNextDisabled = page >= totalPages - 1;

  const btnBase =
    "inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-black/5 bg-[var(--color-linen)]/70 text-asparragus transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-asparragus focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-40";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onPrev}
        disabled={isPrevDisabled}
        className={btnBase}
        aria-label="Mostrar testimonios anteriores"
      >
        <FiChevronLeft aria-hidden />
        <span className="sr-only">Anterior</span>
      </button>
      <span className="mx-1 text-xs font-degular text-asparragus/70" aria-live="polite">
        {page + 1} / {totalPages}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={isNextDisabled}
        className={btnBase}
        aria-label="Mostrar testimonios siguientes"
      >
        <FiChevronRight aria-hidden />
        <span className="sr-only">Siguiente</span>
      </button>
    </div>
  );
};

export default TestimonialsCarousel;

