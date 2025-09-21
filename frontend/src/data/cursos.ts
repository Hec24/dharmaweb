import { Course } from "../types/course";

export const COURSES_MOCK: Course[] = [
  {
    id: "c1",
    slug: "curso-anatomia-yoga",
    titulo: "Anatomía para Profes de Yoga",
    descripcion: "Enseña con seguridad, prevén lesiones y profundiza en el cuerpo.",
    autor: "Patricia",
    imagen: "/img/TestPics/imagencurso.png",
    area: "Cuerpo",
    level: "Intermedio",
    precioEUR: 149,
    hotmartUrl: "https://HOTMART_URL_ANATOMIA",
    tags: ["anatomía", "docentes"],
  },
  {
    id: "c2",
    slug: "vipassana-intensivo",
    titulo: "Meditación Vipassana – Intensivo",
    descripcion: "Limpia tu mente y ordena tus memorias. 10 días transformadores.",
    autor: "Equipo Dharma",
    imagen: "/img/TestPics/imagencurso.png",
    area: "Mente",
    level: "Avanzado",
    precioEUR: 0, // donativo
    tags: ["meditación", "retiro"],
  },
  {
    id: "c3",
    slug: "filosofia-vedanta",
    titulo: "Filosofía: Fundamentos del Vedanta",
    descripcion: "Camino de autoconocimiento desde las escrituras yóguicas.",
    autor: "Patricia",
    imagen: "/img/TestPics/imagencurso.png",
    area: "Filosofía",
    level: "Inicial",
    precioEUR: 89,
    hotmartUrl: "https://HOTMART_URL_VEDANTA",
    tags: ["filosofía", "vedanta"],
  },
];


const cursos = [
  {
    titulo: "Minimalismo",
    descripcion: "Explora una vida con menos cosas y más sentido.",
    autor: "Patricia Pérez",
    imagen: "/img/TestPics/imagencurso.png",
    precio: "24,99€",
  },
  {
    titulo: "Comunicación Efectiva",
    descripcion: "Aprende a comunicar con empatía y claridad.",
    autor: "Mari Pili",
    imagen: "/img/TestPics/imagencurso.png",
    precio: "29,99€",
  },
  {
    titulo: "Mejora tus relaciones personales",
    descripcion: "Herramientas para vínculos más sanos y auténticos.",
    autor: "Wilson González",
    imagen: "/img/TestPics/imagencurso.png",
    precio: "30€",
  },

//   {
//     titulo: "Lectura de Carta Astral",
//     descripcion: "Descubre tu personalidad y potencial a través de los astros.",
//     autor: "Juanita García",
//     imagen: "/img/imagencurso.png",
//     precio: "35€",
//   },
];
export default cursos;