import axios from "axios";

const PROD_API = "https://dharma-en-ruta.onrender.com/api";

const baseURL = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL || PROD_API)          // producción → Render
  : (import.meta.env.VITE_API_URL || "http://localhost:4000/api"); // dev → local

export const api = axios.create({
  baseURL,                // << absoluto
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});