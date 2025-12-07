// src/pages/TestimoniosPage.tsx
import React, { useId, useState } from "react";
import { Link } from "react-router-dom";
import { FiSend, FiStar } from "react-icons/fi";
import { Helmet } from "react-helmet-async";
import GenericNav from "../components/shared/GenericNav";
import SectionHeader from "../components/ui/SectionHeader";
import ButtonLink from "../components/ui/ButtonLink";
import TestimonialsCarousel from "../components/sections/Testimonios/TestimonialsCarousel";
import { areas, leftLinks, rightLinks, acercaLinks } from "../data/navLinks";
import { programFilters } from "../data/testimonios";

type TestimonialPayload = {
  name: string;
  email: string;
  program: string;
  rating: number;
  message: string;
  accept: boolean;
};

const initialForm: TestimonialPayload = {
  name: "",
  email: "",
  program: "General",
  rating: 5,
  message: "",
  accept: false,
};

export default function TestimoniosPage() {
  const [form, setForm] = useState<TestimonialPayload>(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // IDs accesibles
  const pageId = useId();
  const nameId = `${pageId}-name`;
  const emailId = `${pageId}-email`;
  const programId = `${pageId}-program`;
  const ratingId = `${pageId}-rating`;
  const messageId = `${pageId}-message`;
  const acceptId = `${pageId}-accept`;
  const errorBoxId = `${pageId}-errors`;
  const successBoxId = `${pageId}-success`;

  const onChange =
    (field: keyof TestimonialPayload) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value =
          e.currentTarget.type === "checkbox"
            ? (e.currentTarget as HTMLInputElement).checked
            : e.currentTarget.value;
        setForm((f) => ({
          ...f,
          [field]: field === "rating" ? Number(value) : value,
        }));
      };

  const validate = (data: TestimonialPayload) => {
    if (!data.name.trim()) return "El nombre es obligatorio.";
    if (!data.email.trim()) return "El correo es obligatorio.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) return "El correo no parece válido.";
    if (!data.message.trim()) return "Cuéntanos tu experiencia.";
    if (!data.accept) return "Debes aceptar la Política de Privacidad.";
    return "";
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const err = validate(form);
    if (err) {
      setStatus("error");
      setErrorMsg(err);
      return;
    }
    try {
      setStatus("sending");
      // Ajusta esta ruta a tu backend real
      const res = await fetch("/api/testimonios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("No se pudo enviar tu testimonio.");
      setStatus("success");
      setForm(initialForm);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg((err as Error)?.message || "Ha ocurrido un error al enviar el testimonio.");
    }
  };

  // SEO
  const seoTitle = "Testimonios | Dharma en Ruta";
  const seoDesc =
    "Lee las experiencias de personas que han transformado su vida con Dharma en Ruta. Comparte tu testimonio y forma parte de nuestra comunidad.";
  const canonical = "https://dharmaenruta.com/testimonios";
  const ogImage = "https://dharmaenruta.com/og/testimonios.jpg";

  const TESTIMONIALS_PAGE_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "WebPage",
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
          {JSON.stringify(TESTIMONIALS_PAGE_SCHEMA)}
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

      {/* HERO — coherente con Historia/Contacto */}
      <section
        className="relative h-[38vh] md:h-[46vh] flex items-end overflow-hidden"
        aria-labelledby="testimonios-hero-title"
      >
        <img
          src="/img/Backgrounds/tinified/background5.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />
        <div className="absolute inset-0 bg-asparragus/65" aria-hidden />
        <div className="relative z-10 w-full px-6 pb-8 sm:pb-10 md:pb-12">
          <SectionHeader
            title={<span id="testimonios-hero-title">Tu voz importa</span>}
            subtitle="Comparte tu experiencia y descubre la de otras personas"
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
        {/* 1) FORMULARIO PRIMERO */}
        <section id="form-testimonio" aria-labelledby={`${pageId}-form-title`} className="relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
            <div className="max-w-2xl">
              <h2 className="font-gotu text-asparragus text-lg md:text-xl mb-2">
                Quiero aportar mi testimonio
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-raw/90">
                Gracias por tu pasión, energía y amor. Las experiencias vividas suenan mejor
                en boca de quienes las habéis transitado. Este espacio es vuestro.
              </p>
            </div>

            <SectionHeader
              title={<span id={`${pageId}-form-title`}>Comparte tu experiencia</span>}
              subtitle="Tu voz puede motivar a alguien a dar su primer paso"
              size="custom"
              color="asparragus"
              align="left"
              titleClassName="font-gotu text-base md:text-lg mt-6"
              subtitleClassName="text-sm md:text-base text-asparragus/80"
              className="mb-5 md:mb-6"
            />

            {/* Estado accesible */}
            {status === "error" && (
              <div
                id={errorBoxId}
                role="alert"
                aria-live="assertive"
                className="mb-6 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                {errorMsg || "Revisa los campos marcados e inténtalo de nuevo."}
              </div>
            )}
            {status === "success" && (
              <div
                id={successBoxId}
                role="status"
                aria-live="polite"
                className="mb-6 rounded-md border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
              >
                ¡Gracias por tu testimonio! Lo revisaremos y publicaremos en breve.
              </div>
            )}

            <form
              onSubmit={onSubmit}
              noValidate
              aria-describedby={`${status === "error" ? errorBoxId : ""} ${status === "success" ? successBoxId : ""}`.trim()}
              className="grid grid-cols-1 gap-6 md:grid-cols-12"
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

              {/* Programa/Experiencia */}
              <div className="md:col-span-6">
                <label htmlFor={programId} className="block text-sm text-raw/90 mb-1">
                  Experiencia / programa
                </label>
                <select
                  id={programId}
                  name="program"
                  value={form.program}
                  onChange={onChange("program")}
                  className="block w-full rounded-md border border-raw/20 bg-white px-3 py-2 text-base text-raw shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  {["General", ...programFilters].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Valoración */}
              <div className="md:col-span-6">
                <fieldset>
                  <legend className="block text-sm text-raw/90 mb-1">Valoración</legend>
                  <div className="inline-flex items-center gap-2" role="radiogroup" aria-labelledby={ratingId}>
                    <span id={ratingId} className="sr-only">
                      Elige una valoración del 1 al 5
                    </span>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <label key={n} className="inline-flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          value={n}
                          checked={form.rating === n}
                          onChange={onChange("rating")}
                          className="sr-only"
                          aria-label={`${n} estrellas`}
                        />
                        <FiStar
                          aria-hidden
                          className={`h-5 w-5 ${form.rating >= n ? "text-asparragus" : "text-raw/30"}`}
                        />
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              {/* Mensaje */}
              <div className="md:col-span-12">
                <label htmlFor={messageId} className="block text-sm text-raw/90 mb-1">
                  Tu testimonio <span className="text-raw/70">(¿qué viviste? ¿qué te llevaste?)</span>
                </label>
                <textarea
                  id={messageId}
                  name="message"
                  rows={6}
                  required
                  value={form.message}
                  onChange={onChange("message")}
                  placeholder="Ej.: “Llegué con miedos y salí con claridad y energía. El grupo, las prácticas y el acompañamiento me hicieron confiar en mí.”"
                  className="block w-full rounded-md border border-raw/20 bg-white px-3 py-2 text-base text-raw placeholder:text-raw/40 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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
                  {status === "sending" ? "Enviando…" : "Enviar testimonio"}
                </button>
              </div>
            </form>

            {/* Enlaces de salida rápidos */}
            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm md:text-base">
              <span className="text-raw/70">¿Quieres explorar mientras tanto?</span>
              <ButtonLink
                size="sm"
                variant="ghost"
                href="/cursos"
                className="focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2"
              >
                Ver cursos
              </ButtonLink>

            </div>
          </div>
        </section>

        {/* 2) DESPUÉS, LISTADO/CARRUSEL DE TESTIMONIOS */}
        <section aria-labelledby={`${pageId}-listado`} className="relative">
          <TestimonialsCarousel />
        </section>
      </main>
    </>
  );
}
