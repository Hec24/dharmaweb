// src/pages/TestRuedaVidaPage.tsx
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { FiCheckCircle, FiDownload, FiBarChart2, FiMail } from "react-icons/fi";
import ButtonLink from "../components/ui/ButtonLink";
import GenericNav from "../components/shared/GenericNav";
import Footer from "../components/shared/Footer";
import { leftLinks, rightLinks, areas, acercaLinks } from "../data/navLinks";

const TestRuedaVidaPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handlePurchase = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
            const response = await fetch(`${BACKEND_URL}/api/pagos/checkout-session-test`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error("Error al crear la sesión de pago");
            }

            const { url } = await response.json();
            window.location.href = url;
        } catch (err) {
            setError("Hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo.");
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Test de la Rueda de Vida + Libro de Ejercicios | Dharma en Ruta</title>
                <meta
                    name="description"
                    content="Descubre tu punto de partida con nuestro Test de la Rueda de Vida. Incluye libro digital con más de 50 páginas de ejercicios prácticos. Solo 14,90€."
                />
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

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-asparragus/5 via-linen to-gold/5 pt-32 pb-16 md:pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="inline-block px-4 py-1.5 bg-gold/20 text-raw rounded-full text-sm font-medium mb-4">
                            Descubre tu punto de partida
                        </span>
                        <h1 className="font-gotu text-3xl sm:text-4xl md:text-5xl text-asparragus mb-4">
                            Test de la Rueda de Vida + Libro de Ejercicios
                        </h1>
                        <p className="font-degular text-lg md:text-xl text-asparragus/80 leading-relaxed">
                            Identifica en qué áreas de tu vida necesitas más atención y recibe un libro personalizado
                            con ejercicios prácticos para trabajar en ellas.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="bg-linen py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">

                        {/* Mockup del libro */}
                        <div className="order-2 md:order-1">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src="/img/test-rueda-mockup.png"
                                    alt="Libro de ejercicios personalizado de la Rueda de Vida"
                                    className="w-full h-auto"
                                    loading="eager"
                                />
                                <div
                                    aria-hidden
                                    className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"
                                />
                            </div>
                        </div>

                        {/* Beneficios + Formulario de compra */}
                        <div className="order-1 md:order-2 space-y-8">
                            <div>
                                <h2 className="font-gotu text-2xl md:text-3xl text-asparragus mb-6">
                                    ¿Qué incluye?
                                </h2>

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
                            </div>

                            {/* Card de compra */}
                            <div className="bg-white/80 backdrop-blur border border-raw/10 rounded-2xl p-6 shadow-lg">
                                <div className="flex items-baseline gap-3 mb-4">
                                    <span className="text-4xl md:text-5xl font-gotu text-raw">14,90€</span>
                                    <span className="text-sm text-raw/60 line-through">29,90€</span>
                                    <span className="ml-auto bg-gold/20 text-raw px-2 py-1 rounded text-xs font-medium">
                                        -50%
                                    </span>
                                </div>

                                <form onSubmit={handlePurchase} className="space-y-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-asparragus mb-2">
                                            Tu email
                                        </label>
                                        <div className="relative">
                                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-asparragus/60 h-5 w-5" />
                                            <input
                                                type="email"
                                                id="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                placeholder="tu@email.com"
                                                className="w-full pl-10 pr-4 py-3 border border-raw/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-asparragus/50 focus:border-asparragus"
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                                            {error}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-asparragus text-white py-3 px-6 rounded-lg font-medium hover:bg-asparragus/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "Procesando..." : "Comprar ahora"}
                                    </button>

                                    <p className="text-xs text-raw/60 text-center leading-relaxed">
                                        Pago único. Acceso inmediato tras la compra. PDF descargable e imprimible.
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA a membresía */}
            <section className="bg-raw py-12 md:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <h3 className="font-gotu text-2xl md:text-3xl text-linen mb-4">
                        ¿Quieres profundizar más?
                    </h3>
                    <p className="font-degular text-linen/90 mb-6 max-w-2xl mx-auto">
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
            </section>

            <Footer />
        </>
    );
};

export default TestRuedaVidaPage;
