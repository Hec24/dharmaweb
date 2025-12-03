// src/Components/sections/TestRuedaVidaSection/TestRuedaVidaSection.tsx
import React from "react";
import { FiCheckCircle, FiDownload, FiBarChart2 } from "react-icons/fi";
import SectionHeader from "../../ui/SectionHeader";
import ButtonLink from "../../ui/ButtonLink";

const TestRuedaVidaSection: React.FC = () => {
    return (
        <section
            id="test-rueda-vida"
            className="relative bg-linen"
            aria-labelledby="test-heading"
        >
            {/* Escalón superior */}
            <div
                aria-hidden
                className="pointer-events-none absolute top-0 left-0 right-0 h-6 md:h-7 bg-gradient-to-b from-black/10 to-transparent"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <SectionHeader
                    id="test-heading"
                    eyebrow="Descubre tu punto de partida"
                    title="Test de la Rueda de Vida + Libro de Ejercicios"
                    subtitle="Identifica en qué áreas de tu vida necesitas más atención y recibe un libro personalizado con ejercicios prácticos para trabajar en ellas."
                    align="center"
                    size="custom"
                    color="asparragus"
                    titleClassName="text-2xl sm:text-3xl md:text-4xl mb-3"
                    subtitleClassName="text-asparragus/90 font-degular max-w-3xl text-[15px] sm:text-base md:text-[17px] leading-relaxed sm:mx-auto"
                />

                <div className="mt-10 grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Imagen/Mockup del libro */}
                    <div className="order-2 md:order-1">
                        <div className="relative rounded-2xl overflow-hidden shadow-xl">
                            <img
                                src="/img/test-rueda-mockup.png"
                                alt="Libro de ejercicios personalizado de la Rueda de Vida"
                                className="w-full h-auto"
                                loading="lazy"
                            />
                            <div
                                aria-hidden
                                className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"
                            />
                        </div>
                    </div>

                    {/* Beneficios + CTA */}
                    <div className="order-1 md:order-2 space-y-6">
                        <h3 className="font-gotu text-2xl md:text-3xl text-asparragus">
                            ¿Qué incluye?
                        </h3>

                        <ul className="space-y-4" role="list">
                            <li className="flex gap-3">
                                <FiBarChart2 className="text-gold flex-shrink-0 mt-1 h-5 w-5" aria-hidden />
                                <div>
                                    <p className="font-semibold text-asparragus text-sm md:text-base">
                                        Autoevaluación de las 8 áreas de vida
                                    </p>
                                    <p className="text-asparragus/80 text-sm">
                                        Plantillas sencillas para identificar tu nivel de satisfacción actual.
                                    </p>
                                </div>
                            </li>

                            <li className="flex gap-3">
                                <FiCheckCircle className="text-gold flex-shrink-0 mt-1 h-5 w-5" aria-hidden />
                                <div>
                                    <p className="font-semibold text-asparragus text-sm md:text-base">
                                        Mapa visual de tu momento presente
                                    </p>
                                    <p className="text-asparragus/80 text-sm">
                                        Dibuja tu propia Rueda de la Vida y visualiza dónde necesitas equilibrio.
                                    </p>
                                </div>
                            </li>

                            <li className="flex gap-3">
                                <FiDownload className="text-gold flex-shrink-0 mt-1 h-5 w-5" aria-hidden />
                                <div>
                                    <p className="font-semibold text-asparragus text-sm md:text-base">
                                        Libro de trabajo completo (PDF)
                                    </p>
                                    <p className="text-asparragus/80 text-sm">
                                        Más de 50 páginas con ejercicios de escritura, reflexión y práctica.
                                    </p>
                                </div>
                            </li>

                            <li className="flex gap-3">
                                <FiCheckCircle className="text-gold flex-shrink-0 mt-1 h-5 w-5" aria-hidden />
                                <div>
                                    <p className="font-semibold text-asparragus text-sm md:text-base">
                                        Guía paso a paso
                                    </p>
                                    <p className="text-asparragus/80 text-sm">
                                        Instrucciones claras para pasar de la reflexión a la acción real.
                                    </p>
                                </div>
                            </li>
                        </ul>

                        {/* Card de precio y CTA */}
                        <div className="bg-white/60 border border-raw/10 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-baseline gap-3 mb-4">
                                <span className="text-4xl md:text-5xl font-gotu text-raw">14,90€</span>
                                <span className="text-sm text-raw/60 line-through">29,90€</span>
                                <span className="ml-auto bg-gold/20 text-raw px-2 py-1 rounded text-xs font-medium">
                                    -50%
                                </span>
                            </div>

                            <ButtonLink
                                to="/test-rueda-vida"
                                variant="primary"
                                size="sm"
                                fullWidth
                                className="mb-3"
                                aria-label="Comprar Test de la Rueda de Vida personalizado"
                            >
                                Comprar mi Test Personalizado
                            </ButtonLink>

                            <p className="text-xs text-raw/60 text-center leading-relaxed">
                                Pago único. Acceso inmediato tras la compra. PDF descargable e imprimible.
                            </p>
                        </div>
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

export default TestRuedaVidaSection;
