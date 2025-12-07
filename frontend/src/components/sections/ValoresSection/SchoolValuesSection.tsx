// src/Components/brand/SchoolValuesSection.tsx
import React from "react";
import {
  FiUserCheck,
  FiCompass,
  FiUser,
  FiUsers,
  FiCheckCircle,
  FiGlobe,
  FiHeart,
  FiSun,
} from "react-icons/fi";

type Value = {
  key: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
};

const VALUES: Value[] = [
  { key: "autenticidad", title: "Autenticidad", desc: "Mostrarnos tal y como somos. Sin máscaras: honestidad en lo que compartimos y en cómo lo hacemos.", icon: <FiUserCheck aria-hidden="true" /> },
  { key: "libertad", title: "Libertad", desc: "Elegir el propio camino. Diseñar una vida coherente con tus valores, sin prisas ni moldes ajenos.", icon: <FiCompass aria-hidden="true" /> },
  { key: "autoconocimiento", title: "Autoconocimiento", desc: "Mirarte hacia dentro. Comprender emociones, mente y cuerpo para vivir con mayor claridad.", icon: <FiUser aria-hidden="true" /> },
  { key: "conexion", title: "Conexión", desc: "Vínculo contigo y con los demás. Comunidad que acompaña, escucha y celebra los procesos.", icon: <FiUsers aria-hidden="true" /> },
  { key: "coherencia", title: "Coherencia", desc: "Alinear lo que piensas, sientes y haces. Decisiones que respeten tu ritmo y tu verdad.", icon: <FiCheckCircle aria-hidden="true" /> },
  { key: "respeto", title: "Respeto", desc: "Sostenemos la diferencia con curiosidad, cuidado y responsabilidad por la diversidad.", icon: <FiGlobe aria-hidden="true" /> },
  { key: "compasion", title: "Compasión", desc: "Abrazar la imperfección propia y ajena. Un trato amable ante la dificultad y el error.", icon: <FiHeart aria-hidden="true" /> },
  { key: "claridad", title: "Claridad", desc: "Buscar la verdad más allá del ruido. Cultivar una mente lúcida y un corazón despierto.", icon: <FiSun aria-hidden="true" /> },
];

export default function SchoolValuesSection({
  id = "valores",
  className = "",
  title = "¿Qué nos diferencia?",
  subtitle = "Nuestros valores guían cada decisión y experiencia en la escuela.",
  bgSrc = "/img/Backgrounds/tinified/fondoheading.jpg", // Usando la imagen del hero como patrón
}: {
  id?: string;
  className?: string;
  title?: string;
  subtitle?: string;
  bgSrc?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`relative isolate py-16 md:py-24 ${className}`}
    >
      {/* Escalón superior */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 right-0 h-6 md:h-7 bg-gradient-to-b from-black/15 to-transparent z-10"
      />
      {/* Fondo base */}
      <div className="absolute inset-0 -z-20 bg-white" aria-hidden />

      {/* Patrón de imagen de fondo */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-25"
        style={{
          backgroundImage: `url('${bgSrc}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Cabecera */}
        <header className="mb-12 md:mb-16 text-center">
          <h2
            id={`${id}-heading`}
            className="text-3xl md:text-4xl font-gotu text-raw mb-4"
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-asparragus/80 font-degular max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </header>

        {/* Grid de valores */}
        <ul
          role="list"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {VALUES.map((v) => (
            <li key={v.key} role="listitem">
              <ValueTile value={v} />
            </li>
          ))}
        </ul>
      </div>

      {/* Hairline inferior */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent z-10"
      />
    </section>
  );
}

function ValueTile({ value }: { value: Value }) {
  return (
    <article className="group relative p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-raw/20 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-linen flex items-center justify-center text-asparragus mb-4 group-hover:scale-110 transition-transform duration-300">
        <span className="text-2xl">{value.icon}</span>
      </div>

      <h3 className="font-gotu text-xl text-raw mb-3">{value.title}</h3>

      <p className="font-degular text-sm text-gray-600 leading-relaxed">
        {value.desc}
      </p>
    </article>
  );
}
