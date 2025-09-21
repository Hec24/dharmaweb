// src/Components/modalwizard/ConfirmacionReserva.tsx
import React, { useMemo } from "react";
import {
  FiCheckCircle,
  FiCalendar,
  FiUser,
  FiMail,
  FiPhone,
  FiUsers,
} from "react-icons/fi";
import SectionHeader from "../ui/SectionHeader";
import { FormValues, Profesor, Sesion, FechaHora } from "../../data/types";
import { formatFechaHora } from "../../utils/formatFechaHora";

interface Props {
  profesor: Profesor | null;
  fechaHora: FechaHora | null;
  datos: FormValues;
  carrito: Sesion[];
}

const ConfirmacionReserva: React.FC<Props> = ({
  profesor,
  fechaHora,
  datos,
  carrito,
}) => {
  const total = useMemo(
    () => carrito.reduce((acc, s) => acc + (Number(s.precio) || 0), 0),
    [carrito]
  );

  const fechaHoraFmt = useMemo(() => formatFechaHora(fechaHora), [fechaHora]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      <SectionHeader
        title="Confirmación de reserva"
        subtitle="Revisa los datos antes de confirmar y proceder al pago."
        align="center"
        size="sm"
        color="asparragus"
        className="mb-5"
      />

      {/* Tarjeta resumen */}
      <section
        aria-labelledby="resumen-reserva-title"
        className="rounded-2xl border border-raw/20 bg-white shadow-sm"
      >
        <header className="flex items-center gap-2 px-4 sm:px-5 py-3 border-b border-raw/10">
          <FiCheckCircle aria-hidden className="h-5 w-5 text-mossgreen" />
          <h3
            id="resumen-reserva-title"
            className="font-gotu text-[1rem] text-asparragus"
          >
            Resumen de tu sesión
          </h3>
        </header>

        <div className="px-4 sm:px-5 py-4 grid gap-4 text-[0.95rem] leading-relaxed">
          {/* Datos de sesión */}
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <FiUsers aria-hidden className="h-4 w-4" />
              <span className="font-semibold">Profesor/a:</span>
              <span className="truncate">{profesor?.name ?? "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCalendar aria-hidden className="h-4 w-4" />
              <span className="font-semibold">Fecha y hora:</span>
              <span className="truncate">{fechaHoraFmt || "—"}</span>
            </div>
          </div>

          {/* Datos personales */}
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <FiUser aria-hidden className="h-4 w-4" />
              <span className="font-semibold">Nombre:</span>
              <span className="truncate">
                {datos?.nombre || "—"} {datos?.apellidos || ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FiMail aria-hidden className="h-4 w-4" />
              <span className="font-semibold">Email:</span>
              <span className="truncate">{datos?.email || "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiPhone aria-hidden className="h-4 w-4" />
              <span className="font-semibold">Teléfono:</span>
              <span className="truncate">{datos?.telefono || "—"}</span>
            </div>
          </div>

          {/* Carrito */}
          <div className="grid gap-2">
            <h4 className="font-semibold text-asparragus/90">Sesiones incluidas</h4>
            {carrito?.length ? (
              <ul role="list" className="grid gap-2">
                {carrito.map((s, i) => (
                  <li
                    role="listitem"
                    key={`${s.profesor}-${s.fecha}-${i}`}
                    className="flex items-center justify-between rounded-lg border border-raw/15 bg-linen/40 px-3 py-2"
                  >
                    <span className="truncate">
                      {s.profesor} &middot; {s.fecha}
                    </span>
                    <span className="font-semibold">
                      {(Number(s.precio) || 0).toFixed(2)} €
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-raw/70">No hay sesiones añadidas.</p>
            )}

            <div className="mt-2 flex items-center justify-between border-t border-raw/10 pt-2">
              <span className="text-[0.95rem] font-semibold">Total</span>
              <span className="text-[1rem] font-bold text-asparragus">
                {total.toFixed(2)} €
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Nota: el botón “Confirmar sesión” lo renderiza el ModalWizard (footer). */}
    </div>
  );
};

export default ConfirmacionReserva;

