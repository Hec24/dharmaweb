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
    name: "Clara",
    rating: 4,
    text: "No puedo más que recomendar a Patri a otras personas. Gran profe de yoga, sus conocimientos de fisio me dan mucha tranquilidad con mis lesiones. He hecho clases grupales, individuales, y he participado de un retiro. Patri es flexible y se adapta a lo que la pides. Por más prácticas juntas! ☺️",
    program: "Cursos",
    date: "Octubre 2024"
  },

  {
    id: 7,
    name: "Lucía",
    rating: 5,
    text: "Gracias a Patricia descubrí mi pasión por el yoga, tanto en la práctica amable con el cuerpo, como fuera de la esterilla. Con ella comencé el camino que nunca tiene fin. Siempre recomendaré sus clases y sus retiros. Namaste siempre Patri🙏🏼",
    program: "Cursos",
    date: "Octubre 2024"
  },

  {
    id: 8,
    name: "Naomí",
    rating: 5,
    text: "Solo pude disfrutar de una clase de yoga con Patricia porque vivo lejos, pero me bastó para saber que es toda una profesional que hace las cosas con pasión y sentimiento. Una experiencia brutal 👏🏼",
    program: "Cursos",
    date: "Setiembre 2024"
  },



];

export const programFilters = [
  "Todos",
  "Cursos", 
  "Acompañamientos",
];