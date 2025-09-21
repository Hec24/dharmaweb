// src/Components/ui/ModalWizard.tsx
// Ajuste de posición vertical: sube el modal un poco (menos padding-top en overlay)
// Mantiene el resto de mejoras (ancho/alto estable, footer siempre visible).

import React from "react";
import { FiX, FiShoppingCart } from "react-icons/fi";
import Button from "./Button";

interface ModalWizardProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  step: number;
  totalSteps: number;
  stepLabels: string[];
  title?: string;
  goToCarrito?: () => void;
  carritoCount?: number;
  onNext?: () => void;
  onBack?: () => void;
  puedeContinuar?: boolean | string;
  onConfirm?: () => void;
}

const ModalWizard: React.FC<ModalWizardProps> = ({
  open,
  onClose,
  children,
  step,
  totalSteps,
  stepLabels,
  title,
  goToCarrito,
  carritoCount = 0,
  onNext = () => {},
  onBack = () => {},
  puedeContinuar = true,
  onConfirm = () => {},
}) => {
  if (!open) return null;

  const isDisabled =
    typeof puedeContinuar === "boolean" ? !puedeContinuar : !!puedeContinuar;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-start justify-center
        bg-black/40
        pt-20 sm:pt-24 md:pt-28 lg:pt-32  /* ↓ sube el modal (menos separación superior) */
        px-2 sm:px-4
        pb-16
      "
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title || "Asistente de reserva"}
    >
      <div
        className="
          relative bg-white rounded-2xl shadow-2xl flex w-full
          max-w-[96vw] md:max-w-[880px] xl:max-w-[1100px]
          min-h-[360px]
          max-h-[80dvh]
          border border-linen
          overflow-hidden
        "
        style={{ transition: "height 0.28s cubic-bezier(.4,0,.2,1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sidebar Steps */}
        <aside className="hidden md:flex flex-col justify-between w-48 bg-mossgreen/10 rounded-l-2xl border-r border-mossgreen/10 py-4 px-3">
          <nav className="flex flex-col gap-4" aria-label="Progreso de reserva">
            {stepLabels.map((label, i) => {
              const current = step === i;
              const done = i < step;
              return (
                <div key={i} className="flex items-center gap-2 pl-1">
                  <span
                    aria-hidden
                    className={`w-6 h-6 flex items-center justify-center rounded-full border text-[0.8rem] font-gotu
                    ${current ? "bg-gold border-gold text-white" : done ? "bg-mossgreen/30 border-mossgreen/40 text-mossgreen" : "border-mossgreen/30 text-asparragus/60"}
                  `}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={`text-[0.9rem] font-semibold truncate
                    ${current ? "text-mossgreen" : done ? "text-gold" : "text-asparragus/70"}`}
                    title={label}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </nav>
          <div className="text-[0.85rem] text-asparragus/70 mt-6">
            <div>¿Dudas?</div>
            <a
              className="text-mossgreen font-semibold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded"
              href="tel:629904334"
            >
              629 90 43 34
            </a>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col min-w-0 bg-white rounded-r-2xl overflow-hidden">
          {/* Top Bar — compacta */}
          <div className="flex items-center gap-2 justify-between px-3 sm:px-6 pt-3 pb-2 border-b border-linen">
            {/* Progreso (mobile) */}
            <div className="flex md:hidden gap-1.5 flex-1" aria-hidden="true">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 w-full rounded-full ${i <= step ? "bg-mossgreen" : "bg-gold/40"}`}
                />
              ))}
            </div>

            {/* Título */}
            {title && (
              <h2 className="hidden md:block mx-2 text-[0.95rem] text-asparragus/80 font-gotu">
                {title}
              </h2>
            )}

            {/* Carrito */}
            <div className="flex items-center justify-end flex-1">
              {carritoCount > 0 && (
                <button
                  className="relative p-1.5 rounded-full hover:bg-linen transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                  onClick={goToCarrito}
                  aria-label={`Ver carrito (${carritoCount})`}
                >
                  <FiShoppingCart size={18} />
                  <span className="absolute -top-2 -right-2 bg-gold text-white rounded-full px-1 py-0.5 text-[0.65rem] font-bold">
                    {carritoCount}
                  </span>
                </button>
              )}
            </div>

            {/* Cerrar */}
            <button
              onClick={onClose}
              className="ml-1 text-asparragus hover:bg-linen rounded-full p-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              aria-label="Cerrar"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Contenido paso — estabilizado */}
          <div
            className="
              flex-1 overflow-y-auto
              px-3 sm:px-6 pt-4 pb-3 sm:pb-5
              text-[0.92rem] leading-relaxed
              overscroll-contain
              [scrollbar-gutter:stable_both-edges]
            "
          >
            <div className="min-h-[440px] md:min-h-[520px]">
              {children}
            </div>
          </div>

          {/* Footer — botones compactos (siempre visibles) */}
          <footer className="w-full px-3 sm:px-6 py-2.5 border-t border-linen bg-white flex-shrink-0">
            <div className="flex justify-between">
              <Button
                variant="secondary"
                size="md"
                onClick={onBack}
                className="min-w-[96px] px-3 py-2 text-[0.9rem]"
                type="button"
                disabled={step === 0}
                aria-disabled={step === 0}
              >
                ← Volver
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={step === totalSteps - 1 ? onConfirm : onNext}
                className="min-w-[120px] px-3 py-2 text-[0.9rem]"
                disabled={step !== totalSteps - 1 && isDisabled}
                aria-disabled={step !== totalSteps - 1 && isDisabled}
                type="button"
              >
                {step === totalSteps - 1 ? "Confirmar sesión" : "Siguiente →"}
              </Button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default ModalWizard;
