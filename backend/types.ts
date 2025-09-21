// backend/types.ts
export interface Reserva {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  acompanante: string;
  acompananteEmail: string;
  fecha: string; // "YYYY-MM-DD"
  hora: string;  // "HH:MM"
  duracionMin?: number; // <-- OPCIONAL
  // Facturación
  direccion?: string;
  pais?: string;
  poblacion?: string;
  zipCode?: string;
  // Estado
  estado: "pendiente" | "pagada" | "cancelada";
  // Sincronización Calendar
  eventId?: string;
}
