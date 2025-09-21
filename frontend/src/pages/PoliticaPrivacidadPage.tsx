// src/pages/PoliticaPrivacidadPage.tsx
import React from "react";
import SimplePageLayout from "../layouts/SimplePageLayout";

export default function PoliticaPrivacidadPage() {
  return (
    <SimplePageLayout
      title="Política de Privacidad"
      subtitle="Cómo recogemos, usamos y protegemos tus datos personales."
      lastUpdated="14 de septiembre de 2025"
      maxWidthClass="max-w-3xl"
    >
      <h2 id="responsable" className="text-lg font-semibold text-mossgreen font-gotu">
        1. Responsable del tratamiento
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Aquí irá el copy con los datos de la entidad, contacto y DPO si aplica.
      </p>

      <h2 id="finalidad" className="mt-8 text-lg font-semibold text-mossgreen font-gotu">
        2. Finalidad del tratamiento
      </h2>
      <ul role="list" className="mt-3 space-y-1 text-[0.95rem] text-gray-800">
        <li role="listitem">Gestión de reservas y prestación de servicios.</li>
        <li role="listitem">Comunicaciones informativas / newsletter.</li>
        <li role="listitem">Soporte a personas usuarias.</li>
        <li role="listitem">Analítica de uso (cookies).</li>
      </ul>

      <h2 id="legitimacion" className="mt-8 text-lg font-semibold text-mossgreen font-gotu">
        3. Legitimación
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Base legal: contrato, consentimiento, interés legítimo, obligaciones legales…
      </p>

      <h2 id="destinatarios" className="mt-8 text-lg font-semibold text-mossgreen font-gotu">
        4. Destinatarios
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Proveedores (hosting, pago, emailing, analítica…) y encargados de tratamiento.
      </p>

      <h2 id="derechos" className="mt-8 text-lg font-semibold text-mossgreen font-gotu">
        5. Derechos
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Acceso, rectificación, supresión, oposición, limitación, portabilidad y revocación.
      </p>

      <h2 id="conservacion" className="mt-8 text-lg font-semibold text-mossgreen font-gotu">
        6. Plazos de conservación
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Criterios y tiempos de conservación/bloqueo según finalidades y normativa.
      </p>

      <h2 id="transferencias" className="mt-8 text-lg font-semibold text-mossgreen font-gotu">
        7. Transferencias internacionales
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Si existen, especifica países y garantías (SCCs, etc.).
      </p>

      <h2 id="seguridad" className="mt-8 text-lg font-semibold text-mossgreen font-gotu">
        8. Medidas de seguridad
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Medidas técnicas y organizativas proporcionadas al riesgo.
      </p>

      <h2 id="contacto" className="mt-8 text-lg font-semibold text-mossgreen font-gotu">
        9. Contacto y reclamaciones
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Email y referencia a la AEPD en España.
      </p>
    </SimplePageLayout>
  );
}
