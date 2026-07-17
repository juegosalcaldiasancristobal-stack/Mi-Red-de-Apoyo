/* ============================================================
   MI RED DE APOYO — Motor del juego
   --------------------------------------------------------------
   Este archivo SOLO interpreta datos — no conoce personajes,
   textos ni recursos concretos. Todo el contenido vive en
   ./data/ (cargado antes que este script en index.html). Agregar
   un capítulo nuevo nunca debería requerir tocar este archivo.
   Nota: se usan <script> clásicos (no type="module") a propósito,
   para que el juego funcione abriendo index.html con doble clic,
   sin necesidad de servidor — los módulos ES lo bloquean bajo file://.
   ============================================================ */

const BG_STYLES = {
  "scene-home": "linear-gradient(135deg,#4a3355,#2b2140)",
  "scene-tension": "linear-gradient(135deg,#5a2439,#2b1530)",
  "scene-night": "linear-gradient(135deg,#1c2340,#100f22)",
  "scene-day": "linear-gradient(135deg,#3b4d6b,#232a45)",
  "scene-office": "linear-gradient(135deg,#274156,#182338)",
  "scene-room": "linear-gradient(135deg,#4b2e57,#241a35)",
  "scene-street-day": "linear-gradient(135deg,#3d5a4a,#1f2e2a)",
  "scene-street-night": "linear-gradient(135deg,#1b2438,#0f1220)",
};

const TRUST_COLOR = (t) => (t >= 67 ? "#34d399" : t >= 34 ? "#fbbf24" : "#fb7185");

const state = {
  character: null,
  scenario: null,
  nodeId: null,
  stats: { red: 30, bienestar: 50, conocimiento: 10 },
  contacts: {},
  consultedOnce: {},
  unlockedResources: new Set(),
  playMode: "individual",
  achievements: new Set(),
  signalsLog: [],
  anyContactConsulted: false,
  // Activada por defecto (no opt-in): forzar a leer todo el texto para poder
  // jugar es una barrera de accesibilidad real para quien no lee con fluidez.
  // Se puede apagar desde el botón 🔊, pero el punto de partida es con voz.
  speechAutoplay: true,
  chatTimers: [],
  player: { name: "", age: "", email: "" },
  decisionsLog: [],
  missedSignalsLog: [],
  a11y: { fontScale: "normal", highContrast: false, rate: 1 },
  communityFlag: false,
  sessionHistory: [], // ids de personajes ya jugados en esta pestaña (habilita referencias cruzadas)
};

const $ = (sel) => document.querySelector(sel);
const $all = (sel) => document.querySelectorAll(sel);

function showScreen(id) {
  $all("[data-screen]").forEach((s) => s.classList.add("hidden"));
  $(`#${id}`).classList.remove("hidden");
  $(`#${id}`).classList.add("fade-in");
  // Valentina —el personaje del mapa— se queda visible como acompañante
  // solo mientras se está dentro de una historia (screen-game).
  document.getElementById("valentinaCompanion")?.classList.toggle("hidden", id !== "screen-game");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function clamp(n) { return Math.max(0, Math.min(100, n)); }

/* ---------------- INTRO ---------------- */
$("#consentCheck").addEventListener("change", (e) => {
  $("#startBtn").disabled = !e.target.checked;
});
$("#startBtn").addEventListener("click", () => {
  state.playMode = document.querySelector('input[name="playMode"]:checked').value;
  showScreen("screen-register");
});
$("#skipToResources").addEventListener("click", () => openResourcesModal());

/* ---------------- REGISTRO DE PARTICIPANTE (obligatorio + correo verificado) ---------------- */
function validateRegistration() {
  const age = $("#regAge").value;
  const name = $("#regName").value.trim();
  const email = $("#regEmail").value.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const ok = age !== "" && name.length >= 3 && emailOk && $("#regConsent").checked;
  $("#regSubmitBtn").disabled = !ok;
  return ok;
}
["regName", "regAge", "regEmail"].forEach((id) => $(`#${id}`).addEventListener("input", validateRegistration));
$("#regConsent").addEventListener("change", validateRegistration);

$("#regSubmitBtn").addEventListener("click", async () => {
  state.player = {
    name: $("#regName").value.trim(),
    age: $("#regAge").value,
    email: $("#regEmail").value.trim(),
  };

  if (!isBackendConfigured()) {
    // Sin backend desplegado todavía no es posible verificar el correo de verdad.
    // El juego sigue funcionando: se registra localmente y se avanza sin bloquear la sesión.
    registerPlayer();
    renderCharacterSelect();
    window.MRA_UI ? window.MRA_UI.enterWorldMap() : showScreen("screen-select");
    return;
  }

  $("#regSubmitBtn").disabled = true;
  $("#regStatus").textContent = "⏳ Enviando código de verificación a tu correo…";
  const res = await sendToBackend({ action: "send_code", name: state.player.name, email: state.player.email });
  $("#regSubmitBtn").disabled = false;
  if (!res.ok) {
    $("#regStatus").textContent = "⚠️ No se pudo enviar el código (revisa la conexión a internet). Intenta de nuevo.";
    return;
  }
  $("#regStatus").textContent = "";
  $("#regStep2Email").textContent = state.player.email;
  $("#regCode").value = "";
  $("#regStep2Status").textContent = "";
  $("#regStep1").classList.add("hidden");
  $("#regStep2").classList.remove("hidden");
});

$("#regResendBtn").addEventListener("click", async () => {
  $("#regStep2Status").textContent = "⏳ Reenviando código…";
  const res = await sendToBackend({ action: "send_code", name: state.player.name, email: state.player.email });
  $("#regStep2Status").textContent = res.ok ? "✅ Código reenviado, revisa tu correo." : "⚠️ No se pudo reenviar. Intenta de nuevo.";
});

$("#regVerifyBtn").addEventListener("click", async () => {
  const code = $("#regCode").value.trim();
  if (!/^\d{6}$/.test(code)) {
    $("#regStep2Status").textContent = "Ingresa el código de 6 dígitos que enviamos a tu correo.";
    return;
  }
  $("#regVerifyBtn").disabled = true;
  $("#regStep2Status").textContent = "⏳ Verificando…";
  const res = await sendToBackend({ action: "verify_code", email: state.player.email, code });
  $("#regVerifyBtn").disabled = false;
  if (res.ok && res.data && res.data.ok) {
    registerPlayer();
    renderCharacterSelect();
    window.MRA_UI ? window.MRA_UI.enterWorldMap() : showScreen("screen-select");
  } else {
    $("#regStep2Status").textContent = "❌ Código incorrecto o vencido (dura 10 minutos). Puedes reenviarlo.";
  }
});

/* ---------------- CONEXIÓN CON GOOGLE SHEETS (Apps Script) ---------------- */
function isBackendConfigured() {
  return typeof APPS_SCRIPT_URL === "string" && APPS_SCRIPT_URL.startsWith("http");
}
function sendToBackend(payload) {
  if (!isBackendConfigured()) return Promise.resolve({ ok: false, reason: "not-configured" });
  return fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" }, // evita preflight CORS
    body: JSON.stringify(payload),
  })
    .then(async (res) => {
      let data = null;
      try { data = await res.json(); } catch (err) { /* respuesta no-JSON, seguimos sin datos */ }
      return { ok: true, data };
    })
    .catch((err) => ({ ok: false, reason: err.message }));
}
function registerPlayer() {
  sendToBackend({
    action: "register",
    timestamp: new Date().toISOString(),
    name: state.player.name,
    age: state.player.age,
    email: state.player.email,
    playMode: state.playMode,
  });
}
$("#quickExitBtn").addEventListener("click", quickExit);
$("#menuExit").addEventListener("click", quickExit);
function quickExit() {
  if (window.speechSynthesis) speechSynthesis.cancel();
  try { sessionStorage.removeItem("mra_sesion_en_curso"); } catch (err) {}
  window.location.replace("https://www.google.com/search?q=clima+bogota");
}

/* ---------------- SELECCIÓN DE PERSONAJE ---------------- */
function renderCharacterSelect() {
  const grid = $("#characterGrid");
  grid.innerHTML = "";
  CHAPTERS.forEach((chap) => {
    const chars = CHARACTERS.filter((c) => c.chapter === chap.id);
    if (!chars.length) return; // capítulos sin historias todavía (ej. Diversidad) no se muestran
    const heading = document.createElement("h3");
    heading.className = "sm:col-span-2 text-sm font-bold uppercase tracking-wide text-fuchsia-300 mt-2 first:mt-0";
    heading.textContent = chap.title;
    grid.appendChild(heading);

    chars.forEach((c) => {
      const el = document.createElement("div");
      el.className = "char-card fade-in";
      el.innerHTML = `
        <div class="flex items-start gap-3">
          <div class="h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br ${c.color} p-1 shadow-md">${avatarSVG(c, "tranquila")}</div>
          <div class="min-w-0">
            <p class="font-bold leading-tight">${c.name} <span class="text-slate-400 font-normal text-sm">· ${c.age} años</span></p>
            <p class="text-xs text-slate-400">${c.tag}</p>
            <span class="inline-block mt-1.5 text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-white/10">${c.violenceType}</span>
          </div>
        </div>
        <p class="text-sm text-slate-300 mt-3 leading-relaxed">${c.blurb}</p>
        <button class="btn-primary w-full mt-4 !text-sm">Vivir su historia →</button>
      `;
      el.querySelector("button").addEventListener("click", () => startCharacter(c.id));
      grid.appendChild(el);
    });
  });
}

function startCharacter(charId) {
  const c = CHARACTERS.find((x) => x.id === charId);
  state.character = c;
  state.scenario = SCENARIOS[c.scenarioId];
  state.stats = { red: 30, bienestar: 50, conocimiento: 10 };
  state.contacts = {};
  state.consultedOnce = {};
  state.unlockedResources = new Set();
  state.signalsLog = [];
  state.missedSignalsLog = [];
  state.decisionsLog = [];
  state.anyContactConsulted = false;
  state.lastMood = null;
  state.communityFlag = false;
  c.contacts.forEach((cid) => { state.contacts[cid] = { ...CONTACTS[cid] }; });
  state.nodeId = state.scenario.start;

  $("#hudName").textContent = c.name;
  $("#hudScenario").textContent = c.violenceType;

  showScreen("screen-game");
  renderNode();
  window.MRA_NEXA?.onCharacterStart(charId);
}

/* ---------------- HUD ---------------- */
function setAvatarMood(mood) {
  if (!state.character) return;
  const changed = state.lastMood && state.lastMood !== mood;
  state.lastMood = mood;
  $("#hudAvatar").innerHTML = avatarSVG(state.character, mood);
  $("#scenePortrait").innerHTML = avatarSVG(state.character, mood);
  if (changed) {
    ["hudAvatar", "scenePortrait"].forEach((id) => {
      const el = $(`#${id}`);
      el.classList.remove("mood-change");
      void el.offsetWidth; // reinicia la animación
      el.classList.add("mood-change");
    });
  }
}
function updateHud(mood) {
  $("#barRed").style.width = clamp(state.stats.red) + "%";
  $("#barBienestar").style.width = clamp(state.stats.bienestar) + "%";
  $("#barConocimiento").style.width = clamp(state.stats.conocimiento) + "%";
  if (mood) setAvatarMood(mood);
  if (state.stats.red >= 75) unlockAchievement("red_solida");
  saveSessionSnapshot();
}

/* ---------------- RENDER NODOS ---------------- */
function renderNode() {
  const node = state.scenario.nodes[state.nodeId];
  const mood = node.mood || "tranquila";
  updateHud(mood);
  clearChatTimers();
  if (window.speechSynthesis) speechSynthesis.cancel();

  ["choicesWrap", "networkNode", "chatNode", "minigameNode", "tallyNode", "feedbackWrap"].forEach((id) => $(`#${id}`).classList.add("hidden"));
  $("#choicesWrap").innerHTML = "";

  if (node.bg) $("#sceneBg").style.background = BG_STYLES[node.bg] || BG_STYLES["scene-night"];

  if (node.type === "end") {
    computeEnding();
    return;
  }

  $("#speakerName").textContent = node.speaker || "";
  let sceneText = node.type === "random" ? "" : (node.text || "");
  if (node.crossRefs) {
    const matched = node.crossRefs.find((ref) => state.sessionHistory.includes(ref.if));
    if (matched) sceneText += "\n\n" + matched.text;
  }
  $("#sceneText").textContent = sceneText;
  $("#btnListen").classList.remove("hidden");

  if (state.speechAutoplay && node.type !== "random" && sceneText) speakText(sceneText, node.speaker);

  if (node.type === "story") {
    renderStoryNode(node);
  } else if (node.type === "choice") {
    if (state.playMode === "taller") renderTallyNode(node);
    else renderChoiceNode(node);
  } else if (node.type === "network") {
    renderNetworkNode(node);
  } else if (node.type === "chat") {
    renderChatNode(node);
  } else if (node.type === "minigame") {
    renderMinigameNode(node);
  } else if (node.type === "random") {
    renderRandomNode(node);
  }
}

/* ---------------- EVENTO ALEATORIO (rejugabilidad) ---------------- */
function renderRandomNode(node) {
  const pool = (node.variants || []).concat(node.includeWorldEvents ? WORLD_EVENTS : []);
  const variant = pool[Math.floor(Math.random() * pool.length)];
  $("#sceneText").textContent = variant.text;
  if (state.speechAutoplay) speakText(variant.text, node.speaker);

  if (variant.effects) {
    const eff = variant.effects;
    if (eff.red) state.stats.red = clamp(state.stats.red + eff.red);
    if (eff.bienestar) state.stats.bienestar = clamp(state.stats.bienestar + eff.bienestar);
    if (eff.conocimiento) state.stats.conocimiento = clamp(state.stats.conocimiento + eff.conocimiento);
    if (eff.contact && state.contacts[eff.contact.id]) {
      state.contacts[eff.contact.id].trust = clamp(state.contacts[eff.contact.id].trust + eff.contact.delta);
    }
    updateHud();
  }

  $("#choicesWrap").classList.remove("hidden");
  const btn = document.createElement("button");
  btn.className = "choice-btn text-center font-semibold";
  btn.textContent = "Continuar →";
  btn.addEventListener("click", () => goTo(node.next));
  $("#choicesWrap").appendChild(btn);
}

function goTo(nextId) {
  state.nodeId = nextId;
  renderNode();
}

function renderStoryNode(node) {
  $("#choicesWrap").classList.remove("hidden");
  const btn = document.createElement("button");
  btn.className = "choice-btn text-center font-semibold";
  btn.textContent = "Continuar →";
  btn.addEventListener("click", () => goTo(node.next));
  $("#choicesWrap").appendChild(btn);
}

function renderChoiceNode(node) {
  $("#choicesWrap").classList.remove("hidden");
  node.choices.forEach((ch) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.innerHTML = `<span class="tag">${ch.tag}</span>${ch.text}`;
    btn.addEventListener("click", () => applyChoice(ch));
    $("#choicesWrap").appendChild(btn);
  });
}

/* ---------------- ELECCIONES + RETROALIMENTACIÓN ---------------- */
function applyChoice(choice, prefixText) {
  state.decisionsLog.push({ character: state.character.id, node: state.nodeId, choice: choice.tag });
  if (choice.community) state.communityFlag = true;
  const eff = choice.effects || {};
  if (eff.red) state.stats.red = clamp(state.stats.red + eff.red);
  if (eff.bienestar) state.stats.bienestar = clamp(state.stats.bienestar + eff.bienestar);
  if (eff.conocimiento) state.stats.conocimiento = clamp(state.stats.conocimiento + eff.conocimiento);
  if (eff.contact && state.contacts[eff.contact.id]) {
    state.contacts[eff.contact.id].trust = clamp(state.contacts[eff.contact.id].trust + eff.contact.delta);
  }
  if (choice.unlock) {
    const wasEmpty = state.unlockedResources.size === 0;
    state.unlockedResources.add(choice.unlock);
    if (wasEmpty) unlockAchievement("ruta_activada");
  }

  updateHud();
  const text = prefixText ? `${prefixText}\n\n${choice.feedback}` : choice.feedback;
  showFeedback(text, choice.next);
}

function showFeedback(text, next) {
  window.MRA_AUDIO?.play("decision");
  $("#feedbackText").textContent = text;
  $("#feedbackWrap").classList.remove("hidden");
  $("#choicesWrap").classList.add("hidden");
  $("#tallyNode").classList.add("hidden");
  const btn = $("#feedbackContinueBtn");
  const clone = btn.cloneNode(true);
  btn.parentNode.replaceChild(clone, btn);
  clone.addEventListener("click", () => goTo(next));
}

/* ---------------- MODO TALLER (conteo manual) ---------------- */
function renderTallyNode(node) {
  $("#tallyNode").classList.remove("hidden");
  const wrap = $("#tallyOptionsWrap");
  wrap.innerHTML = "";
  node.choices.forEach((ch, i) => {
    const row = document.createElement("div");
    row.className = "tally-row";
    row.innerHTML = `
      <div class="flex-1 min-w-0">
        <span class="tag">${ch.tag}</span>
        <p class="text-sm mt-1">${ch.text}</p>
      </div>
      <div class="tally-stepper">
        <button type="button" data-dir="-1">−</button>
        <input type="number" min="0" value="0" data-idx="${i}" readonly />
        <button type="button" data-dir="1">+</button>
      </div>`;
    const input = row.querySelector("input");
    row.querySelectorAll("button").forEach((b) => {
      b.addEventListener("click", () => {
        const dir = parseInt(b.dataset.dir, 10);
        input.value = Math.max(0, parseInt(input.value, 10) + dir);
      });
    });
    wrap.appendChild(row);
  });

  const confirmBtn = $("#tallyConfirmBtn");
  const clone = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(clone, confirmBtn);
  clone.addEventListener("click", () => {
    const counts = [...wrap.querySelectorAll("input")].map((i) => parseInt(i.value, 10));
    let winnerIdx = 0;
    counts.forEach((c, i) => { if (c > counts[winnerIdx]) winnerIdx = i; });
    const total = counts.reduce((a, b) => a + b, 0);
    const breakdown = node.choices.map((ch, i) => `${ch.tag}: ${counts[i]}`).join(" · ");
    const summary = total > 0
      ? `📊 Votación de la sala (${total} votos) → ${breakdown}. Ganó: "${node.choices[winnerIdx].tag}".`
      : `📊 No se registraron votos — se avanza con la primera opción como ejemplo.`;
    applyChoice(node.choices[winnerIdx], summary);
  });
}

/* ---------------- RED DE APOYO (nodo narrativo) ---------------- */
const CONTACT_RESOURCE_MAP = {
  lineapurpura: "lineapurpura", lineapurpura2: "lineapurpura",
  comisaria: "comisaria", talentohumano: "talentohumano",
  caivirtual: "caivirtual", casaigualdad2: "casaigualdad",
};

function renderNetworkNode(node) {
  $("#networkNode").classList.remove("hidden");
  const wrap = $("#networkOptionsWrap");
  wrap.innerHTML = "";
  $("#networkAdvice").classList.add("hidden");

  node.options.forEach((cid) => {
    const c = state.contacts[cid];
    if (!c) return;
    const btn = document.createElement("button");
    btn.className = "contact-card";
    btn.innerHTML = `
      <div class="flex items-center gap-2.5">
        <span class="text-2xl">${c.avatar}</span>
        <div class="min-w-0 flex-1">
          <p class="font-semibold text-sm">${c.name}</p>
          <div class="stat-bar mt-1"><div class="stat-fill bg-fuchsia-400" style="width:${c.trust}%"></div></div>
        </div>
      </div>`;
    btn.addEventListener("click", () => consultContact(cid, node));
    wrap.appendChild(btn);
  });

  const contBtn = $("#networkContinueBtn");
  const clone = contBtn.cloneNode(true);
  contBtn.parentNode.replaceChild(clone, contBtn);
  clone.addEventListener("click", () => goTo(node.next));
}

const TIER_MOOD = { high: "aliviada", mid: "preocupada", low: "triste" };

function consultContact(cid, node) {
  const c = state.contacts[cid];
  const tier = c.trust >= 67 ? "high" : c.trust >= 34 ? "mid" : "low";
  $("#networkAdvice").classList.remove("hidden");
  $("#networkAdvice").innerHTML = `<span class="text-lg">${c.avatar}</span> <span class="font-semibold">${c.name}:</span> ${c[tier]}`;
  setAvatarMood(TIER_MOOD[tier]);

  if (!state.anyContactConsulted) {
    state.anyContactConsulted = true;
    unlockAchievement("primer_contacto");
  }

  if (!state.consultedOnce[cid]) {
    state.consultedOnce[cid] = true;
    state.stats.conocimiento = clamp(state.stats.conocimiento + 5);
    c.trust = clamp(c.trust + 5);
    if (CONTACT_RESOURCE_MAP[cid]) {
      const wasEmpty = state.unlockedResources.size === 0;
      state.unlockedResources.add(CONTACT_RESOURCE_MAP[cid]);
      if (wasEmpty) unlockAchievement("ruta_activada");
    }
    updateHud();
    renderNetworkNode(node);
    $("#networkAdvice").classList.remove("hidden");
    $("#networkAdvice").innerHTML = `<span class="text-lg">${c.avatar}</span> <span class="font-semibold">${c.name}:</span> ${c[tier]}`;
  }
}

/* ---------------- CHAT ESTILO WHATSAPP ---------------- */
function clearChatTimers() {
  state.chatTimers.forEach((t) => clearTimeout(t));
  state.chatTimers = [];
}

function renderChatNode(node) {
  $("#chatNode").classList.remove("hidden");
  $("#btnListen").classList.add("hidden");
  const bubbles = $("#chatBubbles");
  bubbles.innerHTML = "";
  $("#chatContinueBtn").classList.add("hidden");

  node.messages.forEach((msg, i) => {
    const t = setTimeout(() => {
      const div = document.createElement("div");
      div.className = `chat-bubble ${msg.from === "me" ? "me" : "them"}`;
      div.textContent = msg.text;
      bubbles.appendChild(div);
      bubbles.scrollTop = bubbles.scrollHeight;
      if (i === node.messages.length - 1) {
        const contBtn = $("#chatContinueBtn");
        contBtn.classList.remove("hidden");
        const clone = contBtn.cloneNode(true);
        contBtn.parentNode.replaceChild(clone, contBtn);
        clone.addEventListener("click", () => goTo(node.next));
      }
    }, i * 900);
    state.chatTimers.push(t);
  });
}

/* ---------------- MINIJUEGO: IDENTIFICAR SEÑALES ---------------- */
function renderMinigameNode(node) {
  $("#minigameNode").classList.remove("hidden");
  $("#minigameInstructions").textContent = node.instructions;
  const wrap = $("#minigameItems");
  wrap.innerHTML = "";
  const selected = new Set();
  let checked = false;

  node.items.forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "flag-chip";
    btn.innerHTML = `<span>🚩</span><span>${item.text}</span>`;
    btn.addEventListener("click", () => {
      if (checked) return;
      if (selected.has(item.id)) { selected.delete(item.id); btn.classList.remove("selected"); }
      else { selected.add(item.id); btn.classList.add("selected"); }
    });
    btn.dataset.id = item.id;
    wrap.appendChild(btn);
  });

  const checkBtn = $("#minigameCheckBtn");
  const contBtn = $("#minigameContinueBtn");
  checkBtn.classList.remove("hidden");
  contBtn.classList.add("hidden");

  const checkClone = checkBtn.cloneNode(true);
  checkBtn.parentNode.replaceChild(checkClone, checkBtn);
  checkClone.addEventListener("click", () => {
    checked = true;
    let correctCount = 0;
    node.items.forEach((item) => {
      const chip = wrap.querySelector(`[data-id="${item.id}"]`);
      const isSelected = selected.has(item.id);
      chip.classList.remove("selected");
      if (item.isFlag && isSelected) { chip.classList.add("correct"); correctCount++; state.signalsLog.push(item.text); }
      else if (item.isFlag && !isSelected) { chip.classList.add("incorrect"); state.missedSignalsLog.push(item.text); }
      else if (!item.isFlag && isSelected) { chip.classList.add("incorrect"); }
      const ex = document.createElement("span");
      ex.className = "explain";
      ex.textContent = item.explain;
      chip.appendChild(ex);
    });
    if (correctCount > 0) {
      state.stats.conocimiento = clamp(state.stats.conocimiento + correctCount * 5);
      updateHud();
      unlockAchievement("senal_reconocida");
    }
    const totalFlags = node.items.filter((i) => i.isFlag).length;
    window.MRA_NEXA?.onMinigameResult(correctCount, totalFlags);
    checkClone.classList.add("hidden");
    contBtn.classList.remove("hidden");
    const contClone = contBtn.cloneNode(true);
    contBtn.parentNode.replaceChild(contClone, contBtn);
    contClone.addEventListener("click", () => goTo(node.next));
  });
}

/* ---------------- NARRACIÓN POR VOZ (Web Speech API) ---------------- */
function pickSpanishVoice() {
  if (!window.speechSynthesis) return null;
  const voices = speechSynthesis.getVoices();
  return voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("es")) || voices[0] || null;
}
const VOICE_PROFILES = [
  { test: /jairo|ricardo|andrés|andres/i, pitch: 0.72, rate: 0.92 },                       // agresores
  { test: /narrad/i, pitch: 1.0, rate: 0.95 },                                              // narradora
  { test: /línea púrpura|comisaría|cai virtual|casa de igualdad|talento humano|policía/i,
    pitch: 0.95, rate: 0.88 },                                                              // institucional
  { test: /hermana|mamá|madre|amiga|vecina|colega|psicóloga|lideresa/i, pitch: 1.22, rate: 1.05 }, // red cercana
];
function voiceProfileFor(speaker) {
  const found = VOICE_PROFILES.find((p) => p.test.test(speaker));
  if (found) return found;
  // por descarte: si no matchea ninguna categoría, asumimos que es la protagonista
  return { pitch: 1.1, rate: 1.0 };
}
function speakText(text, speaker = "") {
  if (!window.speechSynthesis || !text) return;
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text.replace(/[«»]/g, ""));
  const voice = pickSpanishVoice();
  if (voice) utter.voice = voice;
  utter.lang = "es-CO";
  const profile = voiceProfileFor(speaker);
  utter.pitch = profile.pitch;
  utter.rate = profile.rate * (state.a11y.rate || 1);
  speechSynthesis.speak(utter);
}
$("#btnListen").addEventListener("click", () => {
  const node = state.scenario.nodes[state.nodeId];
  if (node && node.text) speakText(node.text, node.speaker);
});
$("#btnSpeech").addEventListener("click", () => {
  state.speechAutoplay = !state.speechAutoplay;
  $("#btnSpeech").classList.toggle("!bg-fuchsia-500/30", state.speechAutoplay);
  $("#btnSpeech").classList.toggle("!border-fuchsia-400", state.speechAutoplay);
  if (!state.speechAutoplay && window.speechSynthesis) speechSynthesis.cancel();
});
if (window.speechSynthesis) speechSynthesis.onvoiceschanged = () => {};
$("#btnSpeech").classList.toggle("!bg-fuchsia-500/30", state.speechAutoplay);
$("#btnSpeech").classList.toggle("!border-fuchsia-400", state.speechAutoplay);

/* ---------------- LOGROS ---------------- */
function unlockAchievement(id) {
  if (state.achievements.has(id)) return;
  state.achievements.add(id);
  window.MRA_AUDIO?.play("achievement");
  window.MRA_NEXA?.onAchievement(id);
  const a = ACHIEVEMENTS[id];
  const toast = $("#achievementToast");
  toast.innerHTML = `<span class="text-lg">${a.icon}</span><span>${a.title}</span>`;
  toast.classList.remove("hidden");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.add("hidden"), 3200);
}

/* ---------------- FINAL ---------------- */
function computeEnding() {
  clearSessionSnapshot();
  unlockAchievement("defensora");
  if (!state.sessionHistory.includes(state.character.id)) state.sessionHistory.push(state.character.id);
  const { red, bienestar, conocimiento } = state.stats;
  const score = (red + bienestar + conocimiento) / 3;
  const ending = (state.communityFlag && score >= 65)
    ? ENDINGS.find((e) => e.id === "liderazgo")
    : ENDINGS.filter((e) => e.id !== "liderazgo").find((e) => score >= e.min);
  const epilogue = CHARACTER_EPILOGUES[state.character.id]?.[ending.id] || "";

  $("#endingIcon").textContent = ending.icon;
  $("#endingIcon").className = `mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl text-4xl bg-gradient-to-br ${ending.color}`;
  $("#endingTitle").textContent = ending.title;
  $("#endingText").textContent = ending.text + (epilogue ? "  " + epilogue : "");
  $("#endStatRed").textContent = Math.round(red) + "%";
  $("#endStatBienestar").textContent = Math.round(bienestar) + "%";
  $("#endStatConocimiento").textContent = Math.round(conocimiento) + "%";

  const q = $("#debriefQuestions");
  q.innerHTML = "";
  DEBRIEF_QUESTIONS.forEach((question) => {
    const li = document.createElement("li");
    li.textContent = question;
    q.appendChild(li);
  });

  renderAchievements();
  renderActionPlan(ending);
  sendResultsEmail(ending);

  if (window.MRA_UI && window.MRA_UI.onCharacterEnding) {
    window.MRA_UI.onCharacterEnding(state.character.id, ending, state.stats, [...state.achievements], [...state.unlockedResources]);
  }

  showScreen("screen-ending");
}

function sendResultsEmail(ending) {
  const statusEl = $("#syncStatus");
  if (!isBackendConfigured()) {
    statusEl.textContent = "";
    return;
  }
  const hasEmail = !!state.player.email;
  statusEl.textContent = hasEmail
    ? "⏳ Enviando tus resultados por correo…"
    : "⏳ Registrando tu resultado de forma anónima para las estadísticas del taller…";
  sendToBackend({
    action: "finish",
    timestamp: new Date().toISOString(),
    name: state.player.name,
    email: state.player.email,
    ageRange: state.player.age,
    character: state.character.name,
    violenceType: state.character.violenceType,
    ending: ending.title,
    stats: state.stats,
    achievements: [...state.achievements],
    decisions: state.decisionsLog,
    signalsIdentified: [...new Set(state.signalsLog)],
    signalsMissed: [...new Set(state.missedSignalsLog)],
  }).then((res) => {
    if (!res.ok) { statusEl.textContent = "⚠️ No se pudo sincronizar (revisa la conexión a internet). Puedes descargar tu ficha igualmente."; return; }
    statusEl.textContent = hasEmail
      ? "✅ Te enviamos un correo con el resumen de tus insignias."
      : "✅ Resultado registrado de forma anónima. Gracias por jugar.";
  });
}

function renderAchievements() {
  const wrap = $("#achievementsList");
  wrap.innerHTML = "";
  Object.entries(ACHIEVEMENTS).forEach(([id, a]) => {
    const unlocked = state.achievements.has(id);
    const div = document.createElement("div");
    div.className = "badge-card" + (unlocked ? "" : " locked");
    div.innerHTML = `<span class="text-xl">${a.icon}</span><div><p class="font-bold leading-tight">${a.title}</p><p class="text-[11px] text-slate-400 leading-tight">${a.desc}</p></div>`;
    wrap.appendChild(div);
  });
}

function renderActionPlan(ending) {
  $("#planCharName").textContent = `${state.character.name} · ${state.character.violenceType}`;

  const topContacts = Object.values(state.contacts).sort((a, b) => b.trust - a.trust).slice(0, 3);
  const contactsEl = $("#planContacts");
  contactsEl.innerHTML = topContacts.map((c) => `<li>• ${c.name} — confianza ${c.trust}%</li>`).join("") || "<li>Ninguno consultado todavía.</li>";

  const resourcesEl = $("#planResources");
  const resArr = [...state.unlockedResources];
  resourcesEl.innerHTML = resArr.length
    ? resArr.map((k) => `<li>• ${RESOURCES[k].icon} ${RESOURCES[k].name} — ${RESOURCES[k].contact}</li>`).join("")
    : "<li>Aún no descubriste rutas institucionales en esta partida.</li>";

  const signalsEl = $("#planSignals");
  const uniqSignals = [...new Set(state.signalsLog)];
  signalsEl.innerHTML = uniqSignals.length
    ? uniqSignals.map((s) => `<li>• ${s}</li>`).join("")
    : "<li>Sigue practicando identificar señales de alerta en tu próxima partida.</li>";
}

$("#btnPrintPlan").addEventListener("click", () => window.print());
$("#btnReplaySame").addEventListener("click", () => startCharacter(state.character.id));
$("#btnReplayOther").addEventListener("click", () => {
  renderCharacterSelect();
  showScreen("screen-select");
});
$("#btnViewResourcesEnd").addEventListener("click", () => openResourcesModal());
$("#btnViewNetworkEnd").addEventListener("click", () => openNetworkMapModal());

/* ---------------- MODAL: RECURSOS ---------------- */
function openResourcesModal() {
  const list = $("#resourcesList");
  list.innerHTML = "";
  const inGame = !!state.character;
  Object.entries(RESOURCES).forEach(([key, r]) => {
    const locked = inGame && !state.unlockedResources.has(key) && !isAlwaysOn(key);
    const div = document.createElement("div");
    div.className = "resource-card" + (locked ? " locked" : "");
    div.innerHTML = `
      <div class="flex items-start gap-3">
        <span class="text-2xl">${r.icon}</span>
        <div class="min-w-0">
          <p class="font-bold text-sm">${r.name} ${locked ? '<span class="text-[10px] text-slate-400 font-normal">(descúbrelo jugando)</span>' : ""}</p>
          <p class="text-sm text-slate-300 mt-1 leading-relaxed">${r.info}</p>
          <p class="text-xs text-fuchsia-300 mt-1.5 font-semibold">${r.contact}</p>
        </div>
      </div>`;
    list.appendChild(div);
  });
  $("#modalResources").classList.remove("hidden");
}
function isAlwaysOn(key) {
  return ["linea123", "linea155", "fiscalia"].includes(key);
}
$("#btnResources").addEventListener("click", () => openResourcesModal());
$("#menuResources").addEventListener("click", () => { closeModals(); openResourcesModal(); });

/* ---------------- MODAL: MAPA DE RED ---------------- */
function openNetworkMapModal() {
  renderNetworkMapSVG();
  renderNetworkMapListView();
  $("#modalNetwork").classList.remove("hidden");
}
function renderNetworkMapSVG() {
  const contacts = Object.values(state.contacts);
  const n = contacts.length;
  const cx = 150, cy = 150, r = 100;
  let svg = `<svg viewBox="0 0 300 300" width="280" height="280">`;
  const positions = contacts.map((c, i) => {
    const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
    return { c, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  positions.forEach((p) => {
    svg += `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="${TRUST_COLOR(p.c.trust)}" stroke-width="3" opacity="0.75"/>`;
  });
  svg += `<circle cx="${cx}" cy="${cy}" r="26" fill="#d946ef"/><text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="22">🙋</text>`;
  positions.forEach((p) => {
    svg += `<circle cx="${p.x}" cy="${p.y}" r="22" fill="#191627" stroke="${TRUST_COLOR(p.c.trust)}" stroke-width="3"/>`;
    svg += `<text x="${p.x}" y="${p.y + 6}" text-anchor="middle" font-size="20">${p.c.avatar}</text>`;
    const labelY = p.y + (p.y > cy ? 38 : -32);
    svg += `<text x="${p.x}" y="${labelY}" text-anchor="middle" font-size="10" fill="#cbd5e1">${p.c.name.split(",")[0]}</text>`;
  });
  svg += `</svg>`;
  $("#networkMapWrap").innerHTML = svg;
}
function renderNetworkMapListView() {
  const list = $("#networkMapList");
  list.innerHTML = "";
  Object.values(state.contacts).forEach((c) => {
    const div = document.createElement("div");
    div.className = "resource-card";
    div.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-2xl">${c.avatar}</span>
        <div class="min-w-0 flex-1">
          <p class="font-bold text-sm">${c.name}</p>
          <div class="stat-bar w-full mt-1.5" style="width:100%"><div class="stat-fill" style="width:${c.trust}%;background:${TRUST_COLOR(c.trust)}"></div></div>
          <p class="text-[11px] text-slate-400 mt-1">Confianza: ${c.trust}%</p>
        </div>
      </div>`;
    list.appendChild(div);
  });
}
$("#btnNetwork").addEventListener("click", openNetworkMapModal);

/* ---------------- MODAL: MENÚ ---------------- */
$("#btnMenu").addEventListener("click", () => $("#modalMenu").classList.remove("hidden"));
$("#menuRestartChar").addEventListener("click", () => { closeModals(); startCharacter(state.character.id); });
$("#menuChangeChar").addEventListener("click", () => { closeModals(); renderCharacterSelect(); showScreen("screen-select"); });

function closeModals() {
  $all(".modal-backdrop").forEach((m) => m.classList.add("hidden"));
}
$all("[data-close-modal]").forEach((btn) => btn.addEventListener("click", closeModals));
$all(".modal-backdrop").forEach((m) => m.addEventListener("click", (e) => { if (e.target === m) closeModals(); }));

/* ---------------- ACCESIBILIDAD ---------------- */
$("#btnA11y").addEventListener("click", () => $("#modalA11y").classList.remove("hidden"));
$("#menuA11y").addEventListener("click", () => { closeModals(); $("#modalA11y").classList.remove("hidden"); });

$all(".a11y-opt-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.a11y.fontScale = btn.dataset.fontscale;
    document.body.classList.remove("text-scale-sm", "text-scale-lg");
    if (state.a11y.fontScale !== "normal") document.body.classList.add(`text-scale-${state.a11y.fontScale}`);
    $all(".a11y-opt-btn").forEach((b) => b.classList.toggle("active", b === btn));
  });
});
$all('.a11y-opt-btn[data-fontscale="normal"]').forEach((b) => b.classList.add("active"));

$("#btnHighContrast").addEventListener("click", () => {
  state.a11y.highContrast = !state.a11y.highContrast;
  document.body.classList.toggle("high-contrast", state.a11y.highContrast);
  $("#btnHighContrast").setAttribute("aria-checked", String(state.a11y.highContrast));
});

$("#rateSlider").addEventListener("input", (e) => {
  state.a11y.rate = parseFloat(e.target.value);
  $("#rateValue").textContent = state.a11y.rate.toFixed(1) + "×";
});

/* ---------------- REANUDAR PARTIDA (sessionStorage, no localStorage) ----------------
   sessionStorage se borra automáticamente al cerrar la pestaña o el navegador — a
   diferencia de localStorage, no deja rastro persistente en un equipo compartido. */
const SESSION_KEY = "mra_sesion_en_curso";

function saveSessionSnapshot() {
  if (!state.character) return;
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      characterId: state.character.id,
      nodeId: state.nodeId,
      stats: state.stats,
      contacts: state.contacts,
      consultedOnce: state.consultedOnce,
      unlockedResources: [...state.unlockedResources],
      playMode: state.playMode,
      achievements: [...state.achievements],
      signalsLog: state.signalsLog,
      missedSignalsLog: state.missedSignalsLog,
      decisionsLog: state.decisionsLog,
      anyContactConsulted: state.anyContactConsulted,
      player: state.player,
    }));
  } catch (err) { /* almacenamiento no disponible: seguimos sin guardar, no es crítico */ }
}
function clearSessionSnapshot() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch (err) {}
}
function loadSessionSnapshot() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) { return null; }
}

function checkForResumableSession() {
  const snap = loadSessionSnapshot();
  if (!snap) return;
  const c = CHARACTERS.find((x) => x.id === snap.characterId);
  if (!c) return;
  $("#resumeCharName").textContent = c.name;
  $("#resumeBanner").classList.remove("hidden");
  $("#resumeContinueBtn").addEventListener("click", () => resumeSession(snap, c), { once: true });
  $("#resumeDiscardBtn").addEventListener("click", () => { clearSessionSnapshot(); $("#resumeBanner").classList.add("hidden"); }, { once: true });
}
function resumeSession(snap, c) {
  state.character = c;
  state.scenario = SCENARIOS[c.scenarioId];
  state.nodeId = snap.nodeId;
  state.stats = snap.stats;
  state.contacts = snap.contacts;
  state.consultedOnce = snap.consultedOnce;
  state.unlockedResources = new Set(snap.unlockedResources);
  state.playMode = snap.playMode;
  state.achievements = new Set(snap.achievements);
  state.signalsLog = snap.signalsLog || [];
  state.missedSignalsLog = snap.missedSignalsLog || [];
  state.decisionsLog = snap.decisionsLog || [];
  state.anyContactConsulted = snap.anyContactConsulted;
  state.player = snap.player || { name: "", age: "", email: "" };
  state.lastMood = null;
  $("#hudName").textContent = c.name;
  $("#hudScenario").textContent = c.violenceType;
  showScreen("screen-game");
  renderNode();
}
$("#menuClearData").addEventListener("click", () => {
  clearSessionSnapshot();
  closeModals();
});

checkForResumableSession();

/* Gancho de depuración: engine.js es un módulo ES (alcance propio),
   así que estas referencias no son globales por defecto. Útil para
   soporte técnico y pruebas — no afecta el funcionamiento del juego. */
window.__game = {
  state, goTo, startCharacter, renderCharacterSelect, applyChoice, computeEnding,
  showScreen, renderNode, CHARACTERS, SCENARIOS, CONTACTS, ENDINGS, CHAPTERS,
};
