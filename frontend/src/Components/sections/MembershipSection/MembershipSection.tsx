// src/Components/landing/MembershipSection/MembershipSection.tsx

import React, { useId } from "react";
import { FiLogIn, FiUserPlus } from "react-icons/fi";
import SectionHeader from "../../ui/SectionHeader";
import ButtonLink from "../../ui/ButtonLink";
import { useMembershipStatus } from "../../../hooks/useMembershipStatus";

interface MembershipSectionProps { }

const MembershipSection: React.FC<MembershipSectionProps> = () => {
  const headingId = useId();
  const cardHeadingId = useId();
  const { isOpen } = useMembershipStatus();

  return (
    <section
      id="membresia"
      aria-labelledby={headingId}
      className="py-16 md:py-24 bg-[var(--color-linen)] relative overflow-hidden"
      role="region"
    >
      {/* Escalón superior */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 right-0 h-6 md:h-7 bg-gradient-to-b from-black/15 to-transparent"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Header Unificado (Intro + Membership) */}
        <SectionHeader
          id={headingId}
          eyebrow="Dharma en Ruta"
          title="Tu espacio de práctica, comunidad y vida consciente"
          subtitle={
            <>
              Más que una escuela online, es un refugio donde unimos sabiduría ancestral
              (yoga, meditación, filosofía) con herramientas para tu vida cotidiana.
              <br className="hidden md:block" />
              Una membresía completa para vivir con <strong>libertad, coherencia y conexión</strong>.
            </>
          }
          align="center"
          size="custom"
          color="asparragus"
          titleClassName="text-3xl md:text-4xl lg:text-5xl mb-6 font-gotu"
          subtitleClassName="text-asparragus/90 font-degular max-w-3xl text-base md:text-lg leading-relaxed mx-auto"
          className="mb-12"
        />

        {/* Contenido Principal: Cards + Lista + CTA */}
        <div className="flex flex-col items-center">

          {/* 1. Grid de Pilares (Estilo Intro) - Responsive como SchoolValues */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 w-full">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:shadow-lg transition-all duration-300 group flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-asparragus/10 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                📚
              </div>
              <h3 className="font-gotu text-lg text-asparragus mb-2">Contenidos</h3>
              <p className="text-asparragus/80 text-sm leading-relaxed">
                Biblioteca creciente de vídeos y recursos para tu práctica autónoma.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:shadow-lg transition-all duration-300 group flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                🎥
              </div>
              <h3 className="font-gotu text-lg text-asparragus mb-2">Directos</h3>
              <p className="text-asparragus/80 text-sm leading-relaxed">
                Encuentros mensuales en vivo para profundizar y resolver dudas.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:shadow-lg transition-all duration-300 group flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-raw/10 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                💬
              </div>
              <h3 className="font-gotu text-lg text-asparragus mb-2">Comunidad</h3>
              <p className="text-asparragus/80 text-sm leading-relaxed">
                Foro privado para compartir y sentir el sostén del grupo.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:shadow-lg transition-all duration-300 group flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-asparragus/10 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                🧘🏻‍♀️
              </div>
              <h3 className="font-gotu text-lg text-asparragus mb-2">Acompañamiento</h3>
              <p className="text-asparragus/80 text-sm leading-relaxed">
                Descuentos exclusivos en sesiones 1:1 para tu proceso individual.
              </p>
            </div>
          </div>

          {/* CTA Card (Restaurada) */}
          <div className="w-full max-w-md">
            <div className="relative overflow-hidden rounded-2xl bg-raw text-[var(--color-linen)] shadow-lg ring-1 ring-black/5">
              {/* Decorative background element */}
              <div
                aria-hidden
                className="absolute inset-x-0 -top-16 h-32 opacity-20 bg-[radial-gradient(circle_at_top,_#F2C94C_0,_transparent_60%)]"
              />

              <div className="relative p-6 sm:p-8 space-y-6">
                <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wider font-medium text-gold">
                  Acceso & Registro
                </div>

                <header className="space-y-2">
                  <h3
                    id={cardHeadingId}
                    className="font-gotu text-xl sm:text-2xl leading-snug text-white"
                  >
                    Da el siguiente paso
                  </h3>
                  <p className="font-degular text-sm text-[var(--color-linen)]/80 leading-relaxed">
                    Elige cómo quieres entrar: accede si ya formas parte o apúntate para recibir prioridad cuando se abran plazas.
                  </p>
                </header>

                <div className="space-y-3" role="group" aria-labelledby={cardHeadingId}>
                  {/* Botón Acceder */}
                  <ButtonLink
                    to="/login"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-asparragus px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-asparragus/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <FiLogIn aria-hidden className="h-4 w-4" />
                    <span>Ya soy miembro: Acceder</span>
                  </ButtonLink>

                  {/* Botón Registro o Lista de Espera (condicional) */}
                  <ButtonLink
                    to={isOpen ? "/registro" : "/lista-espera"}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium text-white border border-white/20 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <FiUserPlus aria-hidden className="h-4 w-4" />
                    <span>{isOpen ? "Quiero unirme: Registro" : "Unirme a la lista de espera"}</span>
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MembershipSection;
