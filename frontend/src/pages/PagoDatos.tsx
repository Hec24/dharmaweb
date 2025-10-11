import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Button from "../Components/ui/Button";
import GenericNav from "../Components/shared/GenericNav";
import { api } from "../lib/api";
import type { Sesion } from "../data/types";
import { Helmet} from "react-helmet-async"
import { saveWizardCarrito } from "../lib/wizardSession";

type ReservaDto = {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  fecha: string;
  hora: string;
  acompanante?: string;        // nombre del profesor
  acompananteEmail?: string;
  duracionMin?: number;
};

type LocationState = {
  carrito?: Sesion[];
} | null;

interface Props {
  carrito?: Sesion[]; // opcional si navegas a este componente directamente
}

interface FormValues {
  nombre: string;
  apellidos: string;
  email: string;
  direccion: string;
  pais: string;
  poblacion: string;
  zipCode: string;
  telefono: string;
}

type LineItem = {
  id: string;
  label: string;
  profesor?: string;
  fecha?: string;
  precio: number;
};

type BackendErrorPayload = { error?: string };
type ApiErrorLike = { response?: { data?: BackendErrorPayload } };

const isApiErrorLike = (e: unknown): e is ApiErrorLike =>
  typeof e === "object" && e !== null && "response" in (e as Record<string, unknown>);

const fmtEUR = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n || 0);

export default function PagoDatos({ carrito: carritoProp = [] }: Props): React.ReactElement {
  const { id: reservaId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || null;

  // carrito pasado desde navigate(..., { state: { carrito } })
  const carritoFromState: Sesion[] | undefined = state?.carrito;
  const carrito: Sesion[] = carritoFromState ?? carritoProp;

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingReserva, setLoadingReserva] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [reserva, setReserva] = useState<ReservaDto | null>(null);

  const [datosFacturacion, setDatosFacturacion] = useState<FormValues>({
    nombre: "",
    apellidos: "",
    email: "",
    direccion: "",
    pais: "",
    poblacion: "",
    zipCode: "",
    telefono: "",
  });

  // Carga la reserva (fallback si no hay carrito)
  useEffect(() => {
    if (!reservaId) {
      setLoadingReserva(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoadingReserva(true);
        const { data } = await api.get<ReservaDto>(`/reservas/${reservaId}`);
        if (!cancelled) {
          setReserva(data);
          setDatosFacturacion((prev) => ({
            nombre: prev.nombre || data.nombre || "",
            apellidos: prev.apellidos || data.apellidos || "",
            email: prev.email || data.email || "",
            telefono: prev.telefono || data.telefono || "",
            direccion: prev.direccion,
            pais: prev.pais,
            poblacion: prev.poblacion,
            zipCode: prev.zipCode,
          }));
        }
      } catch {
        if (!cancelled) setErrorMsg("No se pudo cargar la reserva.");
      } finally {
        if (!cancelled) setLoadingReserva(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reservaId]);

  // Construye el resumen
  const lineItems: LineItem[] = useMemo(() => {
    if (carrito.length > 0) {
      return carrito.map((s) => {
        const precio =
          Number.isFinite(s.precio) && (s.precio as number) > 0
            ? Number(s.precio)
            : s.servicio === "Pareja"
            ? 80
            : 50;
        return {
          id: s.id,
          label: s.servicio || "Sesión",
          profesor: s.profesor,
          fecha: s.fecha,
          precio,
        };
      });
    }
    if (reserva) {
      return [
        {
          id: reserva.id,
          label: "Sesión Individual",
          profesor: reserva.acompanante || "Acompañante",
          fecha: `${reserva.fecha} ${reserva.hora}`,
          precio: 50, // fallback si no viene servicio
        },
      ];
    }
    return [];
  }, [carrito, reserva]);

  const subtotal: number = useMemo(
    () => lineItems.reduce((acc, li) => acc + (li.precio || 0), 0),
    [lineItems]
  );
  const total: number = subtotal;

  const onChange = (patch: Partial<FormValues>): void =>
    setDatosFacturacion((v) => ({ ...v, ...patch }));

  const handleGoCheckout = async (): Promise<void> => {
    if (!reservaId) {
      setErrorMsg("Reserva no encontrada");
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      await api.patch(`/reservas/${reservaId}`, datosFacturacion);
      navigate(`/pagoPasarela/${reservaId}`);
    } catch (e: unknown) {
      console.error(e);
      const backendMsg = isApiErrorLike(e) ? e.response?.data?.error : undefined;
      setErrorMsg(backendMsg ?? "No se pudieron guardar los datos de facturación");
    } finally {
      setLoading(false);
    }
  };

  // --- NUEVO: llevar al Wizard en paso Carrito y persistir carrito actual
  const handleEditarReserva = () => {
    try {
      // Si tienes carrito en memoria, guárdalo para que lo hidrate el Wizard
      if (carrito && carrito.length) {
        saveWizardCarrito(carrito as Sesion[]);
        console.log("[PagoDatos] Editar -> guardo carrito (len=%d)", carrito.length);
      } else {
        // Si no, intenta guardar el resumen derivado (por si venimos de reserva simple)
        if (lineItems.length) {
          const fallback = lineItems.map(li => ({
            id: li.id,
            profesor: li.profesor || "Acompañante",
            fecha: li.fecha || "",
            precio: li.precio,
            servicio: li.label,
          }));
          saveWizardCarrito(fallback as Sesion[]);
          console.log("[PagoDatos] Editar -> guardo fallback desde lineItems (len=%d)", fallback.length);
        }
      }
    } catch (e) {
      console.warn("[PagoDatos] No se pudo persistir carrito para edición", e);
    }
    if (reservaId) {
      // Navega al Wizard directamente en el paso Carrito
      navigate(`/editar-reserva/${reservaId}?step=carrito`);
    }
  };

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <header className="absolute inset-x-0 top-0 z-40">
        <GenericNav
          title="Dharma en Ruta"
          logoSrc="/img/Logos/Logos-08.png"
          variant="transparent"
          mode="logoOnly"
          containerWidth="120rem"
          barWidth="110rem"
          innerPx="px-[min(6vw,3rem)]"
          barHeight="h-20"
        />
      </header>

      <main className="min-h-screen bg-[#FDF2EC] pt-40 md:pt-48">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 md:mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">
          {/* Formulario */}
          <section className="lg:col-span-2 bg-white shadow-xl rounded-3xl p-6 sm:p-10">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-6">Datos de facturación</h1>

            {errorMsg && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3">
                {errorMsg}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!loading) handleGoCheckout();
              }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Nombre</label>
                  <input
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-mossgreen/40"
                    value={datosFacturacion.nombre}
                    onChange={(e) => onChange({ nombre: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Apellidos</label>
                  <input
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-mossgreen/40"
                    value={datosFacturacion.apellidos}
                    onChange={(e) => onChange({ apellidos: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-mossgreen/40"
                  value={datosFacturacion.email}
                  onChange={(e) => onChange({ email: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Teléfono</label>
                  <input
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-mossgreen/40"
                    value={datosFacturacion.telefono}
                    onChange={(e) => onChange({ telefono: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Código Postal</label>
                  <input
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-mossgreen/40"
                    value={datosFacturacion.zipCode}
                    onChange={(e) => onChange({ zipCode: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Dirección</label>
                <input
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-mossgreen/40"
                  value={datosFacturacion.direccion}
                  onChange={(e) => onChange({ direccion: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Población</label>
                  <input
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-mossgreen/40"
                    value={datosFacturacion.poblacion}
                    onChange={(e) => onChange({ poblacion: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">País</label>
                  <input
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-mossgreen/40"
                    value={datosFacturacion.pais}
                    onChange={(e) => onChange({ pais: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  size="custom"
                  className="px-6 py-3 w-full sm:w-auto text-lg"
                  aria-busy={loading}
                >
                  {loading ? "Guardando..." : "Continuar a pago"}
                </Button>
              </div>
            </form>
          </section>

          {/* Resumen */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 bg-white shadow-xl rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-semibold mb-4">Resumen</h2>

              {loadingReserva && !carrito.length && (
                <p className="text-sm text-gray-500">Cargando resumen…</p>
              )}

              {!loadingReserva && lineItems.length === 0 && (
                <p className="text-sm text-gray-500">No hay elementos en el resumen.</p>
              )}

              <ul className="divide-y divide-gray-100 mb-4">
                {lineItems.map((li) => {
                  const [f, h] = (li.fecha || "").split(" ");
                  return (
                    <li key={li.id} className="py-3 flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-gray-900">{li.label}</p>
                        {li.profesor && (
                          <p className="text-sm text-gray-600">{li.profesor}</p>
                        )}
                        {(f || h) && (
                          <p className="text-sm text-gray-500">
                            {f}{f && h ? " · " : ""}{h}
                          </p>
                        )}
                      </div>
                      <div className="text-right font-medium">{fmtEUR(li.precio || 0)}</div>
                    </li>
                  );
                })}
              </ul>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{fmtEUR(total)}</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold mt-2">
                <span>Total</span>
                <span>{fmtEUR(total)}</span>
              </div>

              {reservaId && (
                <button
                  onClick={handleEditarReserva}
                  className="mt-6 w-full text-sm underline text-gray-600 hover:text-gray-900 text-center block"
                  type="button"
                >
                  Editar reserva
                </button>
              )}
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
