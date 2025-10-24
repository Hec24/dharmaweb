// src/Components/landing/IntroEscuela.tsx
import React from "react";
import SectionHeader from "../../../Components/ui/SectionHeader";

const IntroEscuela: React.FC = () => {
  return (
    <section
      className="relative bg-[var(--color-linen)]"
      aria-labelledby="intro-escuela-heading"
      role="region"
    >
      {/* hairlines editoriales */}
      {/* <div className="absolute inset-x-0 top-0 h-px bg-black/10 pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-black/10 pointer-events-none" aria-hidden="true" /> */}
      {/* Escalón superior: overlay oscuro que recoge el hairline del Header */}
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
        {/* 💡 Mobile-first: alineado a la IZQUIERDA en mobile, centrado desde sm+ */}
        <SectionHeader
          title={
            <span id="intro-escuela-heading" className="block">
              Dharma en Ruta: tu espacio de transformación práctica
            </span>
          }
          subtitle={
            <>
              <strong className="font-semibold text-asparragus">Dharma en Ruta</strong> es más que una escuela online:
              es un espacio donde unimos sabiduría ancestral —como el yoga, la meditación,
              la filosofía o la astrología— con herramientas cotidianas para tu vida —como las finanzas, el orden,
              la salud o las relaciones—.
              <br />
              <span className="mt-2 inline-block">
                Aquí encontrarás <span className="font-semibold">cursos grabados y prácticos</span> en 8 áreas clave,
                <span className="font-semibold"> acompañamientos personalizados</span>, recursos para diseñar tu propia “ruta”
                y una <span className="font-semibold">comunidad</span> con la que compartir el camino. Todo pensado para que
                vivas con más <span className="font-semibold">libertad, coherencia y conexión</span>, a tu ritmo y desde cualquier lugar.
              </span>
            </>
          }
          align="left"                      
          size="custom"
          color="asparragus"
          titleClassName="text-2xl sm:text-3xl md:text-4xl mb-3 text-left sm:text-center"
          subtitleClassName="text-asparragus/90 font-degular max-w-3xl text-[15px] sm:text-base md:text-[17px] leading-relaxed text-left sm:text-center sm:mx-auto"
          className="max-w-none sm:items-center sm:text-center"
          decoration={<span className="h-px w-16 bg-asparragus/30 mx-0 sm:mx-auto" aria-hidden="true" />}
        />

        {/* Grid de pilares */}
        <div
          className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
          role="list"
          aria-label="Pilares de la escuela"
        >
          <FeatureCard
            emoji="🌿"
            title="Cursos online"
            subtitle="Grabados y prácticos en 8 áreas clave."
          />
          <FeatureCard
            emoji="🧘🏻‍♀️"
            title="Acompañamientos"
            subtitle="Personalizados para profundizar."
          />
          <FeatureCard
            emoji="🏛"
            title="Comunidad"
            subtitle="De personas que, como tú, buscan más claridad y conexión."
          />
          <FeatureCard
            emoji="🧭"
            title="Ruta personalizable"
            subtitle="Porque no todos necesitamos lo mismo en cada etapa."
          />
        </div>
      </div>
    </section>
  );
};

type FeatureCardProps = {
  emoji: string;
  title: string;
  subtitle: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ emoji, title, subtitle }) => {
  return (
    <div
      className="rounded-2xl bg-white/80 p-5 sm:p-6 ring-1 ring-black/5 shadow-sm text-center"
      role="listitem"
    >
      <span
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-linen)] ring-1 ring-black/5 select-none mx-auto"
        aria-hidden="true"
      >
        <span className="text-lg sm:text-xl" aria-hidden="true">
          {emoji}
        </span>
      </span>

      <h3 className="mt-3 font-gotu text-lg sm:text-xl text-asparragus leading-snug">
        {title}
      </h3>
      <p className="mt-1 text-sm sm:text-[15px] font-degular text-asparragus/90 leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
};

export default IntroEscuela;

