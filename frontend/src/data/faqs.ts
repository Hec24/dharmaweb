export type FaqItem = {
  question: string;
  answers?: string[];
  answer?:string[];
  answer2?: string[];
};

export const faqs: FaqItem[] = [
  {
    question: "¿Los acompañamientos forman parte de la escuela?",
    answers: [
      "Sí. Son una parte esencial de Dharma en Ruta.",
      "Los cursos te ofrecen conocimiento, pero los acompañamientos te ayudan a integrarlo en tu día a día, con guía y acompañamiento humano."
    ],
  },
  {
    question: "¿Necesito experiencia previa?",
    answers: ["No. Cada profesional adapta su propuesta a tu momento y nivel."],
  },
  {
    question: "¿Qué diferencia hay entre un curso y un acompañamiento?",
    answers: [
      "El curso te da herramientas y estructura de aprendizaje.",
      "El acompañamiento te ofrece dirección, mirada y sostén personalizado para aplicar lo aprendido a tu realidad."
    ],
  },
  {
    question: "¿Puedo combinar o cambiar de acompañamiento?",
    answers: [
      "Sí. Puedes trabajar con distintos profesionales o explorar varias áreas según lo que necesites en cada momento.",
      "Y si más adelante sientes que otro enfoque o profesional puede ayudarte mejor, podrás cambiar sin problema. Queremos que tu proceso sea flexible, cómodo y totalmente tuyo."
    ],
  },
  {
    question: "¿Son online o presenciales?",
    answers: [
      "La mayoría de los acompañamientos se realizan online, para que puedas acceder desde cualquier lugar.",
      "Algunos profesionales ofrecen sesiones presenciales si coincidís en la misma ciudad o durante eventos de la escuela."
    ],
  },
  {
    question: "¿Cómo elijo a la persona ideal?",
    answers: [
      "En cada ficha encontrarás la especialidad, metodología y energía de cada profesional. Tómate un momento para leer y sentir con quién conectas más.",
      "Si tienes dudas, puedes escribirnos: te ayudaremos a encontrar el acompañamiento más adecuado para ti."
    ],
  },
  {
    question: "¿Qué necesito para la sesión?",
    answers: [
      "Solo un espacio tranquilo, buena conexión a internet y, si quieres, algo para tomar notas.",
      "En el caso de sesiones corporales o prácticas (como yoga o meditación), recibirás indicaciones específicas antes de comenzar."
    ],
  },
  {
    question: "¿Cuál es la duración de las sesiones?",
    answers: [
      "Depende del tipo de acompañamiento y del profesional.",
      "Generalmente, las sesiones individuales duran entre 60 y 90 minutos; en algunos casos se ofrecen procesos más largos o programas por bloques."
    ],
  },
  {
    question: "¿Cómo reservo y qué pasa después?",
    answers: [
      "Elige el acompañamiento y reserva directamente desde la web.",
      "Tras el pago, recibirás un correo con la confirmación, los pasos a seguir y el enlace de acceso o el contacto directo con tu profesional."
    ],
  },
  {
    question: "¿Qué métodos de pago se aceptan?",
    answers: [
      "Puedes pagar de forma segura con tarjeta de crédito o débito y Google Pay.",
      "En procesos más largos se pueden ofrecer pagos fraccionados cuando esté especificado en la ficha."
    ],
  },
  {
    question: "¿Hay cancelaciones, cambios o reembolsos?",
    answers: [
      "Puedes reprogramar con 48 h de antelación. Las cancelaciones con menos de 24 h no dan derecho a reembolso.",
      "Para cursos digitales, aplican las condiciones de la plataforma y lo indicado en los Términos y Condiciones."
    ],
  },
  {
    question: "¿Recibiré factura?",
    answers: [
      "Sí. Tras la compra podrás solicitar tu factura con los datos de facturación que indiques."
    ],
  },
  {
    question: "¿Cómo accedo a mis cursos?",
    answers: [
      "Una vez confirmada la compra, te enviaremos un correo con las instrucciones de acceso (plataforma, usuario y/o enlaces)."
    ],
  },
  {
    question: "¿Ofrecen soporte si tengo problemas técnicos?",
    answers: [
      "Sí. Escríbenos y te ayudaremos a recuperar el acceso o resolver incidencias con la mayor rapidez posible."
    ],
  },
];




export const faqsAcompanamientos: FaqItem[] = [
  {
    question: "¿Los acompañamientos forman parte de la escuela?",
    answer: [
      "Sí. Son una parte esencial de Dharma en Ruta.",
    ],
    answer2: [
      "Los cursos te ofrecen conocimiento, pero los acompañamientos te ayudan a integrarlo en tu día a día, con guía y acompañamiento humano."
    ]
  },
  {
    question: "¿Necesito experiencia previa?",
    answer: ["No. Cada profesional adapta su propuesta a tu momento y nivel."],
  },
  {
    question: "¿Qué diferencia hay entre un curso y un acompañamiento?",
    answer: [
      "El curso te da herramientas y estructura de aprendizaje.",
    ],
    answer2: [
      "El acompañamiento te ofrece dirección, mirada y sostén personalizado para aplicar lo aprendido a tu realidad."

    ],
  },
  {
    question: "¿Puedo combinar o cambiar de acompañamiento?",
    answer: [
      "Sí. Puedes trabajar con distintos profesionales o explorar varias áreas según lo que necesites en cada momento.",
    ],
    answer2: [
      "Y si más adelante sientes que otro enfoque o profesional puede ayudarte mejor, podrás cambiar sin problema. Queremos que tu proceso sea flexible, cómodo y totalmente tuyo."

    ],
  },
  {
    question: "¿Son online o presenciales?",
    answer: [
      "La mayoría de los acompañamientos se realizan online, para que puedas acceder desde cualquier lugar.",
    ],
    answer2: [
      "Algunos profesionales ofrecen sesiones presenciales si coincidís en la misma ciudad o durante eventos de la escuela."

    ]
  },
  {
    question: "¿Cómo elijo a la persona ideal?",
    answer: [
      "En cada ficha encontrarás la especialidad, metodología y energía de cada profesional. Tómate un momento para leer y sentir con quién conectas más.",
    ],
    answer2:[
     "Si tienes dudas, puedes escribirnos: te ayudaremos a encontrar el acompañamiento más adecuado para ti."
    ],
  },
  {
    question: "¿Qué necesito para la sesión?",
    answer: [
      "Solo un espacio tranquilo, buena conexión a internet y, si quieres, algo para tomar notas.",
    ],
    answer2: [
      "En el caso de sesiones corporales o prácticas (como yoga o meditación), recibirás indicaciones específicas antes de comenzar."

    ]
  },
  {
    question: "¿Cuál es la duración de las sesiones?",
    answer: [
      "Depende del tipo de acompañamiento y del profesional.",
    ],
    answer2:[
      "Generalmente, las sesiones individuales duran entre 60 y 90 minutos; en algunos casos se ofrecen procesos más largos o programas por bloques."

    ],
  },
  {
    question: "¿Cómo reservo y qué pasa después?",
    answer: [
      "Elige el acompañamiento y reserva directamente desde la web.",
    ],
    answer2:[
       "Tras el pago, recibirás un correo con la confirmación, los pasos a seguir y el enlace de acceso o el contacto directo con tu profesional."

    ],
  },
  {
    question: "¿Qué métodos de pago se aceptan?",
    answer: [
      "Puedes pagar de forma segura con tarjeta de crédito o débito y Google Pay.",
    ],
    answer2:[
      "En procesos más largos se pueden ofrecer pagos fraccionados cuando esté especificado en la ficha."

    ],
  },
  {
    question: "¿Hay cancelaciones, cambios o reembolsos?",
    answer: [
      "Puedes reprogramar con 48 h de antelación. Las cancelaciones con menos de 24 h no dan derecho a reembolso.",
    ],
    answer2:[
      "Para cursos digitales, aplican las condiciones de la plataforma y lo indicado en los Términos y Condiciones."

    ],
  },
  {
    question: "¿Recibiré factura?",
    answer: [
      "Sí. Tras la compra podrás solicitar tu factura con los datos de facturación que indiques."
    ],
  },
  
];
