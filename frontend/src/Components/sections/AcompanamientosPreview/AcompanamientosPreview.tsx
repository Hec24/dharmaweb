// src/Components/sections/AcompanamientosPreview/AcompanamientosPreview.tsx
import React from "react";
import SectionHeader from "../../ui/SectionHeader";
import ButtonLink from "../../ui/ButtonLink";
import { FiArrowRight } from "react-icons/fi";

const AcompanamientosPreview: React.FC = () => {
    return (
        <section
            id="acompanamientos-preview"
            className="relative bg-raw"
            aria-labelledby="acompanamientos-heading"
        >
            {/* Escalón superior */}
            <div
                aria-hidden
                className="pointer-events-none absolute top-0 left-0 right-0 h-6 md:h-7 bg-gradient-to-b from-black/15 to-transparent"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
                <SectionHeader
                    id="acompanamientos-heading"
                    eyebrow="Acompañamiento personalizado"
                    title="Profundiza con sesiones 1:1"
                    subtitle="Yoga, astrología, finanzas, bienestar... Trabaja de forma cercana con nuestros profesionales especializados."
                    align="center"
                    size="custom"
                    color="linen"
                    titleClassName="text-2xl sm:text-3xl md:text-4xl mb-3"
                    subtitleClassName="text-linen/90 font-degular max-w-2xl text-[15px] sm:text-base md:text-[17px] leading-relaxed sm:mx-auto"
                />

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <ButtonLink
                        to="/acompanamientos"
                        variant="secondary"
                        size="md"
                        icon={<FiArrowRight aria-hidden />}
                        className="bg-linen text-raw hover:bg-linen/90"
                    >
                        Ver acompañamientos
                    </ButtonLink>

                    <div className="flex items-center gap-2 text-linen/80 text-sm">
                        <span className="inline-flex h-2 w-2 rounded-full bg-gold" aria-hidden />
                        <span>Miembros obtienen 20% de descuento</span>
                    </div>
                </div>
            </div>

            {/* Hairline inferior */}
            <div
                aria-hidden
                className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent"
            />
        </section>
    );
};

export default AcompanamientosPreview;
