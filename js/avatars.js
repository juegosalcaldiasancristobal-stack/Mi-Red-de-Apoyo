/* ============================================================
   MI RED DE APOYO — Avatares vectoriales (placeholder de arte)
   --------------------------------------------------------------
   Sistema paramétrico SVG con expresiones intercambiables.
   Pensado para ser reemplazado 1:1 por ilustración final:
   cada personaje solo necesita { skin, hair, hairStyle } y el
   motor ya sabe pedir cualquiera de las 6 expresiones (mood).
   Para sustituir por arte de artista: cambiar buildAvatarSVG()
   por <img src="assets/<personaje>/<mood>.png"> sin tocar el
   resto del motor (engine.js solo llama avatarSVG(char, mood)).
   ============================================================ */

const MOODS = ["feliz", "tranquila", "preocupada", "asustada", "empoderada", "triste", "molesta", "aliviada"];

const MOOD_CONFIG = {
  feliz: {
    browL: "M 30 46 Q 40 40 50 45", browR: "M 70 45 Q 80 40 90 46",
    eyeRy: 6, mouth: "M 42 84 Q 60 100 78 84 Q 60 94 42 84", tilt: 0, tear: false, blush: true,
  },
  tranquila: {
    browL: "M 30 47 Q 40 44 50 47", browR: "M 70 47 Q 80 44 90 47",
    eyeRy: 5, mouth: "M 45 85 Q 60 92 75 85", tilt: 0, tear: false, blush: false,
  },
  preocupada: {
    browL: "M 30 44 Q 42 50 50 48", browR: "M 70 48 Q 78 50 90 44",
    eyeRy: 6, mouth: "M 46 88 Q 60 84 74 88", tilt: -2, tear: false, blush: false,
  },
  asustada: {
    browL: "M 29 40 Q 40 36 51 42", browR: "M 69 42 Q 80 36 91 40",
    eyeRy: 9, mouth: "M 54 86 Q 60 92 66 86 Q 60 90 54 86", tilt: 0, tear: false, blush: false,
  },
  empoderada: {
    browL: "M 30 45 Q 40 41 51 44", browR: "M 69 44 Q 80 41 90 45",
    eyeRy: 5.5, mouth: "M 44 85 Q 60 96 76 85", tilt: -3, tear: false, blush: false,
  },
  triste: {
    browL: "M 31 49 Q 41 44 50 47", browR: "M 70 47 Q 79 44 89 49",
    eyeRy: 5.5, mouth: "M 46 90 Q 60 82 74 90", tilt: 4, tear: true, blush: false,
  },
  molesta: {
    browL: "M 29 43 Q 40 49 51 45", browR: "M 69 45 Q 80 49 91 43",
    eyeRy: 4.5, mouth: "M 46 88 Q 60 85 74 88", tilt: 0, tear: false, blush: false, frown: true,
  },
  aliviada: {
    browL: "M 30 46 Q 40 42 50 46", browR: "M 70 46 Q 80 42 90 46",
    eyeRy: 4, mouth: "M 43 84 Q 60 98 77 84 Q 60 92 43 84", tilt: -1, tear: false, blush: true,
  },
};

const HAIR_PATHS = {
  largo: (color) => `
    <path d="M20 60 Q18 20 60 14 Q102 20 100 60 L100 100 Q88 66 88 55 Q80 78 78 106 L70 106 Q68 70 60 58 Q52 70 50 106 L42 106 Q40 78 32 55 Q32 66 20 100 Z" fill="${color}"/>`,
  corto: (color) => `
    <path d="M20 58 Q18 18 60 16 Q102 18 100 58 Q100 40 60 36 Q20 40 20 58 Z" fill="${color}"/>`,
  canoso: (color) => `
    <path d="M20 58 Q18 22 60 18 Q102 22 100 58 Q100 42 60 38 Q20 42 20 58 Z" fill="${color}"/>`,
  pañoleta: (color) => `
    <path d="M14 62 Q14 10 60 8 Q106 10 106 62 L96 62 Q96 26 60 24 Q24 26 24 62 Z" fill="${color}"/>
    <path d="M80 30 Q100 46 92 70 L78 62 Z" fill="${color}"/>`,
};

function avatarSVG(character, mood = "tranquila") {
  const cfg = MOOD_CONFIG[mood] || MOOD_CONFIG.tranquila;
  const skin = character.skin || "#c98a5e";
  const hair = character.hair || "#3a2417";
  const hairStyle = character.hairStyle || "largo";
  const hairSvg = (HAIR_PATHS[hairStyle] || HAIR_PATHS.largo)(hair);

  return `
  <svg viewBox="0 0 120 120" class="avatar-svg" role="img" aria-label="Retrato de ${character.name}, expresión ${mood}">
    <g transform="rotate(${cfg.tilt} 60 65)">
      ${hairStyle !== "corto" && hairStyle !== "canoso" ? hairSvg : ""}
      <circle cx="60" cy="64" r="38" fill="${skin}"/>
      ${hairStyle === "corto" || hairStyle === "canoso" ? hairSvg : ""}
      ${cfg.blush ? `<ellipse cx="38" cy="74" rx="6" ry="4" fill="#000" opacity="0.06"/><ellipse cx="82" cy="74" rx="6" ry="4" fill="#000" opacity="0.06"/>` : ""}
      <ellipse cx="45" cy="60" rx="5" ry="${cfg.eyeRy}" fill="#241a14"/>
      <ellipse cx="75" cy="60" rx="5" ry="${cfg.eyeRy}" fill="#241a14"/>
      <path d="${cfg.browL}" stroke="${hair}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      <path d="${cfg.browR}" stroke="${hair}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      <path d="${cfg.mouth}" fill="#7a2e2e" opacity="0.85"/>
      ${cfg.tear ? `<path d="M40 68 q3 8 0 13 q-3 -5 0 -13 Z" fill="#5eb8e8" opacity="0.85"/>` : ""}
      ${cfg.frown ? `<path d="M58 47 L60 52 L62 47" stroke="${hair}" stroke-width="2" fill="none" opacity="0.6"/>` : ""}
    </g>
  </svg>`;
}

function moodBadgeEmoji(mood) {
  return { feliz: "😊", tranquila: "🙂", preocupada: "😟", asustada: "😨", empoderada: "💪", triste: "😢", molesta: "😠", aliviada: "😌" }[mood] || "🙂";
}
