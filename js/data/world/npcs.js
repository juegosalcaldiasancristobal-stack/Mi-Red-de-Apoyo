/* ============================================================
   NPCS — personajes institucionales/profesionales recurrentes
   --------------------------------------------------------------
   A diferencia de los contactos personales de cada protagonista
   (hermana, amiga, mamá...), estos NPC representan roles que
   razonablemente existen una sola vez por localidad y pueden
   aparecer en cualquier historia nueva sin duplicar datos.
   Cada personaje solo necesita referenciar el id (ej. "lineapurpura")
   en su lista de contactos — el motor construye una copia de
   estado (confianza, etc.) independiente para cada partida.
   ============================================================ */

const NPCS = {
  lineapurpura: { id: "lineapurpura", name: "Línea Púrpura", avatar: "💜", trust: 100,
    low: "«Estamos aquí las 24 horas. Cuénteme con calma qué está pasando.»",
    mid: "«Reconocer estas señales ya es un paso importante. Hablemos de sus opciones.»",
    high: "«Seguimos acompañándola. Recuerde: usted decide el ritmo de este proceso.»" },

  comisaria: { id: "comisaria", name: "Comisaría de Familia", avatar: "⚖️", trust: 30,
    low: "«Puede radicar su solicitud, el trámite toma su tiempo pero es gratuito.»",
    mid: "«Le explicamos sus opciones de medida de protección, sin costo y sin necesidad de abogado.»",
    high: "«La reconocemos de su visita anterior. Continuemos construyendo su ruta de protección.»" },

  caivirtual: { id: "caivirtual", name: "CAI Virtual (Policía)", avatar: "🖥️", trust: 100,
    low: "«Puede radicar la denuncia en línea, cuéntenos qué evidencia tiene.»",
    mid: "«La difusión no consentida de imágenes íntimas es delito en Colombia (Ley 1273).»",
    high: "«Su denuncia ya está en trámite, la mantendremos informada.»" },

  casaigualdad: { id: "casaigualdad", name: "Casa de Igualdad", avatar: "🏠", trust: 100,
    low: "«Cuéntenos qué está viviendo, aquí atendemos a todas las mujeres de la localidad.»",
    mid: "«Podemos activar una ruta de protección y acompañamiento psicosocial.»",
    high: "«Seguimos acompañándola junto con su red comunitaria.»" },

  talentohumano: { id: "talentohumano", name: "Talento Humano", avatar: "🏢", trust: 20,
    low: "«Toda queja debe presentarse por escrito, seguirá el conducto regular.»",
    mid: "«Su reporte activa el Comité de Convivencia Laboral, es confidencial por ley.»",
    high: "«Gracias por confiar en el proceso. La acompañaremos hasta la resolución del caso.»" },

  eps: { id: "eps", name: "Orientadora de salud (EPS)", avatar: "🧑🏻‍⚕️", trust: 40,
    low: "«Podemos agendar una cita de planificación familiar.»",
    mid: "«El acceso a anticoncepción es un derecho, gratuito y confidencial.»",
    high: "«Trabajemos juntas un método que se ajuste a lo que usted decida.»" },

  policia: { id: "policia", name: "Policía de cuadrante", avatar: "👮🏽", trust: 25,
    low: "«Si no hay agresión física no podemos hacer mucho, señora.»",
    mid: "«Puede instaurar la denuncia, tome nota del cuadrante y el número de caso.»",
    high: "«Quedamos atentos a reforzar el rondín por su cuadra en las noches.»" },

  orientadora: { id: "orientadora", name: "Orientadora escolar", avatar: "🧑🏻‍🏫", trust: 35,
    low: "«Puedo agendarte una cita para la próxima semana.»",
    mid: "«Lo que describes son señales de control, y el colegio puede acompañarte.»",
    high: "«Sigamos trabajando esto juntas, con calma y de forma confidencial.»" },

  lideresa_julieth: { id: "lideresa_julieth", name: "Julieth, lideresa comunitaria", avatar: "🏳️‍⚧️", trust: 60,
    low: "«Esto pasa seguido, lastimosamente. Toca ir armando red entre nosotras.»",
    mid: "«Conozco la ruta de la Casa de Igualdad, te puedo acompañar a poner la queja.»",
    high: "«Ya activamos la red de cuidado del barrio contigo. No vas a estar sola en esto.»" },
};
