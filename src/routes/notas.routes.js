// ============================================================
//  Rutas de NOTAS (rol Estudiante) -> montadas en "/notas"
// ============================================================
const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();
const TABLA = "notas";

// GET /notas -> lista todas
router.get("/", async (req, res) => {
  const respuesta = await supabase.from(TABLA).select("*").order("id");

  if (respuesta.error) {
    res.status(500).json({ error: respuesta.error.message });
    return;
  }

  res.json(respuesta.data);
});

module.exports = router;
