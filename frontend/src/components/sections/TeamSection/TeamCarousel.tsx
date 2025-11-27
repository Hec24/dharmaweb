// src/Components/landing/TeamCarousel/TeamCarousel.tsx
import React, { useId } from "react";
import { profesores } from "../../../data/profesores";
import { CarouselBase } from "../../ui/CarouselBase";
import ProfesorCard from "../../ui/ProfesorCard";
import { FiArrowRight } from "react-icons/fi";
import ButtonLink from "../../ui/ButtonLink";
import SectionHeader from "../../ui/SectionHeader";
import { ROUTES } from "./../../../constants/routes";

type ProfesorItem = (typeof profesores)[number];

const TeamCarousel: React.FC = () => {
  const headingId = useId();

  return (
    <section
      id="profesores"
      className="relative bg-[var(--color-linen)] overflow-hidden"
      aria-labelledby={headingId}
    >
      {/* Escalón superior: overlay oscuro */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 right-0 h-6 md:h-7 bg-gradient-to-b from-black/15 to-transparent"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 md:pt-12 pb-12 md:pb-14">
        <h2 id={headingId} className="sr-only">
          Conoce a nuestro equipo
        </h2>

        <SectionHeader
          title="Conoce a nuestro equipo"
          subtitle="Conoce a las personas que te guiarán en tu camino de autoconocimiento y libertad"
          subtitleClassName="text-sm md:text-base max-w-xl mx-auto text-asparragus/80 mt-2"
          align="center"
          size="md"
          color="asparragus"
          className="mb-6 md:mb-8"
        />

        {/* === Contenedor blanco con patrón detrás (igual que en CursosSection / Testimonials) === */}
        <div
          role="region"
          aria-labelledby={headingId}
          className="relative rounded-2xl supports-[backdrop-filter]:backdrop-blur-md p-4 sm:p-5 md:p-6 lg:p-8 shadow-sm overflow-hidden">
          
          {/* Patrón detrás del contenido (solo md+) */}
          <div
            aria-hidden
            className="
              hidden md:block
              absolute inset-0 -z-10 rounded-3xl
              before:absolute before:inset-0 before:rounded-3xl
            "
            style={{
              backgroundImage: "url('/img/Backgrounds/background2.jpg')",
              backgroundRepeat: "repeat",
              backgroundSize: "320px",
              backgroundPosition: "center",
              opacity: 0.45,
              filter: "saturate(0.9)",
            }}
          />

          {/* Carrusel */}
          <CarouselBase
            items={profesores}
            renderItem={(p: ProfesorItem) => (
              <div
                key={(p as { id?: string | number }).id ?? (p as { name?: string }).name ?? "prof"}
                className="h-full"
                role="group"
                aria-label={`Perfil de ${(p as { name?: string }).name ?? "miembro del equipo"}`}
              >
                <ProfesorCard
                  name={(p as { name: string }).name}
                  image={(p as { image: string }).image}
                  title={(p as { title?: string }).title}
                  description={(p as { description?: string }).description}
                  specialties={(p as { specialties?: string[] }).specialties}
                />
              </div>
            )}
            className=""
          />
        </div>

        {/* CTA global */}
        <div className="text-center mt-8 md:mt-10">
          <ButtonLink
            as="a"
            href={ROUTES.PROFESORES}
            size="md"
            variant="primary"
            icon={<FiArrowRight aria-hidden />}
            className="focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2"
            aria-label="Conoce a todo el profesorado"
          >
            Conoce al profesorado
          </ButtonLink>
        </div>
      </div>

      {/* Hairlines inferiores */}
      <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      <div aria-hidden className="mt-12 md:mt-16 h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
    </section>
  );
};

export default TeamCarousel;
