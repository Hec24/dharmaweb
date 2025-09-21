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
    name: "Izaro",
    rating: 5,
    text: "Este viaje comenzó como una oportunidad para conocer Tenerife y terminó siendo un aprendizaje para mi. Aprendí a ser yo misma con los demás y a abrir mi mente a nuevas experiencias.",
    program: "Yogui Viaje",
    date: "Mayo 2023"
  },
  {
    id: 2,
    name: "Fran",
    rating: 5,
    text: "Uno de los mejores viajes de mi vida, así, sin esperarlo.... Maravilloso! Todo cambió ya en el aeropuerto de Madrid, como si todas las piezas de un puzzle de repente encajaran.",
    program: "Yogui Viaje",
    date: "Junio 2023"
  },
  {
    id: 3,
    name: "Alicia",
    rating: 4,
    text: "Ha sido una experiencia inolvidable. Era un viaje lleno de primeras veces para mí y por tanto...lleno de miedos. Pero fue todo perfecto. Un grupo genial.",
    program: "Summer Yoga Camp",
    date: "Julio 2023"
  },
  {
    id: 4,
    name: "Luisa",
    rating: 5,
    text: "La experiencia para mi ha sido maravillosa. Aprendizaje, risas, charlas, comida 10, actividades estupendas y sobre todo destacar la cercanía y empatía de Patricia.",
    program: "Summer Yoga Camp",
    date: "Agosto 2023"
  },
  {
    id: 5,
    name: "Amanda",
    rating: 4,
    text: "Encontré el anuncio de un ritual de la luna llena en Instagram y aquello resonó en mí en un momento complicado en mi vida. Patricia creó un espacio cómodo, seguro e inspirador.",
    program: "Clases 1:1",
    date: "Septiembre 2023"
  },
  {
    id: 6,
    name: "Gema",
    rating: 5,
    text: "Destacaría sobre todo, además de el haber vivido nuevas experiencias, el haber podido conocer a otras personas de diferentes lugares y compartir con ellos.",
    program: "Yogui Viaje",
    date: "Octubre 2023"
  }
];

export const programFilters = [
  "Todos",
  "Yogui Viaje",
  "Summer Yoga Camp", 
  "Clases 1:1",
  "Retiros"
];