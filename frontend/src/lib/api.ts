// src/lib/api.ts
import axios from "axios";

const PROD_API = "https://dharma-en-ruta.onrender.com/api";
const DEV_API  = "http://localhost:4000/api";

const isProd = typeof import.meta !== "undefined" && !!import.meta.env?.PROD;

const baseURL = isProd
  ? (import.meta.env?.VITE_BACKEND_URL ?? PROD_API)
  : (import.meta.env?.VITE_BACKEND_URL ?? DEV_API);

export const api = axios.create({
  baseURL,
  timeout: 30000, // Render puede estar “frío”; 15s se queda corto
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  r => r,
  err => {
    console.error(`[API] ${err.config?.method?.toUpperCase()} ${err.config?.url}`, {
      code: err.code,
      status: err.response?.status,
      data: err.response?.data
    });
    return Promise.reject(err);
  }
);

export const getApiBaseUrl = () => baseURL;
