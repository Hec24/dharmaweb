// src/pages/CookiesPage.tsx
import React from "react";
import SimplePageLayout from "../layouts/SimplePageLayout";

export default function CookiesPage() {
  return (
    <SimplePageLayout
      title="Política de Cookies"
      subtitle="Información sobre el uso de cookies y tecnologías similares."
      lastUpdated="14 de septiembre de 2025"
      maxWidthClass="max-w-3xl"
    >
      <h2 id="que-son" className="text-lg font-semibold text-mossgreen font-gotu">
        1. ¿Qué son las cookies?
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Definición y por qué se utilizan.
      </p>

      <h2 id="tipos" className="mt-8 text-lg font-semibold text-mossgreen font-gotu">
        2. Tipos de cookies
      </h2>
      <ul role="list" className="mt-3 space-y-1 text-[0.95rem] text-gray-800">
        <li role="listitem">Técnicas o necesarias</li>
        <li role="listitem">Preferencias o personalización</li>
        <li role="listitem">Analíticas o de medición</li>
        <li role="listitem">Publicidad comportamental (si aplica)</li>
      </ul>

      <h2 id="gestion" className="mt-8 text-lg font-semibold text-mossgreen font-gotu">
        3. Cómo gestionar las cookies
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Enlace a panel de consentimiento (si tienes) y guía para navegadores.
      </p>

      <h2 id="listado" className="mt-8 text-lg font-semibold text-mossgreen font-gotu">
        4. Listado de cookies
      </h2>
      <div className="mt-3 overflow-x-auto rounded-xl border border-gray-200">
        <table
          className="min-w-full text-[0.95rem]"
          role="table"
          aria-describedby="listado"
        >
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-2 text-left font-medium">
                Cookie
              </th>
              <th scope="col" className="px-3 py-2 text-left font-medium">
                Proveedor
              </th>
              <th scope="col" className="px-3 py-2 text-left font-medium">
                Finalidad
              </th>
              <th scope="col" className="px-3 py-2 text-left font-medium">
                Duración
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-3 py-2 whitespace-nowrap">_ga</td>
              <td className="px-3 py-2 whitespace-nowrap">Google Analytics</td>
              <td className="px-3 py-2">Analítica de uso</td>
              <td className="px-3 py-2 whitespace-nowrap">24 meses</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="actualizaciones" className="mt-8 text-lg font-semibold text-mossgreen font-gotu">
        5. Actualizaciones
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Indica que esta política puede actualizarse y cómo se notificará.
      </p>

      <h2 id="contacto" className="mt-8 text-lg font-semibold text-mossgreen font-gotu">
        6. Contacto
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Para dudas:{" "}
        <a
          href="mailto:hola@dharmaenruta.com"
          className="underline text-asparragus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded"
        >
          hola@dharmaenruta.com
        </a>
        .
      </p>
    </SimplePageLayout>
  );
}
