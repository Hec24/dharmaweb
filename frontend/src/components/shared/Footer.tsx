// src/Components/layout/Footer.tsx
import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebook, FaYoutube, FaWhatsapp, FaTelegram } from "react-icons/fa";
import { ROUTES } from "../../constants/routes";
import { LINKS } from "../../constants/links";
import NewsletterForm from "../ui/NewsletterForm";
import { useNewsletterSubscription } from "../../hooks/useNewsletterSubscription";

const Footer: React.FC = () => {
  const { subscribe, status, error, setStatus } = useNewsletterSubscription("footer");

  const SocialIcon = ({
    href,
    label,
    children,
  }: {
    href?: string;
    label: string;
    children: React.ReactNode;
  }) => {
    const valid = href && href.trim().length > 0;
    const base = "inline-flex h-6 w-6 items-center justify-center";
    const link =
      "text-linen hover:text-gold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2 focus-visible:ring-offset-asparragus rounded";
    return valid ? (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={link}>
        <span className={`${base} hover:scale-110 transition-transform`}>{children}</span>
      </a>
    ) : (
      <span className="opacity-40 cursor-not-allowed" aria-hidden>
        <span className={base}>{children}</span>
      </span>
    );
  };

  return (
    <footer className="bg-asparragus text-linen border-t border-gold/15" aria-labelledby="site-footer-title">
      <h2 id="site-footer-title" className="sr-only">
        Pie de página
      </h2>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Grid principal */}
        {/* Mobile: 1 col; Tablet: 2 cols con Newsletter a ancho completo; Desktop: 12 cols simétrico 4/4/4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-12 items-start">
          {/* Columna 1 — Branding (lg: 4/12) */}
          <div className="min-w-0 text-center sm:text-left lg:col-span-4">
            <h3 className="font-gotu text-xl text-gold mb-4 break-words">Dharma en Ruta</h3>
            <p className="font-degular mb-6 px-4 sm:px-0 text-linen/90 leading-relaxed max-w-prose">
            Tu escuela nómada para vivir con libertad y coherencia, uniendo conocimiento, práctica y guía para crear la vida que quieres vivir.
            </p>

            <div className="flex flex-wrap gap-4 justify-center sm:justify-start" role="list" aria-label="Redes sociales">
              <span role="listitem">
                <SocialIcon href={LINKS.instagram} label="Instagram">
                  <FaInstagram className="h-5 w-5" />
                </SocialIcon>
              </span>
              <span role="listitem">
                <SocialIcon href={LINKS.facebook} label="Facebook">
                  <FaFacebook className="h-5 w-5" />
                </SocialIcon>
              </span>
              <span role="listitem">
                <SocialIcon href={LINKS.youtube} label="YouTube">
                  <FaYoutube className="h-5 w-5" />
                </SocialIcon>
              </span>
              <span role="listitem">
                <SocialIcon href={LINKS.whatsapp} label="WhatsApp">
                  <FaWhatsapp className="h-5 w-5" />
                </SocialIcon>
              </span>
              <span role="listitem">
                <SocialIcon href={LINKS.telegram} label="Telegram">
                  <FaTelegram className="h-5 w-5" />
                </SocialIcon>
              </span>
            </div>
          </div>

          {/* Columna 2 — Explora (centrada en el conjunto, lg: 4/12 iniciando en col 5) */}
          <nav className="min-w-0 text-center sm:text-left lg:col-span-4 lg:col-start-5 lg:justify-self-center" aria-label="Explora">
            <h3 className="font-gotu text-xl text-gold mb-4">Explora</h3>
            <ul className="space-y-2 font-degular">
              <li>
                <Link
                  to={ROUTES.PROFESORES}
                  className="inline-block py-1 text-linen hover:text-gold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2 focus-visible:ring-offset-asparragus rounded"
                >
                  Equipo
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.CURSOS}
                  className="inline-block py-1 text-linen hover:text-gold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2 focus-visible:ring-offset-asparragus rounded"
                >
                  Cursos
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.ACOMPANAMIENTOS}
                  className="inline-block py-1 text-linen hover:text-gold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2 focus-visible:ring-offset-asparragus rounded"
                >
                  Acompañamientos
                </Link>
              </li>
              <li>
                <Link
                  to="/faqs"
                  className="inline-block py-1 text-linen hover:text-gold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2 focus-visible:ring-offset-asparragus rounded"
                >
                  FAQ&apos;s
                </Link>
              </li>
              <li>
                <Link
                  to="/tu-testimonio"
                  className="inline-block py-1 text-linen hover:text-gold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2 focus-visible:ring-offset-asparragus rounded"
                >
                  Tu Testimonio
                </Link>
              </li>
            </ul>
          </nav>

          {/* Columna 3 — Newsletter (mismo ancho que Branding, simétrica a la derecha, lg: 4/12 iniciando en col 9) */}
          <div className="sm:col-span-2 lg:col-span-4 lg:col-start-9 min-w-0 text-center sm:text-left">
            <h3 className="font-gotu text-xl text-gold mb-4">Únete a la Dharma Letter</h3>
            <p className="font-degular mb-5 text-linen/90 max-w-prose">
              Recibe sabiduría, inspiración y contenido exclusivo directamente en tu bandeja de entrada.
            </p>
            <div className="max-w-md mx-auto sm:mx-0">
              <NewsletterForm
                onSubscribe={subscribe}
                status={status}
                error={error}
                variant="footer"
                buttonText="Sí quiero"
                showTerms={true}
                setStatus={setStatus}
              />
            </div>
          </div>
        </div>

        {/* División */}
        <div className="border-t border-gold/20 my-10" />

        {/* Pie inferior */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-2">
          <div className="text-sm font-degular text-linen/80">
            © {new Date().getFullYear()} Dharma en Ruta | Todos los derechos reservados
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-degular">
            <Link
              to="/aviso-legal"
              className="text-linen hover:text-gold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2 focus-visible:ring-offset-asparragus rounded"
            >
              Aviso Legal
            </Link>
            <Link
              to="/terminos"
              className="text-linen hover:text-gold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2 focus-visible:ring-offset-asparragus rounded"
            >
              Términos y Condiciones
            </Link>
            <Link
              to="/politica-privacidad"
              className="text-linen hover:text-gold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2 focus-visible:ring-offset-asparragus rounded"
            >
              Política de Privacidad
            </Link>
            
            <Link
              to="/cookies"
              className="text-linen hover:text-gold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raw focus-visible:ring-offset-2 focus-visible:ring-offset-asparragus rounded"
            >
              Política de Cookies
            </Link>
            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
