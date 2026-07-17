const ENDINGS = [
  { id: "liderazgo", icon: "🌟", color: "from-fuchsia-500 to-purple-500",
    title: "Liderazgo comunitario",
    text: "No solo fortaleciste tu propia red — también tendiste una mano hacia otras. Al organizar, acompañar o compartir lo que aprendiste, ayudaste a que la red de apoyo crezca más allá de ti misma. Eso es, en el fondo, lo que sostiene a toda una comunidad." },
  { id: "fuerte", min: 75, icon: "🕸️💪", color: "from-emerald-500 to-teal-400",
    title: "Una red tejida y fuerte",
    text: "Lograste construir una red de apoyo sólida: hablaste, pediste ayuda, te informaste y diste pasos concretos hacia instituciones y personas de confianza. Ninguna red se teje en un solo día — la tuya ya tiene hilos fuertes." },
  { id: "camino", min: 55, icon: "🌱", color: "from-lime-500 to-emerald-400",
    title: "Un camino en construcción",
    text: "Diste pasos importantes y reales hacia pedir ayuda. El proceso sigue abierto — y eso está bien: construir una red de apoyo casi nunca es un solo movimiento, sino muchos pequeños pasos sostenidos en el tiempo." },
  { id: "aprendiendo", min: 35, icon: "🔎", color: "from-amber-500 to-orange-400",
    title: "Aprendiendo a pedir ayuda",
    text: "Reconociste señales importantes, aunque todavía cueste dar el siguiente paso. Nunca es tarde para buscar apoyo: cada persona y cada ruta institucional que conociste hoy sigue disponible cuando estés lista." },
  { id: "sola", min: 0, icon: "🕯️", color: "from-rose-500 to-red-400",
    title: "Nunca estás sola, aunque lo sientas",
    text: "Esta historia mostró lo difícil que es reconocer y enfrentar la violencia, sobre todo cuando el aislamiento es parte de la estrategia de quien agrede — no una elección tuya. El directorio de apoyo sigue abierto siempre que lo necesites, y hablarlo con la persona que facilita esta sesión también es un paso válido ahora mismo." },
];

/* Epílogo breve y específico por personaje, según el final alcanzado.
   Se muestra debajo del texto genérico del final en pantalla de cierre.
   "liderazgo" solo aplica a personajes cuyo guion incluye al menos una
   elección con community:true (ver cada archivo de capítulo). */
const CHARACTER_EPILOGUES = {
  marcela: {
    fuerte: "Marcela sigue vendiendo fruta cada mañana en la plaza. Ahora su hermana la llama todos los días, y ya conoce el camino hasta la Comisaría de Familia — no como una amenaza, sino como una puerta que sabe que puede tocar.",
    camino: "Marcela todavía comparte techo con Jairo, pero ya no comparte el silencio: su hermana sabe, la Comisaría la conoce, y cada semana da un paso más hacia decidir con calma qué sigue.",
    aprendiendo: "Marcela guarda en su celular el número de la Línea Púrpura, aunque todavía no se atreve a llamar. Sabe que está ahí. Eso, por ahora, ya es un ancla.",
    sola: "Marcela vuelve a su rutina, con Jairo todavía cerca. El miedo no desapareció, pero ahora sabe que existe un directorio de personas e instituciones dispuestas a escucharla cuando decida buscarlas — hoy, o más adelante.",
  },
  sara: {
    liderazgo: "Sara armó, sin proponérselo, una pequeña red entre sus amigas del colegio: ahora se avisan y se acompañan cuando algo en una relación no se siente bien. La orientadora las apoya de cerca.",
    fuerte: "Sara habló con la orientadora, puso límites claros con Mateo, y su red de amigas y familia sabe exactamente lo que está viviendo. A los 18 años, ya sabe reconocer el control cuando aparece.",
    camino: "Sara dio pasos reales: le contó a su mamá y a su amiga, y empezó a poner límites. El proceso sigue, y cada semana se siente un poco más seguro dar el siguiente paso.",
    aprendiendo: "Sara todavía no ha hablado con un adulto de confianza, pero ya identifica que lo que vive no es normal. Ese reconocimiento, a su edad, ya es un paso enorme.",
    sola: "Sara sigue con Mateo y el control no ha parado. No es su culpa — el aislamiento es parte de cómo funciona este tipo de relación. La orientadora y la Línea Púrpura van a seguir ahí cuando decida buscarlas.",
  },
  diana: {
    liderazgo: "El grupo de mujeres emprendedoras que Diana ayudó a fortalecer ya tiene ocho integrantes. Varias, como ella, están reconstruyendo su autonomía económica paso a paso, juntas.",
    fuerte: "Diana inició su proceso en la Comisaría de Familia, retomó su formación y ya tiene un ingreso propio, así sea pequeño. La dependencia total del dinero de Fabián empezó a cambiar.",
    camino: "Diana ya sabe que lo que vive tiene nombre —violencia patrimonial— y empezó a buscar información y apoyo. El camino hacia la autonomía económica sigue abierto.",
    aprendiendo: "Diana no ha dado el paso de denunciar todavía, pero ya reconoce que controlar todo el dinero de la casa no es 'normal', y sabe a quién puede acudir cuando esté lista.",
    sola: "Diana sigue dependiendo económicamente de Fabián. Eso no es un fracaso personal — es exactamente el tipo de control que este tipo de violencia busca sostener. Las rutas de apoyo económico siguen disponibles.",
  },
  camila: {
    liderazgo: "Camila terminó acompañando a dos amigas más en situaciones parecidas, compartiendo lo que aprendió sobre sus derechos reproductivos. Sin buscarlo, se volvió una voz de referencia entre sus amigas.",
    fuerte: "Camila accedió a un método anticonceptivo que ella misma controla, puso límites claros con Esteban, y habla abiertamente del tema con su red cercana. Su autonomía corporal ya no está en discusión.",
    camino: "Camila dio pasos concretos: buscó información confiable y habló con alguien de confianza. Sigue construyendo, a su ritmo, una relación con su cuerpo que dependa solo de ella.",
    aprendiendo: "Camila todavía no ha ido a la EPS, pero ya identifica que lo que Esteban hizo no es un detalle menor. Saber que es un derecho, no un favor, ya cambia cómo lo ve.",
    sola: "La presión de Esteban sobre sus decisiones reproductivas continúa. Esto no le resta ningún derecho a Camila — el acceso a anticoncepción confidencial sigue estando disponible cuando decida usarlo.",
  },
  marcela_b: {
    liderazgo: "El grupo de mujeres con el que Marcela empezó a reunirse creció rápido: reconocer el ciclo juntas hizo que varias se animaran a buscar ayuda antes de lo que ella misma pudo, doce años atrás.",
    fuerte: "Marcela documentó el patrón, inició el proceso en la Comisaría de Familia, y armó un plan de seguridad junto a Valentina. Doce años de silencio empezaron a romperse.",
    camino: "Marcela ya nombra el ciclo en voz alta —tensión, explosión, reconciliación— y empezó a construir una red con su hija y su amiga Rocío. El proceso sigue, sin prisa pero sin detenerse.",
    aprendiendo: "Marcela todavía no ha dado el siguiente paso formal, pero por primera vez en años logra ver el patrón completo, no solo el incidente de turno. Ese reconocimiento es la base de todo lo que viene.",
    sola: "El ciclo se sigue repitiendo en casa de Marcela. Doce años de patrón no se rompen de un día para otro, y eso no es una falla suya. La Comisaría de Familia y la Línea Púrpura van a seguir disponibles.",
  },
  daniela: {
    fuerte: "El Comité de Convivencia Laboral abrió el caso formalmente. Daniela sigue yendo a trabajar con Camila y Esteban cerca — ya no camina sola por los pasillos de la oficina.",
    camino: "El proceso en Talento Humano avanza lento, pero avanza. Daniela documenta cada semana, segura de que ya no depende solo de su memoria.",
    aprendiendo: "Daniela aún no ha presentado la queja formal, pero ya guardó capturas y fechas. Sabe que la Línea Púrpura existe y que puede llamar cuando esté lista.",
    sola: "Daniela sigue en su puesto, con Ricardo todavía cerca. El miedo a no ser creída pesa, pero ahora conoce sus derechos — y ninguna ley deja de aplicar solo porque ella aún no haya actuado.",
  },
  yuli: {
    fuerte: "La denuncia en el CAI Virtual quedó radicada, y su mamá la acompaña a cada cita. Sofía le recuerda, cada vez que puede, que ninguna foto define lo que Yuli vale.",
    camino: "Yuli guardó toda la evidencia y ya habló con alguien de confianza. El siguiente paso —la denuncia formal— está más cerca de lo que estaba ayer.",
    aprendiendo: "Yuli todavía no le ha contado a su familia, pero ya sabe que lo que Andrés hizo es delito en Colombia, no un 'problema de pareja'. Esa información no se le olvida.",
    sola: "Los mensajes de Andrés continúan. Yuli no ha dado el siguiente paso todavía, y eso también es humano — el CAI Virtual y la Línea Púrpura van a seguir ahí cuando decida usarlos.",
  },
  rosario: {
    liderazgo: "El acuerdo entre vecinas se volvió costumbre del barrio: ahora hay una red activa de comerciantes que se cuidan mutuamente al cerrar, y Rosario —sin buscarlo— se convirtió en referente para otras mujeres del sector.",
    fuerte: "La red de vecinas se organizó de verdad: ahora nadie cierra su local sola por las noches en esa cuadra. Julieth y la Casa de Igualdad siguen acompañando el proceso.",
    camino: "Rosario ya puso la queja y avisó a su red comunitaria. El grupo que la hostigaba sabe que ya no está sola — y eso, de por sí, cambia algo.",
    aprendiendo: "Rosario todavía cierra su tienda con cautela, pero ya conoce la ruta de la Casa de Igualdad y sabe que atienden a mujeres trans sin condiciones.",
    sola: "El hostigamiento no ha parado, y eso no es culpa de Rosario. Su red comunitaria y las rutas institucionales de Bogotá siguen disponibles el día que decida activarlas de nuevo.",
  },
};
