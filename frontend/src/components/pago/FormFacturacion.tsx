import { useState } from "react";
import Input from "../ui/Input";
import SectionHeader from "../ui/SectionHeader";
import React from "react";

export interface FormValues {
  nombre: string;
  apellidos: string;
  email: string;
  direccion: string;
  pais: string;
  poblacion: string;
  zipCode: string;
  telefono: string;
}

interface Props {
  value: FormValues;
  onChange: (data: FormValues) => void;
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const fieldValidators: Partial<Record<keyof FormValues, (v: string) => string>> = {
  email: (v) => !v ? "Este campo es requerido." : !validateEmail(v) ? "El email no es válido." : "",
  nombre: (v) => !v ? "Este campo es requerido." : "",
  apellidos: (v) => !v ? "Este campo es requerido." : "",
  direccion: (v) => !v ? "Este campo es requerido." : "",
  pais: (v) => !v ? "Este campo es requerido." : "",
  poblacion: (v) => !v ? "Este campo es requerido." : "",
  zipCode: (v) => !v ? "Este campo es requerido." : "",
  telefono: (v) =>
    !v ? "Este campo es requerido."
      : !/^\+?\d{9,15}$/.test(v)
      ? "El teléfono debe ser válido"
      : "",
};

export const FormFacturacion: React.FC<Props> = ({ value, onChange }) => {
  const [touched, setTouched] = useState<{ [K in keyof FormValues]?: boolean }>({});
  const [errors, setErrors] = useState<{ [K in keyof FormValues]?: string }>({});

  // Validate a single field and set error
  const validateField = (field: keyof FormValues, val: string) => {
    const validator = fieldValidators[field];
    const error = validator ? validator(val) : "";
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  const handleBlur = (field: keyof FormValues) => {
    setTouched((t) => ({ ...t, [field]: true }));
    validateField(field, value[field]);
  };

  const handleChange = (field: keyof FormValues, val: string) => {
    onChange({ ...value, [field]: val });
    if (touched[field]) {
      validateField(field, val);
    }
  };

  // Validate all on mount/update
  React.useEffect(() => {
    Object.entries(value).forEach(([field, val]) => {
      if (touched[field as keyof FormValues]) {
        validateField(field as keyof FormValues, val as string);
      }
    });
    // eslint-disable-next-line
  }, [value]);

  return (
    <form
      className="rounded-2xl p-8 max-w-xl mx-auto"
      autoComplete="off"
    >
      <SectionHeader
        title="Información de contacto"
        size="md"
        color="asparragus"
        className="mb-4"
        align="left"
      />

      {/* Contact Info */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <Input
            variant="leadmagnet"
            label="Email"
            type="email"
            name="email"
            value={value.email}
            onBlur={() => handleBlur("email")}
            onChange={e => handleChange("email", e.target.value)}
            required
            error={touched.email ? errors.email : undefined}
          />
        </div>
        <div>
          <Input
            variant="leadmagnet"
            label="Teléfono"
            type="tel"
            name="telefono"
            value={value.telefono}
            onBlur={() => handleBlur("telefono")}
            onChange={e => handleChange("telefono", e.target.value)}
            required
            error={touched.telefono ? errors.telefono: undefined}
          />
        </div>
      </div>

      <SectionHeader
        title="Datos de facturación"
        size="md"
        color="asparragus"
        className="mb-4"
        align="left"
      />

      {/* Name and Surname */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <Input
            variant="leadmagnet"
            label="Nombre"
            type="text"
            name="nombre"
            value={value.nombre}
            onBlur={() => handleBlur("nombre")}
            onChange={e => handleChange("nombre", e.target.value)}
            required
            error={touched.nombre ? errors.nombre : undefined}
          />
        </div>
        <div>
          <Input
            variant="leadmagnet"
            label="Apellidos"
            type="text"
            name="apellidos"
            value={value.apellidos}
            onBlur={() => handleBlur("apellidos")}
            onChange={e => handleChange("apellidos", e.target.value)}
            required
            error={touched.apellidos ? errors.apellidos: undefined}
          />
        </div>
      </div>

      {/* Address fields */}
      <div className="mb-6">
        <Input
          variant="leadmagnet"
          label="Dirección"
          type="text"
          name="direccion"
          value={value.direccion}
          onBlur={() => handleBlur("direccion")}
          onChange={e => handleChange("direccion", e.target.value)}
          required
          error={touched.direccion ? errors.direccion: undefined}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div>
          <Input
            variant="leadmagnet"
            label="País"
            type="text"
            name="pais"
            value={value.pais}
            onBlur={() => handleBlur("pais")}
            onChange={e => handleChange("pais", e.target.value)}
            required
            error={touched.pais ? errors.pais: undefined}
          />
        </div>
        <div>
          <Input
            variant="leadmagnet"
            label="Población"
            type="text"
            name="poblacion"
            value={value.poblacion}
            onBlur={() => handleBlur("poblacion")}
            onChange={e => handleChange("poblacion", e.target.value)}
            required
            error={touched.poblacion ? errors.poblacion: undefined}
          />
        </div>
        <div>
          <Input
            variant="leadmagnet"
            label="Código Postal"
            type="text"
            name="zipCode"
            value={value.zipCode}
            onBlur={() => handleBlur("zipCode")}
            onChange={e => handleChange("zipCode", e.target.value)}
            required
            error={touched.zipCode ? errors.zipCode: undefined}
          />
        </div>
      </div>
    </form>
  );
};

export default FormFacturacion;
