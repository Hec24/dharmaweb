import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    port: 5173, // el puerto del frontend
    proxy: {
      "/api": {
        target: "http://localhost:4000", // backend en express
        changeOrigin: true,
        secure: false,
      },
    },
  },
})