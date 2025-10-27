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
      className="relative bg-linen overflow-hidden"
      aria-labelledby={headingId}
    >
      {/* Escalón superior: overlay oscuro */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 right-0 h-6 md:h-7 bg-gradient-to-b from-black/15 to-transparent"
      />
      
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 md:pt-12 pb-12 md:pb-14">
        

        <SectionHeader
          title="Conoce a nuestro equipo"
          subtitle="Conoce a las personas que te guiarán en tu camino de autoconocimiento y libertad"
          subtitleClassName="text-sm md:text-base max-w-xl mx-auto text-asparragus/80 mt-2"
          align="center"
          size="md"
          color="asparragus"
          className="mb-6 md:mb-8"
        />

        {/* Carrusel */}
        <div
          role="region"
          aria-labelledby={headingId}
          className="rounded-2xl bg-white/90 ring-1 ring-black/5 supports-[backdrop-filter]:backdrop-blur-md p-4 md:p-6"
        >
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
                  // /* El botón “Conoce más” de la card apuntará a la sección correcta */
                  // link={ROUTES.PROFESORES} // p.ej. "/acompanamientos#profesores"
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

      {/* Hairline inferior pegado al borde de la sección (para encadenar con el overlay de la siguiente) */}
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

export default TeamCarousel;
