// src/Components/landing/HeroContent.tsx
import React from "react";
import ButtonLink from "../ui/ButtonLink";
import { useMembershipStatus } from "../../hooks/useMembershipStatus";
import { useAuth } from "../../contexts/AuthContext";

export const HeroContent: React.FC = () => {
    const { loading } = useMembershipStatus();
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
                                className="shadow-lg bg-asparragus text-white hover:bg-asparragus/90 border-transparent w-full text-center"
                                aria-label="Ir a mi Dashboard"
                            >
                                Ir a mi Dashboard
                            </ButtonLink>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <ButtonLink
                                to="/registro"
                                variant="primary"
                                size="md"
                                className="shadow-lg bg-asparragus text-white hover:bg-asparragus/90 border-transparent text-center"
                                aria-label="Únete a la membresía de Dharma en Ruta"
                            >
                                Únete a la membresía
                            </ButtonLink>
                            <ButtonLink
                                to="/login"
                                variant="secondary"
                                size="md"
                                className="bg-white/40 backdrop-blur hover:bg-white/60 border-black/10 text-black text-center"
                                aria-label="Iniciar sesión si ya eres miembro"
                            >
                                Ya soy miembro
                            </ButtonLink>
                        </div>
                    )}
                </div>
                {/* Párrafos combinados - Sin fondo, responsive */}
                <div className="w-full max-w-2xl px-2">
                    <p className="font-degular text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-black leading-relaxed text-center">
                        Yoga, autoconocimiento y vida consciente
                        <span className="hidden sm:inline mx-2">•</span>
                        <span className="block sm:inline mt-1 sm:mt-0"></span>
                        Comunidad y acompañamiento para vivir con libertad
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HeroContent;
