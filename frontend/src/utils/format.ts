export function formatEUR(v?: number | null) {
  if (v === undefined || v === null) return "Consultar";
  if (v === 0) return "Donativo";
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(v);
}