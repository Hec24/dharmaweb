// src/Components/sections/FinalCTA/FinalCTA.tsx
import React from "react";
import SectionHeader from "../../ui/SectionHeader";
import ButtonLink from "../../ui/ButtonLink";
import { useMembershipStatus } from "../../../hooks/useMembershipStatus";

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

const FinalCTA: React.FC = () => {
    const { isOpen, nextOpeningDate, loading } = useMembershipStatus();

    if (loading) {
        return (
            <section className="relative bg-raw-100">
                <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 py-12 md:py-16">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-asparragus/20 rounded-lg max-w-md mx-auto" />
                        <div className="h-4 bg-asparragus/20 rounded-lg max-w-lg mx-auto" />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            id="cta-final"
            className="relative bg-raw-100"
            aria-labelledby="cta-heading"
        >
            <div
                aria-hidden
                className="pointer-events-none absolute top-0 left-0 right-0 h-6 md:h-7 bg-gradient-to-b from-black/10 to-transparent"
            />

            <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 py-12 md:py-16">
                <SectionHeader
                    id="cta-heading"
                    title={isOpen ? "¿Lista para dar el paso?" : "Únete cuando abramos puertas"}
                    subtitle={
                        isOpen
                            ? "Empieza tu transformación hoy. Accede a todos los contenidos, comunidad y acompañamiento."
                            : `Déjanos tu email y te avisaremos cuando abramos la próxima ventana de inscripción el ${formatDate(nextOpeningDate)}.`
                    }
                    align="center"
                    size="custom"
                    color="asparragus"
                    titleClassName="text-2xl sm:text-3xl md:text-4xl mb-3"
                    subtitleClassName="text-asparragus/90 font-degular max-w-2xl text-[15px] sm:text-base leading-relaxed sm:mx-auto"
                />

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    {isOpen ? (
                        <>
                            <ButtonLink to="/registro" variant="primary" size="lg">
                                Únete a la membresía
                            </ButtonLink>
                            <ButtonLink to="/login" variant="secondary" size="lg">
                                Ya soy miembro
                            </ButtonLink>
                        </>
                    ) : (
                        <ButtonLink to="/lista-espera" variant="primary" size="lg">
                            Únete a la lista de espera
                        </ButtonLink>
                    )}
                </div>
            </div>

            <div
                aria-hidden
                className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent"
            />
        </section>
    );
};

export default FinalCTA;
