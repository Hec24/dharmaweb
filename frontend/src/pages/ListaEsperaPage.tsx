// src/pages/ListaEsperaPage.tsx
import React from "react";
import { Helmet } from "react-helmet-async";
import GenericNav from "../components/shared/GenericNav";
import SectionHeader from "../components/ui/SectionHeader";
import { leftLinks, rightLinks, areas, acercaLinks } from "../data/navLinks";

const ListaEsperaPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-linen flex flex-col">
            <Helmet>
                <title>Lista de espera | Dharma en Ruta</title>
                <meta
                    name="description"
                    content="Únete a la lista de espera de Dharma en Ruta y sé el primero en enterarte cuando abramos la próxima ventana de inscripción."
                />
                <meta name="robots" content="noindex, nofollow" />
                <link rel="canonical" href="https://dharmaenruta.com/lista-espera" />
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
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
                    <SectionHeader
                        title="Únete a la lista de espera"
                        subtitle="Déjanos tu email y te avisaremos cuando abramos la próxima ventana de inscripción"
                        align="center"
                    />

                    <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-raw/10">
                        <p className="text-center text-asparragus mb-6">
                            Próxima apertura: <strong>15 de enero de 2025</strong>
                        </p>

                        {/* TODO: Integrar formulario de MailerLite aquí */}
                        <div className="text-center text-asparragus/70">
                            <p>Formulario de MailerLite pendiente de integración</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ListaEsperaPage;
