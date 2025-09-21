import React from "react";
import GenericNav from "../Components/shared/GenericNav";
import { leftLinks, rightLinks, areas, acercaLinks } from "../data/navLinks";

interface SimplePageLayoutProps {
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  children: React.ReactNode;
  /** Cambia el ancho de la tarjeta si quieres más estrecho/ancho */
  maxWidthClass?: string; // "max-w-3xl" por defecto
}

export default function SimplePageLayout({
  title,
  subtitle,
  lastUpdated,
  children,
  maxWidthClass = "max-w-3xl",
}: SimplePageLayoutProps) {
  return (
    <>
      {/* NAV sólido, sin hero */}
      <header className="w-full shadow-sm bg-linen">
        <div className="max-w-[110rem] mx-auto px-[min(6vw,3rem)]">
          <GenericNav
            title="Dharma En Ruta"
            logoSrc="/img/Logos/Logos-08.png"
            leftLinks={leftLinks}
            rightLinks={rightLinks}
            areas={areas}
            acercaLinks={acercaLinks}
            variant="solid"
            containerWidth="110rem"
            barWidth="110rem"
            innerPx="px-0"
            barHeight="h-20"
          />
        </div>
      </header>

      {/* Fondo + tarjeta central */}
      <main className="bg-[#FDF2EC]">
        <section className="py-12 md:py-16">
          <div className={`mx-auto ${maxWidthClass} px-4 sm:px-6`}>
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10">
              <h1 className="text-2xl sm:text-3xl font-semibold">{title}</h1>
              {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
              {lastUpdated && (
                <p className="text-sm text-gray-500 mt-3">Última actualización: {lastUpdated}</p>
              )}
              <div className="mt-6 prose max-w-none">
                {children}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
