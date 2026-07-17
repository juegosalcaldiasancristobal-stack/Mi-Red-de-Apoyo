/* ============================================================
   MI RED DE APOYO — Mapa mundial (motor de plataformas)
   --------------------------------------------------------------
   Portado de mi_red_de_apoyo_game.html (Prototipo A) y convertido
   en un único mundo continuo con 3 zonas, en vez de niveles con
   compuerta de salida. Cada "puerta" de personaje real (definida
   en CHARACTERS, cargado por js/data/characters/index.js) abre la
   novela visual existente llamando a window.MRA_UI.enterCharacter.
   Este archivo no conoce el motor de novela visual ni el registro:
   solo dibuja el mapa y notifica eventos hacia afuera.
   ============================================================ */

const MRA_MAP = (() => {
  const GRAVITY = 0.55;
  const JUMP_FORCE = -11;
  const SPEED = 2.8;
  const H_MIN = 260, H_MAX = 460, H_DEFAULT = 340;
  let H = H_DEFAULT;
  let GROUND = H - 44;

  /* Calcula cuánta altura hay disponible debajo del HUD del mapa y por
     encima de los controles táctiles, para que estos nunca queden fuera
     de la pantalla y el área de juego aproveche el resto del alto real
     del dispositivo (en vez de un valor fijo que no cabe en pantallas
     bajas con la barra del navegador visible). */
  function computeAvailableH() {
    try {
      const cont = document.getElementById("mapGameContainer");
      const top = cont.getBoundingClientRect().top;
      const reserveBelow = 108; // controles táctiles + margen inferior
      const available = window.innerHeight - top - reserveBelow;
      return Math.max(H_MIN, Math.min(H_MAX, Math.round(available)));
    } catch (err) { return H_DEFAULT; }
  }

  const ZONES = [
    { id: "vecindario", name: "Zona 1: El Vecindario", xStart: 0, xEnd: 1100,
      bg: ["#1a0a2e", "#2d1b69"], ground: "#3b2080", accent: "#7c3aed", music: "vecindario" },
    { id: "casaigualdad", name: "Zona 2: La Casa de Igualdad", xStart: 1100, xEnd: 2400,
      bg: ["#0c1a2e", "#0f3460"], ground: "#164e92", accent: "#0ea5e9", music: "casaigualdad" },
    { id: "comunidad", name: "Zona 3: La Comunidad Unida", xStart: 2400, xEnd: 4100,
      bg: ["#0a1a0a", "#1a3a1a"], ground: "#1f5e1f", accent: "#22c55e", music: "comunidad" },
  ];
  const WORLD_END = 4100;

  const DOORS_DEF = [
    { charId: "marcela", x: 250 }, { charId: "sara", x: 850 },
    { charId: "daniela", x: 1350 }, { charId: "diana", x: 1750 }, { charId: "camila", x: 2150 },
    { charId: "rosario", x: 2650 }, { charId: "yuli", x: 3050 }, { charId: "marcela_b", x: 3500 },
    { charId: "valentina_rios", x: 3950, special: "comingsoon", label: "Valentina Ríos", tag: "Capítulo V · Próximamente" },
  ];

  const ALLIES_DEF = [
    { x: 500, role: "vecina", color: "#ec4899", title: "Vecina María", text: "¡Hola! Si alguna vez necesitas hablar, mi puerta está abierta. Juntas somos más fuertes." },
    { x: 1000, role: "amiga", color: "#06b6d4", title: "Amiga Luisa", text: "Recuerda que si sientes que estás en peligro, puedes llamar a la Línea Púrpura: 01 8000 112 137. ¡Estoy aquí para ti!" },
    { x: 1550, role: "orientadora", color: "#f59e0b", title: "Orientadora Legal", text: "Las Casas de Igualdad ofrecen atención jurídica y psicológica gratuita. ¡Tu bienestar importa y tienes derechos!" },
    { x: 1950, role: "psicóloga", color: "#a78bfa", title: "Psicóloga", text: "Hablar de lo que te pasa no es debilidad. Es fortaleza. Aquí tienes un espacio seguro para sanar y crecer." },
    { x: 2850, role: "lideresa", color: "#f59e0b", title: "Lideresa Comunitaria", text: "¡Esta es tu comunidad! Aquí organizamos talleres, eventos y redes de apoyo para todas las mujeres del barrio. ¡Únete!" },
    { x: 3250, role: "colega", color: "#34d399", title: "Colega Sandra", text: "Identificar señales de alerta, comunicarnos de forma asertiva y apoyarnos... eso es lo que nos hace fuertes. ¡Juntas llegamos más lejos!" },
  ];

  function generatePlatforms(xStart, xEnd) {
    const heights = [55, 80, 55, 95, 70, 90];
    const platforms = [];
    let i = 0;
    for (let x = xStart + 160; x < xEnd - 140; x += 165) {
      platforms.push({ x, y: GROUND - heights[i % heights.length], w: 80, h: 14 });
      i++;
    }
    return platforms;
  }
  function starsFor(platforms) {
    const stars = platforms.map((p) => ({ x: p.x + 40, y: p.y - 20 }));
    for (let i = 0; i < platforms.length - 1; i += 2) {
      stars.push({ x: (platforms[i].x + platforms[i + 1].x) / 2, y: GROUND - 30 });
    }
    return stars;
  }
  function obstaclesFor(xStart, xEnd, count) {
    const obstacles = [];
    const span = xEnd - xStart;
    for (let i = 1; i <= count; i++) {
      const x = xStart + (span * i) / (count + 1);
      const nearDoor = DOORS_DEF.some((d) => Math.abs(d.x - x) < 90);
      if (!nearDoor) obstacles.push({ x, y: GROUND - 22, w: 22, h: 22 });
    }
    return obstacles;
  }

  let platforms = [], stars = [], obstacles = [], doors = [], allies = [];
  function buildWorld() {
    platforms = []; stars = []; obstacles = [];
    ZONES.forEach((z) => {
      const p = generatePlatforms(z.xStart, z.xEnd);
      platforms.push(...p);
      stars.push(...starsFor(p));
      obstacles.push(...obstaclesFor(z.xStart, z.xEnd, 3));
    });
    doors = DOORS_DEF.map((d) => ({ ...d, completed: false }));
    allies = ALLIES_DEF.map((a) => ({ ...a, wasNear: false }));
  }

  function zoneAt(x) {
    return ZONES.find((z) => x >= z.xStart && x < z.xEnd) || ZONES[ZONES.length - 1];
  }

  let canvas, ctx, container, W = 680;
  let player, camera, score = 0, lives = 3, msgTimer = 0;
  let currentZoneId = null;
  let rafId = null, running = false, initialized = false;
  let rewards = { aura: false, threads: 0, book: false };
  let empoweredUntil = 0;
  let respawnX = 60;

  const keys = { left: false, right: false, jump: false };
  let jumpPressed = false;

  const PLAYER_W = 28, PLAYER_H = 42;
  function resetPlayer(x) {
    player = { x, y: GROUND - PLAYER_H, w: PLAYER_W, h: PLAYER_H, vx: 0, vy: 0, onGround: false, dir: 1, frame: 0, animT: 0, invincible: 0 };
    camera = { x: Math.max(0, x - W / 3) };
  }

  function bindInput() {
    document.addEventListener("keydown", (e) => {
      if (!running) return;
      if (e.key === "ArrowLeft" || e.key === "a") keys.left = true;
      if (e.key === "ArrowRight" || e.key === "d") keys.right = true;
      if ((e.key === "ArrowUp" || e.key === " " || e.key === "w") && !jumpPressed) { keys.jump = true; jumpPressed = true; }
    });
    document.addEventListener("keyup", (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") keys.left = false;
      if (e.key === "ArrowRight" || e.key === "d") keys.right = false;
      if (e.key === "ArrowUp" || e.key === " " || e.key === "w") { keys.jump = false; jumpPressed = false; }
    });
    const bindBtn = (id, key) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("touchstart", (e) => { e.preventDefault(); keys[key] = true; }, { passive: false });
      el.addEventListener("touchend", (e) => { e.preventDefault(); keys[key] = false; jumpPressed = false; });
      el.addEventListener("mousedown", () => { keys[key] = true; });
      el.addEventListener("mouseup", () => { keys[key] = false; jumpPressed = false; });
      el.addEventListener("mouseleave", () => { keys[key] = false; if (key === "jump") jumpPressed = false; });
    };
    bindBtn("mapBtnLeft", "left");
    bindBtn("mapBtnRight", "right");
    bindBtn("mapBtnJump", "jump");
  }

  function renderHearts() {
    const h = document.getElementById("mapHearts");
    if (!h) return;
    h.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const s = document.createElement("span");
      s.className = "heart";
      s.textContent = i < lives ? "❤️" : "🖤";
      h.appendChild(s);
    }
  }

  function showMsg(title, text) {
    const box = document.getElementById("mapMessageBox");
    if (!box) return;
    box.innerHTML = `<strong>${title}</strong>${text}`;
    box.classList.remove("hidden");
    msgTimer = 220;
  }

  function updateNetworkBar() {
    const real = doors.filter((d) => !d.special);
    const done = real.filter((d) => d.completed).length;
    const pct = Math.round((done / real.length) * 100);
    const pctEl = document.getElementById("mapNetworkPct");
    const fillEl = document.getElementById("mapNetworkFill");
    if (pctEl) pctEl.textContent = pct + "%";
    if (fillEl) fillEl.style.width = pct + "%";
    const goFinal = document.getElementById("btnGoFinalNetwork");
    if (goFinal) goFinal.classList.toggle("hidden", done < real.length);
    return { done, total: real.length };
  }

  function markDoorCompleted(charId) {
    const d = doors.find((x) => x.charId === charId);
    if (!d || d.completed) return;
    d.completed = true;
    const { done, total } = updateNetworkBar();
    if (done === total) triggerEmpowered();
  }

  function triggerEmpowered() {
    empoweredUntil = performance.now() + 10000;
    window.MRA_AUDIO?.play("zonecomplete");
    window.MRA_AUDIO?.startMusic("empoderada");
    showMsg("💪 ¡Modo Empoderada!", "Tejiste tu red completa. Valentina brilla con la fuerza de las 8 historias que acompañaste.");
    setTimeout(() => { if (Date.now() >= 0) window.MRA_AUDIO?.startMusic(currentZoneId); }, 10200);
  }

  function setRewards(next) { rewards = { ...rewards, ...next }; }

  function update() {
    if (keys.left) { player.vx = -SPEED; player.dir = -1; }
    else if (keys.right) { player.vx = SPEED; player.dir = 1; }
    else player.vx *= 0.7;

    if (keys.jump && player.onGround) { player.vy = JUMP_FORCE; player.onGround = false; window.MRA_AUDIO?.play("jump"); }

    player.vy += GRAVITY;
    player.x += player.vx;
    player.y += player.vy;

    if (player.x < 0) player.x = 0;
    if (player.x > WORLD_END - player.w) player.x = WORLD_END - player.w;

    player.onGround = false;
    if (player.y + player.h >= GROUND) { player.y = GROUND - player.h; player.vy = 0; player.onGround = true; }

    for (const p of platforms) {
      if (player.x + player.w > p.x && player.x < p.x + p.w &&
          player.y + player.h > p.y && player.y + player.h < p.y + p.h + 12 && player.vy >= 0) {
        player.y = p.y - player.h; player.vy = 0; player.onGround = true;
      }
    }

    player.animT++;
    player.frame = Math.abs(player.vx) > 0.5 ? Math.floor(player.animT / 8) % 4 : 0;

    for (const s of stars) {
      if (!s.collected && Math.abs(player.x + player.w / 2 - s.x) < 18 && Math.abs(player.y + player.h / 2 - s.y) < 18) {
        s.collected = true; score += 10;
        const sc = document.getElementById("mapScoreDisplay"); if (sc) sc.textContent = score;
        window.MRA_AUDIO?.play("star");
      }
    }

    if (player.invincible > 0) player.invincible--;
    const invulnerable = performance.now() < empoweredUntil;
    if (!invulnerable) {
      for (const o of obstacles) {
        if (player.invincible === 0 && player.x + player.w > o.x && player.x < o.x + o.w &&
            player.y + player.h > o.y && player.y < o.y + o.h) {
          lives--; player.invincible = 80; player.vy = JUMP_FORCE * 0.7;
          renderHearts();
          window.MRA_AUDIO?.play("damage");
          if (lives <= 0) {
            lives = 3;
            resetPlayer(respawnX);
            renderHearts();
            showMsg("¡Ánimo!", "Tropezaste, pero puedes volver a intentarlo. ¡La perseverancia es clave!");
            return;
          }
        }
      }
    }

    for (const a of allies) {
      const near = Math.abs(player.x + player.w / 2 - a.x) < 38 && player.y + player.h >= GROUND - 5;
      if (near && !a.wasNear) { showMsg(a.title, a.text); window.MRA_AUDIO?.play("ally"); }
      a.wasNear = near;
    }

    for (const d of doors) {
      const near = Math.abs(player.x + player.w / 2 - d.x) < 34 && player.y + player.h >= GROUND - 5;
      if (near && !d.triggering) {
        d.triggering = true;
        if (d.special === "comingsoon") { showMsg("🎨 Próximamente", "Valentina Ríos — Capítulo V, Diversidad."); window.MRA_UI?.showComingSoon(); }
        else { window.MRA_AUDIO?.play("ally"); window.MRA_UI?.enterCharacter(d.charId); }
      } else if (!near) { d.triggering = false; }
    }

    if (msgTimer > 0) { msgTimer--; if (msgTimer === 0) document.getElementById("mapMessageBox")?.classList.add("hidden"); }

    const targetCam = player.x - W / 3;
    camera.x += (targetCam - camera.x) * 0.1;
    if (camera.x < 0) camera.x = 0;
    if (camera.x > WORLD_END - W) camera.x = WORLD_END - W;

    const z = zoneAt(player.x);
    if (z.id !== currentZoneId) {
      currentZoneId = z.id;
      const lbl = document.getElementById("mapZoneLabel");
      if (lbl) lbl.textContent = z.name;
      respawnX = Math.max(60, z.xStart + 40);
      if (performance.now() >= empoweredUntil) window.MRA_AUDIO?.startMusic(z.music);
    }
  }

  function drawPlayer() {
    const px = player.x - camera.x, py = player.y;
    const flip = player.dir === -1;
    const invulnerable = performance.now() < empoweredUntil;
    const cx0 = px + PLAYER_W / 2;
    ctx.save();
    if (player.invincible > 0 && Math.floor(player.invincible / 5) % 2 === 0) ctx.globalAlpha = 0.4;
    if (invulnerable) {
      ctx.shadowColor = "#fbbf24"; ctx.shadowBlur = 20;
      ctx.beginPath(); ctx.arc(cx0, py + 20, 26, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(251,191,36,0.2)"; ctx.fill();
      ctx.shadowBlur = 0;
    } else if (rewards.aura) {
      ctx.beginPath(); ctx.arc(cx0, py + 20, 23, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(251,191,36,0.15)"; ctx.fill();
    }
    if (rewards.book) {
      ctx.font = "16px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("📚", cx0, py - 16 + Math.sin(player.animT * 0.06) * 3);
    }
    if (flip) { ctx.scale(-1, 1); ctx.translate(-px * 2 - PLAYER_W, 0); }

    const bobY = player.onGround ? Math.sin(player.animT * 0.3) * 1.6 : 0;
    const legSwing = player.onGround ? Math.sin(player.animT * 0.28) * 6 : 0;
    const ponyRot = Math.sin(player.animT * 0.2) * 0.3;
    const hx = px + PLAYER_W / 2;
    const headY = py + 12 + bobY;
    const headR = 11;

    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.beginPath(); ctx.ellipse(hx, GROUND + 2, 11, 3, 0, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#5b21b6";
    ctx.beginPath(); ctx.roundRect(hx - 8, py + 30 + bobY + legSwing, 6, 11, 3); ctx.fill();
    ctx.beginPath(); ctx.roundRect(hx + 2, py + 30 + bobY - legSwing, 6, 11, 3); ctx.fill();
    ctx.fillStyle = "#3b0764";
    ctx.beginPath(); ctx.ellipse(hx - 5, py + 41 + bobY + legSwing, 4.5, 2.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hx + 5, py + 41 + bobY - legSwing, 4.5, 2.6, 0, 0, Math.PI * 2); ctx.fill();

    const dressGrad = ctx.createLinearGradient(hx, py + 17, hx, py + 33);
    dressGrad.addColorStop(0, "#c4b5fd"); dressGrad.addColorStop(1, "#7c3aed");
    ctx.fillStyle = dressGrad;
    ctx.beginPath();
    ctx.moveTo(hx - 7, py + 18 + bobY);
    ctx.quadraticCurveTo(hx, py + 15 + bobY, hx + 7, py + 18 + bobY);
    ctx.lineTo(hx + 10, py + 33 + bobY);
    ctx.quadraticCurveTo(hx, py + 38 + bobY, hx - 10, py + 33 + bobY);
    ctx.closePath(); ctx.fill();

    ctx.fillStyle = "#fbbf24";
    const armSwing = player.onGround ? -legSwing * 0.5 : 0;
    ctx.beginPath(); ctx.ellipse(hx - 10, py + 23 + bobY + armSwing, 3.2, 5.5, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hx + 10, py + 23 + bobY - armSwing, 3.2, 5.5, 0.3, 0, Math.PI * 2); ctx.fill();

    ctx.save();
    ctx.translate(hx + 8, headY - 1);
    ctx.rotate(ponyRot);
    ctx.fillStyle = "#5c3a21";
    ctx.beginPath(); ctx.ellipse(3, 6, 4, 9, 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    ctx.fillStyle = "#f3c9a0";
    ctx.beginPath(); ctx.arc(hx, headY, headR, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#5c3a21";
    ctx.beginPath(); ctx.arc(hx, headY, headR + 1.5, Math.PI, 0, false); ctx.fill();
    ctx.beginPath(); ctx.arc(hx - 7, headY - 2, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(hx + 7, headY - 2, 3.5, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "rgba(244,114,182,0.55)";
    ctx.beginPath(); ctx.ellipse(hx - 6, headY + 3, 2.2, 1.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hx + 6, headY + 3, 2.2, 1.6, 0, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath(); ctx.ellipse(hx - 4, headY + 1, 1.8, 2.4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hx + 4, headY + 1, 1.8, 2.4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(hx - 4.6, headY + 0.2, 0.6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(hx + 3.4, headY + 0.2, 0.6, 0, Math.PI * 2); ctx.fill();

    ctx.strokeStyle = "#92400e"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(hx, headY + 4, 2.6, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();

    ctx.restore();
  }

  function drawAlly(a) {
    const ax = a.x - camera.x, ay = GROUND;
    const bob = Math.sin(Date.now() * 0.003 + a.x) * 2.5;
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath(); ctx.ellipse(ax, ay + 2, 9, 2.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = a.color;
    ctx.beginPath(); ctx.ellipse(ax, ay - 20 + bob, 10, 15, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fde68a";
    ctx.beginPath(); ctx.arc(ax, ay - 40 + bob, 9, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(ax, ay - 40 + bob, 9, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "#fbbf24"; ctx.font = "bold 13px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("💬", ax, ay - 55 + bob);
    ctx.fillStyle = "rgba(255,255,255,0.75)"; ctx.font = "9px sans-serif";
    ctx.fillText(a.role, ax, ay - 3);
  }

  function drawDoor(d) {
    const dx = d.x - camera.x, dy = GROUND;
    if (dx < -60 || dx > W + 60) return;
    const c = CHARACTERS?.find?.((x) => x.id === d.charId);
    const label = d.label || c?.name?.split(" ")[0] || d.charId;
    const avatarEmoji = d.special ? "🎨" : (c?.avatar || "🚪");
    const ringColor = d.completed ? "#34d399" : d.special ? "#94a3b8" : "#fbbf24";
    const bob = Math.sin(Date.now() * 0.0025 + d.x) * 3;
    const frameH = 68;

    ctx.fillStyle = d.completed ? "rgba(52,211,153,0.16)" : d.special ? "rgba(148,163,184,0.14)" : "rgba(251,191,36,0.14)";
    ctx.beginPath(); ctx.roundRect(dx - 19, dy - frameH, 38, frameH, [14, 14, 0, 0]); ctx.fill();
    ctx.strokeStyle = ringColor; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(dx - 19, dy - frameH, 38, frameH, [14, 14, 0, 0]); ctx.stroke();

    const badgeY = dy - frameH - 18 + bob;
    ctx.beginPath(); ctx.arc(dx, badgeY, 18, 0, Math.PI * 2);
    ctx.fillStyle = "#191627"; ctx.fill();
    ctx.lineWidth = 2.5; ctx.strokeStyle = ringColor; ctx.stroke();
    ctx.font = "19px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(avatarEmoji, dx, badgeY + 1);
    ctx.textBaseline = "alphabetic";

    ctx.font = "12px sans-serif";
    ctx.fillStyle = d.completed ? "#34d399" : "#fde68a";
    ctx.fillText(d.completed ? "✓" : "💬", dx + 16, badgeY - 13);

    ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.font = "9px sans-serif";
    ctx.fillText(label, dx, dy + 12);

    if (rewards.threads > 0 && d.completed && !d.special) {
      const px = player.x - camera.x, py = player.y + player.h / 2;
      ctx.strokeStyle = "rgba(167,139,250,0.35)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(dx, badgeY); ctx.stroke();
    }
  }

  function draw() {
    const z = zoneAt(camera.x + W / 2);
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, z.bg[0]); grad.addColorStop(1, z.bg[1]);
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < 40; i++) {
      const seed = i * 137.5;
      const sx = ((seed * 73) % 1400 - camera.x * 0.15) % W;
      const sy = (seed * 43) % (GROUND - 30);
      ctx.fillStyle = `rgba(255,255,255,${0.3 + (i % 3) * 0.2})`;
      ctx.fillRect(sx < 0 ? sx + W : sx, sy, 1.5, 1.5);
    }

    ctx.fillStyle = z.ground; ctx.fillRect(0, GROUND, W, H - GROUND);
    ctx.fillStyle = z.accent; ctx.fillRect(0, GROUND, W, 3);

    for (const p of platforms) {
      const px = p.x - camera.x;
      if (px > -100 && px < W + 100) {
        ctx.fillStyle = zoneAt(p.x).accent;
        ctx.beginPath(); ctx.roundRect(px, p.y, p.w, p.h, 4); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.fillRect(px + 4, p.y + 2, p.w - 8, 2);
      }
    }
    for (const s of stars) {
      if (s.collected) continue;
      const sx = s.x - camera.x;
      if (sx > -20 && sx < W + 20) {
        const t = Date.now() * 0.004;
        ctx.font = "16px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("⭐", sx, s.y + Math.sin(t + s.x * 0.05) * 3);
      }
    }
    for (const o of obstacles) {
      const ox = o.x - camera.x;
      if (ox > -30 && ox < W + 30) {
        ctx.fillStyle = "#ef4444";
        ctx.beginPath(); ctx.roundRect(ox, o.y, o.w, o.h, 4); ctx.fill();
        ctx.font = "13px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("⚠️", ox + o.w / 2, o.y + o.h - 2);
      }
    }
    for (const a of allies) { const ax = a.x - camera.x; if (ax > -60 && ax < W + 60) drawAlly(a); }
    for (const d of doors) drawDoor(d);
    drawPlayer();
  }

  function loop() {
    if (!running) return;
    update();
    draw();
    rafId = requestAnimationFrame(loop);
  }

  function resizeCanvas() {
    if (!container) return;
    W = Math.max(320, Math.min(680, container.clientWidth || 680));
    canvas.width = W; canvas.height = H;
    // Fijar el tamaño CSS explícitamente al mismo valor del bitmap: si se
    // dejara solo "width:100%" (ver style.css), el navegador estira el
    // canvas al ancho completo del contenedor y calcula el alto
    // proporcionalmente (aspect-ratio), que en pantallas anchas supera la
    // altura fija de #mapGameContainer y "overflow:hidden" recorta el
    // tercio inferior de la escena (el suelo y las piernas de Valentina).
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    container.style.height = (H + 44) + "px";
  }

  function init() {
    if (initialized) return;
    initialized = true;
    canvas = document.getElementById("mapCanvas");
    container = document.getElementById("mapGameContainer");
    ctx = canvas.getContext("2d");
    H = computeAvailableH();
    GROUND = H - 44;
    buildWorld();
    resetPlayer(60);
    resizeCanvas();
    bindInput();
    renderHearts();
    updateNetworkBar();
    window.addEventListener("resize", () => { if (running) resizeCanvas(); });
  }

  function resume() {
    init();
    resizeCanvas();
    if (running) return;
    running = true;
    window.MRA_AUDIO?.startMusic(zoneAt(player.x).music);
    loop();
  }
  function pause() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
  }

  function getScore() { return score; }
  function getProgress() {
    const real = doors.filter((d) => !d.special);
    return { done: real.filter((d) => d.completed).length, total: real.length };
  }
  function getSnapshot() {
    return {
      score,
      completed: doors.filter((d) => d.completed).map((d) => d.charId),
      playerX: player ? player.x : 60,
    };
  }
  function restoreSnapshot(snap) {
    if (!snap) return;
    init();
    score = snap.score || 0;
    (snap.completed || []).forEach((id) => { const d = doors.find((x) => x.charId === id); if (d) d.completed = true; });
    updateNetworkBar();
    const sc = document.getElementById("mapScoreDisplay"); if (sc) sc.textContent = score;
    if (typeof snap.playerX === "number") resetPlayer(snap.playerX);
  }

  return { init, resume, pause, markDoorCompleted, setRewards, getScore, getProgress, getSnapshot, restoreSnapshot };
})();

window.MRA_MAP = MRA_MAP;
