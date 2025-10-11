// src/lib/wizardSession.ts
export type WizardSesion = {
  id: string;
  profesor: string;
  fecha: string;     // ISO o legible
  precio: number;
  servicio?: string;
};

const WIZARD_CARRITO_KEY = "wizard_carrito";
const CHECKOUT_CARRITO_KEY = "checkout_carrito"; // ya lo usáis

export function saveWizardCarrito(items: WizardSesion[]) {
  try {
    sessionStorage.setItem(WIZARD_CARRITO_KEY, JSON.stringify(items ?? []));
  } catch (e) {
    console.warn("[wizardSession] saveWizardCarrito error", e);
  }
}

export function loadWizardCarrito(): WizardSesion[] | null {
  try {
    // Prioriza el carrito temporal del wizard; si no existe, cae al de checkout
    const raw =
      sessionStorage.getItem(WIZARD_CARRITO_KEY) ??
      sessionStorage.getItem(CHECKOUT_CARRITO_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (e) {
    console.warn("[wizardSession] loadWizardCarrito error", e);
    return null;
  }
}

export function clearWizardCarritoTemp() {
  try {
    sessionStorage.removeItem(WIZARD_CARRITO_KEY);
  } catch (e) {
    console.warn("[wizardSession] clearWizardCarritoTemp error", e);
  }
}
