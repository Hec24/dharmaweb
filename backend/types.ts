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
  holdExpiresAt?: number;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  area: string;
  video_provider: 'youtube' | 'vimeo' | 'bunny';
  video_id: string;
  duration_minutes: number;
  thumbnail_url: string;
  is_published: boolean;
  upload_date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface VideoProgress {
  id: string;
  user_id: string;
  video_id: string;
  watched_seconds: number;
  total_seconds: number;
  is_completed: boolean;
  last_watched_at: Date;
}
