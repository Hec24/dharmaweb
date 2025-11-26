// src/pages/TestConfirmacionPage.tsx
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FiCheckCircle, FiDownload, FiMail } from "react-icons/fi";
import ButtonLink from "../Components/ui/ButtonLink";
import GenericNav from "../Components/shared/GenericNav";
import Footer from "../Components/shared/Footer";
import { leftLinks, rightLinks, areas, acercaLinks } from "../data/navLinks";

const TestConfirmacionPage: React.FC = () => {
    const [sessionId, setSessionId] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("session_id");
        setSessionId(id);
    }, []);

    return (
        <>
            <Helmet>
                <title>¡Compra Confirmada! | Dharma en Ruta</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* Navigation */}
            <GenericNav
                title="Dharma en Ruta"
                logoSrc="/img/Logos/Logos-08.png"
                leftLinks={leftLinks}
                rightLinks={rightLinks}
                areas={areas}
                acercaLinks={acercaLinks}
                variant="solid"
                containerWidth="120rem"
                barWidth="110rem"
                innerPx="px-[min(6vw,3rem)]"
                barHeight="h-20"
            />

            {/* Success Message */}
            <section className="min-h-screen bg-gradient-to-br from-asparragus/5 via-linen to-gold/5 pt-32 pb-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    {/* Success Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
                        {/* Success Icon */}
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                            <FiCheckCircle className="w-8 h-8 text-green-600" />
                        </div>

                        <h1 className="font-gotu text-3xl md:text-4xl text-asparragus mb-4">
                            ¡Compra confirmada!
                        </h1>

                        <p className="font-degular text-lg text-asparragus/80 mb-8">
                            Gracias por tu compra. Tu Test de la Rueda de Vida está listo.
                        </p>

                        {/* Email Info */}
                        <div className="bg-gold/10 border border-gold/20 rounded-xl p-6 mb-8">
                            <div className="flex items-start gap-3 text-left">
                                <FiMail className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-asparragus mb-2">
                                        Revisa tu email
                                    </p>
                                    <p className="text-sm text-asparragus/80 leading-relaxed">
                                        Te hemos enviado un email a la dirección que proporcionaste con el enlace
                                        de descarga de tu PDF. Si no lo encuentras, revisa tu carpeta de spam.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Download Button */}
                        <div className="space-y-4 mb-8">
                            <a
                                href="/downloads/test-rueda-vida.pdf"
                                download
                                className="inline-flex items-center gap-2 bg-asparragus text-white px-6 py-3 rounded-lg font-medium hover:bg-asparragus/90 transition-colors"
                            >
                                <FiDownload className="w-5 h-5" />
                                <span>Descargar PDF ahora</span>
                            </a>
                            <p className="text-xs text-asparragus/60">
                                También puedes descargarlo desde el email que te hemos enviado
                            </p>
                        </div>

                        {/* What's included reminder */}
                        <div className="border-t border-asparragus/10 pt-8">
                            <h2 className="font-gotu text-xl text-asparragus mb-4">
                                Tu PDF incluye:
                            </h2>
                            <ul className="text-left space-y-2 max-w-md mx-auto text-sm text-asparragus/80">
                                <li className="flex items-start gap-2">
                                    <span className="text-gold mt-1">✓</span>
                                    <span>Test de autoevaluación de las 8 áreas de vida</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-gold mt-1">✓</span>
                                    <span>Plantilla para crear tu gráfico personalizado</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-gold mt-1">✓</span>
                                    <span>Más de 50 páginas de ejercicios prácticos</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-gold mt-1">✓</span>
                                    <span>Guía paso a paso para pasar a la acción</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* CTA to Membership */}
                    <div className="mt-12 bg-raw rounded-2xl p-8 text-center">
                        <h3 className="font-gotu text-2xl text-linen mb-3">
                            ¿Quieres profundizar más?
                        </h3>
                        <p className="font-degular text-linen/90 mb-6 max-w-xl mx-auto">
                            Descubre nuestra membresía con contenidos exclusivos, directos mensuales,
                            comunidad y acompañamiento personalizado.
                        </p>
                        <ButtonLink
                            to="/"
                            variant="secondary"
                            size="md"
                            className="bg-linen text-raw hover:bg-linen/90"
                        >
                            Conocer la membresía
                        </ButtonLink>
                    </div>

                    {/* Support */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-asparragus/60">
                            ¿Problemas con la descarga?{" "}
                            <a href="/contacto" className="text-asparragus hover:underline font-medium">
                                Contáctanos
                            </a>
                        </p>
                        {sessionId && (
                            <p className="text-xs text-asparragus/40 mt-2">
                                ID de sesión: {sessionId}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
};

export default TestConfirmacionPage;
