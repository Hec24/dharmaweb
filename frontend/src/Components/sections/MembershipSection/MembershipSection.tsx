// src/Components/landing/MembershipSection/MembershipSection.tsx

import React, { useId } from "react";
import { FiLogIn, FiUserPlus } from "react-icons/fi";
import SectionHeader from "../../ui/SectionHeader";
import ButtonLink from "../../ui/ButtonLink";

interface MembershipSectionProps {}

const MembershipSection: React.FC<MembershipSectionProps> = () => {
  const headingId = useId();
  const cardHeadingId = useId();

  return (
    <section
      id="membresia"
      aria-labelledby={headingId}
      className="relative bg-[var(--color-linen)]"
      role="region"
    >
      {/* Escalón superior como en IntroEscuela */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 right-0 h-6 md:h-7 bg-gradient-to-b from-black/15 to-transparent"
      />

      <div
        className="
          max-w-7xl mx-auto
          px-5 sm:px-6 lg:px-8
          max-[360px]:px-6
          pt-12 sm:pt-12 lg:pt-16
          max-[375px]:pt-14
          pb-10 sm:pb-12 lg:pb-16
        "
      >
        {/* Header coherente con IntroEscuela pero centrado */}
        <SectionHeader
          id={headingId}
          eyebrow="Membresía Dharma en Ruta"
          title={
            <span className="block">
              Tu espacio de práctica, comunidad y vida en coherencia
            </span>
          }
          subtitle={
            <>
              La membresía de Dharma en Ruta será tu “templo” online: un lugar
              donde combinar práctica, conocimiento y comunidad para sostener tu
              proceso de cambio en el día a día, sin perderte entre mil recursos
              dispersos.
            </>
          }
          align="center"
          size="custom"
          color="asparragus"
          titleClassName="text-2xl sm:text-3xl md:text-4xl mb-3"
          subtitleClassName="text-asparragus/90 font-degular max-w-3xl text-[15px] sm:text-base md:text-[17px] leading-relaxed sm:mx-auto"
          className="max-w-none sm:items-center sm:text-center"
          decoration={
            <span
              className="h-px w-16 bg-asparragus/30 mx-0 sm:mx-auto"
              aria-hidden="true"
            />
          }
        />

         {/* Texto + bullets y luego la card, todo centrado en el flujo */}
        <div className="mt-6 sm:mt-8 flex flex-col items-center">
          <div className="w-full max-w-3xl font-degular text-[15px] sm:text-base md:text-[17px] text-asparragus space-y-5 md:space-y-6">
            {/* Lista de beneficios: bloque centrado, texto alineado a la izquierda */}
            <ul className="space-y-3 sm:space-y-4 max-w-xl mx-auto text-left">
              <li className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-1.5 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-asparragus"
                />
                <div>
                  <p className="font-semibold text-sm sm:text-[15px] md:text-base text-asparragus leading-snug">
                    Práctica viva y acompañada
                  </p>
                  <p className="text-asparragus/85 text-[13px] sm:text-[14px] md:text-[15px] leading-relaxed">
                    Clases, talleres y propuestas guiadas para integrar el yoga,
                    el autoconocimiento y los 8 caminos del Dharma en tu vida
                    real.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-1.5 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-gold"
                />
                <div>
                  <p className="font-semibold text-sm sm:text-[15px] md:text-base text-asparragus leading-snug">
                    Comunidad que vibra parecido
                  </p>
                  <p className="text-asparragus/85 text-[13px] sm:text-[14px] md:text-[15px] leading-relaxed">
                    Espacios de encuentro, inspiración y apoyo mutuo para que no
                    camines sola tu proceso.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-1.5 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-asparragus/80"
                />
                <div>
                  <p className="font-semibold text-sm sm:text-[15px] md:text-base text-asparragus leading-snug">
                    Recursos ordenados por áreas de vida
                  </p>
                  <p className="text-asparragus/85 text-[13px] sm:text-[14px] md:text-[15px] leading-relaxed">
                    Contenidos organizados según las áreas de Dharma en Ruta
                    para que sepas siempre por dónde seguir.
                  </p>
                </div>
              </li>
            </ul>

            {/* Texto final, centrado, conecta visualmente con el header */}
            <p className="text-asparragus/85 text-[13px] sm:text-[14px] md:text-[15px] leading-relaxed text-center sm:mx-auto sm:max-w-xl">
              Aquí puedes acceder si ya eres miembro o apuntarte para ser de las
              primeras personas en entrar cuando abramos puertas.
            </p>
          </div>

          {/* Card de acceso/registro, centrada debajo */}
          <div className="mt-8 w-full max-w-md">
            <div className="relative overflow-hidden rounded-2xl bg-raw text-[var(--color-linen)] shadow-sm ring-1 ring-black/5">
              <div
                aria-hidden
                className="absolute inset-x-0 -top-16 h-32 opacity-20 bg-[radial-gradient(circle_at_top,_#F2C94C_0,_transparent_60%)]"
              />

              <div className="relative p-6 sm:p-7 space-y-5">
                <div className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-[11px] sm:text-xs uppercase tracking-[0.18em] font-medium">
                  Acceso &amp; registro
                </div>

                <header className="space-y-1.5">
                  <h3
                    id={cardHeadingId}
                    className="font-gotu text-lg sm:text-xl leading-snug"
                  >
                    Da el siguiente paso en tu camino
                  </h3>
                  <p className="font-degular text-[13px] sm:text-sm text-[var(--color-linen)]/80 leading-relaxed">
                    Elige cómo quieres entrar: accede si ya formas parte o
                    apúntate para recibir prioridad cuando se abran plazas.
                  </p>
                </header>

                <div
                  className="space-y-3"
                  role="group"
                  aria-labelledby={cardHeadingId}
                >
                  <ButtonLink
                    to="/login"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-asparragus px-3.5 py-2.5 text-sm sm:text-[15px] font-medium text-raw shadow-sm transition hover:bg-asparragus/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-raw"
                  >
                    <FiLogIn aria-hidden className="h-4 w-4" />
                    <span>Ya soy miembro: acceder</span>
                  </ButtonLink>

                    {/* TODO: sustituir por URL real de MailerLite */}
                  <a
                    href="/registro" 
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-linen)]/30 bg-transparent px-3.5 py-2.5 text-sm sm:text-[15px] font-medium text-[var(--color-linen)] transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-raw"
                  >
                    <FiUserPlus aria-hidden className="h-4 w-4" />
                    <span>Quiero unirme / lista de espera</span>
                  </a>
                </div>

                <p className="font-degular text-[11px] sm:text-xs text-[var(--color-linen)]/75 leading-relaxed">
                  No enviaremos spam. Solo contenido relacionado con la
                  membresía de Dharma en Ruta y avisos importantes sobre
                  apertura de plazas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembershipSection;
