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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React vendor code
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Split icon libraries
          'icons': ['react-icons/fi', 'react-icons/fa', 'react-icons/lu'],
          // Split Helmet
          'helmet': ['react-helmet-async'],
        },
      },
    },
    chunkSizeWarningLimit: 600, // Increase warning limit slightly
  },
})