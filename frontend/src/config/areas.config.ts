// Tipos
export type Curso = {
  id: string;
  titulo: string;
  hotmartUrl: string; // URL base de Hotmart (sin UTM)
  cover?: string;
  priceEUR?: number; 
  descripcion?: string; // 🆕
  autor?: string;     // opcional, para GA4/Meta
};

export type Area = {
  nombre: string;
  descripcion: string;
  color?: string;   // usa tu paleta; fallback al --color-linen
  heroImg?: string;
  bullets?: string[];
  cursos: Curso[];
};

// ⚠️ Slugs EXACTOS tal y como los tienes en tu menú
export const AREAS: Record<string, Area> = {
  "elsenderodelyo": {
    nombre: "El Sendero del Yo",
    descripcion:
      "Herramientas para conocerte, gestionar emociones y vivir en coherencia.",
    color: "var(--color-linen)",
    heroImg: "/img/Backgrounds/background3.jpg",
    bullets: [
      "Meditación y journaling práctico",
      "Gestión emocional y niña interior",
      "Astrología aplicada al día a día",
    ],
    cursos: [
      {
        id: "c001",
        titulo: "Meditación eficaz",
        hotmartUrl: "https://hotmart.com/producto/meditacion-eficaz",
        cover: "/img/Backgrounds/background6.jpg",
        priceEUR: 39,
      },
      {
        id: "c002",
        titulo: "Journaling 7 días",
        hotmartUrl: "https://hotmart.com/producto/journaling-7-dias",
        cover: "/img/Backgrounds/background6.jpg",
        priceEUR: 19,
      },
    ],
  },

  "finanzasparaunavidalibre": {
    nombre: "Finanzas para una Vida Libre",
    descripcion:
      "Hábitos financieros, bases de inversión y una relación sana con el dinero.",
    color: "var(--color-gold)",
    heroImg: "/img/Backgrounds/background3.jpg",
    bullets: [
      "Hábitos financieros sostenibles",
      "Mentalidad y paz con el dinero",
      "Primeros pasos de inversión",
    ],
    cursos: [
      {
        id: "c001",
        titulo: "Meditación eficaz",
        descripcion: "Aprende técnicas simples para meditar con claridad.",
        autor: "Patricia Holistic Yoga",
        cover: "/img/meditacion.jpg",
        hotmartUrl: "https://...",
        priceEUR: 59,
      },
      {
        id: "c102",
        titulo: "Hábitos con el dinero",
        hotmartUrl: "https://hotmart.com/producto/habitos-dinero",
        cover: "/img/Backgrounds/background6.jpg",
        priceEUR: 29,
      },
    ],
  },

  // 👉 añade aquí el resto con los mismos slugs exactos:
  "diálogosdeldharma": {
    nombre: "Diálogos del Dharma",
    descripcion: "Filosofías y estilos de vida para expandir tu mirada.",
    color: "var(--color-raw-100)",
    heroImg: "/img/Backgrounds/background3.jpg",
    bullets: ["Yoga, budismo, estoicismo", "Reflexión y escritura", "Debate consciente"],
    cursos: [],
  },
  "elartedehabitar": {
    nombre: "El Arte de Habitar",
    descripcion: "Orden, minimalismo y hogar como refugio.",
    color: "var(--color-pale)",
    heroImg: "/img/Backgrounds/background3.jpg",
    cursos: [],
  },
  "templodeexpresionyencuentro": {
    nombre: "Templo de Expresión y Encuentro",
    descripcion: "Creatividad, goce y comunidad.",
    color: "var(--color-mossgreen)",
    heroImg: "/img/Backgrounds/background3.jpg",
    cursos: [],
  },
  "elcaminodelbienestar": {
    nombre: "El Camino del Bienestar",
    descripcion: "Hábitos, yoga, nutrición y calma.",
    color: "var(--color-asparragus)",
    heroImg: "/img/Backgrounds/background3.jpg",
    cursos: [],
  },
  "relacionesenarmonia": {
    nombre: "Relaciones en Armonía",
    descripcion: "Vínculos sanos y comunicación consciente.",
    color: "var(--color-asparragus-800)",
    heroImg: "/img/Backgrounds/background3.jpg",
    cursos: [],
  },
  "cuerpoplaceryconexion": {
    nombre: "Cuerpo, Placer y Conexión",
    descripcion: "Sexualidad consciente, respeto y presencia.",
    color: "var(--color-raw)",
    heroImg: "/img/Backgrounds/background3.jpg",
    cursos: [],
  },
};
