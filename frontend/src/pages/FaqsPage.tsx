// src/pages/FaqsPage.tsx
import React from "react";
import SimplePageLayout from "../layouts/SimplePageLayout";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { faqs } from "../data/faqs";

export default function FaqsPage() {
  const [open, setOpen] = React.useState<number | null>(null);
  const toggle = (i: number) => setOpen((prev) => (prev === i ? null : i));

  return (
    <SimplePageLayout
      title="Preguntas Frecuentes"
      subtitle="Respuestas rápidas a las dudas más comunes."
      lastUpdated="14 de septiembre de 2025"
      maxWidthClass="max-w-4xl"
    >
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
              <h3 className="sr-only">{`Pregunta ${i + 1}`}</h3>
              <button
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                className="flex w-full items-center justify-between text-left p-4 sm:p-5 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              >
                <span className="text-base sm:text-lg font-semibold text-mossgreen pr-3 font-gotu">
                  {faq.question}
                </span>
                {isOpen ? (
                  <FiChevronUp aria-hidden className="text-asparragus flex-shrink-0" size={20} />
                ) : (
                  <FiChevronDown aria-hidden className="text-asparragus flex-shrink-0" size={20} />
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
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-[0.95rem] leading-relaxed text-gray-800">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </SimplePageLayout>
  );
}
