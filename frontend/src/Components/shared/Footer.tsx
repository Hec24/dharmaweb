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
    const classNames = "text-linen hover:text-gold transition-colors duration-200";
    return valid ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classNames}
        aria-label={label}
      >
        <span className="h-6 w-6 inline-flex items-center justify-center hover:scale-110 transition-transform">
          {children}
        </span>
      </a>
    ) : (
      <span className="opacity-40 cursor-not-allowed" aria-hidden>
        <span className="h-6 w-6 inline-flex items-center justify-center">{children}</span>
      </span>
    );
  };

  return (
    <footer className="bg-asparragus text-linen border-t">
      <div className="container mx-auto px-4 py-16">
        {/* Grid principal */}
        {/* En tablet (sm/md): 2 columnas; Newsletter ocupa 2. En desktop (lg+): 4 columnas; Newsletter ocupa 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 items-start">
          
          {/* Columna 1 - Branding y redes */}
          <div className="min-w-0 text-center sm:text-left">
            <h3 className="font-gotu text-2xl text-gold mb-5 break-words">
              PatriciaHolisticYoga
            </h3>
            <p className="font-degular mb-6 px-4 sm:px-0 text-linen/90 leading-relaxed">
              Encuentra tu equilibrio interior a través del yoga y el autoconocimiento.
            </p>
            <div className="flex flex-wrap gap-5 justify-center sm:justify-start">
              <SocialIcon href={LINKS.instagram} label="Instagram">
                <FaInstagram className="h-6 w-6" />
              </SocialIcon>
              <SocialIcon href={LINKS.facebook} label="Facebook">
                <FaFacebook className="h-6 w-6" />
              </SocialIcon>
              <SocialIcon href={LINKS.youtube} label="YouTube">
                <FaYoutube className="h-6 w-6" />
              </SocialIcon>
              <SocialIcon href={LINKS.whatsapp} label="WhatsApp">
                <FaWhatsapp className="h-6 w-6" />
              </SocialIcon>
              <SocialIcon href={LINKS.telegram} label="Telegram">
                <FaTelegram className="h-6 w-6" />
              </SocialIcon>
            </div>
          </div>

          {/* Columna 2 - Enlaces rápidos */}
          <div className="min-w-0 text-center sm:text-left">
            <h3 className="font-gotu text-2xl text-gold mb-5">Explora</h3>
            <ul className="space-y-3 font-degular">
              <li>
                <Link
                  to={ROUTES.PROFESORES}
                  className="text-linen hover:text-gold transition-colors duration-200 inline-block py-1"
                >
                  Equipo
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.CURSOS}
                  className="text-linen hover:text-gold transition-colors duration-200 inline-block py-1"
                >
                  Cursos
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.ACOMPANAMIENTOS}
                  className="text-linen hover:text-gold transition-colors duration-200 inline-block py-1"
                >
                  Acompañamientos
                </Link>
              </li>
              <li>
                <Link
                  to="/faqs"
                  className="text-linen hover:text-gold transition-colors duration-200 inline-block py-1"
                >
                  FAQ&apos;s
                </Link>
              </li>
              <li>
                <Link
                  to="/tu-testimonio"
                  className="text-linen hover:text-gold transition-colors duration-200 inline-block py-1"
                >
                  Tu Testimonio
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3 - Suscripción (full width en tablet, 2 cols en desktop) */}
          <div className="sm:col-span-2 lg:col-span-2 min-w-0">
            <h3 className="font-gotu text-2xl text-gold mb-5">Únete a la Dharma Letter</h3>
            <p className="font-degular mb-6 text-linen/90 max-w-lg">
              Recibe sabiduría, inspiración y contenido exclusivo directamente en tu bandeja de entrada.
            </p>
            <div className="max-w-md">
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
        <div className="border-t border-gold/20 my-12" />

        {/* Pie inferior */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4">
          <div className="text-sm font-degular text-linen/80">
            © {new Date().getFullYear()} Dharma en Ruta | Todos los derechos reservados
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-degular">
            <Link to="/politica-privacidad" className="text-linen hover:text-gold transition-colors duration-200">Política de Privacidad</Link>
            <Link to="/terminos" className="text-linen hover:text-gold transition-colors duration-200">Términos y Condiciones</Link>
            <Link to="/cookies" className="text-linen hover:text-gold transition-colors duration-200">Cookies</Link>
            <Link to="/aviso-legal" className="text-linen hover:text-gold transition-colors duration-200">Aviso Legal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
