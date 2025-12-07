// src/Components/landing/HeroContent.tsx
import React from "react";
import ButtonLink from "../ui/ButtonLink";
import { useMembershipStatus } from "../../hooks/useMembershipStatus";
import { useAuth } from "../../contexts/AuthContext";

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
    const { user } = useAuth();

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
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pb-4">
            {/* Layout vertical compacto: Párrafos juntos arriba - CTA abajo */}
            <div className="flex flex-col items-center gap-5">

                {/* CTAs - Responsive */}
                <div className="flex flex-col gap-3 w-full max-w-md">
                    {user ? (
                        <div className="flex flex-col items-center gap-3">
                            <ButtonLink
                                to="/dashboard"
                                variant="primary"
                                size="md"
                                className="shadow-lg bg-asparragus text-white hover:bg-asparragus/90 border-transparent text-center"
                                aria-label="Ir a mi Dashboard"
                            >
                                Ir a mi Dashboard
                            </ButtonLink>
                        </div>
                    ) : isOpen ? (
                        <div className="flex flex-col items-center gap-3">
                            <ButtonLink
                                to="/lista-espera"
                                variant="primary"
                                size="md"
                                className="shadow-lg bg-asparragus text-white hover:bg-asparragus/90 border-transparent text-center"
                                aria-label="Únete a la lista de espera de la membresía"
                            >
                                Únete a la lista de espera
                            </ButtonLink>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <ButtonLink
                                to="/lista-espera"
                                variant="primary"
                                size="md"
                                className="shadow-lg bg-asparragus text-white hover:bg-asparragus/90 border-transparent text-center"
                                aria-label="Únete a la lista de espera de la membresía"
                            >
                                Únete a la lista de espera
                            </ButtonLink>
                            <p className="text-xs text-black/80 bg-white/30 backdrop-blur px-3 py-1.5 rounded-full font-medium">
                                Próxima apertura: 21 de marzo de 2026
                            </p>
                        </div>
                    )}
                </div>
                {/* Párrafos combinados - Sin fondo, responsive */}
                <div className="w-full max-w-2xl px-2">
                    <p className="font-degular text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-black leading-relaxed text-center">
                        Una Escuela Nómada para Vivir con Libertad y Coherencia
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HeroContent;
