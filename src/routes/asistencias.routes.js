// ============================================================
//  Rutas de ASISTENCIAS -> montadas en "/asistencias"
//  GET /asistencias/:usuarioId  -> días con asistencia registrada
// ============================================================
const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();
const TABLA = "asistencias";

router.get("/:usuarioId", async (req, res) => {
  const usuarioId = req.params.usuarioId;
  const respuesta = await supabase
    .from(TABLA).select("*").eq("usuario_id", usuarioId).order("dia");

  if (respuesta.error) {
    res.status(500).json({ error: respuesta.error.message });
    return;
  }

  res.json(respuesta.data);
});

module.exports = router;
