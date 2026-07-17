/* ============================================================
   CAPÍTULO I · Relaciones de pareja
   Marcela · Sara · Diana · Camila · Marcela Higuera
   ============================================================ */

const parejasCharacters = [
  {
    id: "marcela", name: "Marcela Rodríguez", age: 52,
    tag: "Vendedora informal · San Cristóbal", avatar: "👩🏽",
    color: "from-rose-500 to-orange-400",
    skin: "#c98a5e", hair: "#4a3b35", hairStyle: "largo",
    violenceType: "Violencia doméstica", chapter: "parejas", localidad: "san_cristobal",
    blurb: "Lleva 15 años con su pareja. Últimamente sus salidas al mercado terminan en interrogatorios y gritos.",
    scenarioId: "domestica",
    contacts: ["hermana", "vecina_m", "comisaria", "lineapurpura"],
  },
  {
    id: "sara", name: "Sara Muñoz", age: 18,
    tag: "Estudiante de último año de colegio", avatar: "👧🏻",
    color: "from-pink-500 to-rose-400",
    skin: "#e8b894", hair: "#5c3a21", hairStyle: "largo",
    violenceType: "Violencia psicológica", chapter: "parejas", localidad: "san_cristobal",
    blurb: "Su novio revisa su celular todo el tiempo, decide con quién puede hablar y critica cómo se viste.",
    scenarioId: "psicologica",
    contacts: ["amiga_s", "mama_s", "orientadora", "lineapurpura"],
  },
  {
    id: "diana", name: "Diana Salazar", age: 34,
    tag: "Madre, en pausa de su carrera profesional", avatar: "👩🏽",
    color: "from-amber-500 to-yellow-400",
    skin: "#c98a5e", hair: "#2e2118", hairStyle: "corto",
    violenceType: "Violencia económica", chapter: "parejas", localidad: "rafael_uribe",
    blurb: "Su pareja administra todo el dinero de la casa y le impide retomar su trabajo.",
    scenarioId: "economica",
    contacts: ["hermana_d", "excolega", "comisaria", "lineapurpura"],
  },
  {
    id: "camila", name: "Camila Torres", age: 24,
    tag: "Estudiante de posgrado", avatar: "👩🏻",
    color: "from-fuchsia-500 to-pink-400",
    skin: "#e8b894", hair: "#1f1512", hairStyle: "largo",
    violenceType: "Violencia reproductiva", chapter: "parejas", localidad: "antonio_narino",
    blurb: "Su pareja intenta imponer decisiones sobre su cuerpo: cuándo tener hijos y qué método anticonceptivo usar.",
    scenarioId: "reproductiva",
    contacts: ["amiga_c", "mama_c", "eps", "lineapurpura"],
  },
  {
    id: "marcela_b", name: "Marcela Higuera", age: 40,
    tag: "Administradora de un local comercial", avatar: "👩🏽‍🦱",
    color: "from-red-500 to-rose-600",
    skin: "#b97a52", hair: "#241a14", hairStyle: "largo",
    violenceType: "Ciclo de violencia", chapter: "parejas", localidad: "san_cristobal",
    blurb: "Doce años con Édgar: después de cada explosión llegan las flores y las promesas — hasta la próxima vez.",
    scenarioId: "ciclo",
    contacts: ["hija_m", "amiga_m", "comisaria", "lineapurpura"],
  },
];

/* Contactos personales — únicos de cada protagonista.
   Los contactos institucionales (comisaria, lineapurpura, eps,
   orientadora) viven en world/npcs.js y se comparten entre historias. */
const parejasPersonalContacts = {
  hermana: { id: "hermana", name: "Aura, tu hermana", avatar: "👩🏽", trust: 60,
    low: "«Ay hermanita, no sé... a veces exageras. ¿Segura que no es solo una pelea normal?»",
    mid: "«Me preocupas. Cuéntame bien qué pasó, quiero ayudarte a pensar qué hacer.»",
    high: "«Aquí estoy, contigo, sin juzgarte. Vamos juntas a averiguar qué opciones tienes.»" },
  vecina_m: { id: "vecina_m", name: "Doña Cecilia, tu vecina", avatar: "👵🏽", trust: 40,
    low: "«Uy m'ija, eso es entre marido y mujer, mejor no meterse...»",
    mid: "«He escuchado cosas por la pared. Si necesita algo, tocan mi puerta.»",
    high: "«Cuente conmigo, yo la acompaño a donde necesite, para eso somos vecinas.»" },

  amiga_s: { id: "amiga_s", name: "Camila, tu amiga del colegio", avatar: "👧🏻", trust: 60,
    low: "«Uy pero todas las parejas son celosas al principio, ¿no?»",
    mid: "«Eso que describes no me suena a amor, me suena a control.»",
    high: "«Estoy contigo, y si quieres hablamos ya mismo con la orientadora juntas.»" },
  mama_s: { id: "mama_s", name: "Tu mamá", avatar: "👩🏽", trust: 45,
    low: "«Ay mija, a esa edad uno se enreda en dramas, ya se les pasa.»",
    mid: "«Cuéntame bien qué pasa, quiero entender antes de opinar.»",
    high: "«Gracias por confiar en mí. Vamos a averiguar juntas qué hacer.»" },

  hermana_d: { id: "hermana_d", name: "Patricia, tu hermana", avatar: "👩🏽", trust: 55,
    low: "«Ay Diana, esas son cosas de pareja, cada casa es un mundo.»",
    mid: "«Eso que me cuentas es grave, no es normal que te controle así la plata.»",
    high: "«Cuenta conmigo para lo que necesites, incluso si necesitas quedarte unos días acá.»" },
  excolega: { id: "excolega", name: "Marta, tu excompañera de trabajo", avatar: "👩🏻‍💼", trust: 40,
    low: "«Uy qué complicado, yo ya ando muy ocupada para meterme.»",
    mid: "«Cuando quieras retomar algo laboral, cuenta conmigo para orientarte.»",
    high: "«Ya pregunté y hay un curso con apoyo económico, te paso los datos.»" },

  amiga_c: { id: "amiga_c", name: "Juliana, tu amiga de la universidad", avatar: "👩🏻", trust: 60,
    low: "«Qué complicado, pero eso es entre ustedes dos, ¿no?»",
    mid: "«Tu cuerpo es tuyo, ninguna decisión sobre eso se toma sin que tú quieras.»",
    high: "«Te acompaño a la EPS cuando quieras, y hablamos de esto las veces que necesites.»" },
  mama_c: { id: "mama_c", name: "Tu mamá", avatar: "👩🏽", trust: 50,
    low: "«Bueno, ya está grande, eso lo arreglan entre los dos.»",
    mid: "«Nadie tiene derecho a decidir por ti sobre tener hijos o no.»",
    high: "«Estoy contigo en esto, tu cuerpo y tus decisiones se respetan, punto.»" },

  hija_m: { id: "hija_m", name: "Valentina, tu hija (16 años)", avatar: "👧🏽", trust: 50,
    low: "«Mamá, ¿por qué a veces te encierras en el cuarto? Me da miedo.»",
    mid: "«Yo ya me di cuenta de cómo es papá cuando se enoja. No es normal.»",
    high: "«Te apoyo en lo que decidas, mamá. No estás sola en esto.»" },
  amiga_m: { id: "amiga_m", name: "Rocío, tu amiga de siempre", avatar: "👩🏽", trust: 55,
    low: "«Pero él después se porta tan lindo contigo, seguro se le pasa.»",
    mid: "«Las flores después de la pelea no borran lo que pasó antes.»",
    high: "«Ya identificamos el patrón juntas. Vamos a armar un plan con calma.»" },
};

const parejasScenarios = {
  /* =================== MARCELA — DOMÉSTICA =================== */
  domestica: {
    start: "d1",
    nodes: {
      d1: { type: "story", speaker: "Narradora", mood: "tranquila", text:
        "Marcela madruga todos los días a montar su puesto de frutas en la plaza. Con Jairo lleva quince años — al principio la hacía sentir cuidada. Ahora él revisa cuánto vendió, le pregunta con quién habló, y se molesta si ella llega tarde a casa.",
        bg: "scene-home", next: "d2" },
      d2: { type: "story", speaker: "Marcela", mood: "preocupada", text:
        "«Hoy es el cumpleaños de mi comadre Flor. Quiero ir un rato, aunque sea una hora.» Jairo resopla desde el sofá: «Haz lo que quieras, pero no te vengas a quejar si luego la gente habla mal de ti por andar de fiestera.»",
        bg: "scene-home", next: "d3a" },

      d3a: { type: "story", speaker: "Narradora", mood: "feliz", text:
        "En casa de Flor, entre café y risas, Marcela se olvida por un rato de las cuentas y los reclamos. «Deberías salir más seguido», le dice Flor. Marcela sonríe: hace tiempo no se sentía tan liviana.",
        bg: "scene-home", next: "d3" },
      d3: { type: "story", speaker: "Narradora", mood: "preocupada", text:
        "Marcela llega a casa más tarde de lo previsto. Jairo la espera de pie, con el teléfono de ella ya en la mano.",
        bg: "scene-tension", next: "d4" },
      d4: { type: "story", speaker: "Jairo", mood: "asustada", text:
        "«¿Con quién estabas? ¡Contesta! Yo sé que tú me estás viendo la cara. Dame acá esa plata de hoy, a ver en qué te la gastaste.» Su voz sube de tono. Marcela siente el corazón acelerado; conoce esta sensación.",
        bg: "scene-tension", next: "choice1" },

      choice1: { type: "choice", speaker: "Marcela — ¿Qué haces?", mood: "asustada", text:
        "El pulso se te acelera. Tienes segundos para reaccionar.",
        bg: "scene-tension",
        choices: [
          { tag: "Justificar", text: "«Tienes razón, no debí demorarme tanto, perdóname.»",
            effects: { bienestar: -10, red: -5 },
            feedback: "Es muy común dudar de lo que sentimos cuando alguien nos ha hecho creer que la culpa es nuestra por cosas normales, como llegar tarde. Ninguna demora justifica el miedo que sentiste — eso es información importante, no una falla tuya.",
            next: "d4b" },
          { tag: "Confrontar", text: "«¡No me grites! ¡Yo no tengo que darte explicaciones de nada!»",
            effects: { bienestar: -5, red: 0 },
            feedback: "Defender tu espacio es válido y comprensible. Al mismo tiempo, cuando el otro ya está muy alterado, subir el tono puede escalar la tensión. No se trata de que 'te lo buscaste' — se trata de pensar también en tu seguridad inmediata, además de en tener razón.",
            next: "d4b" },
          { tag: "Buscar apoyo", text: "Te quedas en silencio, respiras y en cuanto puedes llamas a tu hermana Aura.",
            effects: { bienestar: 5, red: 10, contact: { id: "hermana", delta: 10 } },
            feedback: "Buscar a alguien de confianza en un momento así no es debilidad — es una estrategia de protección. Reconocer que necesitas hablar con alguien es un paso valioso.",
            next: "d4b" },
        ] },

      d4b: { type: "story", speaker: "Narradora", mood: "triste", text:
        "Más tarde, mientras Marcela se baña, Jairo revisa su teléfono sin preguntar — otra vez. No rompe nada, no grita: simplemente decide que tiene derecho a hacerlo. Marcela lo nota al salir, y algo dentro de ella también lo nota: esto no es solo 'un mal día'.",
        bg: "scene-tension", next: "d5" },
      d5: { type: "story", speaker: "Narradora", mood: "triste", text:
        "Esa noche casi no duermes. Repites la escena una y otra vez. Te preguntas si esto es 'normal', si toda pareja pasa por esto, o si algo tiene que cambiar.",
        bg: "scene-night", next: "network1" },

      network1: { type: "network", speaker: "¿A quién le cuentas?", mood: "preocupada", text:
        "Antes de decidir qué hacer, puedes buscar consejo. Habla con quien prefieras — puedes consultar a más de una persona.",
        bg: "scene-night", options: ["hermana", "vecina_m", "lineapurpura"], next: "randomWorld" },

      randomWorld: { type: "random", speaker: "Esos días", mood: "preocupada", bg: "scene-day", includeWorldEvents: true, variants: [], next: "choice2" },

      choice2: { type: "choice", speaker: "Marcela — Un paso concreto", mood: "preocupada", text:
        "Después de pensarlo unos días, decides que es momento de hacer algo. ¿Qué haces primero?",
        bg: "scene-day",
        choices: [
          { tag: "Documentar", text: "Empiezas a guardar mensajes y notas de fechas, discretamente, por si los necesitas.",
            effects: { conocimiento: 15, red: 5 },
            feedback: "Documentar sin exponerte es una herramienta real de protección: sirve como respaldo si más adelante decides pedir una medida de protección o asesoría legal, y no te obliga a actuar de inmediato.",
            next: "d5b" },
          { tag: "Institución", text: "Vas a la Comisaría de Familia a preguntar, solo preguntar, qué opciones tienes.",
            effects: { red: 15, bienestar: 10, conocimiento: 10, contact: { id: "comisaria", delta: 20 } },
            unlock: "comisaria",
            feedback: "Ir a preguntar no te compromete a denunciar de inmediato. Conocer tus opciones con calma es parte de construir un plan seguro y a tu propio ritmo.",
            next: "d5b" },
          { tag: "Límite directo", text: "Hablas con Jairo en un momento tranquilo: «No voy a permitir que me grites ni que revises mi celular.»",
            effects: { bienestar: 5, red: -5 },
            feedback: "Poner límites con calma (usando frases en primera persona, sin acusar) es una habilidad valiosa de comunicación asertiva. Es más seguro practicarla cuando ya tienes una red de apoyo lista, por si la reacción no es la esperada.",
            next: "d5b" },
        ] },

      d5b: { type: "story", speaker: "Narradora", mood: "preocupada", text:
        "Los días siguientes no son fáciles: hay dudas, hay miedo de estar exagerando, hay momentos en que todo parece normal otra vez. Pero también hay algo nuevo: ya no cargas esto completamente sola.",
        bg: "scene-day", next: "d6" },
      d6: { type: "story", speaker: "Narradora", mood: "empoderada", text:
        "No existe una fórmula única ni una decisión que resuelva todo de un día para otro. Lo que sí cambia algo, poco a poco, es dejar de estar sola con esto: cada llamada, cada pregunta, cada persona que ahora sabe lo que vives, es un hilo más en tu red.",
        bg: "scene-day", next: "end" },

      end: { type: "end" },
    },
  },

  /* =================== SARA — VIOLENCIA PSICOLÓGICA =================== */
  psicologica: {
    start: "p1",
    nodes: {
      p1: { type: "story", speaker: "Narradora", mood: "feliz", text:
        "Sara y Mateo llevan ocho meses juntos. En el colegio todos dicen que hacen linda pareja. Al principio, que él quisiera saber de ella todo el tiempo se sentía como amor.",
        bg: "scene-room", next: "p2" },
      p2: { type: "story", speaker: "Narradora", mood: "preocupada", text:
        "Ahora Mateo revisa su celular «para ver que no le escondas nada», y le dice qué ropa «es mejor que no te pongas, para que no te miren tanto».",
        bg: "scene-room", next: "p2b" },
      p2b: { type: "story", speaker: "Mateo", mood: "preocupada", text:
        "«Esas amigas tuyas hablan mal de mí, ¿sabías? Mejor no les pares tanto bolas, yo soy el que de verdad te quiere.»",
        bg: "scene-room", next: "p3" },
      p3: { type: "story", speaker: "Narradora", mood: "asustada", text:
        "En el descanso, frente a sus amigas, Mateo le quita el celular de la mano sin preguntar y empieza a revisar sus chats. Sara siente la cara caliente de vergüenza.",
        bg: "scene-tension", next: "choice1" },

      choice1: { type: "choice", speaker: "Sara — ¿Qué haces?", mood: "asustada", text:
        "Todas tus amigas están mirando.",
        bg: "scene-tension",
        choices: [
          { tag: "Justificar", text: "«Es que él es así de celoso porque me quiere mucho» les dices a tus amigas, sonriendo incómoda.",
            effects: { bienestar: -10, red: -5 },
            feedback: "Es común buscar una explicación que duela menos, sobre todo frente a otras personas. Pero querer a alguien no da derecho a revisar su celular sin permiso — eso es control, no cariño.",
            next: "p3b" },
          { tag: "Confrontar", text: "«¡Dame mi celular, eso es mío!» le reclamas fuerte, delante de todos.",
            effects: { bienestar: -5, red: 0 },
            feedback: "Tienes todo el derecho a defender tu espacio. Poner el límite en público puede sentirse expuesto, pero tu reacción es una respuesta válida ante una falta de respeto real.",
            next: "p3b" },
          { tag: "Buscar apoyo", text: "Te alejas sin pelear en ese momento, y esa tarde le cuentas todo a tu amiga Camila.",
            effects: { bienestar: 5, red: 10, contact: { id: "amiga_s", delta: 10 } },
            feedback: "No reaccionar en caliente y buscar a alguien de confianza para procesarlo es una estrategia válida — te da espacio para pensar con más calma tu siguiente paso.",
            next: "p3b" },
        ] },

      p3b: { type: "story", speaker: "Narradora", mood: "triste", text:
        "Esa noche revisas tu celular una y otra vez, preguntándote si de verdad estás exagerando, como él dice, o si algo aquí no está bien.",
        bg: "scene-night", next: "network1" },

      network1: { type: "network", speaker: "¿A quién le cuentas?", mood: "preocupada", text:
        "Puedes consultar a más de una persona antes de decidir.",
        bg: "scene-night", options: ["amiga_s", "mama_s", "lineapurpura"], next: "random1" },

      random1: { type: "random", speaker: "Esa semana", mood: "preocupada", bg: "scene-night", includeWorldEvents: true,
        variants: [
          { text: "Le escribes a Camila para contarle más, pero no te contesta hasta el día siguiente. A veces las respuestas se demoran — eso no significa que a nadie le importe.",
            effects: { bienestar: -3 } },
          { text: "Sin que se lo pidas, tu mamá te pregunta directamente: «¿Mateo te trata bien?». La pregunta te toma por sorpresa, pero también te abre una puerta.",
            effects: { bienestar: 5, contact: { id: "mama_s", delta: 10 } } },
          { text: "Recuerdas que tu prima Valeria vivió algo parecido hace unos años, y que logró salir adelante. Ese recuerdo, ahora, te da un poco de fuerza.",
            effects: { conocimiento: 5, bienestar: 5 } },
        ],
        next: "choice2" },

      choice2: { type: "choice", speaker: "Sara — Tu siguiente paso", mood: "preocupada", text:
        "Con la cabeza más clara, decides actuar. ¿Qué haces?",
        bg: "scene-room",
        choices: [
          { tag: "Orientación escolar", text: "Hablas con la orientadora del colegio y le cuentas lo que ha pasado.",
            effects: { red: 15, bienestar: 10, conocimiento: 15, contact: { id: "orientadora", delta: 20 } },
            unlock: "lineapurpura",
            feedback: "El colegio tiene protocolos confidenciales para acompañar estas situaciones. Pedir ayuda ahí no te mete en problemas — te da respaldo.",
            next: "p4b" },
          { tag: "Límite directo", text: "Le dices a Mateo, con calma pero firme: «No vuelvas a revisar mi celular. Eso no se negocia.»",
            effects: { bienestar: 5, red: -5 },
            feedback: "Poner un límite claro, sin gritar ni justificarte de más, es una forma poderosa de comunicación asertiva — aunque la reacción del otro no siempre sea la esperada.",
            next: "p4b" },
          { tag: "Alertar a otras", text: "Les cuentas a tus amigas más cercanas cómo reconocer señales de control, por si a alguna le está pasando algo parecido.",
            effects: { red: 10, conocimiento: 10, contact: { id: "amiga_s", delta: 10 } },
            community: true,
            feedback: "Compartir lo que aprendiste no solo te fortalece a ti — ayuda a que otras reconozcan señales de control antes, y construye una red más amplia de cuidado entre pares.",
            next: "p4b" },
        ] },

      p4b: { type: "story", speaker: "Narradora", mood: "empoderada", text:
        "No todo se resuelve en un solo día, pero algo cambió: ya no eres la única que sabe lo que está pasando. Eso, a los 18 años, ya es una forma de fuerza.",
        bg: "scene-room", next: "end" },

      end: { type: "end" },
    },
  },

  /* =================== DIANA — VIOLENCIA ECONÓMICA =================== */
  economica: {
    start: "e1",
    nodes: {
      e1: { type: "story", speaker: "Narradora", mood: "tranquila", text:
        "Diana dejó su empleo hace tres años, cuando nació su hija. «Así vamos a estar mejor como familia», le dijo Fabián en ese momento. Ella le creyó.",
        bg: "scene-home", next: "e2",
        crossRefs: [{ if: "daniela", text: "Diana recuerda a Daniela, una antigua compañera de universidad, quien alguna vez le contó que tuvo que aprender a poner límites en su trabajo. Nunca pensó que ella misma tendría que aprender algo parecido, pero en su propia casa." }] },
      e2: { type: "story", speaker: "Narradora", mood: "preocupada", text:
        "Ahora, cada vez que Diana pide dinero para algo básico, Fabián le pregunta «para qué lo necesita» — y a veces se lo niega, como si fuera un castigo.",
        bg: "scene-home", next: "e2b" },
      e2b: { type: "story", speaker: "Fabián", mood: "preocupada", text:
        "«¿Un curso de manicura? ¿Para qué, si aquí no nos falta nada? Esa plata la necesitamos para cosas más importantes.»",
        bg: "scene-home", next: "e3" },
      e3: { type: "story", speaker: "Narradora", mood: "asustada", text:
        "Diana descubre un estado de cuenta: Fabián sacó una tarjeta de crédito a nombre de ella, sin decirle, y ya tiene deudas a su nombre.",
        bg: "scene-tension", next: "choice1" },

      choice1: { type: "choice", speaker: "Diana — ¿Qué haces?", mood: "asustada", text:
        "El papel tiembla un poco en tus manos.",
        bg: "scene-tension",
        choices: [
          { tag: "Minimizar", text: "«Seguro tiene una explicación» piensas, y guardas el papel sin decir nada.",
            effects: { bienestar: -10, red: -5 },
            feedback: "Dudar antes de confrontar algo así es comprensible, sobre todo cuando depende económicamente de la otra persona. Pero usar tu nombre para endeudarte sin tu consentimiento es un hecho grave, no un malentendido.",
            next: "e3b" },
          { tag: "Confrontar", text: "Le reclamas furiosa apenas llega a casa, exigiendo una explicación inmediata.",
            effects: { bienestar: -5, red: 0 },
            feedback: "Tu indignación es completamente válida. Prepararte antes —incluso hablando primero con alguien de confianza— puede ayudarte a sostener ese reclamo con más respaldo.",
            next: "e3b" },
          { tag: "Buscar apoyo", text: "Guardas el papel como evidencia y llamas a tu hermana Patricia para contarle.",
            effects: { bienestar: 5, red: 10, contact: { id: "hermana_d", delta: 10 } },
            feedback: "Guardar evidencia y buscar respaldo antes de actuar es una estrategia sólida, sobre todo en casos de violencia económica, donde los documentos importan mucho.",
            next: "e3b" },
        ] },

      e3b: { type: "story", speaker: "Narradora", mood: "triste", text:
        "Diana se pregunta cuánto más de su vida ha quedado en manos de otra persona sin que ella lo decidiera del todo.",
        bg: "scene-night", next: "network1" },

      network1: { type: "network", speaker: "¿Con quién cuentas?", mood: "preocupada", text:
        "Puedes consultar a más de una persona antes de decidir.",
        bg: "scene-night", options: ["hermana_d", "excolega", "lineapurpura"], next: "random1" },

      random1: { type: "random", speaker: "Los días siguientes", mood: "preocupada", bg: "scene-day", includeWorldEvents: true,
        variants: [
          { text: "Le escribes a Marta, tu excompañera de trabajo, pero anda ocupada y tarda en responder. Aun así, no borras el mensaje — sabes que en algún momento vas a necesitar esa red.",
            effects: { bienestar: -3 } },
          { text: "Tu hermana Patricia, sin que se lo pidas, te ofrece cuidar a la niña un fin de semana «para que hagas lo que necesites». El gesto te toma por sorpresa.",
            effects: { bienestar: 5, contact: { id: "hermana_d", delta: 10 } } },
          { text: "Te enteras de que hay un fondo distrital de apoyo a emprendimientos de mujeres en tu localidad. No sabías que existía.",
            effects: { conocimiento: 8 } },
        ],
        next: "choice2" },

      choice2: { type: "choice", speaker: "Diana — Tu siguiente paso", mood: "preocupada", text:
        "Decides que algo tiene que cambiar. ¿Qué haces primero?",
        bg: "scene-home",
        choices: [
          { tag: "Asesoría jurídica", text: "Vas a la Comisaría de Familia a preguntar sobre violencia patrimonial y tus derechos económicos.",
            effects: { red: 15, bienestar: 10, conocimiento: 15, contact: { id: "comisaria", delta: 20 } },
            unlock: "comisaria",
            feedback: "La violencia económica y patrimonial está reconocida por la ley colombiana como una forma de violencia intrafamiliar. Informarte es el primer paso para recuperar autonomía.",
            next: "e4b" },
          { tag: "Retomar el curso", text: "Con el apoyo de Marta, te inscribes al curso de manicura que Fabián se había burlado de financiar.",
            effects: { conocimiento: 10, bienestar: 10, contact: { id: "excolega", delta: 15 } },
            feedback: "Recuperar un espacio propio de aprendizaje o trabajo es una forma concreta de reconstruir autonomía económica, paso a paso.",
            next: "e4b" },
          { tag: "Grupo de mujeres", text: "Te unes a un grupo de mujeres del barrio que se apoyan entre sí con pequeños emprendimientos.",
            effects: { red: 15, conocimiento: 5, contact: { id: "hermana_d", delta: 10 } },
            community: true,
            feedback: "Los grupos de apoyo económico entre mujeres no solo generan ingresos — construyen una red colectiva que reduce la dependencia de una sola persona.",
            next: "e4b" },
        ] },

      e4b: { type: "story", speaker: "Narradora", mood: "empoderada", text:
        "La autonomía económica no se recupera de un día para otro, pero cada paso —por pequeño que sea— es un paso que ya no depende del permiso de nadie más.",
        bg: "scene-home", next: "end" },

      end: { type: "end" },
    },
  },

  /* =================== CAMILA — VIOLENCIA REPRODUCTIVA =================== */
  reproductiva: {
    start: "c1",
    nodes: {
      c1: { type: "story", speaker: "Narradora", mood: "tranquila", text:
        "Camila y Esteban llevan dos años juntos. Ella está terminando su posgrado y no se imagina, por ahora, teniendo hijos. Él dice que la entiende.",
        bg: "scene-room", next: "c2" },
      c2: { type: "story", speaker: "Narradora", mood: "preocupada", text:
        "Pero varias veces Esteban le ha dicho que «no le gusta» que ella tome pastillas anticonceptivas, y una vez Camila notó que faltaban varias de la caja.",
        bg: "scene-room", next: "c2b" },
      c2b: { type: "story", speaker: "Esteban", mood: "preocupada", text:
        "«¿Para qué te cuidas tanto? Si llega a pasar algo, tampoco sería tan grave, ya deberíamos ir pensando en eso.»",
        bg: "scene-room", next: "c3" },
      c3: { type: "story", speaker: "Narradora", mood: "asustada", text:
        "Camila descubre que le faltan de nuevo pastillas de la caja — otra vez. «Si quedas embarazada nos toca casarnos, así es mejor para los dos» le dice él, como si fuera un chiste.",
        bg: "scene-tension", next: "choice1" },

      choice1: { type: "choice", speaker: "Camila — ¿Qué haces?", mood: "asustada", text:
        "Sientes que algo muy tuyo está siendo decidido por alguien más.",
        bg: "scene-tension",
        choices: [
          { tag: "Minimizar", text: "«Seguro está bromeando» piensas, aunque no te sientes tranquila.",
            effects: { bienestar: -10, red: -5 },
            feedback: "Restarle peso a algo así es una forma común de protegerte del malestar en el momento. Pero decidir sobre tu cuerpo sin tu consentimiento no es una broma, sea cual sea la intención.",
            next: "c3b" },
          { tag: "Confrontar", text: "Le reclamas con rabia, dejando muy claro que tu cuerpo lo decides tú.",
            effects: { bienestar: -5, red: 0 },
            feedback: "Tu rabia tiene sentido: se trata de tu autonomía corporal, un derecho, no un tema a negociar. Sostener ese límite con claridad es válido y necesario.",
            next: "c3b" },
          { tag: "Buscar apoyo", text: "Compras un nuevo método anticonceptivo que puedas controlar tú sola, y le cuentas a tu amiga Juliana lo que pasó.",
            effects: { bienestar: 5, red: 10, contact: { id: "amiga_c", delta: 10 } },
            feedback: "Buscar un método que dependa solo de ti, y hablarlo con alguien de confianza, son dos formas concretas de recuperar el control sobre tus propias decisiones.",
            next: "c3b" },
        ] },

      c3b: { type: "story", speaker: "Narradora", mood: "triste", text:
        "Camila se pregunta desde cuándo dejó de sentir que su cuerpo era completamente suyo dentro de esa relación.",
        bg: "scene-night", next: "network1" },

      network1: { type: "network", speaker: "¿Con quién cuentas?", mood: "preocupada", text:
        "Puedes consultar a más de una persona antes de decidir.",
        bg: "scene-night", options: ["amiga_c", "mama_c", "lineapurpura"], next: "random1" },

      random1: { type: "random", speaker: "Esa semana", mood: "preocupada", bg: "scene-day", includeWorldEvents: true,
        variants: [
          { text: "Juliana te cuenta que ella también sintió presión parecida con una pareja anterior. No estás tan sola en esto como pensabas.",
            effects: { bienestar: 5, contact: { id: "amiga_c", delta: 8 } } },
          { text: "Tu mamá te escribe de la nada preguntando cómo va todo con Esteban. No le cuentas todo todavía, pero la pregunta se queda contigo.",
            effects: { conocimiento: 3 } },
          { text: "Ves un aviso de una jornada gratuita de salud sexual y reproductiva en tu localidad. Guardas la fecha.",
            effects: { conocimiento: 8 } },
        ],
        next: "choice2" },

      choice2: { type: "choice", speaker: "Camila — Tu siguiente paso", mood: "preocupada", text:
        "Decides actuar con información y calma. ¿Qué haces primero?",
        bg: "scene-room",
        choices: [
          { tag: "Ir a la EPS", text: "Pides una cita para un método anticonceptivo que solo tú controles, de forma confidencial.",
            effects: { red: 15, bienestar: 10, conocimiento: 15, contact: { id: "eps", delta: 20 } },
            unlock: "saludsexual",
            feedback: "El acceso a anticoncepción es un derecho gratuito y confidencial en Colombia — no requiere autorización de la pareja. Ejercerlo es una forma directa de recuperar autonomía.",
            next: "c4b" },
          { tag: "Hablarlo con Juliana", text: "Sigues conversando con Juliana sobre cómo poner límites claros en la relación.",
            effects: { bienestar: 10, red: 5, contact: { id: "amiga_c", delta: 10 } },
            feedback: "Procesar la situación con alguien que ya vivió algo similar ayuda a poner en palabras lo que a veces cuesta nombrar sola.",
            next: "c4b" },
          { tag: "Acompañar a otra", text: "Te enteras de que otra amiga vive algo parecido, y decides contarle lo que aprendiste sobre sus derechos.",
            effects: { red: 10, conocimiento: 10, contact: { id: "amiga_c", delta: 5 } },
            community: true,
            feedback: "Compartir información sobre derechos reproductivos con otras mujeres multiplica el impacto de lo que aprendiste — la autonomía de una fortalece la de todas.",
            next: "c4b" },
        ] },

      c4b: { type: "story", speaker: "Narradora", mood: "empoderada", text:
        "Ninguna decisión sobre tu cuerpo debería depender del permiso de alguien más. Reconocerlo, y actuar en consecuencia, ya es un cambio profundo.",
        bg: "scene-room", next: "end" },

      end: { type: "end" },
    },
  },

  /* =================== MARCELA HIGUERA — CICLO DE VIOLENCIA =================== */
  ciclo: {
    start: "m1",
    nodes: {
      m1: { type: "story", speaker: "Narradora", mood: "tranquila", text:
        "Marcela lleva doce años con Édgar. Después de cada pelea fuerte, él le trae flores, le promete que va a cambiar, y por un tiempo todo vuelve a sentirse bien. Hasta la próxima vez.",
        bg: "scene-home", next: "m2" },
      m2: { type: "story", speaker: "Narradora", mood: "preocupada", text:
        "El patrón se repite hace años: primero la tensión va subiendo, después la explosión, luego las disculpas y los regalos — y una calma que nunca dura demasiado.",
        bg: "scene-home", next: "m2b" },
      m2b: { type: "story", speaker: "Valentina", mood: "preocupada", text:
        "«Mamá, ¿por qué a veces te encierras en el cuarto cuando papá llega así? A mí eso me da miedo» — le dice su hija de 16 años, muy seria.",
        bg: "scene-home", next: "m3" },
      m3: { type: "story", speaker: "Narradora", mood: "asustada", text:
        "Esa noche, Édgar llega alterado por algo del trabajo y explota: grita, avienta un plato contra el piso. Valentina se encierra en su cuarto. Marcela reconoce cada parte de este momento.",
        bg: "scene-tension", next: "choice1" },

      choice1: { type: "choice", speaker: "Marcela — ¿Qué haces?", mood: "asustada", text:
        "El plato roto sigue en el piso.",
        bg: "scene-tension",
        choices: [
          { tag: "Minimizar", text: "«Ya se le pasa, siempre se le pasa» piensas, mientras recoges los pedazos en silencio.",
            effects: { bienestar: -10, red: -5 },
            feedback: "Después de años repitiendo el mismo ciclo, minimizar puede sentirse casi automático. Nombrar el patrón —tensión, explosión, reconciliación— es el primer paso para poder mirarlo de otra forma.",
            next: "m3b" },
          { tag: "Confrontar", text: "Le gritas de vuelta que esta vez no va a ser tan fácil como siempre.",
            effects: { bienestar: -5, red: 0 },
            feedback: "Tu enojo es completamente legítimo después de tantos años. Al mismo tiempo, en momentos de alta tensión, priorizar la seguridad tuya y de tu hija es tan válido como poner el límite.",
            next: "m3b" },
          { tag: "Buscar apoyo", text: "Te llevas a Valentina a tu cuarto, cierras la puerta, y en cuanto puedes le escribes a tu amiga Rocío.",
            effects: { bienestar: 5, red: 10, contact: { id: "amiga_m", delta: 10 } },
            feedback: "Priorizar un espacio seguro para ti y tu hija en el momento, y buscar apoyo apenas puedas, es una decisión que protege a ambas.",
            next: "m3b" },
        ] },

      m3b: { type: "story", speaker: "Narradora", mood: "triste", text:
        "Al día siguiente llegan las flores, como siempre. Marcela las mira distinto esta vez: ya no está seguro de que signifiquen lo que antes creía.",
        bg: "scene-night", next: "network1" },

      network1: { type: "network", speaker: "¿Con quién cuentas?", mood: "preocupada", text:
        "Puedes consultar a más de una persona antes de decidir.",
        bg: "scene-night", options: ["hija_m", "amiga_m", "lineapurpura"], next: "random1" },

      random1: { type: "random", speaker: "Los días siguientes", mood: "preocupada", bg: "scene-day", includeWorldEvents: true,
        variants: [
          { text: "Rocío te manda un mensaje esa noche, pero se demora un día en responder del todo. Aun así, no dejas de escribirle — sabes que te escucha.",
            effects: { bienestar: -3 } },
          { text: "Valentina, sin que se lo pidas, te deja una nota: «Estoy contigo, mamá, en lo que decidas». La guardas.",
            effects: { bienestar: 8, contact: { id: "hija_m", delta: 10 } } },
          { text: "Recuerdas una charla sobre el 'ciclo de la violencia' que escuchaste hace años en una jornada del barrio. Ahora, por fin, entiendes de qué hablaban.",
            effects: { conocimiento: 8 } },
        ],
        next: "choice2" },

      choice2: { type: "choice", speaker: "Marcela — Tu siguiente paso", mood: "preocupada", text:
        "Reconocer el patrón cambia algo. ¿Qué haces con eso?",
        bg: "scene-home",
        choices: [
          { tag: "Documentar y denunciar", text: "Empiezas a anotar fechas y hechos, y vas a la Comisaría de Familia a preguntar por una medida de protección.",
            effects: { red: 15, bienestar: 10, conocimiento: 15, contact: { id: "comisaria", delta: 20 } },
            unlock: "comisaria",
            feedback: "Documentar el patrón a lo largo del tiempo es especialmente valioso en casos de ciclo de violencia, donde cada incidente por separado puede parecer 'menos grave' de lo que es en conjunto.",
            next: "m4b" },
          { tag: "Plan de seguridad", text: "Con Valentina, acuerdan una señal y un lugar seguro al que ir si una situación se vuelve a poner tensa.",
            effects: { bienestar: 10, red: 10, contact: { id: "hija_m", delta: 15 } },
            feedback: "Un plan de seguridad no significa irse de inmediato — es preparar, con calma, cómo protegerse si la tensión escala, mientras se toman otras decisiones con más tiempo.",
            next: "m4b" },
          { tag: "Grupo de apoyo", text: "Te unes a un grupo de mujeres que ya identificaron el mismo ciclo en sus propias historias, para acompañarse entre ellas.",
            effects: { red: 15, conocimiento: 10, contact: { id: "amiga_m", delta: 10 } },
            community: true,
            feedback: "Reconocer el ciclo junto a otras mujeres que vivieron algo similar reduce el aislamiento y ayuda a identificar más rápido las próximas señales — para una misma y para las demás.",
            next: "m4b" },
        ] },

      m4b: { type: "story", speaker: "Narradora", mood: "empoderada", text:
        "Doce años de un mismo patrón no cambian en una noche. Pero nombrar el ciclo, en voz alta, ya es distinto a callarlo una vez más.",
        bg: "scene-home", next: "end" },

      end: { type: "end" },
    },
  },
};
