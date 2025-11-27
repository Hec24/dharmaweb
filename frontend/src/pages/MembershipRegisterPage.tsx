// src/Components/pages/MembershipRegisterPage.tsx
import React, { useState, useRef, FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import GenericNav from "../Components/shared/GenericNav";
import SectionHeader from "../Components/ui/SectionHeader";
import ButtonLink from "../Components/ui/ButtonLink";
import Input from "../Components/ui/Input";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { areas, leftLinks, rightLinks, acercaLinks } from "../data/navLinks";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  message: string;
  acceptsTerms: boolean;
};

type FormStatus = "idle" | "submitting" | "success" | "error";

type FieldErrors = Partial<Record<keyof RegisterFormValues, string>>;

/* // TODO: integrar con MailerLite
async function subscribeUserToMailerLite(_email: string): Promise<void> {
  // Esta función se implementará en el backend o en una integración específica más adelante.
  return Promise.resolve();
} */

function validateField(
  field: keyof RegisterFormValues,
  values: RegisterFormValues
): string | undefined {
  const trimmedName = values.name.trim();
  const trimmedEmail = values.email.trim();
  const trimmedMessage = values.message.trim();

  switch (field) {
    case "name": {
      if (!trimmedName) {
        return "El nombre es obligatorio.";
      }
      if (trimmedName.length < 2) {
        return "Introduce al menos 2 caracteres.";
      }
      return undefined;
    }

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

    case "confirmPassword": {
      if (!values.confirmPassword) {
        return "Por favor, repite la contraseña.";
      }
      if (values.confirmPassword !== values.password) {
        return "Las contraseñas no coinciden.";
      }
      return undefined;
    }

    case "acceptsTerms": {
      if (!values.acceptsTerms) {
        return "Debes aceptar las condiciones para continuar.";
      }
      return undefined;
    }

    case "message": {
      // Opcional: sin validación estricta
      if (trimmedMessage.length > 500) {
        return "El mensaje es demasiado largo.";
      }
      return undefined;
    }

    default:
      return undefined;
  }
}

function validate(values: RegisterFormValues): FieldErrors {
  const errors: FieldErrors = {};

  (Object.keys(values) as (keyof RegisterFormValues)[]).forEach((field) => {
    const error = validateField(field, values);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
}

const MembershipRegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState<RegisterFormValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    message: "",
    acceptsTerms: false,
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement | null>(null);
  const messageTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const termsCheckboxRef = useRef<HTMLInputElement | null>(null);

  const handleFocusFirstError = (fieldErrors: FieldErrors): void => {
    if (fieldErrors.name && nameInputRef.current) {
      nameInputRef.current.focus();
      return;
    }
    if (fieldErrors.email && emailInputRef.current) {
      emailInputRef.current.focus();
      return;
    }
    if (fieldErrors.password && passwordInputRef.current) {
      passwordInputRef.current.focus();
      return;
    }
    if (fieldErrors.confirmPassword && confirmPasswordInputRef.current) {
      confirmPasswordInputRef.current.focus();
      return;
    }
    if (fieldErrors.message && messageTextareaRef.current) {
      messageTextareaRef.current.focus();
      return;
    }
    if (fieldErrors.acceptsTerms && termsCheckboxRef.current) {
      termsCheckboxRef.current.focus();
    }
  };

  const handleChange =
    (field: keyof RegisterFormValues) =>
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const value =
          field === "acceptsTerms"
            ? (event as React.ChangeEvent<HTMLInputElement>).target.checked
            : event.target.value;

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

  const handleBlur =
    (field: keyof RegisterFormValues) =>
      (): void => {
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
      // Separar nombre y apellidos
      const nameParts = values.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || 'Usuario'; // Fallback si no hay apellido

      await register(values.email, values.password, firstName, lastName);

      setStatus("success");
      setSuccessMessage(
        "Hemos recibido tu registro. Redirigiendo a tu panel..."
      );

      setValues({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        message: "",
        acceptsTerms: false,
      });
      setErrors({});

      // Redirigir tras breve pausa
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (error: any) {
      setStatus("error");
      setGeneralError(
        error.message || "Ha ocurrido un error al registrar tu cuenta. Por favor, inténtalo de nuevo."
      );
    }
  };

  const isSubmitting = status === "submitting";

  // SEO - noindex para formularios de registro
  const seoTitle = "Registro de Membresía | Dharma en Ruta";
  const seoDesc =
    "Crea tu cuenta en Dharma en Ruta y accede a cursos, acompañamientos y recursos para vivir de forma más consciente.";
  const canonical = "https://dharmaenruta.com/registro";

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
              title="Registra tu cuenta y únete al viaje"
              subtitle="Crea tu acceso para formar parte de la escuela nómada de Dharma en Ruta. Podrás profundizar en las áreas que necesitas ahora mismo, a tu ritmo y con acompañamiento."
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
                    La membresía de Dharma en Ruta reúne cursos, sesiones y recursos prácticos
                    para que puedas vivir de forma más consciente, en coherencia con lo que
                    quieres y acompañada en el proceso.
                  </p>

                  <ul className="space-y-3 text-sm sm:text-base text-raw/85 font-degular">
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-asparagus flex-shrink-0" />
                      <span>
                        Acceso a contenidos estructurados por áreas (autoconocimiento, finanzas,
                        bienestar, relaciones y más).
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-asparagus flex-shrink-0" />
                      <span>
                        Acompañamiento de profesionales invitados de diferentes disciplinas para
                        profundizar en tu proceso.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-asparagus flex-shrink-0" />
                      <span>
                        Actualizaciones periódicas y espacios de práctica para integrar lo que
                        aprendes en tu día a día.
                      </span>
                    </li>
                  </ul>
                </div>

                <p className="text-xs sm:text-sm text-raw/70 font-degular max-w-md">
                  Completa el formulario para crear tu cuenta. Más adelante, podrás elegir el plan
                  de suscripción que mejor encaje contigo.
                </p>
              </section>

              {/* Columna derecha: formulario, en card horizontal/compacta */}
              <section
                aria-label="Formulario de registro"
                className="flex"
              >
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  aria-describedby={
                    status === "error" && generalError
                      ? "register-general-error"
                      : status === "success" && successMessage
                        ? "register-success-message"
                        : undefined
                  }
                  aria-busy={isSubmitting}
                  className="w-full bg-white/95 border border-raw/10 rounded-2xl shadow-sm px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6 flex flex-col"
                >
                  <div className="mb-3.5 sm:mb-4">
                    <h2 className="text-lg sm:text-xl font-gotu text-raw tracking-tight">
                      Crea tu acceso
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-raw/70 font-degular">
                      Son solo unos datos básicos para poder activar tu cuenta dentro de la
                      plataforma.
                    </p>
                  </div>

                  {/* Mensaje de éxito */}
                  {status === "success" && successMessage && (
                    <div
                      id="register-success-message"
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
                      id="register-general-error"
                      role="alert"
                      className="mb-3.5 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50/80 px-3 py-2 text-xs sm:text-sm text-red-900 font-degular"
                    >
                      <FiAlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <p>{generalError}</p>
                    </div>
                  )}

                  {/* Campos en layout más horizontal en desktop */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                    {/* Nombre */}
                    <div>
                      <Input
                        ref={nameInputRef}
                        name="name"
                        type="text"
                        label="Nombre completo"
                        value={values.name}
                        onChange={handleChange("name")}
                        onBlur={handleBlur("name")}
                        autoComplete="name"
                        error={errors.name}
                        variant="leadmagnet"
                        className="w-full"
                        placeholder="Escribe tu nombre"
                      />
                    </div>

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
                        autoComplete="new-password"
                        error={errors.password}
                        variant="leadmagnet"
                        className="w-full"
                        placeholder="Mínimo 8 caracteres"
                      />
                      <p className="mt-1 text-[11px] sm:text-xs text-raw/50 font-degular">
                        Mínimo 8 caracteres. Te recomendamos combinar letras, números y símbolos.
                      </p>
                    </div>

                    {/* Confirmación password */}
                    <div>
                      <Input
                        ref={confirmPasswordInputRef}
                        name="confirmPassword"
                        type="password"
                        label="Repite la contraseña"
                        value={values.confirmPassword}
                        onChange={handleChange("confirmPassword")}
                        onBlur={handleBlur("confirmPassword")}
                        autoComplete="new-password"
                        error={errors.confirmPassword}
                        variant="leadmagnet"
                        className="w-full"
                        placeholder="Vuelve a escribirla"
                      />
                    </div>

                    {/* Mensaje opcional: ocupa todo el ancho */}
                    <div className="md:col-span-2">
                      <label
                        htmlFor="register-message"
                        className="block text-xs sm:text-sm font-degular text-raw/80 mb-1"
                      >
                        ¿Qué estás buscando en Dharma en Ruta?{" "}
                        <span className="text-raw/50">(opcional)</span>
                      </label>
                      <textarea
                        id="register-message"
                        name="message"
                        ref={messageTextareaRef}
                        rows={3}
                        className="block w-full rounded-lg border border-raw/20 bg-white px-3 py-2 text-sm sm:text-base font-degular text-raw placeholder:text-raw/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-asparagus focus-visible:ring-offset-2 focus-visible:ring-offset-linen resize-none"
                        value={values.message}
                        onChange={handleChange("message")}
                        onBlur={handleBlur("message")}
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={errors.message ? "register-message-error" : undefined}
                      />
                      {errors.message && (
                        <p
                          id="register-message-error"
                          className="mt-1 text-xs text-red-700 font-degular"
                        >
                          {errors.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Aceptación de términos + botón, más compactos */}
                  <div className="mt-4 sm:mt-5 space-y-3">
                    <div>
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          ref={termsCheckboxRef}
                          id="register-accepts-terms"
                          name="acceptsTerms"
                          type="checkbox"
                          className="mt-0.5 h-4 w-4 rounded border-raw/30 text-asparagus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-asparagus focus-visible:ring-offset-2 focus-visible:ring-offset-linen"
                          checked={values.acceptsTerms}
                          onChange={handleChange("acceptsTerms")}
                          onBlur={handleBlur("acceptsTerms")}
                          aria-invalid={Boolean(errors.acceptsTerms)}
                          aria-describedby={
                            errors.acceptsTerms ? "register-accepts-terms-error" : undefined
                          }
                        />
                        <span className="text-xs sm:text-sm text-raw/75 font-degular">
                          He leído y acepto los{" "}
                          <a
                            href="/legal/terminos"
                            className="underline underline-offset-2 decoration-raw/40 hover:decoration-asparagus"
                          >
                            términos y condiciones
                          </a>{" "}
                          y la{" "}
                          <a
                            href="/legal/privacidad"
                            className="underline underline-offset-2 decoration-raw/40 hover:decoration-asparagus"
                          >
                            política de privacidad
                          </a>
                          .
                        </span>
                      </label>
                      {errors.acceptsTerms && (
                        <p
                          id="register-accepts-terms-error"
                          className="mt-1 text-xs text-red-700 font-degular"
                        >
                          {errors.acceptsTerms}
                        </p>
                      )}
                    </div>

                    {/* Aquí se mantiene tu ButtonLink de submit como ya actualizamos antes */}
                    <div className="space-y-2">
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
                        aria-label="Registrarme en la membresía de Dharma en Ruta"
                      >
                        Registrarme en la membresía
                      </ButtonLink>

                      <p className="text-[11px] sm:text-xs text-raw/55 font-degular text-center">
                        Si ya tienes una cuenta, podrás iniciar sesión directamente cuando la
                        escuela esté activa.
                      </p>
                    </div>


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

export default MembershipRegisterPage;
