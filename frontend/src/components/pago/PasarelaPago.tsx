import React, { useEffect, useMemo, useState } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import GenericNav from "../shared/GenericNav";
import Button from "../../Components/ui/Button";
import { api } from "../../lib/api";
import type { Sesion } from "../../data/types";
import { Helmet } from "react-helmet-async";
import { saveWizardCarrito } from "../../lib/wizardSession";

// DTO mínimo de tu backend
type ReservaDto = {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  fecha: string;        // "YYYY-MM-DD"
  hora: string;         // "HH:mm"
  acompanante?: string; // nombre del profesor
  acompananteEmail?: string;
  duracionMin?: number;
};

type LocationState = {
  carrito?: Sesion[];
  reservaIds?: string[];
  datos?: Record<string, unknown>;
} | null;

type LineItem = {
  id: string;
  label: string;
  profesor?: string;
  fecha?: string;
  precio: number;
};

const fmtEUR = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n || 0);

// helpers SS
const loadSS = <T,>(k: string): T | null => {
  try { const raw = sessionStorage.getItem(k); return raw ? (JSON.parse(raw) as T) : null; }
  catch { return null; }
};
const saveSS = (k: string, v: unknown) => {
  try { sessionStorage.setItem(k, JSON.stringify(v)); } catch {
    // no importa
  }
};

export default function PasarelaPago(): React.ReactElement {
  const { id: reservaId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || null;

  // ---- State recibido por navigate (si no hubo refresh)
  const carritoFromState: Sesion[] | undefined = state?.carrito;
  const reservaIdsFromState: string[] | undefined = state?.reservaIds;

  // ---- Fallbacks desde sessionStorage (si hubo refresh o entrada directa)
  const reservaIdsFromSS = loadSS<string[]>("checkout_reserva_ids") ?? [];
  const carritoFromSS = loadSS<Sesion[]>("checkout_carrito") ?? [];

  // ---- Fuente de verdad final (prioriza state; si no, sessionStorage)
  const reservaIdsFinal: string[] | undefined =
    (reservaIdsFromState && reservaIdsFromState.length ? reservaIdsFromState :
     (reservaIdsFromSS && reservaIdsFromSS.length ? reservaIdsFromSS : undefined));

  const carritoFinal: Sesion[] | undefined =
    (carritoFromState && carritoFromState.length ? carritoFromState :
     (carritoFromSS && carritoFromSS.length ? carritoFromSS : undefined));

  // Logs útiles
  console.log("[Pasarela] reservaIdsFinal =", reservaIdsFinal);
  console.log("[Pasarela] carritoFinal.length =", carritoFinal?.length);

  const [pagando, setPagando] = useState(false);
  const [loadingReserva, setLoadingReserva] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [reserva, setReserva] = useState<ReservaDto | null>(null);

  // Carga 1 reserva de fallback si no tenemos carrito en memoria
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
        if (!cancelled) setReserva(data);
      } catch {
        if (!cancelled) setErrorMsg("No se pudo cargar la reserva.");
      } finally {
        if (!cancelled) setLoadingReserva(false);
      }
    })();
    return () => { cancelled = true; };
  }, [reservaId]);

  // Si el usuario vuelve de Stripe con ?cancelled=1 → libera TODAS las reservas implicadas
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const cancelled = params.get("cancelled") === "1";
  if (!cancelled) return;

  const idsToDelete = reservaIdsFinal && reservaIdsFinal.length ? reservaIdsFinal
                      : (reservaId ? [reservaId] : []);

  if (!idsToDelete.length) return;

  (async () => {
    try {
      await Promise.all(idsToDelete.map(id => api.delete(`/reservas/${id}`)));
    } catch (e) {
      console.error("[PasarelaPago] no se pudo cancelar alguna reserva:", e);
    } finally {
      // Limpia TODO: wizard + checkout
      try {
        sessionStorage.removeItem("checkout_reserva_ids");
        sessionStorage.removeItem("checkout_carrito");
        sessionStorage.removeItem("checkout_datos");
        sessionStorage.removeItem("facturacion_datos");
        sessionStorage.removeItem("wizard_carrito");
        sessionStorage.removeItem("wizard_datos");
      } catch {
        // no importa
      }
    }
  })();
}, [reservaId, reservaIdsFinal]);


  // Construye el resumen
  const lineItems: LineItem[] = useMemo(() => {
    if (carritoFinal && carritoFinal.length > 0) {
      return carritoFinal.map((s) => {
        const precio =
          Number.isFinite(s.precio as number) && (s.precio as number) > 0
            ? Number(s.precio)
            : s.servicio === "Pareja"
            ? 80
            : 50;
        return {
          id: s.id,
          label: s.servicio || "Sesión",
          profesor: s.profesor,
          fecha: s.fecha, // "YYYY-MM-DD HH:mm"
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
          precio: 50,
        },
      ];
    }
    return [];
  }, [carritoFinal, reserva]);

  const total = useMemo(
    () => lineItems.reduce((acc, li) => acc + (li.precio || 0), 0),
    [lineItems]
  );

  const handlePagar = async () => {
  const idsActuales = reservaIdsFinal && reservaIdsFinal.length ? [...reservaIdsFinal] : (reservaId ? [reservaId] : []);
  if (!idsActuales.length) {
    alert("No hay reservas válidas");
    return;
  }

  setPagando(true);
  setErrorMsg(null);
  try {
    // carrito (state o sessionStorage)
    const carritoSnapshot: Sesion[] =
      (carritoFinal && carritoFinal.length ? carritoFinal :
       (() => { try { return JSON.parse(sessionStorage.getItem("checkout_carrito") || "[]"); } catch { return []; } })());

    // datos facturación (cualquiera de los alias que ya usas)
    const datosRaw =
      sessionStorage.getItem("checkout_datos") ||
      sessionStorage.getItem("facturacion_datos") ||
      sessionStorage.getItem("wizard_datos");
    const datos = datosRaw ? JSON.parse(datosRaw) : {};

    const payload =
      Array.isArray(idsActuales) && idsActuales.length > 0
        ? { reservaIds: idsActuales, carrito: carritoSnapshot, datos }
        : { reservaId, carrito: carritoSnapshot, datos };

    const { data } = await api.post<{ id: string; url: string }>(
      "/pagos/checkout-session",
      payload
    );

    if (!data?.url) {
      setPagando(false);
      alert("Respuesta de pago inválida");
      return;
    }
    window.location.href = data.url;
  } catch (err) {
    console.error(err);
    setErrorMsg("Error al conectar con el backend");
    setPagando(false);
  }
};


  // Editar → persistir carrito + ids + (si hay) datos de facturación y navegar a Wizard (Carrito)
  const handleEditarReserva = () => {
    const ids = reservaIdsFinal && reservaIdsFinal.length ? reservaIdsFinal : (reservaId ? [reservaId] : []);
    if (!ids.length) return;

    // Persistir carrito (o fallback desde lineItems)
    if (carritoFinal && carritoFinal.length) {
      saveWizardCarrito(carritoFinal as Sesion[]);
      saveSS("checkout_carrito", carritoFinal);
    } else if (lineItems.length) {
      const fallback = lineItems.map(li => ({
        id: li.id,
        profesor: li.profesor || "Acompañante",
        fecha: li.fecha || "",
        precio: li.precio,
        servicio: li.label,
      }));
      saveWizardCarrito(fallback as unknown as Sesion[]);
      saveSS("checkout_carrito", fallback);
    }

    // Persistir ids + conservar datos de facturación si existían
    saveSS("checkout_reserva_ids", ids);
    const datosPrev = loadSS<Record<string, unknown>>("checkout_datos") ||
                      loadSS<Record<string, unknown>>("facturacion_datos");
    if (datosPrev) {
      saveSS("checkout_datos", datosPrev);
      saveSS("facturacion_datos", datosPrev);
    }

    navigate(`/editar-reserva/${ids[0]}?resume=1&step=carrito`);
  };

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      {/* NAV igual que en otras páginas */}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">
          {/* Caja principal de pago */}
          <section className="lg:col-span-2 bg-white shadow-xl rounded-3xl p-6 sm:p-10">
            <h1 className="text-2xl sm:text-3xl font-semibold">Pago seguro</h1>
            <p className="text-gray-600 mt-2">
              Serás redirigido a un pago seguro con Stripe.
            </p>

            {errorMsg && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3">
                {errorMsg}
              </div>
            )}

            <div className="mt-8">
              <Button
                onClick={handlePagar}
                variant="primary"
                disabled={pagando || lineItems.length === 0}
                size="custom"
                className="px-8 py-4 text-lg"
                aria-busy={pagando}
              >
                {pagando ? "Procesando..." : "Pagar ahora"}
              </Button>
            </div>

            {/* Enlaces de utilidad */}
            <div className="mt-6 text-sm text-gray-600">
              {reservaId && (
                <button
                  onClick={handleEditarReserva}
                  className="underline hover:text-gray-800"
                  type="button"
                >
                  Editar reserva
                </button>
              )}
              {reservaId && <span className="mx-2">·</span>}
              {reservaId && (
                <Link
                  to={`/pagoDatos/${reservaId}`}
                  className="underline hover:text-gray-800"
                >
                  Volver a datos de facturación
                </Link>
              )}
            </div>
          </section>

          {/* Resumen */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 bg-white shadow-xl rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl font-semibold mb-4">Resumen</h2>

              {loadingReserva && !carritoFinal?.length && (
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
                      <div className="text-right font-medium">
                        {fmtEUR(li.precio || 0)}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Total</span>
                <span className="text-base font-semibold">{fmtEUR(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
