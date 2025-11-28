// src/pages/ContactPage.tsx
import React, { useId, useState } from "react";
import { Link } from "react-router-dom";
import { FiSend } from "react-icons/fi";
import { Helmet } from "react-helmet-async";
import GenericNav from "../components/shared/GenericNav";
import SectionHeader from "../components/ui/SectionHeader";
import { areas, leftLinks, rightLinks, acercaLinks } from "../data/navLinks";

type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  accept: boolean;
};

const initialForm: ContactPayload = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  accept: false,
};

export default function ContactPage() {
  const [form, setForm] = useState<ContactPayload>(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // IDs accesibles estables
  const formId = useId();
  const nameId = `${formId}-name`;
  const emailId = `${formId}-email`;
  const phoneId = `${formId}-phone`;
  const subjectId = `${formId}-subject`;
  const messageId = `${formId}-message`;
  const acceptId = `${formId}-accept`;
  const errorBoxId = `${formId}-errors`;
  const successBoxId = `${formId}-success`;

  const onChange =
    (field: keyof ContactPayload) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.currentTarget.type === "checkbox"
          ? (e.currentTarget as HTMLInputElement).checked
          : e.currentTarget.value;
        setForm((f) => ({ ...f, [field]: value }));
      };

  const validate = (data: ContactPayload) => {
    if (!data.name.trim()) return "El nombre es obligatorio.";
    if (!data.email.trim()) return "El correo es obligatorio.";
    // email muy básico
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) return "El correo no parece válido.";
    if (!data.phone.trim()) return "El teléfono es obligatorio.";
    if (!data.message.trim()) return "Cuéntanos tu mensaje.";
    if (!data.accept) return "Debes aceptar la Política de Privacidad.";
    return "";
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const err = validate(form);
    if (err) {
      setErrorMsg(err);
      setStatus("error");
      return;
    }
    try {
      setStatus("sending");
      // Ajusta esta ruta a tu backend real:
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("No se pudo enviar el formulario.");
      setStatus("success");
      setForm(initialForm);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg((err as Error)?.message || "Ha ocurrido un error al enviar.");
    }
  };

  const isSubmitting = status === "sending";

  // SEO
  const seoTitle = "Contacto | Dharma en Ruta";
  const seoDesc =
    "¿Tienes dudas o quieres empezar tu camino con nosotros? Escríbenos y te respondemos. Estamos aquí para acompañarte en tu proceso de transformación.";
  const canonical = "https://dharmaenruta.com/contacto";
  const ogImage = "https://dharmaenruta.com/og/contacto.jpg";

  const CONTACT_PAGE_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: canonical,
    name: seoTitle,
    description: seoDesc,
    inLanguage: "es",
    isPartOf: { "@id": "https://dharmaenruta.com/#website" },
  };

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <link rel="canonical" href={canonical} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Dharma en Ruta" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDesc} />
        <meta name="twitter:image" content={ogImage} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(CONTACT_PAGE_SCHEMA)}
        </script>
      </Helmet>

      {/* NAV */}
      <header className="absolute inset-x-0 top-0 z-40">
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
      </header>

      {/* HERO — fondo similar a historia: imagen con overlay asparragus */}
      <section
        className="relative h-[38vh] md:h-[46vh] flex items-end overflow-hidden"
        aria-labelledby="contact-hero-title"
      >
        <img
          src="/img/Backgrounds/background5.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />
        <div className="absolute inset-0 bg-asparragus/65" aria-hidden />
        <div className="relative z-10 w-full px-6 pb-8 sm:pb-10 md:pb-12">
          <SectionHeader
            title={<span id="contact-hero-title">Hablemos</span>}
            subtitle="Cuéntanos qué necesitas y te respondemos"
            size="custom"
            color="white"
            align="left"
            titleClassName="font-gotu text-3xl sm:text-4xl md:text-5xl leading-tight mb-2"
            subtitleClassName="font-gotu text-linen/95 text-base sm:text-lg md:text-xl"
          />
        </div>
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/15 to-transparent"
        />
      </section>

      {/* CONTENIDO */}
      <main id="main" className="bg-linen font-degular text-raw">
        <section className="relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
            {/* Intro editorial/energética */}
            <div className="max-w-2xl">
              <h2 className="font-gotu text-asparragus text-lg md:text-xl mb-2">¡Hola! Estamos aquí para ti…</h2>
              <p className="text-sm md:text-base leading-relaxed text-raw/90">
                Déjanos en el formulario qué te trae por aquí: ¿quieres preguntar algo concreto, empezar
                a trabajar con algún curso, o quizá te llama una experiencia viajera? Cuéntanos un poco sobre ti y en qué
                punto estás. <span className="font-medium">Somos todo oídos.</span>
              </p>
            </div>

            {/* Mensajes de estado accesibles */}
            {status === "error" && (
              <div
                id={errorBoxId}
                role="alert"
                aria-live="assertive"
                className="mt-6 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                {errorMsg || "Revisa los campos marcados e inténtalo de nuevo."}
              </div>
            )}
            {status === "success" && (
              <div
                id={successBoxId}
                role="status"
                aria-live="polite"
                className="mt-6 rounded-md border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
              >
                ¡Gracias! Hemos recibido tu solicitud y te responderemos muy pronto.
              </div>
            )}

            {/* Formulario */}
            <form
              onSubmit={onSubmit}
              noValidate
              aria-describedby={`${status === "error" ? errorBoxId : ""} ${status === "success" ? successBoxId : ""}`.trim()}
              className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-12"
            >
              {/* Nombre */}
              <div className="md:col-span-6">
                <label htmlFor={nameId} className="block text-sm text-raw/90 mb-1">
                  Tu nombre <span className="text-raw/70">(obligatorio)</span>
                </label>
                <input
                  id={nameId}
                  name="name"
                  type="text"
                  inputMode="text"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={onChange("name")}
                  className="block w-full rounded-md border border-raw/20 bg-white px-3 py-2 text-base text-raw placeholder:text-raw/40 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                />
              </div>

              {/* Email */}
              <div className="md:col-span-6">
                <label htmlFor={emailId} className="block text-sm text-raw/90 mb-1">
                  Tu correo electrónico <span className="text-raw/70">(obligatorio)</span>
                </label>
                <input
                  id={emailId}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={onChange("email")}
                  className="block w-full rounded-md border border-raw/20 bg-white px-3 py-2 text-base text-raw placeholder:text-raw/40 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                />
              </div>

              {/* Teléfono */}
              <div className="md:col-span-6">
                <label htmlFor={phoneId} className="block text-sm text-raw/90 mb-1">
                  Un teléfono de contacto <span className="text-raw/70">(obligatorio)</span>
                </label>
                <input
                  id={phoneId}
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  value={form.phone}
                  onChange={onChange("phone")}
                  className="block w-full rounded-md border border-raw/20 bg-white px-3 py-2 text-base text-raw placeholder:text-raw/40 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                />
              </div>

              {/* Asunto */}
              <div className="md:col-span-6">
                <label htmlFor={subjectId} className="block text-sm text-raw/90 mb-1">
                  Asunto
                </label>
                <input
                  id={subjectId}
                  name="subject"
                  type="text"
                  inputMode="text"
                  value={form.subject}
                  onChange={onChange("subject")}
                  className="block w-full rounded-md border border-raw/20 bg-white px-3 py-2 text-base text-raw placeholder:text-raw/40 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                />
              </div>

              {/* Mensaje */}
              <div className="md:col-span-12">
                <label htmlFor={messageId} className="block text-sm text-raw/90 mb-1">
                  Tu mensaje <span className="text-raw/70">(cuéntanos en qué podemos ayudarte)</span>
                </label>
                <textarea
                  id={messageId}
                  name="message"
                  rows={6}
                  required
                  value={form.message}
                  onChange={onChange("message")}
                  className="block w-full rounded-md border border-raw/20 bg-white px-3 py-2 text-base text-raw placeholder:text-raw/40 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  placeholder="¿Quieres empezar un acompañamiento 1:1? ¿Te interesa un Yogui Viaje? ¿Otra consulta?"
                />
              </div>

              {/* Consentimiento */}
              <div className="md:col-span-12">
                <div className="flex items-start gap-3">
                  <input
                    id={acceptId}
                    name="accept"
                    type="checkbox"
                    checked={form.accept}
                    onChange={onChange("accept")}
                    className="mt-1 h-4 w-4 rounded border-raw/30 text-asparragus focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    aria-describedby={`${acceptId}-desc`}
                  />
                  <label htmlFor={acceptId} className="text-sm text-raw/90">
                    He leído y acepto la{" "}
                    <Link
                      to="/politica-privacidad"
                      className="underline underline-offset-2 decoration-asparragus hover:text-asparragus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
                      id={`${acceptId}-desc`}
                    >
                      Política de Privacidad
                    </Link>
                    .
                  </label>
                </div>
              </div>

              {/* CTA */}
              <div className="md:col-span-12">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex items-center gap-2 rounded-md bg-asparragus px-4 py-2 text-base font-medium text-linen shadow-sm transition-colors hover:bg-asparragus/90 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  <FiSend aria-hidden className="h-5 w-5" />
                  {status === "sending" ? "Enviando…" : "Enviar solicitud"}
                </button>
              </div>
            </form>

            {/* Cierre humano/energético */}
            <div className="mt-10 max-w-2xl text-sm md:text-base leading-relaxed text-raw/90">
              <p>
                Gracias por escribirnos. Si lo prefieres, también puedes hablar con el equipo por
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 underline underline-offset-2 decoration-asparragus hover:text-asparragus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
                  aria-label="Abrir WhatsApp en pestaña nueva"
                >
                  WhatsApp
                </a>
                . ¡Hasta pronto!
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
