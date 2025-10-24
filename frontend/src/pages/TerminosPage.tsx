// src/pages/TerminosPage.tsx
import SimplePageLayout from "../layouts/SimplePageLayout";
import { Link } from "react-router-dom";

export default function TerminosPage() {
  return (
    <SimplePageLayout
      title="Términos y Condiciones"
      subtitle="Reglas de uso, contratación y responsabilidades."
      lastUpdated="24 de octubre de 2025"
      maxWidthClass="max-w-3xl"
    >
      {/* Índice accesible */}
      <nav
        aria-label="Índice de contenidos de Términos y Condiciones"
        className="mb-8 rounded-xl border border-raw/20 bg-linen/60 p-4"
      >
        <p className="text-sm font-medium text-mossgreen font-gotu">Índice</p>
        <ol className="mt-2 grid gap-1 text-[0.95rem] text-gray-800 sm:grid-cols-2">
          <li><a className="underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded" href="#identificacion">1. Identificación de las partes</a></li>
          <li><a className="underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded" href="#objeto-condiciones">2. Objeto de las condiciones generales</a></li>
          <li><a className="underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded" href="#descripcion">3. Descripción</a></li>
          <li><a className="underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded" href="#proceso-contratacion">4. Proceso de contratación</a></li>
          <li><a className="underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded" href="#precio">5. Precio, impuestos y formas de pago</a></li>
          <li><a className="underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded" href="#desistimiento">6. Derecho de desistimiento, cancelaciones y devoluciones</a></li>
          <li><a className="underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded" href="#uso-conducta">7. Uso adecuado y conducta</a></li>
          <li><a className="underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded" href="#propiedad">8. Propiedad intelectual e industrial</a></li>
          <li><a className="underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded" href="#precios-colaboradores">9. Política de precios y colaboradores</a></li>
          <li><a className="underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded" href="#limitacion">10. Limitación de responsabilidad</a></li>
          <li><a className="underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded" href="#datos">11. Protección de datos personales</a></li>
          <li><a className="underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded" href="#modificaciones">12. Modificaciones</a></li>
          <li><a className="underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded" href="#ley">13. Jurisdicción y ley aplicable</a></li>
        </ol>
      </nav>

      {/* 1 */}
      <section id="identificacion" aria-labelledby="identificacion-title" className="scroll-mt-28">
        <h2 id="identificacion-title" className="text-lg font-semibold text-mossgreen font-gotu">
          1. Identificación de las partes
        </h2>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
          Tal y como recoge la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de
          Comercio Electrónico (LSSI-CE), se informa que este sitio web es operado por (en adelante, el “Proveedor”):
        </p>
        <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-600">Identidad de la responsable</dt>
            <dd className="text-[0.95rem] text-gray-800">Patricia Pérez Vicente</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-600">Nombre comercial</dt>
            <dd className="text-[0.95rem] text-gray-800">Dharma en Ruta</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-600">NIF/CIF</dt>
            <dd className="text-[0.95rem] text-gray-800">39923329K</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-600">Dirección</dt>
            <dd className="text-[0.95rem] text-gray-800">
              Calle Francisco Chavarría 6, Bj D, 43890, L’Hospitalet de l’Infant, Tarragona
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-600">Email (notificaciones)</dt>
            <dd className="text-[0.95rem] text-gray-800">
              <a className="underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
                 href="mailto:info@dharmaenruta.com">info@dharmaenruta.com</a>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-600">Sitio web</dt>
            <dd className="text-[0.95rem] text-gray-800">
              <a className="underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
                 href="https://dharmaenruta.com" target="_blank" rel="noreferrer">https://dharmaenruta.com</a>
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-600">Actividad</dt>
            <dd className="text-[0.95rem] text-gray-800">
              Formación online, acompañamientos personalizados y asesorías relacionadas con yoga, autoconocimiento,
              bienestar y otros ámbitos de vida.
            </dd>
          </div>
        </dl>
      </section>

      {/* 2 */}
      <section id="objeto-condiciones" aria-labelledby="objeto-condiciones-title" className="mt-8 scroll-mt-28">
        <h2 id="objeto-condiciones-title" className="text-lg font-semibold text-mossgreen font-gotu">
          2. Objeto de las condiciones generales
        </h2>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
          Las presentes Condiciones Generales regulan las relaciones contractuales entre el Proveedor y los usuarios
          (en adelante, el “Cliente”) en relación con la contratación de servicios y productos ofrecidos a través del
          sitio web <span className="whitespace-nowrap">https://dharmaenruta.com</span>. Estas condiciones permanecerán vigentes mientras estén publicadas
          en la web. El Proveedor se reserva el derecho de modificarlas sin previo aviso, siendo aplicables las que
          estén en vigor en el momento de la compra.
        </p>
      </section>

      {/* 3 */}
      <section id="descripcion" aria-labelledby="descripcion-title" className="mt-8 scroll-mt-28">
        <h2 id="descripcion-title" className="text-lg font-semibold text-mossgreen font-gotu">3. Descripción</h2>
        <ul role="list" className="mt-3 list-disc space-y-2 pl-6 text-[0.95rem] text-gray-800">
          <li><strong>Cursos y formaciones online:</strong> contenidos digitales pregrabados, accesibles a través de plataformas externas (Hotmart u otras).</li>
          <li><strong>Acompañamientos personalizados (1:1)</strong> y sesiones individuales con profesionales colaboradores.</li>
          <li><strong>Recursos descargables y materiales digitales</strong> (cuadernos de trabajo, meditaciones, guías, etc.).</li>
          <li><strong>Eventos y encuentros virtuales</strong> (webinars, masterclasses, charlas).</li>
          <li><strong>Espacios de comunidad y aprendizaje colaborativo</strong>, cuando estén disponibles.</li>
        </ul>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
          Todos los servicios tienen una finalidad formativa o de acompañamiento personal, sin constituir asesoramiento
          médico, psicológico ni sanitario.
        </p>
      </section>

      {/* 4 */}
      <section id="proceso-contratacion" aria-labelledby="proceso-title" className="mt-8 scroll-mt-28">
        <h2 id="proceso-title" className="text-lg font-semibold text-mossgreen font-gotu">4. Proceso de contratación</h2>

        <h3 className="mt-4 text-base font-semibold text-asparragus">4.1. Fases del proceso</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-6 text-[0.95rem] text-gray-800">
          <li><strong>Selección del servicio o curso.</strong> El Cliente elige el producto en la web y revisa las condiciones específicas.</li>
          <li><strong>Pago y confirmación.</strong> El pago se efectúa mediante Stripe o Hotmart, según corresponda.</li>
          <li><strong>Acceso al contenido o reserva de sesión.</strong> Tras confirmar el pago, el Cliente recibe un correo con instrucciones o acceso.</li>
        </ol>

        <h3 className="mt-6 text-base font-semibold text-asparragus">4.2. Plataformas externas</h3>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-gray-800">
          Algunos cursos o productos se ofrecen y gestionan mediante plataformas externas como Hotmart, Stripe,
          MailerLite o Google Calendar, aplicando además sus propios términos y políticas de privacidad.
        </p>
      </section>

      {/* 5 */}
      <section id="precio" aria-labelledby="precio-title" className="mt-8 scroll-mt-28">
        <h2 id="precio-title" className="text-lg font-semibold text-mossgreen font-gotu">
          5. Precio, impuestos y formas de pago
        </h2>
        <ul role="list" className="mt-3 list-disc space-y-2 pl-6 text-[0.95rem] text-gray-800">
          <li>Todos los precios se muestran en euros (€) e incluyen los impuestos aplicables (IVA) salvo indicación contraria.</li>
          <li>Las transacciones se procesan en entornos seguros (SSL).</li>
          <li className="space-y-1">
            <p className="font-medium">Métodos de pago aceptados:</p>
            <ul className="list-disc pl-6">
              <li>Tarjeta bancaria (Stripe)</li>
              <li>Compra directa en Hotmart</li>
            </ul>
          </li>
          <li>El Proveedor no almacena datos de pago. Las condiciones específicas de facturación se detallan en cada servicio.</li>
        </ul>
      </section>

      {/* 6 */}
      <section id="desistimiento" aria-labelledby="desistimiento-title" className="mt-8 scroll-mt-28">
        <h2 id="desistimiento-title" className="text-lg font-semibold text-mossgreen font-gotu">
          6. Derecho de desistimiento, cancelaciones y devoluciones
        </h2>

        <h3 className="mt-4 text-base font-semibold text-asparragus">6.1. Productos y cursos digitales en Hotmart</h3>
        <ul role="list" className="mt-2 list-disc space-y-2 pl-6 text-[0.95rem] text-gray-800">
          <li>Hotmart ofrece una garantía comercial de 14 días naturales desde la compra.</li>
          <li>Durante ese plazo, el Cliente puede solicitar el reembolso directamente a través de su cuenta de Hotmart.</li>
          <li>Transcurrido dicho plazo, no se aceptarán devoluciones, salvo error técnico no solventable por el Proveedor.</li>
        </ul>

        <h3 className="mt-6 text-base font-semibold text-asparragus">6.2. Productos digitales propios (pagos por Stripe o web)</h3>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-gray-800">
          De acuerdo con el artículo 103.m del Real Decreto Legislativo 1/2007, el derecho de desistimiento no será
          aplicable al suministro de contenido digital no prestado en soporte material, cuando la ejecución haya
          comenzado con el consentimiento expreso del consumidor y el reconocimiento de la pérdida de este derecho.
        </p>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
          Por tanto, antes de completar el pago, el Cliente verá la siguiente cláusula:
        </p>
        <blockquote className="mt-3 border-l-4 border-asparragus/50 bg-linen/60 p-3 text-[0.95rem] italic text-gray-800">
          “Al hacer clic en ‘Comprar ahora’, entiendo y acepto que, al obtener acceso inmediato al contenido digital, pierdo mi derecho de desistimiento.”
        </blockquote>
        <ul role="list" className="mt-3 list-disc space-y-2 pl-6 text-[0.95rem] text-gray-800">
          <li>Una vez obtenido el acceso al curso o material digital, no procede devolución ni reembolso.</li>
          <li>En caso de incidencias técnicas que impidan el acceso, el Proveedor ofrecerá soporte y, si no se resuelve en un plazo razonable, podrá emitir una devolución excepcional.</li>
        </ul>

        <h3 className="mt-6 text-base font-semibold text-asparragus">6.3. Acompañamientos personalizados (1:1)</h3>
        <ul role="list" className="mt-2 list-disc space-y-2 pl-6 text-[0.95rem] text-gray-800">
          <li>Reprogramación posible avisando con un mínimo de 48 horas de antelación.</li>
          <li>Cancelaciones con menos de 24 horas no dan derecho a reembolso.</li>
          <li>Si el profesional cancela o hay causa de fuerza mayor, se ofrecerá nueva fecha o reembolso íntegro.</li>
          <li>Una vez realizada la sesión, no se contemplan devoluciones.</li>
        </ul>

        <h3 className="mt-6 text-base font-semibold text-asparragus">6.4. Eventos, talleres o actividades puntuales</h3>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-gray-800">
          Las condiciones específicas (plazos de cancelación, reembolso o cambio de fecha) se detallarán en cada evento o actividad.
        </p>
      </section>

      {/* 7 */}
      <section id="uso-conducta" aria-labelledby="uso-conducta-title" className="mt-8 scroll-mt-28">
        <h2 id="uso-conducta-title" className="text-lg font-semibold text-mossgreen font-gotu">
          7. Uso adecuado y conducta
        </h2>
        <ul role="list" className="mt-3 list-disc space-y-2 pl-6 text-[0.95rem] text-gray-800">
          <li>Uso personal, ético y no comercial de los contenidos adquiridos.</li>
          <li>No compartir accesos, materiales o claves con terceros.</li>
          <li>Comportamiento respetuoso en sesiones o espacios comunitarios.</li>
        </ul>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
          El incumplimiento podrá suponer la suspensión inmediata del acceso sin derecho a reembolso.
        </p>
      </section>

      {/* 8 */}
      <section id="propiedad" aria-labelledby="propiedad-title" className="mt-8 scroll-mt-28">
        <h2 id="propiedad-title" className="text-lg font-semibold text-mossgreen font-gotu">
          8. Propiedad intelectual e industrial
        </h2>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
          Todos los contenidos de Dharma en Ruta —incluidos vídeos, textos, audios, documentos, logotipos, gráficos,
          materiales descargables, cursos y formaciones— están protegidos por la legislación de Propiedad Intelectual e
          Industrial. El Cliente obtiene una licencia limitada, personal y no transferible para uso individual.
        </p>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
          Queda prohibida cualquier reproducción, distribución, comunicación pública o comercialización sin
          autorización expresa y por escrito del Proveedor. El incumplimiento podrá derivar en reclamaciones legales y
          la suspensión inmediata del acceso.
        </p>
      </section>

      {/* 9 */}
      <section id="precios-colaboradores" aria-labelledby="precios-colaboradores-title" className="mt-8 scroll-mt-28">
        <h2 id="precios-colaboradores-title" className="text-lg font-semibold text-mossgreen font-gotu">
          9. Política de precios y colaboradores
        </h2>
        <ul role="list" className="mt-3 list-disc space-y-2 pl-6 text-[0.95rem] text-gray-800">
          <li>Los precios de cursos y acompañamientos se establecen dentro de una horquilla consensuada, garantizando coherencia y accesibilidad.</li>
          <li>Los colaboradores perciben un porcentaje de los ingresos netos generados por sus cursos o servicios según el acuerdo o contrato correspondiente.</li>
          <li>La escuela retiene un porcentaje en concepto de gestión, soporte técnico y mantenimiento de la plataforma.</li>
        </ul>
        <h3 className="mt-4 text-base font-semibold text-asparragus">Política de no competencia</h3>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-gray-800">
          Los colaboradores se comprometen a no ofrecer fuera de Dharma en Ruta contenidos idénticos o equivalentes
          durante el periodo de colaboración, ni a captar alumnos de la plataforma para servicios externos. Esta
          política protege la integridad, la sostenibilidad y el espíritu colaborativo de la escuela.
        </p>
      </section>

      {/* 10 */}
      <section id="limitacion" aria-labelledby="limitacion-title" className="mt-8 scroll-mt-28">
        <h2 id="limitacion-title" className="text-lg font-semibold text-mossgreen font-gotu">
          10. Limitación de responsabilidad
        </h2>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
          El Proveedor no garantiza la disponibilidad ininterrumpida de la web o sus contenidos en casos de
          mantenimiento, actualizaciones o causas ajenas. El uso de los contenidos es responsabilidad del Cliente;
          Dharma en Ruta no asume responsabilidad por resultados personales, decisiones o interpretaciones derivadas del
          uso del material formativo.
        </p>
      </section>

      {/* 11 */}
      <section id="datos" aria-labelledby="datos-title" className="mt-8 scroll-mt-28">
        <h2 id="datos-title" className="text-lg font-semibold text-mossgreen font-gotu">
          11. Protección de datos personales
        </h2>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
          El tratamiento de los datos personales se regirá por la Política de Privacidad publicada en:
          {" "}
          <a
            className="underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
            href="https://dharmaenruta.com/politica-privacidad"
            target="_blank"
            rel="noreferrer"
          >
            https://dharmaenruta.com/politica-privacidad
          </a>.
        </p>
      </section>

      {/* 12 */}
      <section id="modificaciones" aria-labelledby="modificaciones-title" className="mt-8 scroll-mt-28">
        <h2 id="modificaciones-title" className="text-lg font-semibold text-mossgreen font-gotu">
          12. Modificaciones
        </h2>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
          El Proveedor podrá modificar estas condiciones en cualquier momento. Las nuevas condiciones serán aplicables
          desde su publicación en el sitio web. La contratación posterior implica la aceptación de dichas modificaciones.
        </p>
      </section>

      {/* 13 */}
      <section id="ley" aria-labelledby="ley-title" className="mt-8 scroll-mt-28">
        <h2 id="ley-title" className="text-lg font-semibold text-mossgreen font-gotu">
          13. Jurisdicción y ley aplicable
        </h2>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-800">
          Estas condiciones se rigen por la legislación española. Para la resolución de cualquier conflicto, las partes
          se someten a los Juzgados y Tribunales de Tarragona, salvo que la ley imponga otro fuero imperativo.
        </p>
      </section>

      {/* CTA contextual opcional */}
      <div className="mt-10 rounded-2xl border border-raw/30 bg-linen/70 p-4 sm:p-5">
        <p className="text-[0.95rem] text-gray-800">
          ¿Tienes dudas legales o sobre un servicio concreto?{" "}
          <Link
            to="/contacto"
            className="font-medium text-asparragus underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
          >
            Escríbenos desde la página de contacto
          </Link>.
        </p>
      </div>
    </SimplePageLayout>
  );
}
