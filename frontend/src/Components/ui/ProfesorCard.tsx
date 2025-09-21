import React from "react";
import { FiChevronRight } from "react-icons/fi";
import Tag from "./Tag";
import ButtonLink from "./ButtonLink";

interface ProfesorCardProps {
  name: string;
  image: string;
  title?: string;
  link?: string;
  description?: string;
  specialties?: string[];
  variant?: "default" | "acompanamientos" | "selector-minimal";
  onAgendar?: () => void; // para el variant "acompanamientos"
}

const ProfesorCard: React.FC<ProfesorCardProps> = ({
  name,
  image,
  title,
  link,
  description,
  specialties,
  onAgendar,
  variant = "default",
}) => {

  // --- Nueva variant minimalista ---
  if (variant === "selector-minimal") {
  return (
    <div className="bg-linen rounded-2xl shadow-lg flex flex-col items-center justify-center py-8 px-4 transition border-2 border-transparent hover:border-mossgreen cursor-pointer">
      <img
        src={image}
        alt={name}
        className="w-28 h-28 md:w-32 md:h-32 rounded-full mb-4 object-cover shadow"
      />
      <h3 className="text-2xl md:text-3xl font-gotu font-bold mb-2 text-asparragus text-center">
        {name}
      </h3>
      {specialties && specialties.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-1">
          <span className="bg-gold/20 text-raw rounded-full px-4 py-1 text-base font-semibold">
            {specialties[0]}
          </span>
        </div>
      )}
    </div>
  );
}

  if (variant === "acompanamientos") {
    // Versión ACOMPAÑAMIENTOS: Visual, grande, responsive
    return (
      <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 bg-linen rounded-3xl shadow-none py-8 px-2 lg:px-8">
        {/* Imagen ultra grande y responsive */}
        <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg flex-shrink-0 mb-6 lg:mb-0">
          <img
            src={image}
            alt={name}
            className="w-full h-auto rounded-3xl shadow-2xl border-4 border-asparragus object-cover"
            style={{ maxHeight: 480, minHeight: 200, background: "#eee" }}
          />
        </div>
        {/* Texto y acción */}
        <div className="flex-1 w-full px-1 sm:px-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-gotu mb-2 sm:mb-4 text-raw leading-tight">
            {name}
          </h2>
          {title && (
            <p className="text-xl sm:text-2xl lg:text-3xl mb-3 sm:mb-6 text-asparragus font-semibold">{title}</p>
          )}
          {description && (
            <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl mb-7 sm:mb-10 leading-relaxed text-asparragus-800">
              {description}
            </p>
          )}
          {specialties && specialties.length > 0 && (
            <div className="mb-7 flex flex-wrap gap-2 sm:gap-3">
              {specialties.map((specialty, i) => (
                <Tag key={i} variant="gold" size="lg">
                  {specialty}
                </Tag>
              ))}
            </div>
          )}
          
            <ButtonLink
            as="button"
            size="lg" 
            variant="primary" 
            icon={<FiChevronRight/>}
            onClick={() => onAgendar?.()}
          >
            Agendar con {name.split(" ")[0]}
            </ButtonLink>
      
        </div>
      </div>
    );
  }

  // --- Default para Carrusel (Team) ---
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col mx-auto max-w-xs border border-gold/10">
      <figure className="relative pt-[100%] overflow-hidden">
        <a href={link} className="block absolute inset-0 group">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-asparragus/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </a>
      </figure>
      <article className="p-5 flex-grow flex flex-col">
        <header className="mb-3">
          <h3 className="text-xl font-gotu font-semibold text-asparragus hover:text-mossgreen transition-colors">
            <a href={link} className="block">
              {name}
            </a>
          </h3>
          {title && (
            <p className="text-mossgreen text-sm font-medium mt-1">
              {title}
            </p>
          )}
        </header>
        <div className="mt-auto pt-3">
          <a
            href={link}
            className="inline-flex items-center text-gold font-medium hover:text-raw transition-colors text-sm group"
          >
            Conoce más
            <FiChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </article>
    </div>
  );
};

export default ProfesorCard;
