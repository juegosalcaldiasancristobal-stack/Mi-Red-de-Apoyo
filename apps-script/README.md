# Conectar el juego a tu Google Sheet (5 minutos)

Esto crea, gratis y sin tarjeta de crédito, un pequeño backend dentro de tu propia
cuenta de Google que: (1) verifica con un código de 6 dígitos que el correo de cada
participante es real antes de dejarla jugar, (2) guarda cada registro en la hoja de
cálculo, y (3) envía el correo con las 5 insignias al terminar la historia.

## Pasos

1. Abre tu hoja de cálculo:
   https://docs.google.com/spreadsheets/d/1tQBvL6OWFKSQLH1MRbirvnS9kHYoVMNOgWx9UsOv4HE/edit
2. Menú **Extensiones → Apps Script**. Se abre un editor de código en una pestaña nueva.
3. Borra el contenido del archivo `Código.gs` que aparece por defecto y pega
   **todo** el contenido de [`Code.gs`](Code.gs) (el archivo que está en esta misma carpeta).
4. Guarda (ícono de disquete o Ctrl+S). Ponle un nombre al proyecto si te lo pide,
   por ejemplo "Mi Red de Apoyo — backend".
5. Arriba a la derecha, botón azul **Implementar → Nueva implementación**.
   - Tipo: **Aplicación web**.
   - "Ejecutar como": **Yo (tu cuenta)**.
   - "Quién tiene acceso": **Cualquier usuario**.
   - Clic en **Implementar**.
6. Google te va a pedir autorizar permisos (porque el script escribe en tu hoja y
   envía correos en tu nombre). Es normal — clic en **Autorizar acceso**, elige tu
   cuenta, y si aparece una pantalla de "app no verificada" clic en
   **Configuración avanzada → Ir a Mi Red de Apoyo (no seguro)** (es tu propio script,
   Google solo advierte porque no está publicado en la tienda de apps).
7. Copia la **URL de la aplicación web** que te entrega al final (empieza con
   `https://script.google.com/macros/s/.../exec`).
8. Pégala en [`../js/config.js`](../js/config.js), reemplazando el texto
   `PEGA_AQUI_LA_URL_DE_TU_APPS_SCRIPT_WEB_APP`.
9. Recarga el juego. Al registrarse una participante y al terminar una historia,
   revisa tu hoja de cálculo — deberían aparecer dos pestañas nuevas: **Registro**
   y **Resultados**, creadas automáticamente.

## Panel para la facilitadora

Apenas llegue el primer registro o resultado, el script crea automáticamente una
pestaña **"Panel Facilitadora"** en tu hoja, con fórmulas que se actualizan solas:
total de participantes, personaje más elegido, decisión más frecuente, señales de
alerta menos reconocidas (para saber qué reforzar en la siguiente sesión),
promedios de red de apoyo / bienestar / conocimiento, y la distribución de finales
y personajes. No necesitas tocar nada — solo abrir esa pestaña después de cada sesión.

Para exportar cualquier pestaña a CSV o Excel: **Archivo → Descargar → Valores
separados por comas / Microsoft Excel** desde el propio Google Sheets — no hace
falta ninguna herramienta adicional.

## Si ya habías desplegado una versión anterior

Si ya hiciste el despliegue una vez y ahora actualizaste `Code.gs` con esta versión
nueva (que agrega el panel de facilitadora y el registro de decisiones), tienes que
publicar los cambios de nuevo: **Implementar → Gestionar implementaciones → ✏️
(editar) → Nueva versión → Implementar**. La URL no cambia, así que no hace falta
tocar `js/config.js` otra vez.

## Notas importantes

- **Cuota de correos:** una cuenta gratuita de Gmail puede enviar hasta 100 correos
  por día con `MailApp`. Para una sesión de 20 personas sobra; si vas a correr varias
  sesiones el mismo día desde la misma cuenta, ten en cuenta ese límite. Una cuenta
  de Google Workspace institucional permite hasta 1500/día.
- **Requiere internet:** a diferencia del resto del juego (que funciona sin conexión),
  el registro y el envío de correo sí necesitan que el dispositivo tenga internet en
  el momento de registrarse y de terminar la historia. Si el salón no tiene wifi
  estable, el juego sigue funcionando con normalidad — simplemente no se sincroniza
  ese registro puntual (se muestra un aviso discreto, sin interrumpir a la jugadora).
- **Cada vez que edites `Code.gs`** tienes que volver a **Implementar → Gestionar
  implementaciones → ✏️ (editar) → Nueva versión → Implementar** para que los cambios
  se reflejen en la URL ya publicada.
- Si en algún momento quieres desactivar el envío de datos (por ejemplo, para probar
  el juego sin llenar la hoja de verdad), basta con volver a dejar el valor por
  defecto `PEGA_AQUI_...` en `js/config.js` — el juego sigue funcionando igual, solo
  deja de sincronizar.
