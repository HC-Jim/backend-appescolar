// ============================================================
//  Punto de entrada: carga variables de entorno y arranca el servidor.
// ============================================================
require("dotenv").config();   // debe ir primero: carga .env antes de todo

const app = require("./src/app");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor escuchando en el puerto " + PORT);
});
