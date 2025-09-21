import { AREAS } from "../config/areas.config";

/** Mapa: Nombre de área normalizado -> slug */
const AREA_NAME_TO_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(AREAS).map(([slug, def]) => [normalize(def.nombre), slug])
);

/** Normaliza para comparar nombres de área de forma robusta */
export function normalize(s?: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

/** Devuelve el slug del área a partir del nombre visible (o undefined si no encuentra) */
export function areaSlugFromName(areaName?: string): string | undefined {
  return AREA_NAME_TO_SLUG[normalize(areaName)];
}