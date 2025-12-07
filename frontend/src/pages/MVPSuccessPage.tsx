// MVP Success Page - After Stripe payment
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GenericNav from '../components/shared/GenericNav';
import SectionHeader from '../components/ui/SectionHeader';
import ButtonLink from '../components/ui/ButtonLink';
import { FiCheckCircle, FiMail, FiCalendar } from 'react-icons/fi';
import { areas, leftLinks, rightLinks, acercaLinks } from '../data/navLinks';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const MVPSuccessPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [processing, setProcessing] = useState(true);
    const [error, setError] = useState('');
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (!sessionId) {
            setError('No se encontró información de la compra');
            setProcessing(false);
            return;
        }

        // Process the successful purchase
        const processPurchase = async () => {
            try {
                const response = await fetch(`${API_URL}/api/mvp/purchase-success`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ sessionId }),
                });

                if (!response.ok) {
                    throw new Error('Error al procesar la compra');
                }

                setProcessing(false);
            } catch (err: any) {
                console.error('Error:', err);
                setError(err.message || 'Ocurrió un error al procesar tu compra');
                setProcessing(false);
            }
        };

        processPurchase();
    }, [sessionId]);

    if (processing) {
        return (
            <div className="min-h-screen bg-linen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-asparagus mx-auto mb-4"></div>
                    <p className="text-raw/70 font-degular">Procesando tu compra...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-linen flex flex-col">
                <GenericNav
                    title="Dharma en Ruta"
                    logoSrc="/img/Logos/Logos-08.png"
                    leftLinks={leftLinks}
                    rightLinks={rightLinks}
                    areas={areas}
                    acercaLinks={acercaLinks}
                    variant="transparent"
                />
                <div className="flex-1 flex items-center justify-center px-4">
                    <div className="max-w-md text-center">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h1 className="font-gotu text-2xl text-raw mb-4">Algo salió mal</h1>
                        <p className="text-raw/70 font-degular mb-6">{error}</p>
                        <ButtonLink to="/" variant="primary">
                            Volver al inicio
                        </ButtonLink>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linen flex flex-col">
            <Helmet>
                <title>¡Compra Exitosa! | Dharma en Ruta</title>
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
            />

            <main className="flex-1">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                            <FiCheckCircle className="w-10 h-10 text-green-600" />
                        </div>

                        <SectionHeader
                            title="¡Pago Exitoso!"
                            subtitle="Bienvenido a Dharma en Ruta. Tu acceso anticipado está listo."
                            align="center"
                        />
                    </div>

                    {/* Next Steps */}
                    <div className="bg-white rounded-3xl border border-raw/10 shadow-sm p-6 sm:p-8 mb-8">
                        <h2 className="font-gotu text-2xl text-raw mb-6">Próximos pasos</h2>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-asparagus/10 flex items-center justify-center">
                                        <FiMail className="w-5 h-5 text-asparagus" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-gotu text-lg text-raw mb-1">1. Revisa tu email</h3>
                                    <p className="text-sm text-raw/70 font-degular">
                                        Te hemos enviado un email con el enlace al Test Rueda de la Vida y tu PDF personalizado.
                                        También encontrarás las instrucciones para crear tu cuenta.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-asparagus/10 flex items-center justify-center">
                                        <span className="text-asparagus font-gotu">2</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-gotu text-lg text-raw mb-1">2. Crea tu cuenta</h3>
                                    <p className="text-sm text-raw/70 font-degular mb-3">
                                        Configura tu contraseña para acceder a la plataforma y explorar el contenido anticipado.
                                    </p>
                                    <ButtonLink
                                        to="/mvp/create-account"
                                        variant="primary"
                                        size="sm"
                                    >
                                        Crear mi cuenta ahora
                                    </ButtonLink>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-asparagus/10 flex items-center justify-center">
                                        <FiCalendar className="w-5 h-5 text-asparagus" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-gotu text-lg text-raw mb-1">3. Marca tu calendario</h3>
                                    <p className="text-sm text-raw/70 font-degular">
                                        El <strong>21 de marzo de 2026</strong> se activará automáticamente tu membresía completa
                                        con 20% de descuento. Recibirás recordatorios por email.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* What's Included */}
                    <div className="bg-gradient-to-br from-asparagus/5 to-raw/5 rounded-2xl border border-asparagus/20 p-6 mb-8">
                        <h3 className="font-gotu text-xl text-raw mb-4">Qué incluye tu acceso</h3>
                        <ul className="space-y-2 text-sm text-raw/80 font-degular">
                            <li className="flex gap-2">
                                <span className="text-asparagus">✓</span>
                                Test Rueda de la Vida completo
                            </li>
                            <li className="flex gap-2">
                                <span className="text-asparagus">✓</span>
                                PDF personalizado con análisis detallado
                            </li>
                            <li className="flex gap-2">
                                <span className="text-asparagus">✓</span>
                                Acceso anticipado a la plataforma (1-21 marzo)
                            </li>
                            <li className="flex gap-2">
                                <span className="text-asparagus">✓</span>
                                20% descuento permanente en tu membresía
                            </li>
                            <li className="flex gap-2">
                                <span className="text-asparagus">✓</span>
                                Activación automática el 21 de marzo
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="text-center text-sm text-raw/60 font-degular">
                        <p>
                            ¿Necesitas ayuda? Escríbenos a{' '}
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

export default MVPSuccessPage;
