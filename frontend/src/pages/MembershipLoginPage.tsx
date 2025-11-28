// src/pages/MembershipLoginPage.tsx
import React, { useState, useRef, FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import GenericNav from "../components/shared/GenericNav";
import SectionHeader from "../components/ui/SectionHeader";
import ButtonLink from "../components/ui/ButtonLink";
import Input from "../components/ui/Input";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { areas, leftLinks, rightLinks, acercaLinks } from "../data/navLinks";

type LoginFormValues = {
    email: string;
    password: string;
};

type FormStatus = "idle" | "submitting" | "success" | "error";

type FieldErrors = Partial<Record<keyof LoginFormValues, string>>;

function validateField(
    field: keyof LoginFormValues,
    values: LoginFormValues
): string | undefined {
    const trimmedEmail = values.email.trim();

    switch (field) {
        case "email": {
            if (!trimmedEmail) {
                return "El email es obligatorio.";
            }
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
            if (!emailPattern.test(trimmedEmail)) {
                return "Introduce un email válido.";
            }
            return undefined;
        }

        case "password": {
            if (!values.password) {
                return "La contraseña es obligatoria.";
            }
            if (values.password.length < 8) {
                return "La contraseña debe tener al menos 8 caracteres.";
            }
            return undefined;
        }

        default:
            return undefined;
    }
}

function validate(values: LoginFormValues): FieldErrors {
    const errors: FieldErrors = {};

    (Object.keys(values) as (keyof LoginFormValues)[]).forEach((field) => {
        const error = validateField(field, values);
        if (error) {
            errors[field] = error;
        }
    });

    return errors;
}

const MembershipLoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [values, setValues] = useState<LoginFormValues>({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<FieldErrors>({});
    const [status, setStatus] = useState<FormStatus>("idle");
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const emailInputRef = useRef<HTMLInputElement | null>(null);
    const passwordInputRef = useRef<HTMLInputElement | null>(null);

    const handleFocusFirstError = (fieldErrors: FieldErrors): void => {
        if (fieldErrors.email && emailInputRef.current) {
            emailInputRef.current.focus();
            return;
        }
        if (fieldErrors.password && passwordInputRef.current) {
            passwordInputRef.current.focus();
        }
    };

    const handleChange =
        (field: keyof LoginFormValues) =>
            (event: React.ChangeEvent<HTMLInputElement>): void => {
                const value = event.target.value;

                setValues((prev) => ({
                    ...prev,
                    [field]: value,
                }));

                if (errors[field]) {
                    setErrors((prev) => ({
                        ...prev,
                        [field]: undefined,
                    }));
                }
            };

    const handleBlur = (field: keyof LoginFormValues) => (): void => {
        const error = validateField(field, values);
        setErrors((prev) => ({
            ...prev,
            [field]: error,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        setStatus("idle");
        setGeneralError(null);
        setSuccessMessage(null);

        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            handleFocusFirstError(validationErrors);
            return;
        }

        setStatus("submitting");

        try {
            await login(values.email, values.password);

            // Éxito
            setStatus("success");
            setSuccessMessage(
                "Has iniciado sesión correctamente. Redirigiendo a tu panel..."
            );

            // Redirigir tras breve pausa o inmediatamente
            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);
        } catch (error: any) {
            setStatus("error");
            setGeneralError(
                error.message || "Ha ocurrido un error al iniciar sesión. Por favor, inténtalo de nuevo."
            );
        }
    };

    const isSubmitting = status === "submitting";

    // SEO - noindex para formularios de login
    const seoTitle = "Iniciar Sesión | Dharma en Ruta";
    const seoDesc =
        "Accede a tu cuenta de Dharma en Ruta para continuar con tus cursos y acompañamientos.";
    const canonical = "https://dharmaenruta.com/login";

    return (
        <div className="min-h-screen bg-linen flex flex-col">
            <Helmet>
                <title>{seoTitle}</title>
                <meta name="description" content={seoDesc} />
                <link rel="canonical" href={canonical} />
                {/* noindex para evitar indexación de formularios */}
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
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
                    <div className="mb-6 sm:mb-8">
                        <SectionHeader
                            eyebrow="Membresía Dharma en Ruta"
                            title="Inicia sesión en tu cuenta"
                            subtitle="Accede a tu espacio personal para continuar con tus cursos, acompañamientos y recursos de la escuela nómada."
                            align="left"
                        />
                    </div>

                    {/* Panel conjunto texto + formulario */}
                    <div className="rounded-3xl bg-white/60 border border-raw/10 shadow-sm">
                        <div className="grid gap-y-8 gap-x-8 lg:gap-x-12 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 md:grid-cols-2 md:items-stretch">
                            {/* Columna izquierda: contexto y beneficios */}
                            <section
                                aria-label="Información sobre la membresía"
                                className="space-y-4 sm:space-y-5 flex flex-col justify-between"
                            >
                                <div className="space-y-4 sm:space-y-5">
                                    <p className="text-sm sm:text-base text-raw/80 font-degular leading-relaxed max-w-xl">
                                        Tu cuenta de Dharma en Ruta te da acceso a todos los contenidos,
                                        sesiones y recursos que necesitas para vivir de forma más consciente
                                        y en coherencia con lo que realmente quieres.
                                    </p>

                                    <ul className="space-y-3 text-sm sm:text-base text-raw/85 font-degular">
                                        <li className="flex gap-2">
                                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-asparagus flex-shrink-0" />
                                            <span>
                                                Continúa con tus cursos y acompañamientos donde los dejaste.
                                            </span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-asparagus flex-shrink-0" />
                                            <span>
                                                Accede a nuevos contenidos y actualizaciones periódicas.
                                            </span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-asparagus flex-shrink-0" />
                                            <span>
                                                Gestiona tu suscripción y preferencias desde tu panel personal.
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                <p className="text-xs sm:text-sm text-raw/70 font-degular max-w-md">
                                    ¿Aún no tienes cuenta?{" "}
                                    <Link
                                        to="/registro"
                                        className="underline underline-offset-2 decoration-raw/40 hover:decoration-asparagus font-medium"
                                    >
                                        Regístrate aquí
                                    </Link>{" "}
                                    para empezar tu viaje con Dharma en Ruta.
                                </p>
                            </section>

                            {/* Columna derecha: formulario */}
                            <section aria-label="Formulario de inicio de sesión" className="flex">
                                <form
                                    onSubmit={handleSubmit}
                                    noValidate
                                    aria-describedby={
                                        status === "error" && generalError
                                            ? "login-general-error"
                                            : status === "success" && successMessage
                                                ? "login-success-message"
                                                : undefined
                                    }
                                    aria-busy={isSubmitting}
                                    className="w-full bg-white/95 border border-raw/10 rounded-2xl shadow-sm px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6 flex flex-col"
                                >
                                    <div className="mb-3.5 sm:mb-4">
                                        <h2 className="text-lg sm:text-xl font-gotu text-raw tracking-tight">
                                            Accede a tu cuenta
                                        </h2>
                                        <p className="mt-1 text-xs sm:text-sm text-raw/70 font-degular">
                                            Introduce tu email y contraseña para continuar.
                                        </p>
                                    </div>

                                    {/* Mensaje de éxito */}
                                    {status === "success" && successMessage && (
                                        <div
                                            id="login-success-message"
                                            role="status"
                                            className="mb-3.5 flex items-start gap-2 rounded-lg border border-emerald-100 bg-emerald-50/80 px-3 py-2 text-xs sm:text-sm text-emerald-900 font-degular"
                                        >
                                            <FiCheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                            <p>{successMessage}</p>
                                        </div>
                                    )}

                                    {/* Mensaje de error general */}
                                    {status === "error" && generalError && (
                                        <div
                                            id="login-general-error"
                                            role="alert"
                                            className="mb-3.5 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50/80 px-3 py-2 text-xs sm:text-sm text-red-900 font-degular"
                                        >
                                            <FiAlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                            <p>{generalError}</p>
                                        </div>
                                    )}

                                    {/* Campos del formulario */}
                                    <div className="space-y-3.5 sm:space-y-4">
                                        {/* Email */}
                                        <div>
                                            <Input
                                                ref={emailInputRef}
                                                name="email"
                                                type="email"
                                                label="Email"
                                                value={values.email}
                                                onChange={handleChange("email")}
                                                onBlur={handleBlur("email")}
                                                autoComplete="email"
                                                error={errors.email}
                                                variant="leadmagnet"
                                                className="w-full"
                                                placeholder="tucorreo@ejemplo.com"
                                            />
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <Input
                                                ref={passwordInputRef}
                                                name="password"
                                                type="password"
                                                label="Contraseña"
                                                value={values.password}
                                                onChange={handleChange("password")}
                                                onBlur={handleBlur("password")}
                                                autoComplete="current-password"
                                                error={errors.password}
                                                variant="leadmagnet"
                                                className="w-full"
                                                placeholder="Tu contraseña"
                                            />
                                            <p className="mt-1 text-[11px] sm:text-xs text-raw/50 font-degular text-right">
                                                <button
                                                    type="button"
                                                    className="underline underline-offset-2 decoration-raw/30 hover:decoration-asparagus"
                                                    onClick={() => {
                                                        // Placeholder: en producción, redirigir a /recuperar-password
                                                        alert(
                                                            "Funcionalidad de recuperación de contraseña próximamente disponible."
                                                        );
                                                    }}
                                                >
                                                    ¿Olvidaste tu contraseña?
                                                </button>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Botón de submit + link a registro */}
                                    <div className="mt-4 sm:mt-5 space-y-2">
                                        <ButtonLink
                                            as="button"
                                            type="submit"
                                            onClick={() => {
                                                // El submit real lo maneja el onSubmit del <form>
                                            }}
                                            variant="primary"
                                            size="sm"
                                            fullWidth
                                            loading={isSubmitting}
                                            className="rounded-xl text-sm sm:text-base font-degular"
                                            aria-label="Iniciar sesión en Dharma en Ruta"
                                        >
                                            Iniciar sesión
                                        </ButtonLink>

                                        <p className="text-[11px] sm:text-xs text-raw/55 font-degular text-center">
                                            ¿No tienes cuenta?{" "}
                                            <Link
                                                to="/registro"
                                                className="underline underline-offset-2 decoration-raw/40 hover:decoration-asparagus font-medium"
                                            >
                                                Regístrate aquí
                                            </Link>
                                        </p>
                                    </div>
                                </form>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MembershipLoginPage;
