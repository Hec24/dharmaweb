import type { AvailabilityRules, HHmm, Weekday } from "../data/types";

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function addDays(d: Date, days: number): Date {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + days);
  return nd;
}

function weekdayOf(d: Date): Weekday {
  return d.getDay() as Weekday; // 0..6
}

function isInRange(dateStr: string, start: string, end: string): boolean {
  return dateStr >= start && dateStr <= end;
}

function generateSlotsFromRanges(ranges: Array<{ start: HHmm; end: HHmm; everyMin: number }>): HHmm[] {
  const out: HHmm[] = [];
  for (const r of ranges) {
    const [sh, sm] = r.start.split(":").map(Number);
    const [eh, em] = r.end.split(":").map(Number);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    for (let m = startMin; m + r.everyMin <= endMin; m += r.everyMin) {
      const h = Math.floor(m / 60);
      const mm = m % 60;
      out.push(`${pad(h)}:${pad(mm)}` as HHmm);
    }
  }
  return out;
}

/**
 * Genera disponibilidad { fecha, horas[] } aplicando:
 * - patrón semanal (slots explícitos y/o rangos)
 * - excepciones por días y rangos
 * - lead time (no ofrecer slots demasiado pronto)
 * - sesiones ya reservadas
 */
export function generateAvailability(
  rules: AvailabilityRules,
  sesionesYaReservadas: string[],        // "YYYY-MM-DD HH:mm"
  from: Date = new Date(),
  days: number = rules.maxDaysAhead ?? 30
): Array<{ fecha: string; horas: HHmm[] }> {
  const out: Array<{ fecha: string; horas: HHmm[] }> = [];
  const leadMs = (rules.leadTimeHours ?? 0) * 60 * 60 * 1000;
  const minDateTime = new Date(from.getTime() + leadMs);

  for (let i = 0; i < days; i++) {
    const day = addDays(from, i);
    const fecha = toDateStr(day);
    const wd = weekdayOf(day);

    // 1) ¿Cierra por rango?
    const closedByRange = rules.exceptions?.ranges?.some(r => r.closed && isInRange(fecha, r.start, r.end));
    if (closedByRange) continue;

    // 2) Slots base del patrón semanal
    let slots: HHmm[] = [];
    const weekly = rules.weekly;
    if (weekly.slotsByWeekday && weekly.slotsByWeekday[wd]) {
      slots = [...(weekly.slotsByWeekday[wd] as HHmm[])];
    }
    if (weekly.rangesByWeekday && weekly.rangesByWeekday[wd]) {
      slots.push(...generateSlotsFromRanges(weekly.rangesByWeekday[wd]!));
    }

    if (!slots.length) continue;

    // 3) Excepciones por fecha: remove/add/closed
    const dateEx = rules.exceptions?.dates?.find(d => d.date === fecha);
    if (dateEx?.closed) continue;
    if (dateEx?.removeSlots?.length) {
      const remove = new Set(dateEx.removeSlots);
      slots = slots.filter(s => !remove.has(s));
    }
    if (dateEx?.addSlots?.length) {
      slots = Array.from(new Set([...slots, ...dateEx.addSlots])).sort();
    }

    // 4) Filtra por lead time (no ofrecer slots en el pasado o antes del mínimo)
    const slotsAfterLead = slots.filter((hhmm) => {
      const [h, m] = hhmm.split(":").map(Number);
      const dt = new Date(day);
      dt.setHours(h, m, 0, 0);
      return dt.getTime() >= minDateTime.getTime();
    });

    if (!slotsAfterLead.length) continue;

    // 5) Quita los ya reservados
    const reservedSet = new Set(sesionesYaReservadas); // "YYYY-MM-DD HH:mm"
    const libres = slotsAfterLead.filter((hhmm) => !reservedSet.has(`${fecha} ${hhmm}`));

    if (!libres.length) continue;

    out.push({ fecha, horas: libres });
  }

  return out;
}
