import {FormValues}  from "../pages/TuTestimonioPage";


export function validarDatos(datos:FormValues) {
    if (!datos.nombre) return false;
    if (!datos.apellidos) return false;
    if (!datos.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) return false;
    if (!datos.telefono || !/^\+?\d{9,15}$/.test(datos.telefono)) return false;
    return true;

  }

//   export default validarDatos