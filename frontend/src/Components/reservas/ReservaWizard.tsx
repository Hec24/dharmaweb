import React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import ModalWizard from "../ui/ModalWizard";
import SelectorProfesores from "./SelectorProfesores";
import SelectorCalendario from "./SelectorCalendario";
import FormDatosPersonales from "./FormDatosPersonales";
import SelectorSesion from "./SelectorSesion";
import CarritoReserva from "../pago/CarritoReserva";
import ConfirmacionReserva from "./ConfirmacionReserva";

import { profesores } from "../../data/profesores";
import { validarDatos } from "../../utils/validacion";

import { postWithRetry, patchWithRetry } from "../../lib/net";
import {
  loadWizardCarrito,
  saveWizardCarrito,
  clearWizardCarritoTemp,
  loadWizardDatos,
  saveWizardDatos,
} from "../../lib/wizardSession";

import type { Profesor, Sesion, FechaHora, FormValues, Servicio } from "../../data/types";

interface ReservaWizardProps {
  open: boolean;
  onClose: () => void;
  preSelectedProfesor?: Profesor | null;
  autoAdvanceFromStep0?: boolean;
}

const normalizeServicio = (v: unknown): Servicio =>
  v === "Pareja" ? "Pareja" : "Individual";

export default function ReservaWizard({
  open,
  onClose,
  preSelectedProfesor = null,
  autoAdvanceFromStep0 = false,
}: ReservaWizardProps) {
  const navigate = useNavigate();

  // —— State
  const [step, setStep] = React.useState(0);
  const [profesor, setProfesor] = React.useState<Profesor | null>(null);
  const [servicio, setServicio] = React.useState<Servicio | null>(null);
  const [fechaHora, setFechaHora] = React.useState<FechaHora | null>(null);
  const [datos, setDatos] = React.useState<FormValues>({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
  });
  const [carrito, setCarrito] = React.useState<Sesion[]>([]);

  // —— Navegación programática + edición
  const location = useLocation();
  const qs = React.useMemo(() => new URLSearchParams(location.search), [location.search]);
  const resume = qs.get("resume") === "1";
  const stepParam = qs.get("step"); // "carrito" para aterrizar en carrito
  const shouldHydrate = resume || stepParam === "carrito"; // ← solo editar restaura/persiste carrito
  const { id: reservaId } = useParams<{ id: string }>();

  // —— Evitar re-inicializaciones en cada render: init por apertura
  const initRef = React.useRef(false);

  // Reset completo (sin llamar setState en render)
  const resetWizard = React.useCallback(() => {
    setStep(0);
    setProfesor(null);
    setServicio(null);
    setFechaHora(null);
    setDatos({
      nombre: "",
      apellidos: "",
      email: "",
      telefono: "",
    });
    setCarrito([]);
  }, []);

  // Derivar base desde carrito si falta estado (útil al volver desde Pago/Pasarela)
  const deriveFromCarrito = (c: Sesion[] | null | undefined) => {
    if (!c || c.length === 0) return null;
    const first = c[0];
    const [f, h] = first.fecha.split(" ");
    const profObj = profesores.find((p) => p.name === first.profesor);
    return {
      profesorName: first.profesor,
      fecha: f,
      hora: h,
      acompananteEmail: profObj?.acompananteEmail ?? "",
      servicio: first.servicio as Servicio | undefined,
    };
  };

  const base = React.useMemo(() => {
    const baseFromState =
      profesor && fechaHora
        ? {
            profesorName: profesor.name,
            fecha: fechaHora.fecha,
            hora: fechaHora.hora,
            acompananteEmail: profesor.acompananteEmail ?? "",
            servicio: (servicio ? normalizeServicio(servicio) : undefined),
          }
        : null;
    return baseFromState ?? deriveFromCarrito(carrito);
  }, [profesor, fechaHora, servicio, carrito]);

  // Cuando cambia `open`: si se abre, inicializa 1 vez; si se cierra, limpia el flag.
  React.useEffect(() => {
    if (!open) {
      initRef.current = false;
      return;
    }
    // abierto
    if (initRef.current) return;
    initRef.current = true;

    // Preselección de profesor (si viene del padre)
    if (preSelectedProfesor) {
      setProfesor((prev) => (prev?.id === preSelectedProfesor.id ? prev : preSelectedProfesor));
      if (autoAdvanceFromStep0) {
        // avanzamos SOLO si venimos del paso 0
        setStep((s) => (s === 0 ? 1 : s));
      }
    } else {
      // sin preseleccion → asegúrate de estar en paso 0 por defecto
      setStep(0);
    }

    // Carrito -> solo hidratar si vienes a editar; si no, limpiar
    if (shouldHydrate) {
      const savedCarrito = loadWizardCarrito();
      if (savedCarrito && Array.isArray(savedCarrito) && savedCarrito.length > 0) {
        setCarrito(savedCarrito as Sesion[]);
        console.log("[Wizard] Carrito restaurado (len=%d)", savedCarrito.length);
      }
    } else {
      try {
        sessionStorage.removeItem("wizard_carrito");
      } catch {
        // ignore storage errorsq
      }
      setCarrito([]);
    }

    // Hidratar datos (nombre, email, etc.)
    const savedDatos = loadWizardDatos();
      if (savedDatos) {
        setDatos(prev => ({
          ...prev,
          ...savedDatos, // ← merge completo, incluye código postal, dirección, ciudad, país, etc.
        }));
        console.log("[Wizard] Datos personales restaurados");
    }


    // Si la URL trae ?step=carrito → ir directamente a Carrito (índice 4)
    if (stepParam === "carrito") {
      setStep(4);
      console.log("[Wizard] initial step = Carrito (por query param)");
    }
  }, [open, preSelectedProfesor, autoAdvanceFromStep0, stepParam, shouldHydrate]);

  // —— Navegación pasos
  const stepsTotal = 6;
  const nextStep = React.useCallback(
    () => setStep((s) => Math.min(s + 1, stepsTotal - 1)),
    []
  );
  const prevStep = React.useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  // Añadir la sesión elegida al carrito al pasar de Datos → Carrito
  const handleNext = React.useCallback(() => {
    if (step === 3) {
      if (
        profesor &&
        fechaHora &&
        servicio &&
        !carrito.some(
          (s) => s.profesor === profesor.name && s.fecha === `${fechaHora.fecha} ${fechaHora.hora}`
        )
      ) {
        const svc: Servicio = normalizeServicio(servicio);
        const nueva: Sesion = {
          id: Date.now().toString(),
          profesor: profesor.name,
          fecha: `${fechaHora.fecha} ${fechaHora.hora}`,
          precio: svc === "Pareja" ? 80 : 50,
          servicio: svc,
        };
        setCarrito((c) => {
          const next = [...c, nueva];
          // Persistimos carrito solo en edición
          if (shouldHydrate) {
            saveWizardCarrito(next as Sesion[]);
          }
          console.log("[Wizard] add sesion → carrito len=%d", next.length);
          return next;
        });
      }
    }
    nextStep();
  }, [step, profesor, fechaHora, servicio, carrito, nextStep, shouldHydrate]);

  const handleAddAnotherSession = React.useCallback(() => {
    setStep(0);
    setProfesor(null);
    setServicio(null);
    setFechaHora(null);
    // mantenemos datos personales
  }, []);

  const handleProfesorSelect = React.useCallback((p: Profesor) => {
    // evita setear si es el mismo
    setProfesor((prev) => (prev?.id === p.id ? prev : p));
  }, []);

  // Habilitar botón “Siguiente/Confirmar”
  const puedeContinuar =
    (step === 0 && !!profesor) ||
    (step === 1 && !!servicio) ||
    (step === 2 && !!fechaHora && !!fechaHora.fecha && !!fechaHora.hora) ||
    (step === 3 && validarDatos(datos)) ||
    (step === 4 && carrito.length > 0) ||
    step === 5;

  const stepLabels = [
    "Acompañante",
    "Sesión",
    "Fecha y hora",
    "Datos",
    "Carrito",
    "Confirmación",
  ];

  const titles = [
    "Elige tu acompañante",
    "Elige la sesión",
    "Elige fecha y hora",
    "Tus datos",
    "Carrito",
    "Confirmación y pago",
  ];

  const handleWizardNext = React.useCallback(() => {
    if (step === 3) {
      handleNext();
    } else {
      nextStep();
    }
  }, [step, handleNext, nextStep]);

  // —— Utilidades de persistencia para Pasarela
  const persistCheckoutState = React.useCallback((ids: string[], sesiones: Sesion[]) => {
    try {
      sessionStorage.setItem("checkout_reserva_ids", JSON.stringify(ids));
      sessionStorage.setItem("checkout_carrito", JSON.stringify(sesiones));
    } catch {
      // ignore storage errors
    }
  }, []);

  // ✅ Confirmar sesión: crea/edita y pasa el carrito al checkout
  const handleConfirmSesion = React.useCallback(async () => {
    // Si ni estado ni carrito tienen info suficiente, avisamos
    if (!base) {
      alert("Falta seleccionar al acompañante y la fecha/hora o añadir la sesión al carrito.");
      return;
    }

    // Detectar si ya existía un checkout ANTES de persistir para decidir navegación
    const hadCheckout = !!sessionStorage.getItem("checkout_reserva_ids");

    try {
      // sesiones a pagar (si no hay carrito, construimos 1 con la selección actual/base)
      const sesiones: Sesion[] =
        carrito.length > 0
          ? carrito
          : [
              {
                id: Date.now().toString(),
                profesor: base.profesorName,
                fecha: `${base.fecha} ${base.hora}`,
                servicio: base.servicio ?? "Individual",
                precio: (base.servicio ?? "Individual") === "Pareja" ? 80 : 50,
              },
            ];

      // —— EDICIÓN
      if (resume && reservaId && sesiones[0]) {
        const [f, h] = sesiones[0].fecha.split(" ");
        const patchBody = {
          nombre: datos.nombre,
          apellidos: datos.apellidos,
          email: datos.email,
          telefono: datos.telefono,
          acompanante: base.profesorName,
          acompananteEmail: base.acompananteEmail ?? "",
          fecha: f,
          hora: h,
        };
        try {
          await patchWithRetry(`/reservas/${reservaId}`, patchBody);

          // persistimos checkout
          persistCheckoutState([reservaId], sesiones);
          // limpiar/persistir estado wizard
          if (shouldHydrate) {
            saveWizardCarrito(sesiones);
          }
          saveWizardDatos(datos as FormValues);
          clearWizardCarritoTemp();
          resetWizard();

          const target = hadCheckout
            ? `/pagoPasarela/${reservaId}`
            : `/pagoDatos/${reservaId}`;

          navigate(target, { state: { carrito: sesiones, reservaIds: [reservaId] }, replace: true });
          return;
        } catch (e: unknown) {
          // Si el backend perdió la reserva (404), re-crear y continuar
          const status =
            typeof e === "object" && e !== null && "response" in e
              ? (e as { response?: { status?: number } }).response?.status
              : undefined;
          if (status === 404) {
            const resp = await postWithRetry<{ id: string }>("/reservas", patchBody);
            const newId = resp.data.id;

            persistCheckoutState([newId], sesiones);
            if (shouldHydrate) {
              saveWizardCarrito(sesiones);
            }
            saveWizardDatos(datos as FormValues);
            clearWizardCarritoTemp();
            resetWizard();

            const target = hadCheckout
              ? `/pagoPasarela/${newId}`
              : `/pagoDatos/${newId}`;

            navigate(target, { state: { carrito: sesiones, reservaIds: [newId] }, replace: true });
            return;
          }
          throw e;
        }
      }

      // —— CREACIÓN (una o varias sesiones)
      const ids: string[] = [];
      for (const s of sesiones) {
        const [f, h] = s.fecha.split(" ");
        const profEmail =
          profesor?.acompananteEmail ??
          profesores.find((p) => p.name === s.profesor)?.acompananteEmail ??
          "";
        const body = {
          nombre: datos.nombre,
          apellidos: datos.apellidos,
          email: datos.email,
          telefono: datos.telefono,
          acompanante: s.profesor,
          acompananteEmail: profEmail,
          fecha: f,
          hora: h,
        };

        const resp = await postWithRetry<{ id: string }>("/reservas", body);
        ids.push(resp.data.id);
      }

      // persistimos y navegamos con TODOS los ids
      persistCheckoutState(ids, sesiones);
      if (shouldHydrate) {
        saveWizardCarrito(sesiones);
      }
      saveWizardDatos(datos as FormValues);
      clearWizardCarritoTemp();
      resetWizard();

      const firstId = ids[0];
      const target = hadCheckout
        ? `/pagoPasarela/${firstId}`
        : `/pagoDatos/${firstId}`;

      navigate(target, { state: { carrito: sesiones, reservaIds: ids }, replace: true });
    } catch (e: unknown) {
      console.error("Error guardando reserva:", e);
      alert("Error de conexión al guardar la reserva");
    }
  }, [
    base,
    carrito,
    datos.nombre,
    datos.apellidos,
    datos.email,
    datos.telefono,
    navigate,
    persistCheckoutState,
    profesor,
    resume,
    reservaId,
    resetWizard,
    shouldHydrate,
  ]);

  // Persistir carrito en removals (solo en edición) y limpiar al cerrar
  const handleRemoveFromCarrito = React.useCallback((id: string) => {
    setCarrito((c) => {
      const next = c.filter((s) => s.id !== id);
      if (shouldHydrate) {
        saveWizardCarrito(next as Sesion[]);
      }
      console.log("[Wizard] remove sesion → carrito len=%d", next.length);
      return next;
    });
  }, [shouldHydrate]);

  // —— Render
  return (
    <ModalWizard
      open={open}
      onClose={() => {
        clearWizardCarritoTemp(); // limpia temporal de wizard
        try { sessionStorage.removeItem("wizard_carrito"); } catch {
          // ignore storage errors
        }
        resetWizard();
        onClose();
      }}
      step={step}
      totalSteps={stepsTotal}
      stepLabels={stepLabels}
      title={titles[step]}
      goToCarrito={() => setStep(4)}
      carritoCount={carrito.length}
      puedeContinuar={puedeContinuar}
      onNext={handleWizardNext}
      onBack={prevStep}
      onConfirm={handleConfirmSesion}
    >
      {step === 0 && (
        <SelectorProfesores
          profesores={profesores}
          value={profesor}
          onChange={handleProfesorSelect}
        />
      )}

      {step === 1 && (
        <SelectorSesion
          servicios={["Individual", "Pareja"] as Servicio[]}
          value={servicio}
          onChange={(v: string) => setServicio(normalizeServicio(v))}
          onBack={prevStep}
        />
      )}

      {step === 2 && profesor && (
        <SelectorCalendario
          profesor={profesor}
          sesionesYaReservadas={carrito.map((s) => s.fecha)}
          value={fechaHora}
          onChange={setFechaHora}
        />
      )}

      {step === 3 && (
        <FormDatosPersonales
          value={datos}
          onChange={(v) => {
            setDatos(v);
            saveWizardDatos(v as FormValues); // persistir datos al cambiar
          }}
        />
      )}

      {step === 4 && (
        <CarritoReserva
          carrito={carrito}
          onAdd={handleAddAnotherSession}
          onRemove={handleRemoveFromCarrito}
        />
      )}

      {step === 5 && (
        <ConfirmacionReserva
          profesor={profesor}
          fechaHora={fechaHora}
          datos={datos}
          carrito={carrito}
        />
      )}
    </ModalWizard>
  );
}
