// src/pages/QueIncluyePage.tsx
import React from "react";
import { Helmet } from "react-helmet-async";
import GenericNav from "../components/shared/GenericNav";
import SectionHeader from "../components/ui/SectionHeader";
import { leftLinks, rightLinks, areas, acercaLinks } from "../data/navLinks";

const QueIncluyePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-linen flex flex-col">
            <Helmet>
                <title>Qué incluye la membresía | Dharma en Ruta</title>
                <meta
                    name="description"
                    content="Descubre todo lo que incluye la membresía de Dharma en Ruta: vídeos tutoriales, directos mensuales, foro de comunidad y descuentos exclusivos."
                />
                <link rel="canonical" href="https://dharmaenruta.com/que-incluye" />
            </Helmet>

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

            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
                    <SectionHeader
                        title="Qué incluye la membresía"
                        subtitle="Descubre todos los beneficios y contenidos exclusivos de Dharma en Ruta"
                        align="center"
                    />

                    <div className="mt-12 text-center text-asparragus">
                        <p className="text-lg">
                            Esta página está en construcción. Pronto tendrás información detallada sobre la membresía.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default QueIncluyePage;
