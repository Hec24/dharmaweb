// src/pages/CookiesPage.tsx
import { Link } from "react-router-dom";
import SimplePageLayout from "../layouts/SimplePageLayout";

export default function CookiesPage() {
  const openCookiePanel = () => {
    // Si usas un CMP (Consent Management Platform), expón un método global y llámalo aquí.
    // Ejemplos comunes:
    // window.cookieConsent?.open?.();
    // window.OneTrust?.ToggleInfoDisplay?.();
    // window.Cookiebot?.show?.();
    (window as Window & { cookieConsent?: { open?: () => void } }).cookieConsent?.open?.();
  };

  return (
    <SimplePageLayout
      title="Política de Cookies"
      subtitle="Información sobre el uso de cookies y tecnologías similares."
      lastUpdated="10 de octubre de 2025"
      maxWidthClass="max-w-3xl"
    >
      {/* Índice de contenidos */}
      <nav aria-label="Índice de contenidos" className="mb-6">
        <ul role="list" className="list-disc pl-5 grid gap-1 text-[0.95rem] text-gray-700">
          <li role="listitem">
            <a
              href="#introduccion"
              className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm"
            >
              1. Introducción
            </a>
          </li>
          <li role="listitem">
            <a
              href="#que-son"
              className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm"
            >
              2. ¿Qué son las cookies?
            </a>
          </li>
          <li role="listitem">
            <a
              href="#tipos"
              className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm"
            >
              3. Tipos de cookies utilizadas
            </a>
          </li>
          <li role="listitem" className="ml-4">
            <a
              href="#tipos-finalidad"
              className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm"
            >
              3.1 Según su finalidad
            </a>
          </li>
          <li role="listitem">
            <a
              href="#listado"
              className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm"
            >
              4. Cookies utilizadas en este sitio (tabla)
            </a>
          </li>
          <li role="listitem">
            <a
              href="#base-legal"
              className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm"
            >
              5. Base legal del tratamiento
            </a>
          </li>
          <li role="listitem">
            <a
              href="#gestion"
              className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm"
            >
              6. Cómo aceptar, rechazar o eliminar cookies
            </a>
          </li>
          <li role="listitem">
            <a
              href="#transferencias"
              className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm"
            >
              7. Transferencias internacionales
            </a>
          </li>
          <li role="listitem">
            <a
              href="#actualizaciones"
              className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm"
            >
              8. Actualización de la política
            </a>
          </li>
          <li role="listitem">
            <a
              href="#contacto"
              className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm"
            >
              9. Contacto
            </a>
          </li>
        </ul>
      </nav>

      {/* 1. Introducción */}
      <h2 id="introduccion" className="text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        1. Introducción
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        El sitio web{" "}
        <a
          href="https://dharmenruta.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm"
        >
          https://dharmenruta.com
        </a>{" "}
        (en adelante, “el Sitio Web”), titularidad de Patricia Pérez Vicente, utiliza cookies y
        tecnologías similares para garantizar el correcto funcionamiento del sitio, analizar la
        navegación y mejorar los servicios ofrecidos.
      </p>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Al acceder al Sitio Web, se muestra un banner o panel de configuración de cookies que te
        permite aceptar, rechazar o personalizar las cookies que se instalan en tu dispositivo. Tu
        consentimiento se aplica al dominio:{" "}
        <strong>https://dharmenruta.com</strong>.
      </p>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Actualizada según el Reglamento (UE) 2016/679 (RGPD), la Ley 34/2002 (LSSI-CE) y la Guía
        sobre el uso de cookies de la AEPD (2023).
      </p>

      {/* 2. ¿Qué son? */}
      <h2 id="que-son" className="mt-8 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        2. ¿Qué son las cookies?
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo
        (ordenador, móvil o tableta) al visitarlos. Su objetivo es reconocer tu navegador, guardar
        información sobre tu visita (como preferencias o idioma) y facilitar tu experiencia de
        navegación.
      </p>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Existen otros mecanismos similares como píxeles, balizas web o SDK, que funcionan de manera
        análoga. A todos ellos los denominaremos genéricamente “cookies”.
      </p>

      {/* 3. Tipos */}
      <h2 id="tipos" className="mt-8 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        3. Tipos de cookies utilizadas
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        En <strong>Dharma en Ruta</strong> utilizamos tanto cookies propias (instaladas por nuestro
        dominio) como cookies de terceros (instaladas por servicios externos como Google o Meta).
      </p>

      <h3 id="tipos-finalidad" className="mt-4 text-base font-semibold text-mossgreen font-gotu scroll-mt-24">
        3.1. Según su finalidad
      </h3>
      <ul role="list" className="mt-3 space-y-2 text-[0.95rem] text-gray-800 list-disc pl-5">
        <li role="listitem">
          <strong>Cookies técnicas o necesarias:</strong> esenciales para el funcionamiento básico
          de la web (iniciar sesión, rellenar formularios, acceder a áreas seguras, seguridad).
          <em className="block mt-1 text-gray-600">
            ➤ Ejemplo: cookie de sesión, aceptación de políticas, control de acceso a Hotmart.
          </em>
        </li>
        <li role="listitem">
          <strong>Cookies de personalización:</strong> recuerdan tus preferencias (idioma, país,
          configuración de visualización, dispositivo).
        </li>
        <li role="listitem">
          <strong>Cookies analíticas o de rendimiento:</strong> miden el uso del sitio (páginas más
          visitadas, tiempo, origen del tráfico) para mejorar contenidos y estructura.
          <em className="block mt-1 text-gray-600">
            ➤ Herramientas: Google Analytics. Datos: IP anonimizada, dispositivo, navegador, tiempo
            de sesión, comportamiento.
          </em>
        </li>
        <li role="listitem">
          <strong>Cookies publicitarias o de marketing:</strong> muestran anuncios relevantes según
          tus intereses y miden la eficacia de campañas.
          <em className="block mt-1 text-gray-600">
            ➤ Herramientas: Facebook Pixel (Meta), Google Ads. Finalidad: anuncios personalizados en
            redes/buscadores.
          </em>
        </li>
        <li role="listitem">
          <strong>Cookies de redes sociales:</strong> permiten compartir contenidos y medir
          interacciones en Instagram, Facebook o YouTube.
        </li>
      </ul>

      {/* 4. Tabla de cookies */}
      <h2 id="listado" className="mt-8 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        4. Cookies utilizadas en este sitio
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        La siguiente tabla es orientativa; los nombres exactos pueden variar según actualizaciones
        de los servicios. Se actualizará cada vez que haya cambios relevantes.
      </p>

      <div className="mt-3 overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-[0.95rem]" role="table" aria-describedby="listado">
          <caption className="sr-only">
            Tabla de cookies utilizadas: nombre, proveedor, finalidad y duración.
          </caption>
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-2 text-left font-medium">
                Tipo
              </th>
              <th scope="col" className="px-3 py-2 text-left font-medium">
                Nombre
              </th>
              <th scope="col" className="px-3 py-2 text-left font-medium">
                Proveedor
              </th>
              <th scope="col" className="px-3 py-2 text-left font-medium">
                Duración
              </th>
              <th scope="col" className="px-3 py-2 text-left font-medium">
                Finalidad
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                tipo: "Necesaria",
                nombre: "__cfduid, PHPSESSID",
                proveedor: "Dharma en Ruta / IONOS",
                duracion: "Sesión",
                finalidad: "Identificar la sesión del usuario y permitir la navegación segura",
              },
              {
                tipo: "Preferencias",
                nombre: "pll_language",
                proveedor: "Dharma en Ruta",
                duracion: "1 año",
                finalidad: "Grabar idioma de navegación",
              },
              {
                tipo: "Analítica",
                nombre: "_ga, _gid, _gat",
                proveedor: "Google Analytics",
                duracion: "2 años / 1 día",
                finalidad: "Medir tráfico y comportamiento de usuarios",
              },
              {
                tipo: "Marketing",
                nombre: "_fbp, fr",
                proveedor: "Meta (Facebook Pixel)",
                duracion: "3 meses",
                finalidad: "Seguimiento de conversiones y segmentación de anuncios",
              },
              {
                tipo: "Publicitaria",
                nombre: "_gcl_au",
                proveedor: "Google Ads",
                duracion: "3 meses",
                finalidad: "Optimización de campañas publicitarias",
              },
              {
                tipo: "Técnica",
                nombre: "mailerlite:webform:shown",
                proveedor: "MailerLite",
                duracion: "1 año",
                finalidad: "Control de visualización de formularios de suscripción",
              },
            ].map((c, i) => (
              <tr key={i} className="border-t align-top">
                <td className="px-3 py-2 whitespace-nowrap">{c.tipo}</td>
                <td className="px-3 py-2 whitespace-nowrap">{c.nombre}</td>
                <td className="px-3 py-2 whitespace-nowrap">{c.proveedor}</td>
                <td className="px-3 py-2 whitespace-nowrap">{c.duracion}</td>
                <td className="px-3 py-2">{c.finalidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 5. Base legal */}
      <h2 id="base-legal" className="mt-8 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        5. Base legal del tratamiento
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        El uso de cookies analíticas, publicitarias o de personalización requiere tu{" "}
        <strong>consentimiento expreso</strong>, solicitado al acceder al sitio mediante el banner
        de configuración. Las cookies técnicas se instalan por <strong>interés legítimo</strong>, ya
        que son necesarias para el funcionamiento básico de la web. Puedes retirar tu consentimiento
        en cualquier momento desde el panel de configuración o eliminando las cookies desde tu
        navegador.
      </p>

      {/* 6. Gestión */}
      <h2 id="gestion" className="mt-8 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        6. Cómo aceptar, rechazar o eliminar cookies
      </h2>

      <h3 id="configurar-cookies" className="mt-3 text-base font-semibold text-mossgreen font-gotu scroll-mt-24">
        6.1 Panel de configuración del sitio
      </h3>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-gray-800">
        Al acceder por primera vez al sitio, aparece un banner donde puedes:
      </p>
      <ul role="list" className="mt-2 space-y-2 text-[0.95rem] text-gray-800 list-disc pl-5">
        <li role="listitem">Aceptar todas las cookies.</li>
        <li role="listitem">Rechazar todas las cookies no esenciales.</li>
        <li role="listitem">Configurar tus preferencias por tipo de cookie.</li>
      </ul>
      <div className="mt-3">
        <button
          type="button"
          onClick={openCookiePanel}
          className="inline-flex items-center rounded-lg border border-asparragus/30 px-3 py-1.5 text-[0.95rem] text-asparragus hover:bg-asparragus/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          Abrir configuración de cookies
        </button>
        <p className="mt-2 text-[0.9rem] text-gray-700">
          También encontrarás un enlace permanente a “Configuración de cookies” en el pie de página.
        </p>
      </div>

      <h3 className="mt-6 text-base font-semibold text-mossgreen font-gotu">6.2 Desde el navegador</h3>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-gray-800">
        También puedes eliminar o bloquear las cookies desde la configuración de tu navegador. Enlaces de ayuda:
      </p>
      <ul role="list" className="mt-2 space-y-2 text-[0.95rem] text-gray-800 list-disc pl-5">
        {[
          {
            label: "Google Chrome",
            href: "https://support.google.com/chrome/answer/95647?hl=es",
          },
          {
            label: "Mozilla Firefox",
            href: "https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web",
          },
          {
            label: "Safari (Mac)",
            href: "https://support.apple.com/es-es/guide/safari/sfri11471/mac",
          },
          {
            label: "Microsoft Edge",
            href: "https://support.microsoft.com/es-es/help/4027947/microsoft-edge-delete-cookies",
          },
          {
            label: "Opera",
            href: "https://help.opera.com/es/latest/web-preferences/#cookies",
          },
        ].map((b) => (
          <li key={b.href} role="listitem">
            <a
              href={b.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm"
            >
              {b.label}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-gray-800">
        Ten en cuenta que la eliminación o bloqueo de cookies puede afectar al correcto
        funcionamiento de algunas funciones del sitio.
      </p>

      {/* 7. Transferencias */}
      <h2 id="transferencias" className="mt-8 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        7. Transferencias internacionales de datos
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Algunas cookies pertenecen a proveedores ubicados fuera del Espacio Económico Europeo (p. ej.,
        EE. UU.), como Google LLC o Meta Platforms Inc. Estas empresas aplican Cláusulas
        Contractuales Tipo aprobadas por la Comisión Europea y otras garantías adecuadas.
      </p>

      {/* 8. Actualización */}
      <h2 id="actualizaciones" className="mt-8 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        8. Actualización de la política
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Esta Política de Cookies puede actualizarse para reflejar cambios normativos o técnicos.
        Publicaremos siempre la última versión vigente, con fecha de actualización visible en la
        parte superior de la página.
      </p>

      {/* 9. Contacto */}
      <h2 id="contacto" className="mt-8 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        9. Contacto
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Para cualquier duda o ejercicio de derechos en materia de protección de datos, puedes
        escribirnos a:{" "}
        <a
          href="mailto:info@dharmenruta.com"
          className="underline text-asparragus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded"
        >
          info@dharmenruta.com
        </a>
        .
      </p>

      {/* Enlaces internos útiles */}
      <div className="mt-8 rounded-lg bg-gray-50 px-3 py-3 text-[0.92rem] text-gray-700">
        <span className="font-medium text-mossgreen">Ver también: </span>
        <Link
          to="/legal/privacidad"
          className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm"
        >
          Política de Privacidad
        </Link>
        {" · "}
        <Link
          to="/legal/aviso-legal"
          className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm"
        >
          Aviso Legal
        </Link>
      </div>
    </SimplePageLayout>
  );
}
