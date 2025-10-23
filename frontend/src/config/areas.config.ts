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
  encontraras?: string;
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
    "Un viaje hacia dentro para conocerte, reconocerte y sanar lo que duele. Aquí trabajas tus emociones, tu historia y tu identidad, para vivir desde tu verdad, no desde el deber.", 
    encontraras:"Qué encontrarás:",
    color: "var(--color-linen)",
    heroImg: "/img/Backgrounds/background3.jpg",
    bullets: [
      "Herramientas de autoconocimiento y gestión emocional",
      "Trabajo con la/el niña/o interior, heridas y creencias limitantes",
      "Astrología y carta natal como mapas de comprensión",
      "Prácticas de meditación, journaling y manifestación consciente"
    ],
    cursos: [
      {
        id: "c001",
        titulo: "Atrología & Carta Natal",
        autor: "Patricia Pérez",
        cover: "/img/Backgrounds/background6.jpg",
        hotmartUrl: "https://...",
        priceEUR: 59,
      },
      {
        id: "c002",
        titulo: "Reconocimiento - Manejo emocional & heridas del ser",
        hotmartUrl: "https://hotmart.com/producto/habitos-dinero",
        cover: "/img/Backgrounds/background6.jpg",
        priceEUR: 29,
      },
      {
        id: "c003",
        titulo: "Reconocer tus creencias & lidiar con tus miedos",
        hotmartUrl: "https://hotmart.com/producto/habitos-dinero",
        cover: "/img/Backgrounds/background6.jpg",
        priceEUR: 29,
      },
      {
        id: "c004",
        titulo: "¿Cómo reconocer, conectar y atender a tu niñ@ interior?",
        hotmartUrl: "https://hotmart.com/producto/habitos-dinero",
        cover: "/img/Backgrounds/background6.jpg",
        priceEUR: 29,
      },
      {
        id: "c005",
        titulo: "Meditación & Journaling efectivo",
        hotmartUrl: "https://hotmart.com/producto/habitos-dinero",
        cover: "/img/Backgrounds/background6.jpg",
        priceEUR: 29,
      },
      {
        id: "c006",
        titulo: "¿Cómo alcanzar objetivos y sueños? Manifestación práctica",
        hotmartUrl: "https://hotmart.com/producto/habitos-dinero",
        cover: "/img/Backgrounds/background6.jpg",
        priceEUR: 29,
      },
    ],
  },

  "finanzasparaunavidalibre": {
    nombre: "Finanzas para una Vida Libre",
    descripcion:
    "Aprende a cuidar de tu dinero sin miedo, con presencia y consciencia. Porque la libertad también se construye desde la seguridad y el equilibrio.",
    encontraras:"Qué encontrarás:",
    color: "var(--color-gold)",
    heroImg: "/img/Backgrounds/background3.jpg",
    bullets: [
      "Educación financiera básica y hábitos de abundancia",
      "Cómo reconciliarte con la energía del dinero",
      "Herramientas prácticas para organizar, ahorrar e invertir",
      "Recursos para crear una relación más libre con tu economía",
    ],
    cursos: [
      {
        id: "c007",
        titulo: "Tu relación con el dinero",
        descripcion:" Hacer las paces con la energía del dinero – Creencias, bloqueos y cómo transformar tu visión del dinero.",
        autor: "Patricia Pérez",
        cover: "/img/Backgrounds/background6.jpg",
        hotmartUrl: "https://...",
        priceEUR: 59,
      },
      {
        id: "c008",
        titulo: " Finanzas básicas y gestión de recursos",
        descripcion:"Cómo cuidar bien tu dinero – Finanzas básicas para empezar a gestionar tu economía con seguridad.",
        hotmartUrl: "https://hotmart.com/producto/habitos-dinero",
        cover: "/img/Backgrounds/background6.jpg",
        priceEUR: 29,
      },
      {
        id: "c009",
        titulo: "Crecimiento financiero y hábitos saludables",
        descripcion:"Cultivar tu inteligencia financiera - Hábitos y estrategias para mejorar tu bienestar económico a largo plazo.",
        hotmartUrl: "https://hotmart.com/producto/habitos-dinero",
        cover: "/img/Backgrounds/background6.jpg",
        priceEUR: 29,
      },
    ],
  },

  // 👉 añade aquí el resto con los mismos slugs exactos:
  "diálogosdeldharma": {
    nombre: "Diálogos del Dharma",
    descripcion: "Explora las enseñanzas que transforman la manera en que ves el mundo. Yoga, budismo, taoísmo, estoicismo y más… caminos que te invitan a pensar, sentir y comunicar con mayor claridad y propósito.",
    encontraras:"Qué encontrarás:",
    color: "var(--color-raw-100)",
    heroImg: "/img/Backgrounds/background3.jpg",
    bullets: [
      "Escritura y comunicación como herramientas de autoconocimiento", 
      "Filosofías y prácticas de vida aplicadas al día a día",
      "Espacios de reflexión, escritura y debate consciente",
      "Claves para comprender los desafíos de la vida y transformarlos en aprendizaje.",
      "Herramientas para cuestionar creencias y cultivar pensamiento libre.",
      "Claves para encontrar sentido y coherencia en lo cotidiano.",
    ],
    cursos: [
      {
        id: "c010",
        titulo: "Conocer diferentes estilos de ver la vida: Navegar por tus creencias de vida",
        autor: "Patricia Pérez",
        cover: "/img/Backgrounds/background6.jpg",
        hotmartUrl: "https://...",
        priceEUR: 59,
      },
      {
        id: "c011",
        titulo: "Filosofía y origen del Yoga",
        hotmartUrl: "https://hotmart.com/producto/habitos-dinero",
        cover: "/img/Backgrounds/background6.jpg",
        priceEUR: 29,
      },
      {
        id: "c012",
        titulo: "Budismo para el día a día",
        hotmartUrl: "https://hotmart.com/producto/habitos-dinero",
        cover: "/img/Backgrounds/background6.jpg",
        priceEUR: 29,
      },
      {
        id: "c013",
        titulo: "Filosofía y cultura hinduista",
        hotmartUrl: "https://hotmart.com/producto/habitos-dinero",
        cover: "/img/Backgrounds/background6.jpg",
        priceEUR: 29,
      },
      {
        id: "c014",
        titulo: "Estilo de vida Yogui",
        hotmartUrl: "https://hotmart.com/producto/habitos-dinero",
        cover: "/img/Backgrounds/background6.jpg",
        priceEUR: 29,
      },
      {
        id: "c015",
        titulo: "Enseñanzas taoístas",
        hotmartUrl: "https://hotmart.com/producto/habitos-dinero",
        cover: "/img/Backgrounds/background6.jpg",
        priceEUR: 29,
      },
    ],
  },
  "elartedehabitar": {
    nombre: "El Arte de Habitar",
    descripcion: "Tu hogar es el reflejo de tu mente. Aprende a crear espacios que te sostengan, a simplificar lo que te rodea y a encontrar paz en lo cotidiano.",
    encontraras:"Qué encontrarás:",
    bullets: [
      "Claves de organización, orden y minimalismo.",
      "Limpieza física, digital y energética.",
      "Herramientas de planificación práctica y mental.",
      "Reflexiones sobre el desapego y el bienestar emocional en casa.",
    ],
    color: "var(--color-pale)",
    heroImg: "/img/Backgrounds/background3.jpg",
    cursos: [
       {
        id: "c016",
        titulo: "Conceptos básicos del minimalismo y cómo aplicarlo a los ámbitos de tu vida",
        autor: "Patricia Pérez",
        cover: "/img/Backgrounds/background6.jpg",
        hotmartUrl: "https://...",
        priceEUR: 59,
      },
      {
        id: "c017",
        titulo: "Ordenar espacios de manera efectiva",
        hotmartUrl: "https://hotmart.com/producto/habitos-dinero",
        cover: "/img/Backgrounds/background6.jpg",
        priceEUR: 29,
      },
      {
        id: "c018",
        titulo: "Organización y planificación práctica",
        descripcion: "De agenda, calendario y vida",
        hotmartUrl: "https://hotmart.com/producto/habitos-dinero",
        cover: "/img/Backgrounds/background6.jpg",
        priceEUR: 29,
      },
      {
        id: "c019",
        titulo: "Limpiar espacios sin morir en el intento",
        descripcion: "Físicos, digitales, energéticos",
        hotmartUrl: "https://hotmart.com/producto/habitos-dinero",
        cover: "/img/Backgrounds/background6.jpg",
        priceEUR: 29,
      },
      {
        id: "c020",
        titulo: "¿Cómo simplificar tu vida",
        descripcion: "Menos es más",
        hotmartUrl: "https://hotmart.com/producto/habitos-dinero",
        cover: "/img/Backgrounds/background6.jpg",
        priceEUR: 29,
      },
      {
        id: "c021",
        titulo: "Apego a lo material & creencias limitantes",
        hotmartUrl: "https://hotmart.com/producto/habitos-dinero",
        cover: "/img/Backgrounds/background6.jpg",
        priceEUR: 29,
      },
    ],
  },
  "templodeexpresionyencuentro": {
    nombre: "Templo de Expresión y Encuentro",
    descripcion: "Creatividad, goce y comunidad.",
    encontraras:"Qué encontrarás:",
    color: "var(--color-mossgreen)",
    heroImg: "/img/Backgrounds/background3.jpg",
    cursos: [],
  },
  "elcaminodelbienestar": {
    nombre: "El Camino del Bienestar",
    descripcion: "Hábitos, yoga, nutrición y calma.",
    encontraras:"Qué encontrarás:",
    color: "var(--color-asparragus)",
    heroImg: "/img/Backgrounds/background3.jpg",
    cursos: [],
  },
  "relacionesenarmonia": {
    nombre: "Relaciones en Armonía",
    descripcion: "Vínculos sanos y comunicación consciente.",
    encontraras:"Qué encontrarás:",
    color: "var(--color-asparragus-800)",
    heroImg: "/img/Backgrounds/background3.jpg",
    cursos: [],
  },
  "cuerpoplaceryconexion": {
    nombre: "Cuerpo, Placer y Conexión",
    descripcion: "Sexualidad consciente, respeto y presencia.",
    encontraras:"Qué encontrarás:",
    color: "var(--color-raw)",
    heroImg: "/img/Backgrounds/background3.jpg",
    cursos: [],
  },
};
