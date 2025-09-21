// src/Components/landing/TestimonialsCarousel/TestimonialsCarousel.tsx
import React, { useId, useMemo, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { testimonialsData, programFilters } from "../../../data/testimonios";
import { CarouselBase } from "../../ui/CarouselBase";
import TestimonialCard from "../../ui/TestimonialCard";
import ButtonLink from "../../ui/ButtonLink";
import Tag from "../../ui/Tag";
import SectionHeader from "../../ui/SectionHeader";

type Testimonial = (typeof testimonialsData)[number];

const TestimonialsCarousel: React.FC = () => {
  const headingId = useId();
  const [activeFilter, setActiveFilter] = useState<string>("Todos");

  const filteredTestimonials: Testimonial[] = useMemo(() => {
    return activeFilter === "Todos"
      ? testimonialsData
      : testimonialsData.filter((t) => t.program === activeFilter);
  }, [activeFilter]);

  return (
    <section
      id="testimonios"
      className="relative bg-linen overflow-hidden"
      aria-labelledby={headingId}
    >
      {/* SOLO overlay superior (escalón oscuro). Sin hairline arriba. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 right-0 h-5 md:h-6 bg-gradient-to-b from-black/15 to-transparent"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 md:pt-12 pb-12 md:pb-16">
        {/* Heading accesible */}
        <h2 id={headingId} className="sr-only">
          Voces de nuestros participantes
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

        {/* Carrusel */}
        <div
          role="region"
          aria-label="Carrusel de testimonios"
          className="rounded-2xl bg-white/90 ring-1 ring-black/5 supports-[backdrop-filter]:backdrop-blur-md p-4 md:p-6"
        >
          <CarouselBase
            items={filteredTestimonials}
            itemsToShow={2}
            breakpoints={{ 0: 1, 768: 2 }}
            renderItem={(testimonial: Testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                {...testimonial}
                date={testimonial.date ?? ""}
              />
            )}
          />
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

      {/* Hairline inferior (transición fina hacia la siguiente sección) */}
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

export default TestimonialsCarousel;
