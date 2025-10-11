// src/lib/wizardSession.ts
export type WizardSesion = {
  id: string;
  profesor: string;
  fecha: string;     // ISO o legible
  precio: number;
  servicio?: string;
};

export type WizardDatos = {
  nombre?: string;
  apellidos?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  pais?: string;
  poblacion?: string;
  zipCode?: string;
};

const WIZARD_CARRITO_KEY = "wizard_carrito";
const WIZARD_DATOS_KEY = "wizard_datos";
const CHECKOUT_CARRITO_KEY = "checkout_carrito"; // ya existe en tu flujo

export function saveWizardCarrito(items: WizardSesion[]) {
  try {
    sessionStorage.setItem(WIZARD_CARRITO_KEY, JSON.stringify(items ?? []));
  } catch (e) {
    console.warn("[wizardSession] saveWizardCarrito error", e);
  }
}

export function loadWizardCarrito(): WizardSesion[] | null {
  try {
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

// --- NUEVO: datos de comprador / facturación (compartido Wizard <-> PagoDatos)
export function saveWizardDatos(datos: WizardDatos) {
  try {
    sessionStorage.setItem(WIZARD_DATOS_KEY, JSON.stringify(datos ?? {}));
  } catch (e) {
    console.warn("[wizardSession] saveWizardDatos error", e);
  }
}

export function loadWizardDatos(): WizardDatos | null {
  try {
    const raw = sessionStorage.getItem(WIZARD_DATOS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (e) {
    console.warn("[wizardSession] loadWizardDatos error", e);
    return null;
  }
}

export function clearWizardDatos() {
  try {
    sessionStorage.removeItem(WIZARD_DATOS_KEY);
  } catch (e) {
    console.warn("[wizardSession] clearWizardDatos error", e);
  }
}
