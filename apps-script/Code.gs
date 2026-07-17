/**
 * MI RED DE APOYO — backend de registro, resultados y panel de facilitadora
 * ---------------------------------------------------------------------
 * Pega este archivo en el editor de Apps Script vinculado a tu
 * hoja de cálculo (Extensiones > Apps Script). Ver README.md en
 * esta misma carpeta para los pasos de despliegue.
 */

var ACHIEVEMENTS = [
  { id: "primer_contacto", title: "Primera persona de confianza" },
  { id: "ruta_activada", title: "Activaste una ruta de atención" },
  { id: "senal_reconocida", title: "Reconociste una señal de alerta" },
  { id: "red_solida", title: "Construiste una red sólida" },
  { id: "defensora", title: "Defensora de tus derechos" },
];

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  if (data.action === "register") return handleRegister(data);
  if (data.action === "finish") return handleFinish(data);
  if (data.action === "send_code") return handleSendCode(data);
  if (data.action === "verify_code") return handleVerifyCode(data);
  return jsonOutput({ ok: false, reason: "acción desconocida" });
}

/**
 * Verificación real de correo: genera un código de 6 dígitos, lo guarda
 * temporalmente (10 minutos) y lo envía por correo. No se guarda en la
 * hoja de cálculo, solo en memoria caché del script.
 */
function handleSendCode(data) {
  var code = String(Math.floor(100000 + Math.random() * 900000));
  CacheService.getScriptCache().put("code_" + data.email, code, 600);

  var subject = "Tu código de verificación — Mi Red de Apoyo";
  var body =
    "Hola" + (data.name ? " " + data.name : "") + ",\n\n" +
    "Tu código para confirmar tu correo es: " + code + "\n\n" +
    "Este código vence en 10 minutos. Si no solicitaste este código, puedes ignorar este mensaje.\n\n" +
    "Alcaldía Local de San Cristóbal — Mi Red de Apoyo.";
  MailApp.sendEmail(data.email, subject, body);

  return jsonOutput({ ok: true });
}

function handleVerifyCode(data) {
  var cache = CacheService.getScriptCache();
  var stored = cache.get("code_" + data.email);
  var valid = !!stored && stored === String(data.code);
  if (valid) cache.remove("code_" + data.email);
  return jsonOutput({ ok: valid });
}

function doGet(e) {
  return ContentService.createTextOutput("Mi Red de Apoyo — backend activo.");
}

function getOrCreateSheet(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  }
  return sheet;
}

function handleRegister(data) {
  var sheet = getOrCreateSheet("Registro", ["Marca temporal", "Nombre", "Rango de edad", "Correo", "Modo de juego"]);
  sheet.appendRow([data.timestamp, data.name, data.age, data.email, data.playMode]);
  ensureDashboard();
  return jsonOutput({ ok: true });
}

function handleFinish(data) {
  var sheet = getOrCreateSheet("Resultados", [
    "Marca temporal", "Nombre", "Correo", "Personaje", "Tipo de violencia",
    "Final obtenido", "Red de apoyo %", "Bienestar %", "Conocimiento %",
    "Logros obtenidos", "Total logros", "Rango de edad",
  ]);
  var earned = data.achievements || [];
  var earnedTitles = ACHIEVEMENTS.filter(function (a) {
    return earned.indexOf(a.id) !== -1;
  }).map(function (a) { return a.title; });

  sheet.appendRow([
    data.timestamp, data.name, data.email, data.character, data.violenceType, data.ending,
    Math.round(data.stats.red), Math.round(data.stats.bienestar), Math.round(data.stats.conocimiento),
    earnedTitles.join(", "), earned.length + " / " + ACHIEVEMENTS.length, data.ageRange || "",
  ]);

  logDecisions(data);
  logSignals(data);
  ensureDashboard();

  if (data.email) sendAchievementEmail(data, earned);

  return jsonOutput({ ok: true });
}

function logDecisions(data) {
  if (!data.decisions || !data.decisions.length) return;
  var sheet = getOrCreateSheet("Decisiones", ["Marca temporal", "Nombre", "Personaje", "Nodo", "Decisión elegida"]);
  var rows = data.decisions.map(function (d) {
    return [data.timestamp, data.name, d.character, d.node, d.choice];
  });
  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 5).setValues(rows);
}

function logSignals(data) {
  var identified = data.signalsIdentified || [];
  var missed = data.signalsMissed || [];
  if (!identified.length && !missed.length) return;
  var sheet = getOrCreateSheet("Señales", ["Marca temporal", "Nombre", "Mensaje", "Resultado"]);
  var rows = identified.map(function (s) { return [data.timestamp, data.name, s, "Reconocida"]; })
    .concat(missed.map(function (s) { return [data.timestamp, data.name, s, "No reconocida"]; }));
  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 4).setValues(rows);
}

function sendAchievementEmail(data, earned) {
  var rows = ACHIEVEMENTS.map(function (a) {
    var got = earned.indexOf(a.id) !== -1;
    return (got ? "✅ " : "⬜ ") + a.title;
  }).join("\n");

  var subject = '🤝 Tus resultados en "Mi Red de Apoyo"';
  var body =
    "Hola " + (data.name || "") + ",\n\n" +
    'Gracias por participar en la sesión de "Mi Red de Apoyo". Este fue tu resultado jugando con ' + data.character + ":\n\n" +
    "Final obtenido: " + data.ending + "\n\n" +
    "Tus insignias:\n" + rows + "\n\n" +
    "Recuerda que estas rutas de apoyo en Bogotá están disponibles siempre que las necesites:\n" +
    "💜 Línea Púrpura: 01 8000 112 137\n" +
    "📞 Línea 155 (orientación nacional a mujeres)\n" +
    "🚨 Línea 123 (emergencias)\n\n" +
    "Alcaldía Local de San Cristóbal — Acciones pedagógicas para la resolución de conflictos.";

  MailApp.sendEmail(data.email, subject, body);
}

/**
 * Crea (si no existe) la pestaña "Panel Facilitadora" con fórmulas que se
 * recalculan solas a medida que llegan más registros. No se sobreescribe si
 * ya existe, así que puedes reordenar o darle estilo sin que se pierda.
 */
function ensureDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSheetByName("Panel Facilitadora")) return;

  var sheet = ss.insertSheet("Panel Facilitadora");
  sheet.getRange("A1").setValue("📊 Panel Facilitadora — Mi Red de Apoyo").setFontWeight("bold").setFontSize(14);

  var rows = [
    ["Total registros de asistencia", '=COUNTA(Registro!A2:A)'],
    ["Total historias completadas", '=COUNTA(Resultados!A2:A)'],
    ["Personaje más elegido", '=IFERROR(INDEX(QUERY(Resultados!D2:D,"select D, count(D) where D is not null group by D order by count(D) desc limit 1"),1,1),"—")'],
    ["Decisión más frecuente", '=IFERROR(INDEX(QUERY(Decisiones!E2:E,"select E, count(E) where E is not null group by E order by count(E) desc limit 1"),1,1),"—")'],
    ["Señal de alerta menos reconocida", '=IFERROR(INDEX(QUERY(Señales!C2:D,"select C, count(C) where D = \'No reconocida\' group by C order by count(C) desc limit 1"),1,1),"—")'],
    ["Promedio Red de apoyo %", '=IFERROR(ROUND(AVERAGE(Resultados!G2:G),1),"—")'],
    ["Promedio Bienestar %", '=IFERROR(ROUND(AVERAGE(Resultados!H2:H),1),"—")'],
    ["Promedio Conocimiento %", '=IFERROR(ROUND(AVERAGE(Resultados!I2:I),1),"—")'],
  ];
  sheet.getRange(3, 1, rows.length, 2).setValues(rows);
  sheet.getRange(3, 1, rows.length, 1).setFontWeight("bold");

  sheet.getRange("A13").setValue("Distribución de finales obtenidos").setFontWeight("bold");
  sheet.getRange("A14").setFormula('=IFERROR(QUERY(Resultados!F2:F,"select F, count(F) where F is not null group by F order by count(F) desc"),"Sin datos aún")');

  sheet.getRange("D13").setValue("Distribución de personajes elegidos").setFontWeight("bold");
  sheet.getRange("D14").setFormula('=IFERROR(QUERY(Resultados!D2:D,"select D, count(D) where D is not null group by D order by count(D) desc"),"Sin datos aún")');

  sheet.getRange("A24").setValue("Top 5 señales de alerta NO reconocidas (oportunidad de reforzar)").setFontWeight("bold");
  sheet.getRange("A25").setFormula('=IFERROR(QUERY(Señales!C2:D,"select C, count(C) where D = \'No reconocida\' group by C order by count(C) desc limit 5"),"Sin datos aún")');

  sheet.autoResizeColumns(1, 5);
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
