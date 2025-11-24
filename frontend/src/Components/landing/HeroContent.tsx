// src/Components/landing/HeroContent.tsx
import React from "react";
import ButtonLink from "../ui/ButtonLink";
import { useMembershipStatus } from "../../hooks/useMembershipStatus";

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

export const HeroContent: React.FC = () => {
    const { isOpen, nextOpeningDate, loading } = useMembershipStatus();

    if (loading) {
        return (
            <div className="w-full max-w-xl mx-auto px-6 pb-8">
                <div className="animate-pulse flex flex-col gap-3 items-center">
                    <div className="h-20 w-full bg-white/20 rounded-2xl" />
                    <div className="h-12 w-64 bg-white/20 rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-xl mx-auto px-6 pb-8">
            {/* Layout vertical compacto: Párrafos juntos arriba - CTA abajo */}
            <div className="flex flex-col items-center gap-4">

                {/* Párrafos combinados - Tarjeta decorativa */}
                <div className="bg-white/50 backdrop-blur-md rounded-xl px-5 py-3 shadow-lg border border-white/60 w-full">
                    <p className="font-degular text-sm font-medium text-black/90 leading-snug text-center">
                        Yoga, autoconocimiento y vida consciente
                        <span className="mx-2">•</span>
                        Comunidad y acompañamiento para vivir con libertad
                    </p>
                </div>

                {/* CTAs - Más estrechos */}
                <div className="flex flex-col gap-3 w-full max-w-sm">
                    {isOpen ? (
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <ButtonLink
                                to="/registro"
                                variant="primary"
                                size="md"
                                className="shadow-lg bg-asparragus text-white hover:bg-asparragus/90 border-transparent"
                                aria-label="Únete a la membresía de Dharma en Ruta"
                            >
                                Únete a la membresía
                            </ButtonLink>
                            <ButtonLink
                                to="/login"
                                variant="secondary"
                                size="md"
                                className="bg-white/40 backdrop-blur hover:bg-white/60 border-black/10 text-black"
                                aria-label="Iniciar sesión si ya eres miembro"
                            >
                                Ya soy miembro
                            </ButtonLink>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <ButtonLink
                                to="/lista-espera"
                                variant="primary"
                                size="md"
                                className="shadow-lg bg-asparragus text-white hover:bg-asparragus/90 border-transparent w-full"
                                aria-label="Únete a la lista de espera de la membresía"
                            >
                                Únete a la lista de espera
                            </ButtonLink>
                            <p className="text-xs text-black/80 bg-white/30 backdrop-blur px-3 py-1.5 rounded-full font-medium">
                                Próxima apertura: {formatDate(nextOpeningDate)}
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default HeroContent;

