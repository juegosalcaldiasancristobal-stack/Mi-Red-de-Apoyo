/* ============================================================
   CAPÍTULO III · Espacio público
   Rosario
   ============================================================ */

const publicoCharacters = [
  {
    id: "rosario", name: "Rosario Nieto", age: 45,
    tag: "Tendera y lideresa comunitaria", avatar: "🏳️‍⚧️",
    color: "from-emerald-500 to-teal-400",
    skin: "#8a5a3a", hair: "#1f1512", hairStyle: "pañoleta",
    violenceType: "Violencia callejera", chapter: "publico", localidad: "san_cristobal",
    blurb: "Lleva diez años con su tienda de barrio. Un grupo de vecinos nuevos la hostiga al cerrar cada noche.",
    scenarioId: "callejera",
    contacts: ["vecina_r", "lideresa_julieth", "policia", "casaigualdad"],
  },
];

const publicoPersonalContacts = {
  vecina_r: { id: "vecina_r", name: "Doña Marlene, vecina del local", avatar: "👵🏻", trust: 50,
    low: "«Mejor no se meta con esos manes, mija, hágase la que no oye.»",
    mid: "«A mí también me da rabia lo que le hacen. Cuente conmigo para lo que necesite.»",
    high: "«Ya hablé con otras vecinas, todas la acompañamos a cerrar el local, faltaba más.»" },
};

const publicoScenarios = {
  callejera: {
    start: "r1",
    nodes: {
      r1: { type: "story", speaker: "Narradora", mood: "tranquila", text:
        "Rosario lleva diez años con su tienda de barrio en San Cristóbal. La conocen y la respetan como lideresa comunitaria. En los últimos meses, un grupo de vecinos nuevos ha empezado a hacer comentarios transfóbicos cuando pasa.",
        bg: "scene-street-day", next: "r1b",
        crossRefs: [{ if: "sara", text: "Entre las vecinas nuevas del sector hay una estudiante de colegio de la que Rosario ha oído hablar bien: dicen que empezó a poner límites claros en una relación que no la estaba tratando bien, y que no lo tuvo fácil." }] },
      r1b: { type: "story", speaker: "Narradora", mood: "feliz", text:
        "Semanas atrás, cuando alguien rayó una palabra ofensiva en la pared de su local, fue Julieth quien organizó a los vecinos para repintarla esa misma tarde. Rosario no ha olvidado ese gesto.",
        bg: "scene-street-day", next: "r2" },
      r2: { type: "story", speaker: "Narradora", mood: "asustada", text:
        "Esa noche, al bajar la reja del local, el grupo la sigue media cuadra, gritándole insultos y grabándola con el celular entre risas. Rosario siente el corazón en la garganta y aprieta el manojo de llaves en su mano.",
        bg: "scene-street-night", next: "choice1" },

      choice1: { type: "choice", speaker: "Rosario — ¿Qué haces?", mood: "asustada", text:
        "Los pasos del grupo se acercan.",
        bg: "scene-street-night",
        choices: [
          { tag: "Silencio", text: "Te quedas callada, bajas la mirada y caminas más rápido, con miedo de que sea peor.",
            effects: { bienestar: -10, red: -5 },
            feedback: "Buscar no escalar una situación de riesgo inmediato es una decisión válida de autoprotección, no sumisión. El problema nunca es cómo reaccionaste tú, sino la violencia de quienes te agreden.",
            next: "r2b" },
          { tag: "Confrontar sola", text: "Te das la vuelta y les gritas que la dejen en paz, sola frente al grupo.",
            effects: { bienestar: -5, red: 0 },
            feedback: "Tu derecho a defenderte es legítimo. Al mismo tiempo, hacerlo sola frente a un grupo puede aumentar el riesgo físico inmediato; buscar apoyo o distancia primero no te resta valentía.",
            next: "r2b" },
          { tag: "Alejarse y pedir ayuda", text: "Te alejas con calma hacia la tienda de Doña Marlene, que sigue abierta, y le pides que te acompañe.",
            effects: { bienestar: 5, red: 10, contact: { id: "vecina_r", delta: 10 } },
            feedback: "Buscar un espacio seguro cercano y compañía inmediata es una estrategia efectiva de protección física en el momento — y activa red comunitaria en tiempo real.",
            next: "r2b" },
        ] },

      r2b: { type: "story", speaker: "Narradora", mood: "triste", text:
        "Doña Marlene cierra su reja detrás de Rosario y le dice, bajito: «A mí también me ha tocado duro por otras razones. Aquí la que se calla, sufre doble.»",
        bg: "scene-street-night", next: "r3" },
      r3: { type: "story", speaker: "Narradora", mood: "triste", text:
        "Llegas a casa con el pulso todavía acelerado. No es la primera vez, y temes que tampoco sea la última si nada cambia.",
        bg: "scene-night", next: "network1" },

      network1: { type: "network", speaker: "¿Con quién cuentas?", mood: "preocupada", text:
        "Puedes consultar a más de una persona antes de decidir tu siguiente paso.",
        bg: "scene-night", options: ["vecina_r", "lideresa_julieth", "policia"], next: "randomWorld" },

      randomWorld: { type: "random", speaker: "Esos días", mood: "preocupada", bg: "scene-day", includeWorldEvents: true, variants: [], next: "choice2" },

      choice2: { type: "choice", speaker: "Rosario — Tu siguiente paso", mood: "preocupada", text:
        "Decides que esto no puede seguir pasando en silencio. ¿Qué haces?",
        bg: "scene-street-day",
        choices: [
          { tag: "Casa de Igualdad", text: "Vas con Julieth a la Casa de Igualdad a activar una ruta de protección y acompañamiento.",
            effects: { red: 15, bienestar: 10, conocimiento: 15, contact: { id: "casaigualdad", delta: 20 } },
            unlock: "casaigualdad",
            feedback: "Las Casas de Igualdad de Oportunidades atienden a todas las mujeres de Bogotá, incluidas las mujeres trans, con enfoque diferencial. Ir acompañada fortalece el proceso.",
            next: "r3b" },
          { tag: "Denuncia policial", text: "Instauras la denuncia con acompañamiento de Julieth, aunque sabes que no siempre es fácil confiar en la respuesta institucional.",
            effects: { red: 10, conocimiento: 10, contact: { id: "policia", delta: 15 } },
            feedback: "Denunciar con acompañamiento aumenta las probabilidades de que tu caso sea tomado en serio, y deja un registro formal aunque la respuesta institucional no siempre sea inmediata.",
            next: "r3b" },
          { tag: "Red comunitaria", text: "Organizas con vecinas un acuerdo de acompañarse mutuamente al cerrar los negocios en la noche.",
            effects: { red: 20, bienestar: 10, contact: { id: "vecina_r", delta: 15 } },
            community: true,
            feedback: "Las redes comunitarias de cuidado colectivo son una de las formas de protección más sostenibles en el tiempo, especialmente frente a violencias que las instituciones tardan en atender.",
            next: "r3b" },
        ] },

      r3b: { type: "story", speaker: "Narradora", mood: "empoderada", text:
        "La voz se corre en el barrio — no como chisme, sino como alerta comunitaria: «a Rosario la están molestando, hay que estar pendientes». Por primera vez, siente que el barrio la protege activamente, no solo la tolera.",
        bg: "scene-street-day", next: "r4" },
      r4: { type: "story", speaker: "Narradora", mood: "empoderada", text:
        "Rosario sigue abriendo su tienda cada mañana. Lo que cambió es que ahora no camina sola a cerrarla — y eso, en un barrio que la vio crecer como lideresa, es apenas el comienzo de algo más grande.",
        bg: "scene-street-day", next: "end" },

      end: { type: "end" },
    },
  },
};
