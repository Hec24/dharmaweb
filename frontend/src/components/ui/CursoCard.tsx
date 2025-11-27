import React from "react";
import Button from "./Button";
import Tag from "./Tag";

type CardSize = "sm" | "md" | "lg";

const IMG_H: Record<CardSize, string> = {
  sm: "h-40",   // ~160px
  md: "h-52",   // ~208px (tu valor original era h-52)
  lg: "h-56",   // ~224px
};

const MIN_H: Record<CardSize, string> = {
  sm: "min-h-[360px]",
  md: "min-h-[420px]",
  lg: "min-h-[460px]",
};

interface CursoCardProps {
  titulo: string;
  descripcion: string;
  autor: string;
  imagen: string;
  precio: string;
  onComprar?: () => void;
  className?: string;
  size?: CardSize; // 👈 controla “presencia” visual
}

const CursoCard: React.FC<CursoCardProps> = ({
  titulo,
  descripcion,
  autor,
  imagen,
  precio,
  onComprar,
  className = "",
  size = "md",
}) => {
  return (
    <div
      className={[
        "w-full h-full bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-default",
        "flex flex-col border-2 border-gold/10 hover:border-gold/30",
        MIN_H[size],               // altura mínima coherente
        className,
      ].join(" ")}
    >
      {/* Imagen con overlay */}
      <div className={`relative overflow-hidden ${IMG_H[size]} w-full cursor-pointer flex-shrink-0`}>
        <img
          alt={titulo}
          src={imagen}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-asparragus/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Tag variant="author" size="md" className="absolute bottom-4 left-4">
          {autor}
        </Tag>
      </div>

      {/* Contenido */}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="mb-3 text-xl font-gotu font-bold text-asparragus line-clamp-2 min-h-[3rem] group-hover:text-gold transition-colors">
          {titulo}
        </h3>

        {/* min-h para alinear cards aunque cambie la longitud del copy */}
        <p className="mb-5 text-asparragus/80 text-sm line-clamp-3 flex-grow font-degular leading-relaxed min-h-[3.5rem]">
          {descripcion}
        </p>

        {/* Precio y botón */}
        <div className="mt-auto flex items-center justify-between">
          <span className="font-gotu text-lg text-gold">{precio}</span>
          <Button size="sm" variant="primary" onClick={onComprar}>
            Comprar ahora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CursoCard;
