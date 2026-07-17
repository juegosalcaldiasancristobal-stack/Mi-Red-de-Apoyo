/* ============================================================
   NEXA — mascota consejera (personaje vivo, no un cartel de tips)
   --------------------------------------------------------------
   Usa las imágenes reales en assets/img/*.png (8 expresiones).
   Reacciona a eventos reales del juego —inicio de cada historia,
   minijuego de señales, logros, finales— con guiones propios
   para "Mi Red de Apoyo". No conoce el motor por dentro: engine.js
   y ui.js solo la llaman en puntos concretos (ver PLAN /
   conversación), y si este script no carga, el resto sigue
   funcionando igual.
   ============================================================ */

const MRA_NEXA = (() => {
  const WELCOME = { mood: "feliz", text: "¡Hola! Soy Nexa, tu consejera. Usa ◀ ▶ o los botones para mover a Valentina, y ↑ Saltar para brincar. Tócame cuando quieras un consejo." };

  const MAP_TIPS = [
    { mood: "curiosa", text: "Busca las puertas 🚪 con 💬 encima — ahí vive cada historia. Las que ya tienen ✓ ya las jugaste." },
    { mood: "alerta", text: "Cuidado con los ⚠️: te quitan una vida. ¡Salta para esquivarlos!" },
    { mood: "empoderada", text: "Cada estrella ⭐ suma puntos a tu partida. Tómate tu tiempo, no hay límite." },
    { mood: "pensativa", text: "¿Prefieres no usar el mapa? Toca '📋 Modo accesible' para elegir una historia directo de la lista." },
    { mood: "aliviada", text: "Puedes silenciar la música y los sonidos con el botón 🔊 cuando quieras." },
    { mood: "celebrando", text: "Cuando acompañes a las 8 mujeres vas a poder ver tu Red Tejida completa 🕸️." },
    { mood: "preocupada", text: "Si necesitas salir rápido en cualquier momento, arriba siempre está ⨯ Salida rápida." },
  ];

  /* Guion de bienvenida de Nexa al empezar cada historia: la sitúa,
     sin adelantar la trama, con la misma mirada de "no es tu culpa"
     que ya usan endings.js y los epílogos por personaje. */
  const CHARACTER_INTROS = {
    marcela: { mood: "pensativa", text: "Vas a acompañar a Marcela. El control no siempre grita — a veces suena a preguntas que nunca terminan. Fíjate en cómo se siente ella, no en si 'exagera'." },
    sara: { mood: "alerta", text: "Sara tiene 18 años. Revisar el celular de alguien, decidir con quién puede hablar... eso no es amor, es control. Acompáñala a nombrarlo." },
    diana: { mood: "pensativa", text: "El dinero también puede ser una forma de control. Fíjate en quién decide qué se puede o no se puede hacer en la casa de Diana." },
    camila: { mood: "alerta", text: "El cuerpo de Camila es solo de ella. Ninguna decisión sobre tener hijos o no se toma sin que ella quiera." },
    marcela_b: { mood: "preocupada", text: "Marcela lleva doce años en un ciclo: tensión, explosión, y luego las flores. Reconocer el patrón completo es el primer paso — tómate tu tiempo." },
    daniela: { mood: "alerta", text: "El acoso laboral casi nunca se ve a la primera. Fíjate en los patrones que se repiten, no solo en el incidente de hoy." },
    rosario: { mood: "empoderada", text: "Rosario es comerciante y mujer trans. La comunidad puede ser una gran red de apoyo cuando se organiza — acompáñala a construirla." },
    yuli: { mood: "alerta", text: "Compartir una foto no le da a nadie derecho sobre el cuerpo de otra persona. Lo que le pasa a Yuli tiene nombre, y es delito en Colombia." },
  };

  const MINIGAME_FEEDBACK = {
    perfect: [
      { mood: "celebrando", text: "¡Las detectaste todas! Reconocer señales de alerta es una herramienta que te llevas de aquí." },
      { mood: "celebrando", text: "¡Excelente ojo! Así se entrena la mirada para detectar el control a tiempo." },
    ],
    partial: [
      { mood: "pensativa", text: "Vas bien. Revisemos con calma cuáles señales se nos escaparon — algunas cuestan más que otras." },
      { mood: "pensativa", text: "Detectaste varias. Aprender a verlas todas toma práctica, y eso también es parte del proceso." },
    ],
    weak: [
      { mood: "preocupada", text: "No pasa nada por no verlas todas hoy — el control muchas veces se disfraza de cariño." },
      { mood: "preocupada", text: "Está bien no acertar siempre. Lo importante es que sigues practicando cómo reconocerlas." },
    ],
  };

  const ACHIEVEMENT_LINES = {
    primer_contacto: { mood: "aliviada", text: "Diste el primer paso: pedir ayuda. Aunque no lo sientas así, eso ya es un acto de valentía." },
    ruta_activada: { mood: "empoderada", text: "Activaste tu primera ruta institucional. Ese contacto sigue ahí, disponible, cuando lo necesites de nuevo." },
    senal_reconocida: { mood: "curiosa", text: "Reconociste una señal de alerta. Cada vez te va a costar menos verlas venir." },
    red_solida: { mood: "celebrando", text: "¡Tu red de apoyo llegó a 75%! Ninguna red se teje sola — la estás construyendo hilo a hilo." },
    defensora: { mood: "empoderada", text: "Completaste esta historia de principio a fin. Acompañar, aunque sea en un juego, también enseña a cuidar." },
  };

  const ENDING_LINES = {
    liderazgo: { mood: "celebrando", text: "No solo tejiste tu red — ayudaste a que creciera más allá de ti. Eso es liderazgo comunitario de verdad." },
    fuerte: { mood: "celebrando", text: "Construiste una red sólida: hablaste, pediste ayuda, te informaste. Ninguna red así se teje en un solo día." },
    camino: { mood: "aliviada", text: "El camino sigue abierto, y eso está bien. Construir una red casi nunca es un solo paso, sino muchos pequeños." },
    aprendiendo: { mood: "pensativa", text: "Diste pasos importantes, aunque cueste el siguiente. La información que reuniste hoy sigue disponible cuando la necesites." },
    sola: { mood: "preocupada", text: "Esta historia mostró lo difícil que es pedir ayuda, sobre todo cuando el aislamiento es parte de la estrategia de quien agrede — nunca tu culpa. El directorio de apoyo sigue abierto." },
  };

  /* Nexa que solo se lee es una barrera para quien no lee con fluidez:
     habla en voz alta cada vez que dice algo, reusando Web Speech API
     (el mismo mecanismo que ya narra las historias en engine.js). */
  let waitToSpeakId = null;
  function speakNexa(text) {
    if (!window.speechSynthesis || !text) return;
    if (window.MRA_AUDIO?.isMuted?.()) return;
    clearInterval(waitToSpeakId);
    const doSpeak = () => {
      speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text.replace(/[«»]/g, ""));
      const voices = speechSynthesis.getVoices();
      const voice = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("es")) || voices[0];
      if (voice) utter.voice = voice;
      utter.lang = "es-CO";
      utter.pitch = 1.2;
      utter.rate = 1.02;
      speechSynthesis.speak(utter);
    };
    if (!speechSynthesis.speaking) { doSpeak(); return; }
    // La narración de la historia ya está hablando: Nexa espera su turno
    // en vez de cortarla a mitad de frase.
    let waited = 0;
    waitToSpeakId = setInterval(() => {
      waited += 300;
      if (!speechSynthesis.speaking || waited > 15000) { clearInterval(waitToSpeakId); doSpeak(); }
    }, 300);
  }
  function estimateSpeechMs(text) {
    const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1800, words * 380);
  }

  let idx = 0;
  let welcomed = false;
  let storyWelcomed = false;
  let hideTimer = null;

  function imgFor(mood) { return `assets/img/${mood}.png`; }
  function paintButtons(mood) {
    document.querySelectorAll(".nexa-tip-btn").forEach((btn) => { btn.style.backgroundImage = `url("${imgFor(mood)}")`; });
  }

  /* Cola simple: si dos reacciones ocurren casi al mismo tiempo (ej. un
     logro justo antes del final de la historia), Nexa las dice una
     después de la otra en vez de que la segunda tape a la primera sin
     que la jugadora alcance a leerla. */
  const MIN_DISPLAY_MS = 3000;
  let queue = [];
  let processing = false;

  function renderTip(tip) {
    const bubble = document.getElementById("nexaTipBubble");
    const img = document.getElementById("nexaTipImg");
    const text = document.getElementById("nexaTipText");
    if (!bubble || !img || !text || !tip) return;
    img.src = imgFor(tip.mood);
    img.alt = "Nexa";
    text.textContent = tip.text;
    bubble.classList.remove("hidden");
    bubble.classList.remove("nexa-pulse");
    void bubble.offsetWidth;
    bubble.classList.add("nexa-pulse");
    paintButtons(tip.mood);
    speakNexa(tip.text);
  }
  function processQueue() {
    if (processing || queue.length === 0) return;
    processing = true;
    const { tip, autoHideMs } = queue.shift();
    renderTip(tip);
    clearTimeout(hideTimer);
    // Si ya hay más mensajes esperando, este cede el turno más rápido —
    // pero nunca antes de que le dé tiempo de terminar de decirlo en voz alta.
    const moreQueued = queue.length > 0;
    const speechMs = estimateSpeechMs(tip.text);
    const displayMs = moreQueued ? Math.max(MIN_DISPLAY_MS, speechMs) : Math.max(MIN_DISPLAY_MS, autoHideMs || 0, speechMs);
    hideTimer = setTimeout(() => {
      processing = false;
      if (queue.length === 0 && autoHideMs) hideTip();
      else processQueue();
    }, displayMs);
  }
  function showTip(tip, autoHideMs) {
    if (!tip) return;
    queue.push({ tip, autoHideMs });
    if (queue.length > 3) queue = queue.slice(-3); // no dejar acumular una cola eterna
    processQueue();
  }
  function hideTip() {
    document.getElementById("nexaTipBubble")?.classList.add("hidden");
    if (window.speechSynthesis) speechSynthesis.cancel();
    queue = [];
    processing = false;
  }

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function nextTip() {
    const tip = MAP_TIPS[idx % MAP_TIPS.length];
    idx++;
    showTip(tip);
  }
  function welcomeIfFirstTime() {
    if (welcomed) return;
    welcomed = true;
    showTip(WELCOME);
  }

  /* Se dice una sola vez en toda la sesión, la primera vez que se entra
     a cualquier historia: explica por qué Valentina aparece dentro de
     las novelas visuales como acompañante (ver conversación con GESEG). */
  const STORY_INTRO = { mood: "empoderada", text: "Esa que ves ahí eres tú: Valentina te acompaña dentro de cada historia. A través de ella ves y decides lo que pasa." };

  /* ---------------- reacciones a eventos del juego ---------------- */
  function onCharacterStart(charId) {
    if (!storyWelcomed) { storyWelcomed = true; showTip(STORY_INTRO, 7000); }
    const tip = CHARACTER_INTROS[charId];
    if (tip) showTip(tip, 6000);
  }
  function onMinigameResult(correct, total) {
    if (total <= 0) return;
    const tier = correct >= total ? "perfect" : correct >= Math.ceil(total / 2) ? "partial" : "weak";
    showTip(pick(MINIGAME_FEEDBACK[tier]), 6000);
  }
  function onAchievement(id) {
    const tip = ACHIEVEMENT_LINES[id];
    if (tip) showTip(tip, 6000);
  }
  function onEnding(endingId) {
    const tip = ENDING_LINES[endingId];
    if (tip) showTip(tip, 9000);
  }
  function storyHintForCurrent() {
    const c = window.__game && window.__game.state && window.__game.state.character;
    if (c && CHARACTER_INTROS[c.id]) { showTip(CHARACTER_INTROS[c.id], 9000); return; }
    showTip(pick(MAP_TIPS));
  }

  function init() {
    paintButtons("feliz");
    document.querySelectorAll(".nexa-tip-btn").forEach((btn) => btn.addEventListener("click", () => {
      if (!document.getElementById("screen-game")?.classList.contains("hidden")) storyHintForCurrent();
      else nextTip();
    }));
    document.getElementById("nexaTipClose")?.addEventListener("click", hideTip);
    document.getElementById("nexaTipReplay")?.addEventListener("click", () => {
      speakNexa(document.getElementById("nexaTipText")?.textContent);
    });
  }
  document.addEventListener("DOMContentLoaded", init);
  if (document.readyState !== "loading") init();

  return { nextTip, welcomeIfFirstTime, hideTip, onCharacterStart, onMinigameResult, onAchievement, onEnding, storyHintForCurrent };
})();

window.MRA_NEXA = MRA_NEXA;
