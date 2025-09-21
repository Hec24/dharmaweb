import type { ProfesorAvailabilityConfig } from "./types";

export const disponibilidadProfesoresConfig: ProfesorAvailabilityConfig[] = [
  {
    id: 1,
    name: "Patricia Pérez",
    rules: {
      timezone: "Europe/Madrid",
      leadTimeHours: 12,
      maxDaysAhead: 30,
      bufferMinBetweenSessions: 0,
      weekly: {
        // Slots explícitos por día (Opción A)
        slotsByWeekday: {
          1: ["10:00", "12:00", "16:00"], // Lunes
          3: ["09:00", "11:00", "18:00"], // Miércoles
          5: ["10:00", "15:00"],          // Viernes
        },
        // O, si prefieres generar por rango (Opción B)
        // rangesByWeekday: {
        //   2: [{ start: "09:00", end: "12:00", everyMin: 60 }], // Martes 9-12 cada 60
        // }
      },
      exceptions: {
        dates: [
          { date: "2025-09-15", closed: true },                 // cierra ese día
          { date: "2025-09-20", addSlots: ["19:00"] },          // añade slot extra
          { date: "2025-09-22", removeSlots: ["10:00"] },       // quita un slot concreto
        ],
        ranges: [
          { start: "2025-10-01", end: "2025-10-07", closed: true }, // vacaciones 1-7 Oct
        ],
      },
    },
  },
  {
    id: 2,
    name: "Raquel Lagoa",
    rules: {
      timezone: "Europe/Madrid",
      leadTimeHours: 12,
      maxDaysAhead: 30,
      weekly: {
        slotsByWeekday: {
          1: ["10:00", "12:00", "16:00"], // Lunes
          3: ["09:00", "11:00", "18:00"], // Miércoles
          5: ["10:00", "15:00"],     // Viernes
          2: ["17:00", "19:00"],  // Martes
          4: ["09:00", "11:00"],  // Jueves
        },
      },
      exceptions: { dates: [] },
    },
  },


{
    id: 3,
    name: "Veronica",
    rules: {
      timezone: "Europe/Madrid",
      leadTimeHours: 12,
      maxDaysAhead: 30,
      bufferMinBetweenSessions: 0,
      weekly: {
        // Slots explícitos por día (Opción A)
        slotsByWeekday: {
          1: ["10:00", "12:00", "16:00"], // Lunes
          3: ["09:00", "11:00", "18:00"], // Miércoles
          5: ["10:00", "15:00"],          // Viernes
        },
        // O, si prefieres generar por rango (Opción B)
        // rangesByWeekday: {
        //   2: [{ start: "09:00", end: "12:00", everyMin: 60 }], // Martes 9-12 cada 60
        // }
      },
      exceptions: {
        dates: [
          { date: "2025-09-15", closed: true },                 // cierra ese día
          { date: "2025-09-20", addSlots: ["19:00"] },          // añade slot extra
          { date: "2025-09-22", removeSlots: ["10:00"] },       // quita un slot concreto
        ],
        ranges: [
          { start: "2025-10-01", end: "2025-10-07", closed: true }, // vacaciones 1-7 Oct
        ],
      },
    },
  },
  {
    id: 4,
    name: "Guadalupe Fernández",
    rules: {
      timezone: "Europe/Madrid",
      leadTimeHours: 12,
      maxDaysAhead: 30,
      bufferMinBetweenSessions: 0,
      weekly: {
        // Slots explícitos por día (Opción A)
        slotsByWeekday: {
          1: ["10:00", "12:00", "16:00"], // Lunes
          3: ["09:00", "11:00", "18:00"], // Miércoles
          5: ["10:00", "15:00"],          // Viernes
        },
        // O, si prefieres generar por rango (Opción B)
        // rangesByWeekday: {
        //   2: [{ start: "09:00", end: "12:00", everyMin: 60 }], // Martes 9-12 cada 60
        // }
      },
      exceptions: {
        dates: [
          { date: "2025-09-15", closed: true },                 // cierra ese día
          { date: "2025-09-20", addSlots: ["19:00"] },          // añade slot extra
          { date: "2025-09-22", removeSlots: ["10:00"] },       // quita un slot concreto
        ],
        ranges: [
          { start: "2025-10-01", end: "2025-10-07", closed: true }, // vacaciones 1-7 Oct
        ],
      },
    },
  },
  {
    id: 5,
    name: "Marina Romes",
    rules: {
      timezone: "Europe/Madrid",
      leadTimeHours: 12,
      maxDaysAhead: 30,
      bufferMinBetweenSessions: 0,
      weekly: {
        // Slots explícitos por día (Opción A)
        slotsByWeekday: {
          1: ["10:00", "12:00", "16:00"], // Lunes
          3: ["09:00", "11:00", "18:00"], // Miércoles
          5: ["10:00", "15:00"],          // Viernes
        },
        // O, si prefieres generar por rango (Opción B)
        // rangesByWeekday: {
        //   2: [{ start: "09:00", end: "12:00", everyMin: 60 }], // Martes 9-12 cada 60
        // }
      },
      exceptions: {
        dates: [
          { date: "2025-09-15", closed: true },                 // cierra ese día
          { date: "2025-09-20", addSlots: ["19:00"] },          // añade slot extra
          { date: "2025-09-22", removeSlots: ["10:00"] },       // quita un slot concreto
        ],
        ranges: [
          { start: "2025-10-01", end: "2025-10-07", closed: true }, // vacaciones 1-7 Oct
        ],
      },
    },
  },
];
