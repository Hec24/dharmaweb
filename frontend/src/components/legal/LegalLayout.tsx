// src/Components/legal/LegalLayout.tsx
import React from "react";
import { Helmet } from "react-helmet-async";
import GenericNav from "../shared/GenericNav";
import Header from "../shared/Header";
import SectionHeader from "../ui/SectionHeader";
import { leftLinks, rightLinks, areas, acercaLinks } from "../../data/navLinks";

type Section = { id: string; label: string };
type HeaderSize = "sm" | "md" | "lg";

interface LegalLayoutProps {
  title: string;
  subtitle?: string;
  sections: Section[];
  lastUpdated?: string; // ej: "14 de septiembre de 2025"
  headerSize?: HeaderSize; // 👈 nuevo
  children: React.ReactNode;
}

const sizeClasses: Record<HeaderSize, string> = {
  sm: "pt-10 md:pt-12 pb-6 min-h-[220px]",
  md: "pt-12 md:pt-16 pb-8 min-h-[280px]",
  lg: "pt-16 md:pt-20 pb-10 min-h-[340px]",
};

const sectionHeaderSizes: Record<HeaderSize, "sm" | "md" | "lg" | "xl"> = {
  sm: "lg",
  md: "xl",
  lg: "xl",
};

export default function LegalLayout({
  title,
  subtitle,
  sections,
  lastUpdated,
  headerSize = "sm", // 👈 por defecto compacto
  children,
}: LegalLayoutProps): React.ReactElement {
  return (
    <>
      <Helmet>
        <title>{title} · Dharma en Ruta</title>
        {subtitle && <meta name="description" content={subtitle} />}
      </Helmet>

      <Header
        bgImage="/img/Backgrounds/tinified/background5.jpg"
        align="center"
        nav={
          <GenericNav
            title="Dharma en Ruta"
            logoSrc="/img/Logos/Logos-08.png"
            leftLinks={leftLinks}
            rightLinks={rightLinks}
            areas={areas}
            acercaLinks={acercaLinks}
            variant="transparent"
            containerWidth="120rem"
            barWidth="110rem"
            innerPx="px-[min(6vw,3rem)]"
            barHeight="h-20"
          />
        }
      >
        <div className={`w-full text-center flex flex-col items-center justify-start ${sizeClasses[headerSize]}`}>
          <SectionHeader
            title={title}
            subtitle={subtitle}
            align="center"
            size={sectionHeaderSizes[headerSize]}
            color="black"
            decoration
          />
        </div>
      </Header>

      <main className="bg-[#FDF2EC]">
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* TOC */}
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-28 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Índice</h3>
                <nav className="space-y-2 text-sm">
                  {sections.map((s) => (
                    <a key={s.id} href={`#${s.id}`} className="block text-gray-700 hover:text-mossgreen">
                      {s.label}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Contenido */}
            <article className="lg:col-span-9">
              <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-10">
                {lastUpdated && (
                  <p className="text-sm text-gray-500 mb-6">Última actualización: {lastUpdated}</p>
                )}
                <div className="prose max-w-none prose-headings:scroll-mt-28">
                  {children}
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}
