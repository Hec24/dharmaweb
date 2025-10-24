// src/pages/AvisoLegalPage.tsx
import { Link } from "react-router-dom";
import SimplePageLayout from "../layouts/SimplePageLayout";

export default function AvisoLegalPage() {
  return (
    <SimplePageLayout
      title="Aviso Legal"
      subtitle="Información general y condiciones de uso del sitio."
      lastUpdated="14 de septiembre de 2025"
      maxWidthClass="max-w-3xl"
    >
      {/* Índice de contenidos */}
      <nav aria-label="Índice de contenidos" className="mb-6">
        <ul className="list-disc pl-5 grid gap-1 text-[0.95rem] text-gray-700" role="list">
          <li role="listitem"><a className="underline underline-offset-4 hover:text-mossgreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm" href="#identificacion">1.1 Identificación del responsable</a></li>
          <li role="listitem"><a className="underline underline-offset-4 hover:text-mossgreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm" href="#finalidad">1.2 Finalidad de la página web</a></li>
          <li role="listitem"><a className="underline underline-offset-4 hover:text-mossgreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm" href="#uso-condiciones">1.3 Condiciones de uso</a></li>
          <li role="listitem" className="ml-4"><a className="underline underline-offset-4 hover:text-mossgreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm" href="#seguridad">1.3.1 Medidas de seguridad</a></li>
          <li role="listitem" className="ml-4"><a className="underline underline-offset-4 hover:text-mossgreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm" href="#captura-datos">1.3.2 Captura de información y datos personales</a></li>
          <li role="listitem" className="ml-4"><a className="underline underline-offset-4 hover:text-mossgreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm" href="#contenidos">1.3.3 Contenidos</a></li>
          <li role="listitem"><a className="underline underline-offset-4 hover:text-mossgreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm" href="#propiedad">2. Propiedad intelectual e industrial</a></li>
          <li role="listitem"><a className="underline underline-offset-4 hover:text-mossgreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm" href="#exclusion">3. Exclusión de garantías y responsabilidad</a></li>
          <li role="listitem"><a className="underline underline-offset-4 hover:text-mossgreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm" href="#modificaciones">4. Modificaciones</a></li>
          <li role="listitem"><a className="underline underline-offset-4 hover:text-mossgreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm" href="#enlaces">5. Enlaces de interés a otros sitios web</a></li>
          <li role="listitem"><a className="underline underline-offset-4 hover:text-mossgreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm" href="#derecho-exclusion">6. Derecho de exclusión</a></li>
          <li role="listitem"><a className="underline underline-offset-4 hover:text-mossgreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm" href="#generalidades">7. Generalidades</a></li>
          <li role="listitem"><a className="underline underline-offset-4 hover:text-mossgreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm" href="#modificacion-duracion">8. Modificación de las condiciones y duración</a></li>
          <li role="listitem"><a className="underline underline-offset-4 hover:text-mossgreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm" href="#reclamaciones">9. Reclamaciones y dudas</a></li>
          <li role="listitem"><a className="underline underline-offset-4 hover:text-mossgreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm" href="#jurisdiccion">10. Jurisdicción</a></li>
        </ul>
      </nav>

      {/* 1.1 Identificación */}
      <h2 id="identificacion" className="text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        1.1 Datos identificativos del responsable
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Tal y como recoge la Ley 34/2002, de 11 de julio, de servicios de la sociedad de la
        información y de comercio electrónico (LSSI-CE), se informa de que este sitio web es operado por:
      </p>
      <dl className="mt-4 grid grid-cols-1 gap-y-2 text-[0.95rem] text-gray-900">
        <div>
          <dt className="font-medium text-gray-700">Identidad del responsable</dt>
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
          <dd>Calle Francisco Chavarría 6, bjo D, 43890, Hospitalet del Infante, Tarragona</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-700">Correo electrónico</dt>
          <dd>
            <a
              className="underline underline-offset-4 hover:text-mossgreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm"
              href="mailto:info@dharmenruta.com"
            >
              info@dharmenruta.com
            </a>
          </dd>
        </div>
        <div>
          <dt className="font-medium text-gray-700">Sitio web</dt>
          <dd>
            <a
              className="underline underline-offset-4 hover:text-mossgreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm"
              href="https://dharmenruta.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://dharmenruta.com
            </a>
          </dd>
        </div>
        <div>
          <dt className="font-medium text-gray-700">Actividad</dt>
          <dd>
            Formación online, acompañamientos personalizados y asesorías relacionadas con yoga,
            autoconocimiento, bienestar y otros ámbitos de vida.
          </dd>
        </div>
      </dl>

      {/* 1.2 Finalidad */}
      <h2 id="finalidad" className="mt-8 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        1.2 Finalidad de la página web
      </h2>
      <ul className="mt-3 space-y-2 text-[0.95rem] leading-relaxed text-gray-800 list-disc pl-5" role="list">
        <li role="listitem">Venta de servicios y formaciones propias y de terceros.</li>
        <li role="listitem">
          Supervisor de contenidos y recursos relacionados con las áreas de la escuela (yoga,
          autoconocimiento, finanzas conscientes, minimalismo, vínculos, etc.).
        </li>
        <li role="listitem">Gestión de suscriptores y usuarios registrados en la plataforma.</li>
        <li role="listitem">
          Envío de comunicaciones relacionadas con los productos y servicios contratados,
          incidencias técnicas, actualizaciones de seguridad y/o información relevante para su
          correcta ejecución.
        </li>
      </ul>

      {/* 1.3 Condiciones */}
      <h2 id="uso-condiciones" className="mt-8 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        1.3 Condiciones de uso
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        El acceso y/o uso de este sitio web atribuye la condición de <strong>USUARIO</strong> y
        supone la aceptación plena de todas las cláusulas y condiciones de uso incluidas en las
        páginas:{" "}
        <Link to="/legal/aviso-legal" className="underline underline-offset-4 hover:text-mossgreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">Aviso legal</Link>
        ,{" "}
        <Link to="/legal/privacidad" className="underline underline-offset-4 hover:text-mossgreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">Política de Privacidad</Link>
        ,{" "}
        <Link to="/legal/cookies" className="underline underline-offset-4 hover:text-mossgreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">Política de cookies</Link>{" "}
        y{" "}
        <Link to="/legal/terminos" className="underline underline-offset-4 hover:text-mossgreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">Términos y condiciones</Link>
        . Si no está conforme, le rogamos se abstenga de utilizar este sitio web.
      </p>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        El acceso a este sitio web no supone, en modo alguno, el inicio de una relación comercial
        con la Titular. A través de este sitio, la Titular facilita el acceso a contenidos propios o
        de colaboradores publicados mediante Internet. El USUARIO se compromete a no utilizar los
        contenidos con fines o efectos ilícitos, lesivos de derechos e intereses de terceros o que
        puedan impedir la normal utilización del sitio web y sus sistemas.
      </p>

      {/* 1.3.1 Medidas de seguridad */}
      <h3 id="seguridad" className="mt-8 text-base font-semibold text-mossgreen font-gotu scroll-mt-24">
        1.3.1 Medidas de seguridad
      </h3>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Los datos personales que facilite el USUARIO podrán almacenarse en bases de datos
        titularidad exclusiva de la Titular, quien adopta medidas técnicas y organizativas para
        garantizar la confidencialidad, integridad y disponibilidad de la información, conforme a la
        normativa vigente. No obstante, las medidas en Internet no son inexpugnables y no puede
        garantizarse la inexistencia de virus u otros elementos dañinos, si bien la Titular emplea
        todos los medios razonables para evitarlos.
      </p>

      {/* 1.3.2 Captura de datos */}
      <h3 id="captura-datos" className="mt-8 text-base font-semibold text-mossgreen font-gotu scroll-mt-24">
        1.3.2 Captura de información y datos personales
      </h3>
      <ul className="mt-3 space-y-2 text-[0.95rem] leading-relaxed text-gray-800 list-disc pl-5" role="list">
        <li role="listitem"><strong>Formulario de contacto:</strong> nombre, correo y los datos que el USUARIO aporte para atender consultas.</li>
        <li role="listitem"><strong>Registro/compra/suscripción:</strong> datos identificativos, de acceso y de pago para gestionar altas, acceso a cursos/acompañamientos, facturación y soporte.</li>
        <li role="listitem"><strong>Navegación e IP:</strong> IP, fecha/hora, referente, SO y navegador, con fines estadísticos y de mejora. La AEPD considera la IP dato personal.</li>
        <li role="listitem"><strong>Cookies:</strong> ver la <Link to="/legal/cookies" className="underline underline-offset-4 hover:text-mossgreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">Política de Cookies</Link>.</li>
        <li role="listitem">
          <strong>Plataformas de terceros utilizadas:</strong> MailerLite (email marketing), Stripe (pagos), Hotmart (gestión de cursos), Google Analytics (analítica), Facebook Pixel (publicidad), Google Calendar (reservas/agenda) e IONOS (hosting). Actúan como encargados del tratamiento con garantías RGPD.
        </li>
      </ul>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Los usuarios pueden darse de baja de los servicios y ejercer sus derechos de protección de
        datos según lo indicado en la{" "}
        <Link to="/legal/privacidad" className="underline underline-offset-4 hover:text-mossgreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm">
          Política de Privacidad
        </Link>.
      </p>

      {/* 1.3.3 Contenidos */}
      <h3 id="contenidos" className="mt-8 text-base font-semibold text-mossgreen font-gotu scroll-mt-24">
        1.3.3 Contenidos
      </h3>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        La Titular obtiene información y materiales de fuentes consideradas confiables y adopta
        medidas razonables para su exactitud. No obstante, no garantiza que los contenidos sean
        exactos, completos o actualizados y declina responsabilidad por errores u omisiones. Está
        prohibido transmitir contenido ilícito o que vulnere derechos (incluido software malicioso).
      </p>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Los contenidos son informativos y no constituyen, salvo indicación expresa, oferta
        vinculante. La Titular podrá modificar, suspender o restringir contenidos, enlaces o
        información sin previo aviso. No será responsable de daños derivados del uso de la
        información del sitio o de sus redes sociales.
      </p>

      {/* 2. Propiedad intelectual */}
      <h2 id="propiedad" className="mt-10 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        2. Propiedad intelectual e industrial
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Todos los derechos sobre los contenidos del sitio (textos, imágenes, vídeos, diseños,
        logotipos, materiales descargables, estructura, bases de datos, etc.) pertenecen a la
        Titular o a terceros colaboradores y están protegidos por la normativa vigente. Queda
        prohibida su reproducción, distribución, comunicación pública, transformación o cualquier
        forma de explotación, total o parcial, sin autorización previa y por escrito.
      </p>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        El diseño y los materiales constituyen obra protegida. Cualquier uso indebido o plagio podrá
        ser puesto en conocimiento de las autoridades competentes.
      </p>

      {/* 3. Exclusión de garantías */}
      <h2 id="exclusion" className="mt-10 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        3. Exclusión de garantías y responsabilidad
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        La Titular no garantiza la disponibilidad continua del sitio y podrá interrumpirlo por
        mantenimiento u otras causas. A pesar de las medidas adoptadas, no se responsabiliza de la
        presencia de virus u otros elementos que puedan producir alteraciones en el sistema del
        USUARIO. Tampoco será responsable por daños y perjuicios derivados de errores u omisiones en
        los contenidos o falta de disponibilidad del sitio.
      </p>

      {/* 4. Modificaciones */}
      <h2 id="modificaciones" className="mt-10 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        4. Modificaciones
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        La Titular se reserva el derecho a realizar, sin previo aviso, las modificaciones que
        considere oportunas en el sitio web, pudiendo cambiar, suprimir o añadir contenidos y
        servicios, así como la forma de presentación o localización de estos.
      </p>

      {/* 5. Enlaces */}
      <h2 id="enlaces" className="mt-10 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        5. Enlaces de interés a otros sitios web
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        El sitio puede incluir enlaces a páginas de terceros. Su existencia no implica recomendación
        ni aprobación alguna. Son páginas fuera del control de la Titular, que no se hace
        responsable de su contenido ni del resultado al seguir dichos enlaces. Al acceder a un sitio
        externo, el USUARIO deberá leer su propia política de privacidad y aviso legal.
      </p>

      {/* 6. Derecho de exclusión */}
      <h2 id="derecho-exclusion" className="mt-10 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        6. Derecho de exclusión
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        La Titular se reserva el derecho a denegar o retirar el acceso al sitio y/o a los servicios
        ofrecidos, sin necesidad de previo aviso, por iniciativa propia o a petición de tercero, a
        los usuarios que incumplan las condiciones presentes.
      </p>

      {/* 7. Generalidades */}
      <h2 id="generalidades" className="mt-10 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        7. Generalidades
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        La Titular perseguirá el incumplimiento de estas condiciones, así como cualquier uso indebido
        del sitio web, ejercitando todas las acciones civiles y penales que correspondan.
      </p>

      {/* 8. Modificación y duración */}
      <h2 id="modificacion-duracion" className="mt-10 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        8. Modificación de las condiciones y duración
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        La Titular podrá modificar en cualquier momento las condiciones aquí determinadas,
        publicándolas como aparecen. La vigencia de estas condiciones irá en función de su exposición
        y estarán vigentes hasta que sean modificadas por otras debidamente publicadas.
      </p>

      {/* 9. Reclamaciones */}
      <h2 id="reclamaciones" className="mt-10 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        9. Reclamaciones y dudas
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Existen hojas de reclamación a disposición de usuarios y clientes. Puede enviar un correo a{" "}
        <a
          href="mailto:info@dharmenruta.com"
          className="underline underline-offset-4 hover:text-mossgreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm"
        >
          info@dharmenruta.com
        </a>, indicando su nombre y apellidos, el servicio o producto adquirido y los motivos de su
        reclamación. También puede dirigirla por correo postal a: Calle Francisco Chavarría 6, Bjo D,
        43890 Hospitalet del Infante, Tarragona.
      </p>

      {/* 10. Jurisdicción */}
      <h2 id="jurisdiccion" className="mt-10 text-lg font-semibold text-mossgreen font-gotu scroll-mt-24">
        10. Jurisdicción
      </h2>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
        Este Aviso Legal se rige íntegramente por la legislación española. Salvo norma imperativa en
        contrario, para cuantas cuestiones se susciten sobre la interpretación, aplicación y
        cumplimiento de este Aviso Legal, las partes se someten a los Juzgados y Tribunales de
        Tarragona, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.
      </p>
    </SimplePageLayout>
  );
}
