// MVP Purchase Page
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import GenericNav from '../components/shared/GenericNav';
import SectionHeader from '../components/ui/SectionHeader';
import ButtonLink from '../components/ui/ButtonLink';
import Input from '../components/ui/Input';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { areas, leftLinks, rightLinks, acercaLinks } from '../data/navLinks';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const MVPPurchasePage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);

    const validateEmail = (email: string) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('El email es obligatorio');
            return;
        }

        if (!validateEmail(email)) {
            setError('Por favor, introduce un email válido');
            return;
        }

        if (!acceptTerms) {
            setError('Debes aceptar los términos y condiciones');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/mvp/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.trim() }),
            });

            if (!response.ok) {
                throw new Error('Error al crear la sesión de pago');
            }

            const data = await response.json();

            // Redirect to Stripe Checkout
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No se recibió URL de pago');
            }
        } catch (err: any) {
            console.error('Error:', err);
            setError(err.message || 'Ocurrió un error. Por favor, inténtalo de nuevo.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linen flex flex-col">
            <Helmet>
                <title>Test Rueda de la Vida + Acceso Anticipado | Dharma en Ruta</title>
                <meta
                    name="description"
                    content="Obtén tu Test Rueda de la Vida personalizado y acceso anticipado a la membresía de Dharma en Ruta antes del lanzamiento oficial."
                />
                <meta name="robots" content="noindex, nofollow" />
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
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                    <div className="mb-8 sm:mb-12">
                        <SectionHeader
                            eyebrow="Oferta Exclusiva Pre-Lanzamiento"
                            title="Test Rueda de la Vida + Acceso Anticipado"
                            subtitle="Obtén tu test personalizado, PDF de resultados y acceso exclusivo a la membresía 20 días antes del lanzamiento oficial (1-21 marzo 2026)"
                            align="center"
                        />
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-white/60 rounded-2xl p-6 border border-raw/10">
                            <div className="text-3xl mb-3">📊</div>
                            <h3 className="font-gotu text-xl text-raw mb-2">Test Personalizado</h3>
                            <p className="text-sm text-raw/75 font-degular">
                                Evalúa las 8 áreas clave de tu vida y descubre dónde enfocar tu energía
                            </p>
                        </div>

                        <div className="bg-white/60 rounded-2xl p-6 border border-raw/10">
                            <div className="text-3xl mb-3">📄</div>
                            <h3 className="font-gotu text-xl text-raw mb-2">PDF de Resultados</h3>
                            <p className="text-sm text-raw/75 font-degular">
                                Informe detallado con análisis y recomendaciones personalizadas
                            </p>
                        </div>

                        <div className="bg-white/60 rounded-2xl p-6 border border-raw/10">
                            <div className="text-3xl mb-3">🎁</div>
                            <h3 className="font-gotu text-xl text-raw mb-2">Acceso Anticipado</h3>
                            <p className="text-sm text-raw/75 font-degular">
                                Explora la plataforma 20 días antes + 20% descuento en membresía
                            </p>
                        </div>
                    </div>

                    {/* Pricing Card */}
                    <div className="rounded-3xl bg-white border border-raw/10 shadow-sm overflow-hidden mb-8">
                        <div className="bg-gradient-to-r from-asparagus/10 to-raw/5 p-6 border-b border-raw/10">
                            <div className="flex items-baseline justify-center gap-2">
                                <span className="text-4xl font-gotu text-raw">€29</span>
                                <span className="text-raw/60 font-degular">pago único</span>
                            </div>
                            <p className="text-center text-sm text-raw/70 font-degular mt-2">
                                Incluye todo + acceso anticipado hasta el 21 de marzo
                            </p>
                        </div>

                        <div className="p-6 sm:p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="flex items-start gap-2 rounded-lg border border-red-100 bg-red-50/80 px-4 py-3 text-sm text-red-900 font-degular">
                                        <FiAlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                        <p>{error}</p>
                                    </div>
                                )}

                                <div>
                                    <Input
                                        name="email"
                                        type="email"
                                        label="Tu email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="tu@email.com"
                                        variant="leadmagnet"
                                        className="w-full"
                                        disabled={loading}
                                    />
                                    <p className="mt-2 text-xs text-raw/60 font-degular">
                                        Recibirás el test y las instrucciones de acceso en este email
                                    </p>
                                </div>

                                <div className="bg-asparagus/5 rounded-xl p-4 border border-asparagus/20">
                                    <h4 className="font-gotu text-raw mb-3 flex items-center gap-2">
                                        <FiCheckCircle className="text-asparagus" />
                                        Qué incluye
                                    </h4>
                                    <ul className="space-y-2 text-sm text-raw/80 font-degular">
                                        <li className="flex gap-2">
                                            <span className="text-asparagus">✓</span>
                                            Test Rueda de la Vida completo
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-asparagus">✓</span>
                                            PDF personalizado con resultados
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-asparagus">✓</span>
                                            Acceso anticipado (1-21 marzo 2026)
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-asparagus">✓</span>
                                            20% descuento en membresía
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-asparagus">✓</span>
                                            Activación automática el 21 de marzo
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200/50">
                                    <p className="text-sm text-amber-900 font-degular">
                                        <strong>Importante:</strong> El 21 de marzo de 2026 se activará automáticamente tu membresía
                                        con 20% de descuento. Podrás cancelar antes de esa fecha si lo deseas.
                                    </p>
                                </div>

                                <div>
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={acceptTerms}
                                            onChange={(e) => setAcceptTerms(e.target.checked)}
                                            className="mt-1 h-4 w-4 rounded border-raw/30 text-asparagus focus:ring-2 focus:ring-asparagus focus:ring-offset-2"
                                            disabled={loading}
                                        />
                                        <span className="text-sm text-raw/75 font-degular">
                                            Acepto los{' '}
                                            <a href="/legal/terminos" className="underline hover:text-asparagus">
                                                términos y condiciones
                                            </a>{' '}
                                            y entiendo que mi membresía se activará automáticamente el 21 de marzo de 2026 con un
                                            descuento del 20%. Puedo cancelar antes de esa fecha.
                                        </span>
                                    </label>
                                </div>

                                <ButtonLink
                                    as="button"
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    loading={loading}
                                    disabled={loading}
                                    className="text-base sm:text-lg"
                                    onClick={() => { }}
                                >
                                    {loading ? 'Procesando...' : 'Obtener Acceso Anticipado - €29'}
                                </ButtonLink>

                                <p className="text-center text-xs text-raw/50 font-degular">
                                    Pago seguro procesado por Stripe. Tus datos están protegidos.
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="text-center text-sm text-raw/70 font-degular space-y-2">
                        <p>
                            <strong>¿Preguntas?</strong> Escríbenos a{' '}
                            <a href="mailto:hola@dharmaenruta.com" className="underline hover:text-asparagus">
                                hola@dharmaenruta.com
                            </a>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MVPPurchasePage;
