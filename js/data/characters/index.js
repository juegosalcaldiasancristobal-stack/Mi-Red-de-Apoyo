/* ============================================================
   Agregador de personajes — une todos los capítulos.
   Agregar un capítulo nuevo = crear su archivo (con el mismo
   patrón: xxxCharacters, xxxScenarios, xxxPersonalContacts) y
   sumarlo a los tres arrays/objetos de abajo — sin tocar el
   motor (engine.js) ni los demás capítulos.
   ============================================================ */

const CHARACTERS = [
  ...parejasCharacters,
  ...trabajoCharacters,
  ...publicoCharacters,
  ...digitalCharacters,
];

const SCENARIOS = {
  ...parejasScenarios,
  ...trabajoScenarios,
  ...publicoScenarios,
  ...digitalScenarios,
};

const CONTACTS = {
  ...NPCS,
  ...parejasPersonalContacts,
  ...trabajoPersonalContacts,
  ...publicoPersonalContacts,
  ...digitalPersonalContacts,
};
