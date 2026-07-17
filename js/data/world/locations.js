/* ============================================================
   LOCALIDADES — Bogotá como capa de datos compartida
   --------------------------------------------------------------
   Catálogo semilla, pensado para crecer: cada nueva localidad que
   se agregue queda disponible automáticamente para cualquier
   personaje futuro que la referencie por id, sin tocar el motor.
   ============================================================ */

const LOCALIDADES = {
  san_cristobal: {
    nombre: "San Cristóbal",
    casaIgualdad: "Casa de Igualdad de Oportunidades — San Cristóbal",
    comisaria: "Comisaría de Familia de San Cristóbal",
    transmilenio: ["Portal 20 de Julio", "San Cristóbal Sur"],
    hospital: "Hospital San Cristóbal (E.S.E.)",
    biblioteca: "Biblioteca Pública La Victoria (BibloRed)",
  },
  rafael_uribe: {
    nombre: "Rafael Uribe Uribe",
    casaIgualdad: "Casa de Igualdad de Oportunidades — Rafael Uribe Uribe",
    comisaria: "Comisaría de Familia de Rafael Uribe Uribe",
    transmilenio: ["Country Sur", "Quiroga"],
    hospital: "Hospital Rafael Uribe Uribe (E.S.E.)",
    biblioteca: "Biblioteca Pública Marco Fidel Suárez (BibloRed)",
  },
  antonio_narino: {
    nombre: "Antonio Nariño",
    casaIgualdad: "Casa de Igualdad de Oportunidades — Antonio Nariño",
    comisaria: "Comisaría de Familia de Antonio Nariño",
    transmilenio: ["Restrepo", "Fucha"],
    hospital: "Hospital Rafael Uribe Uribe — Unidad Antonio Nariño",
    biblioteca: "Biblioteca Pública Restrepo (BibloRed)",
  },
};

function locationField(localidadId, field) {
  const loc = LOCALIDADES[localidadId];
  return loc ? loc[field] : null;
}
