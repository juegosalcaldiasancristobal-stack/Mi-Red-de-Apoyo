/* ============================================================
   MI RED DE APOYO — Orquestador de la consola híbrida
   --------------------------------------------------------------
   Conecta el mapa mundial (worldmap.js) con la novela visual
   (engine.js, sin tocar su lógica interna) y agrega las pantallas
   nuevas: mapa, red tejida final y panel de facilitadora. engine.js
   llama a window.MRA_UI en dos puntos únicamente (ver PLAN):
   tras el registro, y al calcular el final de una historia.
   ============================================================ */

const MRA_UI = (() => {
  const STORAGE_KEY = "mra_worldmap_progress";
  const ENDING_COLOR = { liderazgo: "#d946ef", fuerte: "#34d399", camino: "#a3e635", aprendiendo: "#fbbf24", sola: "#fb7185" };
  const ENDING_NAME = { liderazgo: "Liderazgo comunitario", fuerte: "Red tejida y fuerte", camino: "Camino en construcción", aprendiendo: "Aprendiendo a pedir ayuda", sola: "Nunca estás sola" };

  let progress = { charEndings: {}, achievements: new Set(), resources: new Set(), participantsTally: 0, lastBienestar: 50 };
  let mapLoaded = false;

  /* ---------------- PERSISTENCIA ---------------- */
  function saveProgress() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        charEndings: progress.charEndings,
        achievements: [...progress.achievements],
        resources: [...progress.resources],
        participantsTally: progress.participantsTally,
        lastBienestar: progress.lastBienestar,
        map: MRA_MAP.getSnapshot(),
      }));
    } catch (err) { /* almacenamiento no disponible: no es crítico */ }
  }
  function loadProgress() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const snap = JSON.parse(raw);
      progress.charEndings = snap.charEndings || {};
      progress.achievements = new Set(snap.achievements || []);
      progress.resources = new Set(snap.resources || []);
      progress.participantsTally = snap.participantsTally || 0;
      progress.lastBienestar = snap.lastBienestar || 50;
      MRA_MAP.restoreSnapshot(snap.map);
      applyRewards();
    } catch (err) { /* snapshot corrupto: seguimos con progreso vacío */ }
  }

  function applyRewards() {
    MRA_MAP.setRewards({
      aura: progress.lastBienestar >= 70,
      threads: progress.resources.size,
      book: progress.resources.size >= 3,
    });
  }

  /* ---------------- TRANSICIONES ENTRE CAPAS ---------------- */
  function ensureFadeEl() {
    let el = document.getElementById("mraScreenFade");
    if (!el) {
      el = document.createElement("div");
      el.id = "mraScreenFade";
      el.className = "screen-fade-white";
      document.body.appendChild(el);
    }
    return el;
  }

  function enterWorldMap() {
    document.querySelectorAll("[data-screen]").forEach((s) => s.classList.add("hidden"));
    document.getElementById("screen-worldmap").classList.remove("hidden");
    document.getElementById("mapGameContainer")?.classList.remove("door-closing");
    if (!mapLoaded) { loadProgress(); mapLoaded = true; }
    MRA_MAP.resume();
    window.MRA_NEXA?.welcomeIfFirstTime();
  }

  function enterCharacter(charId) {
    const mapContainer = document.getElementById("mapGameContainer");
    mapContainer?.classList.add("door-closing");
    window.MRA_AUDIO?.play("scenechange");
    setTimeout(() => {
      MRA_MAP.pause();
      saveProgress();
      window.__game.startCharacter(charId);
    }, 380);
  }

  function backToMap() {
    const fade = ensureFadeEl();
    requestAnimationFrame(() => fade.classList.add("active"));
    setTimeout(() => {
      showScreen("screen-worldmap");
      document.getElementById("mapGameContainer")?.classList.remove("door-closing");
      MRA_MAP.resume();
      setTimeout(() => fade.classList.remove("active"), 80);
    }, 480);
  }

  function onCharacterEnding(charId, ending, stats, achievements, resources) {
    progress.charEndings[charId] = ending.id;
    achievements.forEach((a) => progress.achievements.add(a));
    resources.forEach((r) => progress.resources.add(r));
    progress.lastBienestar = stats.bienestar;
    window.MRA_AUDIO?.play("ending_" + ending.id);
    window.MRA_NEXA?.onEnding(ending.id);
    MRA_MAP.markDoorCompleted(charId);
    applyRewards();
    saveProgress();
    const btn = document.getElementById("btnBackToMap");
    if (btn) { btn.classList.remove("hidden"); btn.onclick = backToMap; }
  }

  function showComingSoon() {
    document.getElementById("modalComingSoon")?.classList.remove("hidden");
  }

  /* ---------------- PANTALLA: RED TEJIDA FINAL ---------------- */
  function renderFinalNetworkGraph() {
    const entries = Object.entries(progress.charEndings);
    const wrap = document.getElementById("finalNetworkGraphWrap");
    if (!wrap) return;
    const n = Math.max(entries.length, 1);
    const cx = 160, cy = 160, r = 115;
    const positions = entries.map(([charId, endingId], i) => {
      const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
      return { charId, endingId, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    });
    let svg = `<svg viewBox="0 0 320 320" width="300" height="300" role="img" aria-label="Grafo de tu red de apoyo">`;
    positions.forEach((p) => {
      svg += `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="${ENDING_COLOR[p.endingId] || "#a78bfa"}" stroke-width="3" opacity="0.8"/>`;
    });
    svg += `<circle cx="${cx}" cy="${cy}" r="28" fill="#d946ef"/><text x="${cx}" y="${cy + 6}" text-anchor="middle" font-size="24">🙋</text>`;
    positions.forEach((p) => {
      const c = CHARACTERS.find((x) => x.id === p.charId);
      svg += `<circle cx="${p.x}" cy="${p.y}" r="24" fill="#191627" stroke="${ENDING_COLOR[p.endingId] || "#a78bfa"}" stroke-width="3"/>`;
      svg += `<text x="${p.x}" y="${p.y + 6}" text-anchor="middle" font-size="20">${c ? c.avatar : "👤"}</text>`;
      const labelY = p.y + (p.y > cy ? 40 : -32);
      svg += `<text x="${p.x}" y="${labelY}" text-anchor="middle" class="final-node-label">${c ? c.name.split(" ")[0] : p.charId}</text>`;
    });
    svg += `</svg>`;
    wrap.innerHTML = svg;
  }

  function renderFinalStats() {
    const entries = Object.entries(progress.charEndings);
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set("finalStatResources", `${progress.resources.size}/9`);
    set("finalStatAchievements", `${progress.achievements.size}/5`);
    set("finalStatStars", Math.round(MRA_MAP.getScore() / 10));
    set("finalStatChars", `${entries.length}/8`);

    const tierCounts = {};
    entries.forEach(([, endingId]) => { tierCounts[endingId] = (tierCounts[endingId] || 0) + 1; });
    const breakdownEl = document.getElementById("finalEndingBreakdown");
    if (breakdownEl) {
      breakdownEl.innerHTML = Object.entries(tierCounts)
        .map(([id, count]) => `<span class="inline-block mr-3 mb-1">${ENDING_NAME[id] || id}: <strong>${count}</strong></span>`)
        .join("") || "<span>Aún no hay finales registrados.</span>";
    }
  }

  function renderFinalPrintable() {
    const nameEl = document.getElementById("finalPlanPlayerName");
    if (nameEl) nameEl.textContent = window.__game.state.player.name || "Participante";
    const charsList = document.getElementById("finalPlanChars");
    if (charsList) {
      charsList.innerHTML = Object.entries(progress.charEndings).map(([charId, endingId]) => {
        const c = CHARACTERS.find((x) => x.id === charId);
        return `<li>• ${c ? c.name : charId} — ${ENDING_NAME[endingId] || endingId}</li>`;
      }).join("") || "<li>Ninguna historia completada todavía.</li>";
    }
    const resList = document.getElementById("finalPlanResources");
    if (resList) {
      resList.innerHTML = [...progress.resources].map((k) => `<li>• ${RESOURCES[k]?.icon || ""} ${RESOURCES[k]?.name || k} — ${RESOURCES[k]?.contact || ""}</li>`).join("")
        || "<li>Aún no se descubrieron rutas institucionales.</li>";
    }
  }

  function goFinalNetwork() {
    renderFinalNetworkGraph();
    renderFinalStats();
    renderFinalPrintable();
    showScreen("screen-finalnetwork");
  }

  /* ---------------- PANEL DE FACILITADORA ---------------- */
  let facilitatorClicks = [];
  function bindFacilitatorTrigger() {
    document.getElementById("introLogo")?.addEventListener("click", () => {
      const now = Date.now();
      facilitatorClicks = facilitatorClicks.filter((t) => now - t < 2000);
      facilitatorClicks.push(now);
      if (facilitatorClicks.length >= 5) { facilitatorClicks = []; openFacilitatorPanel(); }
    });
  }
  function openFacilitatorPanel() {
    renderFacilitatorCharList();
    const wrap = document.getElementById("facDebriefList");
    if (wrap) wrap.innerHTML = DEBRIEF_QUESTIONS.map((q) => `<li>${q}</li>`).join("");
    renderFacilitatorDecisions();
    const countEl = document.getElementById("facParticipantsCount");
    if (countEl) countEl.value = progress.participantsTally;
    document.getElementById("modalFacilitator")?.classList.remove("hidden");
  }
  function renderFacilitatorCharList() {
    const wrap = document.getElementById("facilitatorCharList");
    if (!wrap) return;
    wrap.innerHTML = "";
    CHARACTERS.forEach((c) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "contact-card !text-left";
      btn.innerHTML = `<p class="font-semibold text-sm">${c.name}</p><p class="text-[11px] text-slate-400">${c.tag}</p>`;
      btn.addEventListener("click", () => { closeModals(); window.__game.startCharacter(c.id); });
      wrap.appendChild(btn);
    });
  }
  function renderFacilitatorDecisions() {
    const wrap = document.getElementById("facDecisionsSummary");
    if (!wrap) return;
    const log = window.__game.state.decisionsLog || [];
    if (!log.length) { wrap.innerHTML = '<p class="text-slate-400">Aún no hay decisiones registradas en esta sesión.</p>'; return; }
    const byChar = {};
    log.forEach((d) => { (byChar[d.character] = byChar[d.character] || []).push(d.choice); });
    wrap.innerHTML = Object.entries(byChar).map(([charId, choices]) => {
      const c = CHARACTERS.find((x) => x.id === charId);
      return `<p>• <strong>${c ? c.name : charId}:</strong> ${choices.join(" · ")}</p>`;
    }).join("");
  }
  function bindFacilitatorControls() {
    const countEl = document.getElementById("facParticipantsCount");
    document.getElementById("facParticipantsMinus")?.addEventListener("click", () => {
      progress.participantsTally = Math.max(0, progress.participantsTally - 1);
      if (countEl) countEl.value = progress.participantsTally;
      saveProgress();
    });
    document.getElementById("facParticipantsPlus")?.addEventListener("click", () => {
      progress.participantsTally++;
      if (countEl) countEl.value = progress.participantsTally;
      saveProgress();
    });
    document.getElementById("facPrintPlan")?.addEventListener("click", () => window.print());
    document.getElementById("facProjectorMode")?.addEventListener("click", () => {
      document.body.classList.toggle("projector-mode");
    });
  }

  /* ---------------- CONTROLES DEL MAPA (HUD) ---------------- */
  function bindMapHud() {
    document.getElementById("btnMapMute")?.addEventListener("click", (e) => {
      const muted = window.MRA_AUDIO?.toggleMute();
      e.currentTarget.textContent = muted ? "🔇" : "🔊";
    });
    document.getElementById("btnMapResources")?.addEventListener("click", () => openResourcesModal());
    document.getElementById("btnMapAccessible")?.addEventListener("click", () => {
      renderCharacterSelect();
      showScreen("screen-select");
    });
    document.getElementById("btnBackToMapFromSelect")?.addEventListener("click", () => enterWorldMap());
    document.getElementById("btnGoFinalNetwork")?.addEventListener("click", goFinalNetwork);
    document.getElementById("btnPrintFinalPlan")?.addEventListener("click", () => window.print());
    document.getElementById("btnFinalReplay")?.addEventListener("click", () => {
      try { sessionStorage.removeItem(STORAGE_KEY); sessionStorage.removeItem("mra_sesion_en_curso"); } catch (err) {}
      window.location.reload();
    });
  }

  function init() {
    bindFacilitatorTrigger();
    bindFacilitatorControls();
    bindMapHud();
    if (window.MRA_AUDIO?.isMuted?.()) {
      const btn = document.getElementById("btnMapMute");
      if (btn) btn.textContent = "🔇";
    }
  }
  document.addEventListener("DOMContentLoaded", init);
  if (document.readyState !== "loading") init();

  return { enterWorldMap, enterCharacter, onCharacterEnding, showComingSoon };
})();

window.MRA_UI = MRA_UI;
