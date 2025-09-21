export type CourseLevel = "Inicial" | "Intermedio" | "Avanzado";

export interface Course {
  id: string;
  slug: string;
  titulo: string;
  descripcion: string;
  autor: string;
  imagen: string;
  area: string;            // "Cuerpo" | "Mente" | "Filosofía" | ...
  level: CourseLevel;
  precioEUR?: number | null; // null/undefined => “Consultar”, 0 => “Donativo”
  hotmartUrl?: string;       // si existe, “Comprar ahora” abre Hotmart
  tags?: string[];
}