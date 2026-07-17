/* ============================================================
   CAPÍTULO II · Trabajo y autonomía
   Daniela
   ============================================================ */

const trabajoCharacters = [
  {
    id: "daniela", name: "Daniela Pérez", age: 28,
    tag: "Auxiliar administrativa", avatar: "👩🏻‍💼",
    color: "from-sky-500 to-cyan-400",
    skin: "#e8b894", hair: "#2a1f1c", hairStyle: "corto",
    violenceType: "Violencia laboral", chapter: "trabajo", localidad: "san_cristobal",
    blurb: "Su jefe empezó como un mentor amable. Ahora sus comentarios y propuestas la hacen sentir atrapada.",
    scenarioId: "laboral",
    contacts: ["amiga_d", "colega", "talentohumano", "lineapurpura"],
  },
];

const trabajoPersonalContacts = {
  amiga_d: { id: "amiga_d", name: "Camila, tu amiga de la universidad", avatar: "👩🏻", trust: 55,
    low: "«Qué incómodo... pero cuidado con armar problema, tú necesitas ese trabajo.»",
    mid: "«Eso no está bien. ¿Quieres que te acompañe a averiguar qué puedes hacer?»",
    high: "«No estás loca ni exagerada. Vamos a buscar juntas cómo protegerte y documentar todo.»" },
  colega: { id: "colega", name: "Esteban, tu colega de confianza", avatar: "🧑🏽", trust: 45,
    low: "«Prefiero no meterme, aquí las cosas de jefes son delicadas...»",
    mid: "«Yo también he notado cosas raras. Si necesitas un testigo, cuenta conmigo.»",
    high: "«Estoy dispuesto a acompañarte a Talento Humano y respaldar lo que viste conmigo.»" },
};

const trabajoScenarios = {
  laboral: {
    start: "l1",
    nodes: {
      l1: { type: "story", speaker: "Narradora", mood: "tranquila", text:
        "Daniela lleva ocho meses en su primer empleo formal. Ricardo, su jefe, la felicitó desde el inicio por su desempeño y empezó a darle responsabilidades importantes. Ella se sentía afortunada de tener un mentor así.",
        bg: "scene-office", next: "l2" },
      l2: { type: "story", speaker: "Narradora", mood: "preocupada", text:
        "Con el tiempo, los comentarios de Ricardo cambiaron: bromas sobre su ropa frente a otros compañeros, mensajes fuera de horario, invitaciones a 'reuniones' que siempre terminan siendo solo los dos, tarde, con la oficina vacía.",
        bg: "scene-office", next: "l2b" },
      l2b: { type: "story", speaker: "Narradora", mood: "preocupada", text:
        "Un día escuchas por casualidad a Ricardo comentarle a otro gerente: «Con ella hay que tener cuidado, es muy sensible». Te preguntas si ya perdiste credibilidad antes de haber dicho una sola palabra.",
        bg: "scene-office", next: "l3" },
      l3: { type: "story", speaker: "Ricardo", mood: "asustada", text:
        "«Sabes que confío mucho en ti, Daniela... esa promoción que quieres, yo puedo hacer que pase. Solo necesito saber que tú también confías en mí» — dice, acercándose más de lo necesario y tocándole el hombro.",
        bg: "scene-tension", next: "choice1" },

      choice1: { type: "choice", speaker: "Daniela — ¿Cómo reaccionas?", mood: "asustada", text:
        "Te quedas paralizada un segundo. Todo tu cuerpo se pone en alerta.",
        bg: "scene-tension",
        choices: [
          { tag: "Minimizar", text: "«Seguro fue un mal chiste, no quiso decir nada raro» piensas, y sigues trabajando como si nada.",
            effects: { bienestar: -10, red: -5 },
            feedback: "Minimizar es una reacción de protección muy común frente al miedo o la sorpresa — el cerebro busca una explicación que se sienta más segura. Pero lo que sentiste, esa incomodidad, es información válida que merece ser escuchada, no descartada.",
            next: "l3b" },
          { tag: "Confrontar impulsiva", text: "Le gritas frente a toda la oficina: «¡Nunca me vuelva a tocar!»",
            effects: { bienestar: -5, red: 0 },
            feedback: "Tu reacción es comprensible y tu enojo es legítimo — nadie tiene derecho a tocarte sin tu consentimiento. Confrontar en caliente frente a testigos también puede exponerte a represalias; documentar y buscar el canal formal suele proteger mejor tu proceso.",
            next: "l3b" },
          { tag: "Salir con calma", text: "«Necesito revisar algo, hablamos luego» dices con voz firme, y sales de la oficina a buscar aire.",
            effects: { bienestar: 5, red: 10 },
            feedback: "Salir de una situación incómoda con una frase firme y neutral, sin justificarte, es una forma de comunicación asertiva que te da tiempo y espacio para pensar tu siguiente paso con calma.",
            next: "l3b" },
        ] },

      l3b: { type: "story", speaker: "Narradora", mood: "triste", text:
        "Al día siguiente, Ricardo actúa como si nada hubiera pasado — hasta te felicita frente a todos por un informe. Esa 'normalidad' forzada te desconcierta tanto como el incidente mismo.",
        bg: "scene-office", next: "l4" },
      l4: { type: "story", speaker: "Narradora", mood: "triste", text:
        "Esa noche escribes en tu celular todo lo que recuerdas: fechas, mensajes, lo que dijo. Sabes que necesitas hablarlo con alguien, aunque te da miedo que no te crean o que esto te cueste el trabajo.",
        bg: "scene-night", next: "network1" },

      network1: { type: "network", speaker: "¿En quién confías?", mood: "preocupada", text:
        "Puedes buscar consejo con más de una persona antes de decidir tu siguiente paso.",
        bg: "scene-night", options: ["amiga_d", "colega", "lineapurpura"], next: "randomWorld" },

      randomWorld: { type: "random", speaker: "Esos días", mood: "preocupada", bg: "scene-day", includeWorldEvents: true, variants: [], next: "choice2" },

      choice2: { type: "choice", speaker: "Daniela — Tu siguiente paso", mood: "preocupada", text:
        "Con la cabeza más clara, decides actuar. ¿Qué haces?",
        bg: "scene-office",
        choices: [
          { tag: "Testigo", text: "Le pides a Esteban que sea tu acompañante y testigo si decides poner una queja formal.",
            effects: { red: 15, conocimiento: 5, contact: { id: "colega", delta: 15 } },
            feedback: "Buscar acompañamiento —un testigo, alguien que sostenga contigo el proceso— fortalece tu caso y reduce la sensación de enfrentar todo en soledad.",
            next: "l4b" },
          { tag: "Denuncia formal", text: "Vas directo a Talento Humano y activas el Comité de Convivencia Laboral (Ley 1010 de 2006).",
            effects: { red: 15, bienestar: 10, conocimiento: 15, contact: { id: "talentohumano", delta: 20 } },
            unlock: "talentohumano",
            feedback: "En Colombia, el acoso laboral —incluido el de tipo sexual— está regulado por ley, y toda empresa está obligada a tener un canal confidencial para recibirlo. Usar ese canal es un derecho, no una exageración.",
            next: "l4b" },
          { tag: "Asesoría previa", text: "Antes de actuar en la empresa, llamas a la Línea Púrpura para recibir orientación jurídica gratuita.",
            effects: { conocimiento: 15, bienestar: 5, contact: { id: "lineapurpura", delta: 10 } },
            unlock: "lineapurpura",
            feedback: "Informarte antes de actuar no es demora — te permite tomar decisiones desde el conocimiento y no desde el miedo, y llegar más segura a cualquier proceso formal.",
            next: "l4b" },
        ] },

      l4b: { type: "story", speaker: "Narradora", mood: "empoderada", text:
        "Camila te escribe esa noche: «No estás loca. Yo también lo vi.» Por primera vez en semanas, sientes que alguien más carga parte del peso contigo.",
        bg: "scene-night", next: "l5" },
      l5: { type: "story", speaker: "Narradora", mood: "empoderada", text:
        "El proceso no es inmediato ni sencillo, pero ya no lo enfrentas sola: tienes testigos, información, y una ruta clara. Eso, en sí mismo, ya cambió la historia.",
        bg: "scene-office", next: "end" },

      end: { type: "end" },
    },
  },
};
