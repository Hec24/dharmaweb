export interface Testimonial {
  id: number;
  name: string;
  rating: number; // 1-5
  text: string;
  program: string;
  date?: string;
}

export const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: "Fede",
    rating: 5,
    text: "Aprendí cositas nuevas y muchos desbloqueos. Gran paz y tranquilidad",
    program: "Cursos",
    date: "Mayo 2024"
  },
  {
    id: 2,
    name: "Cristina",
    rating: 5,
    text: "Una experiencia buenísima para perfeccionar la técnica de yoga e introducirte en una meditación profunda, lo recomiendo mucho.",
    program: "Cursos",
    date: "Junio 2024"
  },
  {
    id: 3,
    name: "Laura",
    rating: 4,
    text: "Se lo recomendaría a mis amigos y familiares para que prueben la experiencia y piensen si necesitan cambiar algo en su estilo de vida y lo puedan incorporar un poco en su día a día para desconectar, respirar y centrarse en uno mismo por un momento.",
    program: "Cursos",
    date: "Julio 2024"
  },
  {
    id: 4,
    name: "Macarena",
    rating: 5,
    text: "Me gustó mucho que Patricia diese espacio para que todas hablásemos, normalmente los ponentes hablan solo ellos y tienen necesidad de contar sus caso pero Patricia no es así. Lo he valorado mucho. Recomiendo a Patricia totalmente. Se prepara super bien los talleres y genera un espacio muy cálido donde todas nos hemos sentido libres de poder expresar cualquier cosa que llevábamos dentro. Espacio de no juicio y amor.",
    program: "Cursos",
    date: "Agosto 2024"
  },
  {
    id: 5,
    name: "Amanda",
    rating: 5,
    text: "Encontré el anuncio de un ritual de la luna llena en Instagram y aquello resonó en mí en un momento complicado en mi vida. Patricia creó un espacio cómodo, seguro e inspirador.",
    program: "Acompañamientos",
    date: "Septiembre 2024"
  },
  {
    id: 6,
    name: "Gema",
    rating: 4,
    text: "Destacaría sobre todo, además de el haber vivido nuevas experiencias, el haber podido conocer a otras personas de diferentes lugares y compartir con ellos.",
    program: "Yogui Viaje",
    date: "Octubre 2024"
  },

  {
    id: 7,
    name: "Fran",
    rating: 5,
    text: "Uno de los mejores viajes de mi vida, así, sin esperarlo.... Maravilloso! Todo cambió ya en el aeropuerto de Madrid, como si todas las piezas de un puzzle de repente encajaran.",
    program: "Yogui Viaje",
    date: "Junio 2023"
  },

  {
    id: 8,
    name: "Izaro",
    rating: 5,
    text: "Este viaje comenzó como una oportunidad para conocer Tenerife y terminó siendo un aprendizaje para mi. Aprendí a ser yo misma con los demás y a abrir mi mente a nuevas experiencias.",
    program: "Yogui Viaje",
    date: "Mayo 2023"
  },



];

export const programFilters = [
  "Todos",
  "Cursos", 
  "Acompañamientos",
  "Yogui Viaje",
];