/* ============================================================
   MI RED DE APOYO — Motor de audio (Web Audio API, sin archivos)
   --------------------------------------------------------------
   Todo el sonido (SFX + música de fondo generativa) se sintetiza
   con osciladores. No conoce el resto del juego: expone
   window.MRA_AUDIO.play(nombre) / .startMusic(zona) / .toggleMute().
   Si este script no carga, el resto del juego sigue funcionando
   (todas las llamadas hacia acá son opt-chained en el resto de módulos).
   ============================================================ */

const MRA_AUDIO = (() => {
  const MUTE_KEY = "mra_audio_muted";
  let ctx = null, masterGain = null;
  let musicTimer = null;
  let muted = sessionStorage.getItem(MUTE_KEY) === "1";

  function ensureCtx() {
    if (!ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      ctx = new Ctx();
      masterGain = ctx.createGain();
      masterGain.gain.value = muted ? 0 : 1;
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone({ freq, start = 0, dur = 0.2, type = "sine", gain = 0.16, attack = 0.012, release }) {
    const c = ensureCtx();
    if (!c) return;
    const rel = release ?? dur * 0.6;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime + start);
    g.gain.setValueAtTime(0, c.currentTime + start);
    g.gain.linearRampToValueAtTime(gain, c.currentTime + start + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur + rel);
    osc.connect(g); g.connect(masterGain);
    osc.start(c.currentTime + start);
    osc.stop(c.currentTime + start + dur + rel + 0.05);
  }
  function glide({ from, to, start = 0, dur = 0.12, type = "sine", gain = 0.18 }) {
    const c = ensureCtx();
    if (!c) return;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, c.currentTime + start);
    osc.frequency.linearRampToValueAtTime(to, c.currentTime + start + dur);
    g.gain.setValueAtTime(gain, c.currentTime + start);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur + 0.05);
    osc.connect(g); g.connect(masterGain);
    osc.start(c.currentTime + start);
    osc.stop(c.currentTime + start + dur + 0.1);
  }

  const SFX = {
    jump: () => glide({ from: 261.63, to: 392.0, dur: 0.12, type: "square", gain: 0.12 }),
    star: () => tone({ freq: 987.77, dur: 0.05, release: 0.13, type: "sine", gain: 0.2 }),
    ally: () => { [220, 261.63, 329.63].forEach((f, i) => tone({ freq: f, start: i * 0.02, dur: 0.4, type: "sine", gain: 0.09 })); },
    damage: () => glide({ from: 300, to: 90, dur: 0.2, type: "sawtooth", gain: 0.14 }),
    zonecomplete: () => { [523.25, 783.99, 1046.5].forEach((f, i) => tone({ freq: f, start: i * 0.18, dur: 0.22, release: 0.3, type: "triangle", gain: 0.16 })); },
    scenechange: () => tone({ freq: 220, dur: 0.3, release: 0.3, type: "sine", gain: 0.06 }),
    decision: () => tone({ freq: 660, dur: 0.05, release: 0.06, type: "square", gain: 0.08 }),
    achievement: () => { [523.25, 659.25, 783.99].forEach((f, i) => tone({ freq: f, start: i * 0.08, dur: 0.22, release: 0.25, type: "triangle", gain: 0.14 })); },
    ending_liderazgo: () => { [392, 523.25, 659.25].forEach((f, i) => tone({ freq: f, start: i * 0.15, dur: 0.4, release: 0.6, type: "triangle", gain: 0.14 })); },
    ending_fuerte: () => { [329.63, 415.3, 493.88].forEach((f, i) => tone({ freq: f, start: i * 0.12, dur: 0.5, release: 0.5, type: "sine", gain: 0.14 })); },
    ending_camino: () => { [349.23, 440].forEach((f, i) => tone({ freq: f, start: i * 0.18, dur: 0.4, release: 0.4, type: "sine", gain: 0.13 })); },
    ending_aprendiendo: () => { [329.63, 392].forEach((f, i) => tone({ freq: f, start: i * 0.2, dur: 0.35, release: 0.4, type: "sine", gain: 0.11 })); },
    ending_sola: () => glide({ from: 392, to: 220, dur: 1.5, type: "sine", gain: 0.11 }),
  };

  function play(name) {
    if (muted) return;
    (SFX[name] || (() => {}))();
  }

  /* ---------------- MÚSICA GENERATIVA POR ZONA ---------------- */
  const SCALES = {
    vecindario: { notes: [220, 261.63, 293.66, 329.63, 392.0], bpm: 72, type: "sine", gain: 0.05, restChance: 0.35 },
    casaigualdad: { notes: [164.81, 196.0, 220, 246.94, 293.66], bpm: 60, type: "sine", gain: 0.04, restChance: 0.45 },
    comunidad: { notes: [261.63, 293.66, 329.63, 392.0, 440.0], bpm: 80, type: "triangle", gain: 0.055, restChance: 0.3 },
    empoderada: { notes: [261.63, 329.63, 392.0, 523.25], bpm: 104, type: "triangle", gain: 0.07, restChance: 0.15 },
    vn: { notes: [110, 130.81], bpm: 30, type: "sine", gain: 0.035, restChance: 0.1 },
  };
  let currentZoneKey = null;

  function startMusic(key) {
    const scale = SCALES[key] || SCALES.vecindario;
    if (currentZoneKey === key && musicTimer) return;
    currentZoneKey = key;
    if (musicTimer) clearInterval(musicTimer);
    const interval = 60000 / scale.bpm;
    const step = () => {
      if (muted) return;
      if (Math.random() < scale.restChance) return;
      const note = scale.notes[Math.floor(Math.random() * scale.notes.length)];
      tone({ freq: note, dur: interval / 1000 * 0.9, release: interval / 1000 * 0.5, type: scale.type, gain: scale.gain });
    };
    step();
    musicTimer = setInterval(step, interval);
  }
  function stopMusic() {
    if (musicTimer) clearInterval(musicTimer);
    musicTimer = null;
    currentZoneKey = null;
  }

  function toggleMute() {
    muted = !muted;
    try { sessionStorage.setItem(MUTE_KEY, muted ? "1" : "0"); } catch (err) {}
    if (masterGain) masterGain.gain.setTargetAtTime(muted ? 0 : 1, ctx.currentTime, 0.05);
    return muted;
  }
  function isMuted() { return muted; }

  return { play, startMusic, stopMusic, toggleMute, isMuted };
})();

window.MRA_AUDIO = MRA_AUDIO;
