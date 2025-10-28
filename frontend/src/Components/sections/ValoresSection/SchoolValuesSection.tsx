// src/Components/brand/SchoolValuesSection.tsx
import React from "react";
import {
  FiUserCheck,
  FiCompass,
  FiUser,
  FiUsers,
  FiCheckCircle,
  FiGlobe,
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
  { key: "respeto", title: "Respeto por la diversidad", desc: "Hay muchos caminos. Sostenemos la diferencia con curiosidad, cuidado y responsabilidad.", icon: <FiGlobe aria-hidden="true" /> },
];

export default function SchoolValuesSection({
  id = "valores",
  className = "",
  title = "¿Qué nos diferencia?",
  subtitle = "Nuestros valores guían cada decisión y experiencia en la escuela.",
  bgSrc = "/img/Backgrounds/background4.jpg", // el de Dharma en Ruta
  ctaHref,
  ctaLabel,
}: {
  id?: string;
  className?: string;
  title?: string;
  subtitle?: string;
  bgSrc?: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`relative isolate ${className}`}
    >
      {/* Fondo base claro */}
      <div className="absolute inset-0 -z-20 " aria-hidden />

      {/* Patrón visible con mezcla cálida */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-65"
        style={{
          backgroundImage: `url('${bgSrc}')`,
          backgroundRepeat: "repeat",
          backgroundSize: "240px",
          backgroundPosition: "center",
          mixBlendMode: "multiply",
          filter: "saturate(0.85) brightness(1.05) opacity(0.35)",
        }}
      />

      {/* Tinte suave para cohesionar con bg-raw */}
      <div
        aria-hidden
        className="absolute inset-0 -z-[5]  mix-blend-multiply"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Cabecera */}
        <header className="mb-6 sm:mb-8 text-center">
          <h2
            id={`${id}-heading`}
            className="text-[1.9rem] sm:text-[2.1rem] font-gotu text-raw"
          >
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm md:text-base text-asparragus/85 font-degular max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
          {ctaHref && ctaLabel && (
            <p className="mt-4">
              <a
                href={ctaHref}
                className="inline-flex items-center rounded-lg border border-raw/30 bg-white/80 px-3 py-2 text-sm font-medium text-raw hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2"
              >
                {ctaLabel}
              </a>
            </p>
          )}
        </header>

        {/* Grid de valores */}
        <ul
          role="list"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10"
        >
          {VALUES.map((v) => (
            <li key={v.key} role="listitem">
              <ValueTile value={v} />
            </li>
          ))}
        </ul>
      </div>

      {/* Línea inferior */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-raw/30 to-transparent"
      />
    </section>
  );
}

function ValueTile({ value }: { value: Value }) {
  return (
    <article className="group relative isolate" aria-label={value.title}>
      <h3 className="mb-3 text-[1.05rem] font-gotu text-raw">{value.title}</h3>

      <div
        className="relative h-36 sm:h-40 lg:h-44 rounded-lg bg-white/90 border border-raw/30
                   flex items-center justify-center overflow-hidden shadow-sm
                   focus-within:ring-2 focus-within:ring-raw focus-within:ring-offset-2"
      >
        <span
          className="text-asparragus"
          aria-hidden="true"
          style={{ fontSize: "3.15rem" }}
        >
          {value.icon}
        </span>

        {/* Overlay hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-raw/80 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
        />
        <div className="absolute inset-0 p-4 text-white flex items-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
          <p className="text-[0.95rem] leading-relaxed font-degular">
            {value.desc}
          </p>
        </div>
        <button
          type="button"
          aria-label={`Más sobre ${value.title}`}
          className="absolute inset-0 focus:outline-none"
        />
      </div>
    </article>
  );
}
