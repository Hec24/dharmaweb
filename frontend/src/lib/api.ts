// src/lib/api.ts
import axios from "axios";

// baseURL relativa: el proxy de Vite la envía al backend
export const api = axios.create({
  baseURL: "/api",
  timeout: 15000,
});