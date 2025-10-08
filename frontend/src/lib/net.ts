import { api } from "../lib/api";

export async function postWithRetry<T = unknown>(url: string, data: unknown) {
  try {
    return await api.post<T>(url, data);
  } catch (e: unknown) {
    if (typeof e === "object" && e !== null && "code" in e && (e as { code?: string }).code === "ECONNABORTED") {
      await new Promise(r => setTimeout(r, 1000)); // espera 1s (cold start)
      return await api.post<T>(url, data);
    }
    throw e;
  }
}

export async function patchWithRetry<T = unknown>(url: string, data: unknown) {
  try {
    return await api.patch<T>(url, data);
  } catch (e: unknown) {
    if (typeof e === "object" && e !== null && "code" in e && (e as { code?: string }).code === "ECONNABORTED") {
      await new Promise(r => setTimeout(r, 1000));
      return await api.patch<T>(url, data);
    }
    throw e;
  }
}