// src/pages/AvisoLegalPage.tsx
import React from "react";
import SimplePageLayout from "../layouts/SimplePageLayout";

export default function AvisoLegalPage() {
  return (
    <SimplePageLayout
      title="Aviso Legal"
      subtitle="Información general y condiciones de uso del sitio."
      lastUpdated="14 de septiembre de 2025"
      maxWidthClass="max-w-3xl"
    >
      <h2 id="identificacion" className="text-lg font-semibold text-mossgreen font-gotu">
        1. Identificación
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Nombre/Razón social, CIF/NIF, domicilio, email y datos registrales si aplica.
      </p>

      <h2 id="uso-web" className="mt-8 text-lg font-semibold text-mossgreen font-gotu">
        2. Condiciones de uso de la web
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Normas básicas de uso, exactitud de la información, conducta, etc.
      </p>

      <h2 id="propiedad" className="mt-8 text-lg font-semibold text-mossgreen font-gotu">
        3. Propiedad intelectual e industrial
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Derechos sobre contenidos, marcas y restricciones de uso.
      </p>

      <h2 id="exclusion" className="mt-8 text-lg font-semibold text-mossgreen font-gotu">
        4. Exclusión de responsabilidad
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Límites sobre información, disponibilidad y enlaces de terceros.
      </p>

      <h2 id="enlaces" className="mt-8 text-lg font-semibold text-mossgreen font-gotu">
        5. Enlaces
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Política respecto a enlaces entrantes/salientes.
      </p>

      <h2 id="ley" className="mt-8 text-lg font-semibold text-mossgreen font-gotu">
        6. Ley aplicable
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Normativa española y tribunales competentes.
      </p>
    </SimplePageLayout>
  );
}
