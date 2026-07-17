/* ============================================================
   WORLD_EVENTS — eventos dinámicos de la ciudad
   --------------------------------------------------------------
   Pool compartido que cualquier nodo tipo "random" puede mezclar
   (flag includeWorldEvents) para que Bogotá se sienta viva y
   ninguna partida sea idéntica a otra, sin escribir un evento
   distinto por cada personaje.
   ============================================================ */

const WORLD_EVENTS = [
  { id: "lluvia", text: "Esa tarde cae un aguacero fuerte sobre Bogotá. El trancón hace que todo tome más tiempo del esperado.",
    effects: {} },
  { id: "transmi_falla", text: "Hay una falla en TransMilenio en hora pico; te toca esperar casi 40 minutos más de lo previsto para llegar.",
    effects: { bienestar: -3 } },
  { id: "jornada_comunitaria", text: "Te enteras de que esta semana hay una jornada comunitaria gratuita en tu localidad, con orientación jurídica y psicosocial.",
    effects: { conocimiento: 5 } },
  { id: "apagon", text: "Un corte de energía deja sin señal tu celular un par de horas — justo cuando más querías escribirle a alguien.",
    effects: { bienestar: -3 } },
  { id: "paro", text: "Hay una manifestación en la Avenida Caracas y varias rutas cambian su recorrido. La ciudad, hoy, se mueve distinto.",
    effects: {} },
  { id: "festival_barrio", text: "El barrio organiza una verbena comunitaria el fin de semana. Por un rato, el ambiente se siente más liviano.",
    effects: { bienestar: 5 } },
  { id: "campana_distrital", text: "Ves en un poste un aviso de una campaña distrital sobre rutas de atención a mujeres. Te tomas un segundo para leerlo completo.",
    effects: { conocimiento: 3 } },
];
