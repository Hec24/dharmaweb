// src/pages/QueIncluyePage.tsx
import React from "react";
import { Helmet } from "react-helmet-async";
import GenericNav from "../components/shared/GenericNav";
import SectionHeader from "../components/ui/SectionHeader";
import { leftLinks, rightLinks, areas, acercaLinks } from "../data/navLinks";

import MembershipSection from "../components/sections/MembershipSection/MembershipSection";
import FinalCTA from "../components/sections/FinalCTA/FinalCTA";

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
                {/* Reutilizamos la sección de membresía que ya detalla qué incluye */}
                <MembershipSection />

                {/* Añadimos CTA final para cerrar la página */}
                <FinalCTA />
            </main>
        </div>
    );
};

export default QueIncluyePage;
