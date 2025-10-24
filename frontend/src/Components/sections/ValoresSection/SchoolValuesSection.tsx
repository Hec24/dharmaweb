// src/Components/brand/SchoolValuesLikeShots.tsx
import React from "react";
import {
  FiUserCheck,
  FiCompass,
  FiUser,
  FiUsers,
  FiCheckCircle,
  FiGlobe,
} from "react-icons/fi";

/**
 * Sección de valores con layout “como en las screenshots”:
 * - Título grande arriba.
 * - Grid de 3x2 (md: 3 columnas; lg: 6 en 2 filas) con el **título del valor encima** del icono.
 * - Overlay de texto descriptivo que aparece al **hover/focus** del tile (estilo “caja oscura”).
 * - Mobile-first, tipografías compactas (100% zoom), paleta y fonts del proyecto.
 */

type Value = {
  key: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
};

const VALUES: Value[] = [
  {
    key: "autenticidad",
    title: "Autenticidad",
    desc:
      "Mostrarnos tal y como somos. Sin máscaras: honestidad en lo que compartimos y en cómo lo hacemos.",
    icon: <FiUserCheck aria-hidden="true" />,
  },
  {
    key: "libertad",
    title: "Libertad",
    desc:
      "Elegir el propio camino. Diseñar una vida coherente con tus valores, sin prisas ni moldes ajenos.",
    icon: <FiCompass aria-hidden="true" />,
  },
  {
    key: "autoconocimiento",
    title: "Autoconocimiento",
    desc:
      "Mirarte hacia dentro. Comprender emociones, mente y cuerpo para vivir con mayor claridad.",
    icon: <FiUser aria-hidden="true" />,
  },
  {
    key: "conexion",
    title: "Conexión",
    desc:
      "Vínculo contigo y con los demás. Comunidad que acompaña, escucha y celebra los procesos.",
    icon: <FiUsers aria-hidden="true" />,
  },
  {
    key: "coherencia",
    title: "Coherencia",
    desc:
      "Alinear lo que piensas, sientes y haces. Tomar decisiones que respeten tu ritmo y tu verdad.",
    icon: <FiCheckCircle aria-hidden="true" />,
  },
  {
    key: "respeto",
    title: "Respeto por la diversidad",
    desc:
      "Hay muchos caminos. Sostenemos la diferencia con curiosidad, cuidado y responsabilidad.",
    icon: <FiGlobe aria-hidden="true" />,
  },
];

export default function SchoolValuesSection({
  id = "valores",
  className = "",
  title = "¿Qué nos diferencia?",
}: {
  id?: string;
  className?: string;
  title?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={`relative bg-white ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Título principal */}
        <header className="mb-6 sm:mb-8">
          <h2
            id={`${id}-heading`}
            className="text-[1.9rem] sm:text-[2.1rem] font-gotu text-gray-900"
          >
            {title}
          </h2>
        </header>

        {/* Grid de valores: 2 filas, 3 columnas; en lg se mantiene 3x2 con mayor respiro */}
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
    </section>
  );
}

function ValueTile({ value }: { value: Value }) {
  return (
    <article
      className="group relative isolate"
      aria-label={value.title}
    >
      {/* Título del valor encima del icono (como en las screenshots) */}
      <h3 className="mb-3 text-[1.05rem] font-gotu text-gray-900">{value.title}</h3>

      {/* “Escenario” del icono */}
      <div
        className="relative h-36 sm:h-40 lg:h-44 rounded-lg bg-linen/80 border border-raw/30
                   flex items-center justify-center overflow-hidden"
      >
        {/* Icono grande, negro, simple */}
        <span
          className="text-gray-900"
          aria-hidden="true"
          // Tamaños compactos pero con presencia
          style={{ fontSize: "3.2rem" }}
        >
          {value.icon}
        </span>

        {/* Overlay tipo “caja oscura” (aparece al hover/focus) */}
        <div
          className="pointer-events-none absolute inset-0 bg-black/70 opacity-0 transition-opacity duration-200
                     group-hover:opacity-100"
          aria-hidden="true"
        />

        {/* Contenido del overlay (accesible con teclado mediante focus-within del botón) */}
        <div
          className="absolute inset-0 p-4 text-white flex"
          // Oculto visualmente hasta hover, pero disponible al foco del botón
          style={{ opacity: 0 }}
        >
          <p className="text-[0.95rem] leading-relaxed font-degular">
            {value.desc}
          </p>
        </div>

        {/* Botón “info” invisible (sirve para focus para accesibilidad) */}
        <button
          type="button"
          aria-label={`Más sobre ${value.title}`}
          className="absolute inset-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-asparragus focus-visible:ring-offset-2 focus-visible:ring-offset-black/70"
          onFocus={(e) => {
            // al enfocar con teclado, mostramos overlay
            const card = (e.currentTarget.parentElement as HTMLElement) || null;
            if (card) {
              const overlay = card.querySelector<HTMLDivElement>("div.absolute.inset-0.p-4");
              const scrim = card.querySelector<HTMLDivElement>("div.pointer-events-none.absolute.inset-0");
              if (overlay && scrim) {
                overlay.style.opacity = "1";
                scrim.style.opacity = "1";
              }
            }
          }}
          onBlur={(e) => {
            const card = (e.currentTarget.parentElement as HTMLElement) || null;
            if (card) {
              const overlay = card.querySelector<HTMLDivElement>("div.absolute.inset-0.p-4");
              const scrim = card.querySelector<HTMLDivElement>("div.pointer-events-none.absolute.inset-0");
              if (overlay && scrim) {
                overlay.style.opacity = "0";
                scrim.style.opacity = "0";
              }
            }
          }}
        />
      </div>
    </article>
  );
}
