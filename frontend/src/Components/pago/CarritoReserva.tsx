// src/Components/modalwizard/CarritoReserva.tsx
import React, { useMemo } from "react";
import { FiCalendar, FiUser, FiPlusCircle, FiTrash2, FiShoppingCart } from "react-icons/fi";
import SectionHeader from "../ui/SectionHeader";
import ButtonLink from "../ui/ButtonLink";

interface Sesion {
  id: string;
  profesor: string;
  fecha: string;     // cadena legible o 'YYYY-MM-DD HH:mm'
  precio: number;
  servicio?: string; // p.ej. "Individual" | "Pareja"
}

interface Props {
  carrito: Sesion[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onBack?: () => void; // lo inyecta el Wizard; no se usa aquí
}

const CarritoReserva: React.FC<Props> = ({ carrito, onAdd, onRemove }) => {
  const total = useMemo(
    () => carrito.reduce((acc, s) => acc + (Number(s.precio) || 0), 0),
    [carrito]
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      <SectionHeader
        title="Tu carrito de sesiones"
        subtitle="Revisa y añade las sesiones que desees reservar."
        align="center"
        size="sm"
        color="asparragus"
        className="mb-5"
      />

      {/* Resumen superior */}
      <div className="mb-4 flex items-center justify-between text-sm">
        <div className="inline-flex items-center gap-2 text-asparragus/80">
          <FiShoppingCart aria-hidden className="h-4 w-4" />
          <span>
            {carrito.length === 0
              ? "Carrito vacío"
              : carrito.length === 1
              ? "1 sesión en el carrito"
              : `${carrito.length} sesiones en el carrito`}
          </span>
        </div>
        <div className="font-semibold text-asparragus">
          Total: {total.toFixed(2)} €
        </div>
      </div>

      {/* Lista de sesiones */}
      {carrito.length === 0 ? (
        <div
          className="rounded-2xl border border-raw/20 bg-linen/50 px-4 py-8 text-center text-asparragus/70"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-2">
            <FiCalendar aria-hidden className="h-6 w-6" />
            <p className="text-sm">Todavía no has añadido ninguna sesión.</p>
          </div>
        </div>
      ) : (
        <ul role="list" className="grid gap-3 mb-4">
          {carrito.map((s) => (
            <li
              key={s.id}
              role="listitem"
              className="flex items-center justify-between gap-3 rounded-xl border border-raw/20 bg-white px-3 py-2.5"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-asparragus">
                  <FiUser aria-hidden className="h-4 w-4 shrink-0" />
                  <span className="font-semibold truncate">{s.profesor}</span>
                  {s.servicio && (
                    <span className="ml-2 text-gold font-medium shrink-0">
                      {s.servicio}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-asparragus/80">
                  <FiCalendar aria-hidden className="h-4 w-4 shrink-0" />
                  <span className="truncate">{s.fecha}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-mossgreen font-semibold whitespace-nowrap">
                  {Number(s.precio).toFixed(2)} €
                </span>
                <ButtonLink
                  variant="danger"
                  size="sm"
                  href="#"
                  aria-label={`Eliminar sesión de ${s.profesor} el ${s.fecha}`}
                  className="inline-flex items-center gap-1"
                  onClick={(e) => {
                    e.preventDefault();
                    onRemove(s.id);
                  }}
                >
                  <FiTrash2 aria-hidden className="h-4 w-4" />
                  Eliminar
                </ButtonLink>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* CTA Añadir otra sesión */}
      <div className="flex justify-center">
        <ButtonLink
          variant="leadmagnet"
          size="md"
          href="#"
          className="w-full max-w-xs inline-flex items-center justify-center gap-2"
          onClick={(e) => {
            e.preventDefault();
            onAdd();
          }}
        >
          <FiPlusCircle aria-hidden className="h-5 w-5" />
          Añadir otra sesión
        </ButtonLink>
      </div>
    </div>
  );
};

export default CarritoReserva;
