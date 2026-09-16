// ============================================================
//  Configuración de Express: middlewares + enganche de rutas.
//  Aquí NO se arranca el servidor (eso lo hace index.js).
// ============================================================
const express = require("express");
const cors = require("cors");

// Rutas por recurso
const comunicadosRoutes = require("./routes/comunicados.routes");
const notasRoutes = require("./routes/notas.routes");
const ubicacionesRoutes = require("./routes/ubicaciones.routes");
const usuariosRoutes = require("./routes/usuarios.routes");
const asistenciasRoutes = require("./routes/asistencias.routes");

const app = express();

// Middlewares
app.use(cors());          // permite que la app Android llame a la API
app.use(express.json());  // permite leer JSON del body

// Ruta de prueba (para saber que la API está viva)
app.get("/", (req, res) => {
  res.json({ mensaje: "API App Escolar funcionando 🚌" });
});

// Cada grupo de rutas se monta bajo su propio prefijo
app.use("/comunicados", comunicadosRoutes);
app.use("/notas", notasRoutes);
app.use("/ubicaciones", ubicacionesRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/asistencias", asistenciasRoutes);

module.exports = app;
