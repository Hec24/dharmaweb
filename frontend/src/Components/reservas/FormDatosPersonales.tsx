// src/Components/modalwizard/FormDatosPersonales.tsx
import React, { useEffect, useMemo, useState } from "react";
import SectionHeader from "../ui/SectionHeader";
import Input from "../ui/Input";

export interface FormValues {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
}

interface Props {
  value: FormValues;
  onChange: (data: FormValues) => void;
  onBack?: () => void; // lo inyecta el Wizard (no se usa aquí)
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const fieldValidators: Partial<Record<keyof FormValues, (v: string) => string>> = {
  nombre: (v) => (!v ? "El nombre es obligatorio." : ""),
  apellidos: (v) => (!v ? "El apellido es obligatorio." : ""),
  email: (v) =>
    !v ? "El email es obligatorio." : !validateEmail(v) ? "El email no es válido." : "",
  telefono: (v) =>
    !v
      ? "El teléfono es obligatorio."
      : !/^\+?\d{9,15}$/.test(v)
      ? "El teléfono debe ser válido."
      : "",
};

const fieldOrder: (keyof FormValues)[] = ["nombre", "apellidos", "email", "telefono"];

const FormDatosPersonales: React.FC<Props> = ({ value, onChange }) => {
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

  const validateField = (field: keyof FormValues, val: string) => {
    const validator = fieldValidators[field];
    const error = validator ? validator(val) : "";
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
    // Nota: el componente Input debería exponer aria-invalid/aria-describedby a partir de `error`
  };

  const handleBlur = (field: keyof FormValues) => {
    setTouched((t) => ({ ...t, [field]: true }));
    validateField(field, value[field]);
  };

  const handleChange = (field: keyof FormValues, val: string) => {
    onChange({ ...value, [field]: val });
    if (touched[field]) validateField(field, val);
  };

  // Revalida los campos tocados cuando cambian los valores
  useEffect(() => {
    fieldOrder.forEach((field) => {
      if (touched[field]) validateField(field, value[field]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const firstError = useMemo(() => {
    for (const f of fieldOrder) {
      const e = errors[f];
      if (e) return { field: f, message: e };
    }
    return null;
  }, [errors]);

  return (
    <form
      className="w-full max-w-4xl mx-auto px-3 sm:px-6"
      noValidate
      aria-describedby={firstError ? "form-error-summary" : undefined}
    >
      <SectionHeader
        title="Tus datos personales"
        subtitle="Necesitamos tus datos para gestionar la reserva y enviarte la confirmación."
        align="center"
        size="sm"            // tipografías compactas
        color="asparragus"
        className="mb-5"
      />

      {/* Resumen accesible de errores (solo el primero, live) */}
      <p
        id="form-error-summary"
        role="status"
        aria-live="polite"
        className="sr-only"
      >
        {firstError ? `Error en ${firstError.field}: ${firstError.message}` : "Sin errores"}
      </p>

      <div className="grid gap-3">
        <Input
          label="Nombre"
          name="nombre"
          value={value.nombre}
          onBlur={() => handleBlur("nombre")}
          onChange={(e) => handleChange("nombre", e.target.value)}
          variant="leadmagnet"
          required
          // Mantener inputs a 16px en móvil (el Input debe respetar esto por defecto)
          error={touched.nombre ? errors.nombre : undefined}
        />

        <Input
          label="Apellidos"
          name="apellidos"
          value={value.apellidos}
          onBlur={() => handleBlur("apellidos")}
          onChange={(e) => handleChange("apellidos", e.target.value)}
          variant="leadmagnet"
          required
          error={touched.apellidos ? errors.apellidos : undefined}
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={value.email}
          onBlur={() => handleBlur("email")}
          onChange={(e) => handleChange("email", e.target.value)}
          variant="leadmagnet"
          required
          error={touched.email ? errors.email : undefined}
        />

        <Input
          label="Teléfono"
          type="tel"
          name="telefono"
          value={value.telefono}
          onBlur={() => handleBlur("telefono")}
          onChange={(e) => handleChange("telefono", e.target.value)}
          variant="leadmagnet"
          required
          error={touched.telefono ? errors.telefono : undefined}
        />
      </div>

      {/* El botón Siguiente/Atrás lo renderiza el ModalWizard; aquí no se incluye */}
    </form>
  );
};

export default FormDatosPersonales;

