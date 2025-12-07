export interface Profesor {
  id: number;
  name: string;
  acompananteEmail: string;
  title?: string;
  image: string;
  description?: string;
  specialties?: string[];
  calendlyLink: string;
}
export interface FormValues {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion?: string;
  ciudad?: string;
  codigoPostal?: string;
  pais?: string;

}
export interface Sesion {
  id: string;
  profesor: string;
  fecha: string;
  precio: number;
  servicio?: Servicio;
}

export type FechaHora = {
  fecha: string;
  hora: string;
};


export type Servicio = "Individual" | "Pareja";


export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Dom, 1=Lun...

export type HHmm = `${number}${number}:${number}${number}`; // "09:00", "18:30"

export interface WeeklyPattern {
  // Opción A: slots explícitos
  slotsByWeekday?: Partial<Record<Weekday, HHmm[]>>;

  // Opción B (opcional): generar slots por rango + duración
  // (si usas esto, puedes no rellenar slotsByWeekday ese día)
  rangesByWeekday?: Partial<Record<Weekday, Array<{ start: HHmm; end: HHmm; everyMin: number }>>>;
}

export interface DateException {
  date: string;               // "YYYY-MM-DD"
  closed?: boolean;           // cierra el día completo
  addSlots?: HHmm[];          // añade slots puntuales
  removeSlots?: HHmm[];       // elimina slots concretos
}

export interface DateRangeException {
  start: string;              // "YYYY-MM-DD"
  end: string;                // "YYYY-MM-DD" (inclusive)
  closed?: boolean;           // cierra todo el rango
}

export interface AvailabilityRules {
  timezone: string;                   // "Europe/Madrid"
  leadTimeHours?: number;             // p.ej. 12h de antelación mínima
  bufferMinBetweenSessions?: number;  // p.ej. 15 (si encadena sesiones)
  maxDaysAhead?: number;              // p.ej. 60
  weekly: WeeklyPattern;
  exceptions?: {
    dates?: DateException[];
    ranges?: DateRangeException[];
  };
}

export interface ProfesorAvailabilityConfig {
  id: number;
  name: string;
  rules: AvailabilityRules;
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
  upload_date: string;
  watched_seconds?: number;
  total_seconds?: number;
  is_completed?: boolean;
}
