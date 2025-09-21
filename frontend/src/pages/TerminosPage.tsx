// src/pages/TerminosPage.tsx
import React from "react";
import SimplePageLayout from "../layouts/SimplePageLayout";

export default function TerminosPage() {
  return (
    <SimplePageLayout
      title="Términos y Condiciones"
      subtitle="Reglas de uso, contratación y responsabilidades."
      lastUpdated="14 de septiembre de 2025"
      maxWidthClass="max-w-3xl"
    >
      <h2 id="objeto" className="text-lg font-semibold text-mossgreen font-gotu">
        1. Objeto y ámbito
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Describe el servicio, la web y a quién va dirigido.
      </p>

      <h2 id="usuario" className="mt-8 text-lg font-semibold text-mossgreen font-gotu">
        2. Condición de usuario
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Obligaciones, veracidad de datos y edad mínima.
      </p>

      <h2 id="proceso" className="mt-8 text-lg font-semibold text-mossgreen font-gotu">
        3. Proceso de compra y reservas
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Pasos, confirmaciones por email, calendario, etc.
      </p>

      <h2 id="precios" className="mt-8 text-lg font-semibold text-mossgreen font-gotu">
        4. Precios, impuestos y pagos
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Moneda, impuestos incluidos, Stripe, seguridad.
      </p>

      <h2 id="cancelacion" className="mt-8 text-lg font-semibold text-mossgreen font-gotu">
        5. Cancelación y reembolsos
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Condiciones, plazos, reprogramación y no shows.
      </p>

      <h2 id="propiedad" className="mt-8 text-lg font-semibold text-mossgreen font-gotu">
        6. Propiedad intelectual
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Derechos sobre contenidos, marca e imágenes.
      </p>

      <h2 id="responsabilidad" className="mt-8 text-lg font-semibold text-mossgreen font-gotu">
        7. Responsabilidad y garantías
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Límites de responsabilidad, fuerza mayor, disponibilidad.
      </p>

      <h2 id="ley" className="mt-8 text-lg font-semibold text-mossgreen font-gotu">
        8. Ley aplicable y jurisdicción
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Normativa española y tribunales competentes.
      </p>
    </SimplePageLayout>
  );
}
