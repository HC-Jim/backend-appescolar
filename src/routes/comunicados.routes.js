// ============================================================
//  Rutas de COMUNICADOS (rol Estudiante) -> montadas en "/comunicados"
// ============================================================
const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();
const TABLA = "comunicados";

// GET /comunicados -> lista todos
router.get("/", async (req, res) => {
  const respuesta = await supabase.from(TABLA).select("*").order("id");

  if (respuesta.error) {
    res.status(500).json({ error: respuesta.error.message });
    return;
  }

  res.json(respuesta.data);
});

module.exports = router;
