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
      // sin preseleccion → asegúrate de estar en paso 0
      setStep(0);
    }
  }, [open, preSelectedProfesor, autoAdvanceFromStep0]);

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
        setCarrito((c) => [...c, nueva]);
      }
    }
    nextStep();
  }, [step, profesor, fechaHora, servicio, carrito, nextStep]);

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

  // ✅ Confirmar sesión: crea/edita y pasa el carrito al checkout
  const handleConfirmSesion = React.useCallback(async () => {
  if (!profesor || !fechaHora) return;

  try {
    // sesiones a pagar (si no hay carrito, construimos 1 con la selección actual)
    const sesiones: Sesion[] =
      carrito.length > 0
        ? carrito
        : [
            {
              id: Date.now().toString(),
              profesor: profesor.name,
              fecha: `${fechaHora.fecha} ${fechaHora.hora}`,
              servicio: normalizeServicio(servicio),
              precio: normalizeServicio(servicio) === "Pareja" ? 80 : 50,
            },
          ];

      // EDICIÓN
     
      if (resume && reservaId && sesiones[0]) {
      const [f, h] = sesiones[0].fecha.split(" ");
      const patchBody = {
        nombre: datos.nombre,
        apellidos: datos.apellidos,
        email: datos.email,
        telefono: datos.telefono,
        acompanante: profesor.name,
        acompananteEmail: profesor.acompananteEmail ?? "",
        fecha: f,
        hora: h,
      };
        await patchWithRetry(`/reservas/${reservaId}`, patchBody);
        resetWizard();
        onClose();
        const ids: string[] = [reservaId];
        navigate(`/pagoDatos/${reservaId}`, { state: { carrito: sesiones, reservaIds: ids } });
        return;
      }


      // CREACIÓN
        const ids: string[] = [];
    for (const s of sesiones) {
      const [f, h] = s.fecha.split(" ");
      const body = {
        nombre: datos.nombre,
        apellidos: datos.apellidos,
        email: datos.email,
        telefono: datos.telefono,
        acompanante: s.profesor,
        acompananteEmail: profesor.acompananteEmail ?? "",
        fecha: f,
        hora: h,
      };

      const resp = await postWithRetry<{ id: string }>("/reservas", body);
      ids.push(resp.data.id);
      }

      resetWizard();
      onClose();
      navigate(`/pagoDatos/${ids[0]}`, { state: { carrito: sesiones } });
    } catch (e: unknown) {
      console.error("Error guardando reserva:", e);
      alert("Error de conexión al guardar la reserva");
    }
  }, [
    profesor,
    fechaHora,
    servicio,
    carrito,
    resume,
    reservaId,
    datos.nombre,
    datos.apellidos,
    datos.email,
    datos.telefono,
    onClose,
    resetWizard,
    navigate,
  ]);

  // —— Render
  return (
    <ModalWizard
      open={open}
      onClose={() => {
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

      {step === 3 && <FormDatosPersonales value={datos} onChange={setDatos} />}

      {step === 4 && (
        <CarritoReserva carrito={carrito} onAdd={handleAddAnotherSession} onRemove={(id) =>
          setCarrito((c) => c.filter((s) => s.id !== id))
        } />
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

