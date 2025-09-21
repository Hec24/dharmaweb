import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // @ts-expect-error: safelist is not officially typed in Tailwind Config but needed for custom classes
  safelist: [
    // Tamaños de texto
    "text-xs", "text-sm", "text-md", "text-lg", "text-xl",
    "text-2xl", "text-3xl", "text-4xl", "text-5xl", "text-6xl", "text-7xl",
    // Colores de texto
    "text-asparragus", "text-gold", "text-raw", "text-linen", "text-white", "text-mossgreen",
    // Fuentes y pesos
    "font-bold", "font-semibold", "font-gotu", "font-degular",
    // Espaciados y layouts
    "mb-2", "mb-4", "mb-6", "mb-8", "mb-10", "max-w-2xl", "mx-auto",
  ],
  theme: {
  extend: {
    fontFamily: {
      gotu: ["Gotu","ui-sans-serif","system-ui","sans-serif"],
      arapey: ["Arapey","ui-serif","Georgia","serif"],
      degular: ['"Plus Jakarta Sans"','Inter','system-ui','sans-serif'],
      // Degular la definimos más abajo según Adobe
    },
  },
},
};

export default config;
