/* ============================================================
   CAPÍTULO IV · Violencia digital
   Yuli
   ============================================================ */

const digitalCharacters = [
  {
    id: "yuli", name: "Yuli Cárdenas", age: 19,
    tag: "Estudiante universitaria", avatar: "👧🏽",
    color: "from-violet-500 to-fuchsia-400",
    skin: "#d9a06b", hair: "#3a2417", hairStyle: "largo",
    violenceType: "Violencia digital", chapter: "digital", localidad: "san_cristobal",
    blurb: "Terminó su relación con Andrés hace semanas. Él no ha dejado de escribirle — y ahora amenaza con algo peor.",
    scenarioId: "digital",
    contacts: ["mama", "amiga_y", "psicologa", "caivirtual"],
  },
];

const digitalPersonalContacts = {
  mama: { id: "mama", name: "Rocío, tu mamá", avatar: "👩🏽", trust: 50,
    low: "«¿Pero tú por qué le mandaste esas fotos? Ay Yuli, hay que tener más cuidado...»",
    mid: "«Me asusta lo que cuentas, pero la culpa es de él, no tuya. Busquemos ayuda juntas.»",
    high: "«Estoy contigo en esto, sin reproches. Vamos a denunciar y a protegerte.»" },
  amiga_y: { id: "amiga_y", name: "Sofía, tu mejor amiga", avatar: "👧🏻", trust: 65,
    low: "«Uy qué miedo, bloquéalo y ya, no le pares bolas.»",
    mid: "«Eso es un delito, no es solo 'dramas de pareja'. Guarda las capturas.»",
    high: "«Te acompaño a poner la denuncia y a contarle a tu mamá si quieres, no estás sola.»" },
  psicologa: { id: "psicologa", name: "Psicóloga del colegio", avatar: "🧑🏻‍⚕️", trust: 30,
    low: "«Podemos agendar una cita la próxima semana si gustas.»",
    mid: "«Lo que sientes —miedo, vergüenza— es una reacción normal ante una amenaza real.»",
    high: "«Sigamos trabajando juntas tu bienestar mientras avanza el proceso legal.»" },
};

const digitalScenarios = {
  digital: {
    start: "y1",
    nodes: {
      y1: { type: "story", speaker: "Narradora", mood: "tranquila", text:
        "Yuli terminó su relación con Andrés hace tres semanas. Al principio los mensajes eran de tristeza. En los últimos días, empezaron a cambiar de tono.",
        bg: "scene-room", next: "chat1" },

      chat1: { type: "chat", speaker: "Chat con Andrés", mood: "preocupada", bg: "scene-room",
        messages: [
          { from: "them", text: "¿Por qué no me respondes?" },
          { from: "them", text: "Mándame tu ubicación." },
          { from: "me", text: "Prefiero no hacerlo, ya no estamos juntos." },
          { from: "them", text: "Si sales con tus amigas, me avisas." },
          { from: "them", text: "Sé que me estás ignorando, no me hagas esto." },
        ],
        next: "minigame1" },

      minigame1: { type: "minigame", subtype: "tapflags", mood: "preocupada",
        speaker: "¿Cuáles de estos mensajes son señales de control?",
        instructions: "Toca los mensajes que consideres señales de control en una relación. Puede haber más de uno — luego revisa tu selección.",
        items: [
          { id: "m1", text: "«¿Por qué no me respondes?»", isFlag: false,
            explain: "La insistencia sola no siempre es control, aunque sí puede incomodar. Lo relevante es el patrón completo, no un mensaje aislado." },
          { id: "m2", text: "«Mándame tu ubicación.»", isFlag: true,
            explain: "Pedir tu ubicación de forma insistente, más aún después de terminar la relación, es una forma de vigilancia y control." },
          { id: "m3", text: "«Si sales con tus amigas, me avisas.»", isFlag: true,
            explain: "Exigir 'aviso' o permiso sobre tus salidas es una señal clásica de control sobre tu libertad y tus relaciones." },
          { id: "m4", text: "«Sé que me estás ignorando, no me hagas esto.»", isFlag: true,
            explain: "Culpar a la otra persona por poner distancia, apelando a la culpa, es una forma de manipulación emocional." },
        ],
        next: "y2" },

      y2: { type: "story", speaker: "Andrés (mensaje)", mood: "asustada", text:
        "«Si no vuelves conmigo, todos van a ver las fotos que me mandaste. Tú sabes que las tengo. No me obligues a hacerlo.»",
        bg: "scene-room", next: "y3" },
      y3: { type: "story", speaker: "Narradora", mood: "asustada", text:
        "Yuli siente que el piso se abre bajo sus pies. Vergüenza, miedo, rabia, todo junto. Su primer impulso es borrar el mensaje y hacer como si no hubiera pasado.",
        bg: "scene-tension", next: "choice1" },

      choice1: { type: "choice", speaker: "Yuli — ¿Qué haces?", mood: "asustada", text:
        "El teléfono sigue vibrando con más mensajes.",
        bg: "scene-tension",
        choices: [
          { tag: "Ocultar", text: "Borras el mensaje y decides no contarle a nadie, por miedo y vergüenza.",
            effects: { bienestar: -10, red: -5 },
            feedback: "El silencio suele ser justo lo que este tipo de amenaza busca provocar. La vergüenza es una reacción común, pero la responsabilidad de esta amenaza es completamente de quien la hace, nunca tuya.",
            next: "y3b" },
          { tag: "Responder con rabia", text: "Le respondes furiosa, amenazándolo de vuelta.",
            effects: { bienestar: -5, red: 0 },
            feedback: "Tu rabia es una respuesta válida ante una amenaza real. Sin embargo, responder de forma directa puede escalar el conflicto; guardar evidencia sin engancharte en la discusión suele proteger mejor un proceso de denuncia.",
            next: "y3b" },
          { tag: "Evidencia + apoyo", text: "Sin responder, tomas capturas de pantalla de todo y le escribes a tu amiga Sofía.",
            effects: { bienestar: 5, red: 10, conocimiento: 5, contact: { id: "amiga_y", delta: 10 } },
            feedback: "Guardar evidencia sin responder a la provocación, y avisarle a alguien de confianza, son dos de las acciones más efectivas frente a este tipo de amenaza digital.",
            next: "y3b" },
        ] },

      y3b: { type: "story", speaker: "Narradora", mood: "triste", text:
        "Sofía te cuenta que a ella casi le pasó algo parecido el año pasado, con otro chico. «No me atreví a contarlo entonces. Ahora sé que debí hacerlo.»",
        bg: "scene-night", next: "y4" },
      y4: { type: "story", speaker: "Narradora", mood: "preocupada", text:
        "Necesitas decidir tu siguiente paso, pero no tienes por qué hacerlo sola.",
        bg: "scene-night", next: "network1" },

      network1: { type: "network", speaker: "¿A quién recurres?", mood: "preocupada", text:
        "Puedes hablar con más de una persona antes de decidir.",
        bg: "scene-night", options: ["mama", "amiga_y", "psicologa"], next: "randomWorld" },

      randomWorld: { type: "random", speaker: "Esos días", mood: "preocupada", bg: "scene-day", includeWorldEvents: true, variants: [], next: "choice2" },

      choice2: { type: "choice", speaker: "Yuli — Tu siguiente paso", mood: "preocupada", text:
        "Con apoyo, decides actuar. ¿Qué haces primero?",
        bg: "scene-room",
        choices: [
          { tag: "Denuncia digital", text: "Bloqueas a Andrés, reportas el perfil, y denuncias en el CAI Virtual de la Policía.",
            effects: { red: 15, conocimiento: 15, contact: { id: "caivirtual", delta: 20 } },
            unlock: "caivirtual",
            feedback: "En Colombia, amenazar con difundir imágenes íntimas sin consentimiento es delito (Ley 1273 de 2009 y Ley 1257 de violencia de género). Denunciar activa una investigación y dejar de responder reduce el poder de la amenaza.",
            next: "y4b" },
          { tag: "Contarle a mamá", text: "Reúnes valor y le cuentas todo a tu mamá, pidiéndole que te acompañe.",
            effects: { red: 15, bienestar: 15, contact: { id: "mama", delta: 20 } },
            feedback: "Contarle a un adulto de confianza no te quita autonomía: te da respaldo emocional y práctico para enfrentar el proceso, especialmente cuando hay un componente legal de por medio.",
            next: "y4b" },
          { tag: "Apoyo emocional primero", text: "Pides una cita con la psicóloga del colegio para sostener cómo te sientes mientras avanzas con la denuncia.",
            effects: { bienestar: 15, conocimiento: 5, contact: { id: "psicologa", delta: 15 } },
            feedback: "Cuidar tu bienestar emocional en paralelo al proceso legal no es un lujo — es parte de sostenerte para poder llevar el proceso hasta el final.",
            next: "y4b" },
        ] },

      y4b: { type: "story", speaker: "Narradora", mood: "empoderada", text:
        "Un par de días después, Andrés borra sus redes sociales. El miedo no desaparece del todo, pero algo en el aire cambia: ya no eres tú quien tiene que desaparecer.",
        bg: "scene-room", next: "y5" },
      y5: { type: "story", speaker: "Narradora", mood: "empoderada", text:
        "La amenaza no desaparece de un día para otro, pero ahora hay evidencia, hay una denuncia en curso, y hay personas que lo saben y te acompañan. Ya no es un secreto que cargas sola.",
        bg: "scene-room", next: "end" },

      end: { type: "end" },
    },
  },
};
