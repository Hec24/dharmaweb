// MVP Create Account Page
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GenericNav from '../components/shared/GenericNav';
import SectionHeader from '../components/ui/SectionHeader';
import ButtonLink from '../components/ui/ButtonLink';
import Input from '../components/ui/Input';
import { FiAlertCircle } from 'react-icons/fi';
import { areas, leftLinks, rightLinks, acercaLinks } from '../data/navLinks';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const MVPCreateAccountPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        nombre: '',
        apellidos: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email.trim()) {
            newErrors.email = 'El email es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio';
        }

        if (!formData.apellidos.trim()) {
            newErrors.apellidos = 'Los apellidos son obligatorios';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria';
        } else if (formData.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Create account from MVP purchase
            const response = await fetch(`${API_URL}/api/mvp/create-account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email.trim(),
                    password: formData.password,
                    nombre: formData.nombre.trim(),
                    apellidos: formData.apellidos.trim(),
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al crear la cuenta');
            }

            // Auto-login after account creation
            await login(formData.email.trim(), formData.password);

            // Redirect to dashboard
            navigate('/dashboard');
        } catch (err: any) {
            console.error('Error:', err);
            setGeneralError(
                err.message || 'Ocurrió un error al crear tu cuenta. Por favor, inténtalo de nuevo.'
            );
            setLoading(false);
        }
    };

    const handleChange = (field: keyof typeof formData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <div className="min-h-screen bg-linen flex flex-col">
            <Helmet>
                <title>Crear Cuenta | Dharma en Ruta</title>
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
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                    <div className="mb-8">
                        <SectionHeader
                            eyebrow="Acceso Anticipado MVP"
                            title="Crea tu cuenta"
                            subtitle="Configura tu contraseña para acceder a la plataforma y comenzar tu viaje"
                            align="center"
                        />
                    </div>

                    <div className="bg-white rounded-3xl border border-raw/10 shadow-sm p-6 sm:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {generalError && (
                                <div className="flex items-start gap-2 rounded-lg border border-red-100 bg-red-50/80 px-4 py-3 text-sm text-red-900 font-degular">
                                    <FiAlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                    <p>{generalError}</p>
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-4">
                                <Input
                                    name="nombre"
                                    type="text"
                                    label="Nombre"
                                    value={formData.nombre}
                                    onChange={handleChange('nombre')}
                                    error={errors.nombre}
                                    variant="leadmagnet"
                                    placeholder="Tu nombre"
                                    disabled={loading}
                                />

                                <Input
                                    name="apellidos"
                                    type="text"
                                    label="Apellidos"
                                    value={formData.apellidos}
                                    onChange={handleChange('apellidos')}
                                    error={errors.apellidos}
                                    variant="leadmagnet"
                                    placeholder="Tus apellidos"
                                    disabled={loading}
                                />
                            </div>

                            <Input
                                name="email"
                                type="email"
                                label="Email"
                                value={formData.email}
                                onChange={handleChange('email')}
                                error={errors.email}
                                variant="leadmagnet"
                                placeholder="tu@email.com"
                                disabled={loading}
                            />
                            <p className="text-xs text-raw/60 font-degular -mt-4">
                                Usa el mismo email con el que compraste el MVP
                            </p>

                            <Input
                                name="password"
                                type="password"
                                label="Contraseña"
                                value={formData.password}
                                onChange={handleChange('password')}
                                error={errors.password}
                                variant="leadmagnet"
                                placeholder="Mínimo 8 caracteres"
                                disabled={loading}
                            />

                            <Input
                                name="confirmPassword"
                                type="password"
                                label="Confirmar contraseña"
                                value={formData.confirmPassword}
                                onChange={handleChange('confirmPassword')}
                                error={errors.confirmPassword}
                                variant="leadmagnet"
                                placeholder="Repite tu contraseña"
                                disabled={loading}
                            />

                            <div className="bg-asparagus/5 rounded-xl p-4 border border-asparagus/20">
                                <p className="text-sm text-raw/80 font-degular">
                                    <strong>Acceso anticipado activo hasta el 21 de marzo de 2026</strong>
                                    <br />
                                    Podrás explorar la plataforma y el contenido disponible. Tu membresía completa se
                                    activará automáticamente en esa fecha con 20% de descuento.
                                </p>
                            </div>

                            <ButtonLink
                                as="button"
                                type="submit"
                                variant="primary"
                                size="lg"
                                fullWidth
                                loading={loading}
                                disabled={loading}
                            >
                                {loading ? 'Creando cuenta...' : 'Crear cuenta y acceder'}
                            </ButtonLink>

                            <p className="text-center text-sm text-raw/60 font-degular">
                                ¿Ya tienes cuenta?{' '}
                                <a href="/login" className="underline hover:text-asparagus">
                                    Inicia sesión aquí
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MVPCreateAccountPage;
