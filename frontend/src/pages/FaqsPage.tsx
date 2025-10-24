import React from "react";
import { Helmet } from "react-helmet-async";
import SimplePageLayout from "../layouts/SimplePageLayout";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { Link } from "react-router-dom";
import { faqs } from "../data/faqs";

export default function FaqsPage() {
  const [open, setOpen] = React.useState<number | null>(null);
  const toggle = (i: number) => setOpen(open === i ? null : i);

  const title = "Preguntas frecuentes | Dharma en Ruta";
  const description =
    "Resolvemos tus dudas sobre cursos, acompañamientos, pagos, cancelaciones, acceso a contenidos y soporte técnico.";
  const canonical = "https://dharmaenruta.com/faqs";
  const ogImage = "https://dharmaenruta.com/og/faqs.jpg";

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answers.join(" ") },
    })),
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Dharma en Ruta" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <SimplePageLayout
        title="Preguntas Frecuentes"
        subtitle="Respuestas claras sobre cursos, acompañamientos y acceso a contenidos."
        lastUpdated="24 de octubre de 2025"
        maxWidthClass="max-w-4xl"
      >
        {/* CTA breve */}
        <div className="mb-6 rounded-xl border border-raw/20 bg-linen/60 p-4">
          <p className="text-[0.95rem] text-gray-800">
            ¿No encuentras lo que buscas?{" "}
            <Link
              to="/contacto"
              className="font-medium text-asparragus underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
            >
              Escríbenos aquí
            </Link>{" "}
            y te ayudamos a resolverlo.
          </p>
        </div>

        {/* Acordeones */}
        <div role="list" className="space-y-3 sm:space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <section
                key={i}
                role="listitem"
                className={`bg-white rounded-xl border border-gray-100 overflow-hidden transition-shadow duration-200 ${
                  isOpen ? "shadow-md" : "shadow-sm"
                }`}
              >
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-heading-${i}`}
                  className="flex w-full items-center justify-between text-left p-4 sm:p-5 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                >
                  <span className="text-base sm:text-lg font-semibold text-mossgreen pr-3 font-gotu">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <FiChevronUp aria-hidden className="text-asparragus" size={20} />
                  ) : (
                    <FiChevronDown aria-hidden className="text-asparragus" size={20} />
                  )}
                </button>

                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-heading-${i}`}
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-[0.95rem] leading-relaxed text-gray-800 space-y-3">
                      {faq.answers.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </SimplePageLayout>
    </>
  );
}
