// ============================================================
//  Rutas de UBICACIONES (seguimiento del bus) -> montadas en "/ubicaciones"
//
//  - El CONDUCTOR envía su posición:   PUT /ubicaciones/:movilidad  { lat, lng }
//  - El APODERADO lee la posición:     GET /ubicaciones/:movilidad
// ============================================================
const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();
const TABLA = "ubicaciones";

// GET /ubicaciones/:movilidad -> última posición del bus
router.get("/:movilidad", async (req, res) => {
  const { data, error } = await supabase
    .from(TABLA).select("*").eq("movilidad", req.params.movilidad).single();
  if (error) return res.status(404).json({ error: "Sin ubicación para esa movilidad" });
  res.json(data);
});

// PUT /ubicaciones/:movilidad -> guarda/actualiza la posición (upsert)
router.put("/:movilidad", async (req, res) => {
  const { lat, lng } = req.body;
  if (lat == null || lng == null) {
    return res.status(400).json({ error: "Faltan 'lat' y/o 'lng'" });
  }

  const fila = {
    movilidad: req.params.movilidad,
    lat,
    lng,
    actualizado_en: new Date()
  };

  // upsert: inserta si no existe, actualiza si ya existe (clave = movilidad)
  const { data, error } = await supabase
    .from(TABLA).upsert(fila, { onConflict: "movilidad" }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;
