// src/pages/PoliticaPrivacidadPage.tsx
import { Link } from "react-router-dom";
import SimplePageLayout from "../layouts/SimplePageLayout";

export default function PoliticaPrivacidadPage() {
  return (
    <SimplePageLayout
      title="Política de Privacidad"
      subtitle="Cómo recogemos, usamos y protegemos tus datos personales."
      lastUpdated="14 de septiembre de 2025"
      maxWidthClass="max-w-3xl"
    >
      {/* Índice de contenidos */}
      <nav aria-label="Índice de contenidos" className="mb-6">
        <ul role="list" className="list-disc pl-5 grid gap-1 text-[0.95rem] text-gray-700">
          <li role="listitem"><a href="#intro" className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">0. Introducción</a></li>
          <li role="listitem"><a href="#edad-minima" className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">0.1 Edad mínima</a></li>
          <li role="listitem"><a href="#responsable" className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">1. Responsable del tratamiento</a></li>
          <li role="listitem"><a href="#origen-datos" className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">2. ¿Qué datos recogemos y cómo?</a></li>
          <li role="listitem" className="ml-4"><a href="#origenes" className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">2.1 Orígenes</a></li>
          <li role="listitem" className="ml-4"><a href="#tipos" className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">2.2 Tipos de datos</a></li>
          <li role="listitem"><a href="#finalidades" className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">3. Finalidades del tratamiento</a></li>
          <li role="listitem"><a href="#bases" className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">4. Bases jurídicas</a></li>
          <li role="listitem"><a href="#conservacion" className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">5. Conservación de datos</a></li>
          <li role="listitem"><a href="#destinatarios" className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">6. Destinatarios/encargados</a></li>
          <li role="listitem"><a href="#derechos" className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">7. Derechos</a></li>
          <li role="listitem"><a href="#seguridad" className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">8. Seguridad</a></li>
          <li role="listitem"><a href="#veracidad" className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">9. Veracidad y actualización</a></li>
          <li role="listitem"><a href="#redes" className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">10. Redes sociales</a></li>
          <li role="listitem"><a href="#cookies" className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">11. Cookies</a></li>
          <li role="listitem"><a href="#formularios" className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">12. Formularios y capturas</a></li>
          <li role="listitem"><a href="#comerciales" className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">13. Comunicaciones comerciales</a></li>
          <li role="listitem"><a href="#cambios" className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">14. Cambios en la política</a></li>
          <li role="listitem"><a href="#contacto" className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">15. Contacto</a></li>
        </ul>
      </nav>

      {/* 0. Intro */}
      <h2 id="intro" className="text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        Política de Privacidad
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Tu privacidad es importante para <strong>Dharma en Ruta</strong>. En esta política te explicamos qué datos
        personales recopilamos, con qué finalidad, cómo los tratamos y protegemos, y qué derechos te asisten.
        Te recomendamos leerla diligentemente antes de facilitarnos datos personales.
      </p>

      {/* 0.1 Edad mínima */}
      <h3 id="edad-minima" className="mt-6 text-base font-semibold text-mossgreen font-gotu scroll-mt-24">
        Edad mínima
      </h3>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Las personas mayores de 18 años pueden utilizar las funcionalidades que requieren datos personales sin
        consentimiento previo de sus progenitores o tutores. Para menores de 18 años se requiere autorización
        expresa de padre/madre o tutor/a legal. No se recabarán del menor datos relativos a la situación
        profesional/económica ni a la intimidad de otros miembros de la familia sin su consentimiento.
      </p>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Al usar este sitio web y/o nuestros servicios declaras haber leído y comprendido esta Política de Privacidad.
      </p>

      {/* 1. Responsable */}
      <h2 id="responsable" className="mt-8 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        1. Responsable del tratamiento
      </h2>
      <dl className="mt-3 grid grid-cols-1 gap-y-2 text-[0.95rem] text-gray-900">
        <div>
          <dt className="font-medium text-gray-700">Responsable</dt>
          <dd>Patricia Pérez Vicente</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-700">Nombre comercial</dt>
          <dd>Dharma en Ruta</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-700">NIF/CIF</dt>
          <dd>39923329K</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-700">Dirección</dt>
          <dd>Calle Francisco Chavarría 6, Bajo D, 43890, Hospitalet del Infante, Tarragona</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-700">Correo de contacto</dt>
          <dd>
            <a
              href="mailto:info@dharmenruta.com"
              className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm"
            >
              info@dharmenruta.com
            </a>
          </dd>
        </div>
        <div>
          <dt className="font-medium text-gray-700">Sitio web</dt>
          <dd>
            <a
              href="https://dharmenruta.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm"
            >
              https://dharmenruta.com
            </a>
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Dharma en Ruta ha adecuado su web a las exigencias del Reglamento (UE) 2016/679 (RGPD), la LOPDGDD 3/2018 y la LSSI 34/2002.
      </p>

      {/* 2. ¿Qué datos y cómo? */}
      <h2 id="origen-datos" className="mt-8 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        2. ¿Qué datos recogemos y cómo los obtenemos?
      </h2>

      <h3 id="origenes" className="mt-4 text-base font-semibold text-mossgreen font-gotu scroll-mt-24">
        2.1. Orígenes de los datos
      </h3>
      <ul role="list" className="mt-3 space-y-2 text-[0.95rem] text-gray-800 list-disc pl-5">
        <li role="listitem">Formularios de contacto (nombre, correo electrónico, asunto y mensaje).</li>
        <li role="listitem">Formularios de suscripción (nombre, correo electrónico y preferencias).</li>
        <li role="listitem">
          Registro/compra de cursos y acompañamientos (nombre, apellidos, dirección, país, datos de pago a través de pasarela segura, correo electrónico y contraseña).
        </li>
        <li role="listitem">Formulario de comentarios o comunidad (nombre, correo electrónico y contenido).</li>
        <li role="listitem">Datos de navegación e IP (dispositivo, navegador, páginas vistas, fecha/hora, referente).</li>
        <li role="listitem">
          Cookies (consulta la{" "}
          <Link to="/legal/cookies" className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">
            Política de Cookies
          </Link>
          ).
        </li>
      </ul>

      <h3 id="tipos" className="mt-4 text-base font-semibold text-mossgreen font-gotu scroll-mt-24">
        2.2. Tipos de datos
      </h3>
      <ul role="list" className="mt-3 space-y-2 text-[0.95rem] text-gray-800 list-disc pl-5">
        <li role="listitem"><strong>Identificativos y de contacto:</strong> nombre, apellidos, correo, país.</li>
        <li role="listitem"><strong>Transaccionales:</strong> datos de compra, productos/servicios contratados.</li>
        <li role="listitem"><strong>Facturación:</strong> dirección postal, país, NIF (si procede).</li>
        <li role="listitem"><strong>Técnicos/navegación:</strong> IP, identificadores de dispositivo, datos analíticos.</li>
        <li role="listitem"><strong>Preferencias:</strong> intereses formativos, áreas de la escuela.</li>
      </ul>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        No tratamos categorías especiales de datos (salud, religión, ideología, etc.). No recabamos datos de menores de 18 años sin consentimiento.
      </p>

      {/* 3. Finalidades */}
      <h2 id="finalidades" className="mt-8 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        3. Finalidades del tratamiento
      </h2>
      <ul role="list" className="mt-3 space-y-2 text-[0.95rem] text-gray-800 list-disc pl-5">
        <li role="listitem">Gestionar tu alta, compras y acceso a cursos/acompañamientos.</li>
        <li role="listitem">Atender consultas y comunicaciones (formulario o email).</li>
        <li role="listitem">Enviar información funcional sobre servicios contratados e incidencias.</li>
        <li role="listitem">Remitir newsletters y comunicaciones comerciales (si consientes).</li>
        <li role="listitem">Gestionar la comunidad (foros, comentarios, áreas privadas).</li>
        <li role="listitem">Mejorar la web mediante analítica y cookies.</li>
        <li role="listitem">Cumplir obligaciones legales (fiscales, contables y de seguridad).</li>
      </ul>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Podemos realizar segmentación básica (p. ej., por áreas de interés o actividad previa) para enviarte comunicaciones más relevantes. No tomamos decisiones automatizadas con efectos jurídicos.
      </p>

      {/* 4. Bases jurídicas */}
      <h2 id="bases" className="mt-8 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        4. Bases jurídicas del tratamiento
      </h2>
      <ul role="list" className="mt-3 space-y-2 text-[0.95rem] text-gray-800 list-disc pl-5">
        <li role="listitem"><strong>Ejecución de contrato/medidas precontractuales:</strong> compras, accesos, soporte.</li>
        <li role="listitem"><strong>Consentimiento:</strong> newsletters, comunicaciones comerciales, cookies no técnicas.</li>
        <li role="listitem"><strong>Interés legítimo:</strong> seguridad, prevención del fraude, mejora de servicios, estadísticas anónimas.</li>
        <li role="listitem"><strong>Cumplimiento legal:</strong> facturación y obligaciones fiscales/contables.</li>
      </ul>

      {/* 5. Conservación */}
      <h2 id="conservacion" className="mt-8 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        5. Conservación de datos
      </h2>
      <ul role="list" className="mt-3 space-y-2 text-[0.95rem] text-gray-800 list-disc pl-5">
        <li role="listitem"><strong>Cliente y facturación:</strong> durante la relación y el tiempo necesario para cumplir obligaciones legales y posibles responsabilidades.</li>
        <li role="listitem"><strong>Contacto/newsletters:</strong> hasta revocación del consentimiento o solicitud de supresión.</li>
        <li role="listitem"><strong>Técnicos/analíticos:</strong> según los plazos de cada cookie o herramienta (ver <Link to="/legal/cookies" className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">Política de Cookies</Link>).</li>
      </ul>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">Revisamos periódicamente los datos y bloqueamos o eliminamos los que ya no sean necesarios.</p>

      {/* 6. Destinatarios */}
      <h2 id="destinatarios" className="mt-8 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        6. Destinatarios y encargados de tratamiento
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Para prestar nuestros servicios utilizamos proveedores que tratan datos en nuestro nombre (encargados), con acuerdos conforme al RGPD:
      </p>
      <ul role="list" className="mt-3 space-y-2 text-[0.95rem] text-gray-800 list-disc pl-5">
        <li role="listitem">MailerLite (email marketing y automatizaciones).</li>
        <li role="listitem">Stripe (pasarela de pago).</li>
        <li role="listitem">Hotmart (alojamiento y gestión de cursos).</li>
        <li role="listitem">Google Analytics (analítica web).</li>
        <li role="listitem">Meta/Facebook Pixel (medición y publicidad).</li>
        <li role="listitem">Google Calendar (gestión de agenda/reservas).</li>
        <li role="listitem">IONOS (alojamiento).</li>
      </ul>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Algunos proveedores pueden estar fuera del EEE (p. ej., EE. UU.). En esos casos, se aplican cláusulas contractuales tipo u otras garantías adecuadas. No vendemos ni cedemos tus datos a terceros con fines comerciales.
      </p>

      {/* 7. Derechos */}
      <h2 id="derechos" className="mt-8 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        7. Derechos de las personas usuarias
      </h2>
      <ul role="list" className="mt-3 space-y-2 text-[0.95rem] text-gray-800 list-disc pl-5">
        <li role="listitem">Acceso, rectificación, supresión (olvido), limitación, oposición y portabilidad.</li>
        <li role="listitem">A no ser objeto de decisiones basadas únicamente en tratamientos automatizados.</li>
      </ul>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Para ejercerlos, escribe a <a href="mailto:info@dharmenruta.com" className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">info@dharmenruta.com</a> indicando tu nombre, medio de contacto y el derecho que deseas ejercer. Podemos solicitar información adicional para verificar tu identidad.
      </p>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Asimismo, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD):{" "}
        <a
          href="https://www.aepd.es"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm"
        >
          www.aepd.es
        </a>.
      </p>

      {/* 8. Seguridad */}
      <h2 id="seguridad" className="mt-8 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        8. Seguridad de los datos
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Aplicamos medidas técnicas y organizativas razonables (control de accesos, cifrado TLS/SSL, copias de seguridad, contraseñas robustas, políticas internas).
        Ningún sistema es 100% inviolable en Internet. En caso de incidente que afecte a datos personales, notificaremos sin dilación indebida, con medidas adoptadas y recomendaciones.
      </p>

      {/* 9. Veracidad */}
      <h2 id="veracidad" className="mt-8 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        9. Veracidad y actualización de los datos
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Eres responsable de que los datos facilitados sean veraces, exactos y estén actualizados; te comprometes a comunicarnos cualquier modificación. Dharma en Ruta no se hace responsable por datos inexactos si no nos lo notificas.
      </p>

      {/* 10. Redes sociales */}
      <h2 id="redes" className="mt-8 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        10. Redes sociales
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Podemos tener presencia en redes sociales. El tratamiento de los datos de quienes se hagan seguidoras de nuestras cuentas se rige por esta política, por las condiciones de uso y por las políticas de privacidad de cada plataforma.
        No utilizaremos los perfiles para envíos publicitarios individuales sin consentimiento.
      </p>

      {/* 11. Cookies */}
      <h2 id="cookies" className="mt-8 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        11. Cookies y tecnologías similares
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Este sitio utiliza cookies propias y de terceros (técnicas, analíticas, publicitarias). Al acceder, mostramos un banner de consentimiento para aceptar, rechazar o configurar preferencias. Consulta la{" "}
        <Link to="/legal/cookies" className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">
          Política de Cookies
        </Link>{" "}
        para detalle de cada cookie, finalidad, duración y cómo desactivarlas en tu navegador.
      </p>

      {/* 12. Formularios */}
      <h2 id="formularios" className="mt-8 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        12. Formularios y sistemas de captura
      </h2>
      <ul role="list" className="mt-3 space-y-2 text-[0.95rem] text-gray-800 list-disc pl-5">
        <li role="listitem"><strong>Contacto:</strong> atender solicitudes y resolver dudas.</li>
        <li role="listitem"><strong>Suscripción:</strong> envío de contenidos y comunicaciones comerciales (con consentimiento).</li>
        <li role="listitem"><strong>Registro/compra:</strong> gestión de usuarios, acceso a cursos y facturación.</li>
        <li role="listitem"><strong>Comentarios/comunidad:</strong> mostrar y moderar comentarios, garantizar la convivencia.</li>
      </ul>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        El envío de formularios implica que nos autorizas a usar los datos solo para el fin indicado en cada caso.
      </p>

      {/* 13. Comunicaciones comerciales */}
      <h2 id="comerciales" className="mt-8 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        13. Comunicaciones comerciales
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Conforme a la LSSI, no realizamos SPAM. En cada formulario podrás consentir el envío de comunicaciones. Podrás darte de baja en cualquier momento desde el enlace incluido en cada email o escribiendo a{" "}
        <a href="mailto:info@dharmaenruta.com" className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">info@dharmaenruta.com</a>.
      </p>

      {/* 14. Cambios */}
      <h2 id="cambios" className="mt-8 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        14. Cambios en la Política de Privacidad
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Podemos actualizar esta política para reflejar cambios legales o del servicio. Publicaremos la versión más reciente con fecha de última actualización. Te recomendamos revisarla periódicamente.
      </p>

      {/* 15. Contacto */}
      <h2 id="contacto" className="mt-8 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        15. Contacto
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Para cuestiones relacionadas con esta Política o para ejercer tus derechos, escríbenos a{" "}
        <a href="mailto:info@dharmenruta.com" className="underline underline-offset-4 hover:text-mossgreen focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">info@dharmenruta.com</a>.
      </p>
    </SimplePageLayout>
  );
}
