export function formatFechaHora(fh: string | {fecha: string; hora: string} | null) {
    if (!fh) return "";
    if (typeof fh === "string") return fh;
    return `${fh.fecha} ${fh.hora}`;
}