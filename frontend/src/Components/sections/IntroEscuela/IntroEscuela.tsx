// src/Components/landing/IntroEscuela.tsx
import React from "react";
import SectionHeader from "../../ui/SectionHeader";

const IntroEscuela: React.FC = () => {
  return (
    <section
      className="relative bg-[var(--color-linen)]"
      aria-labelledby="intro-escuela-heading"
      role="region"
    >
      {/* hairlines editoriales */}
      <div className="absolute inset-x-0 top-0 h-px bg-black/10 pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-black/10 pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
        {/* Cabecera centrada con SectionHeader */}
        <SectionHeader
          title={
            <span id="intro-escuela-heading" className="block">
              Dharma en Ruta: tu espacio de transformación práctica
            </span>
          }
          subtitle={
            <>
              <strong className="font-semibold text-asparragus">Dharma en Ruta</strong> es más que una escuela online:
              es un espacio de transformación práctica donde unimos sabiduría ancestral —como el yoga, la meditación,
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
          align="center"
          size="custom"
          color="asparragus"
          titleClassName="text-2xl sm:text-3xl md:text-4xl mb-3"
          subtitleClassName="text-asparragus/90 font-degular max-w-3xl mx-auto text-[15px] sm:text-base md:text-[17px] leading-relaxed"
          className="max-w-none"
          decoration={<span className="h-px w-16 bg-asparragus/30 mx-auto" aria-hidden="true" />}
        />

        {/* Grid de pilares centrados con emoji arriba */}
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
      {/* Emoji en pastilla centrado */}
      <span
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-linen)] ring-1 ring-black/5 select-none mx-auto"
        aria-hidden="true"
      >
        <span className="text-lg sm:text-xl" aria-hidden="true">
          {emoji}
        </span>
      </span>

      {/* Título y subtítulo */}
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
