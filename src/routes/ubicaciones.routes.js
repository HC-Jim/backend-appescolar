// ============================================================
//  Rutas de UBICACIONES (seguimiento del bus) -> montadas en "/ubicaciones"
//
//  - El CONDUCTOR envia su posicion:   PUT /ubicaciones/:movilidad  { lat, lng }
//  - El APODERADO lee la posicion:     GET /ubicaciones/:movilidad
// ============================================================
const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();
const TABLA = "ubicaciones";

// GET /ubicaciones/:movilidad -> ultima posicion del bus
router.get("/:movilidad", async (req, res) => {
  const movilidad = req.params.movilidad;
  const respuesta = await supabase.from(TABLA).select("*").eq("movilidad", movilidad).single();

  if (respuesta.error) {
    res.status(404).json({ error: "Sin ubicacion para esa movilidad" });
    return;
  }

  res.json(respuesta.data);
});

// PUT /ubicaciones/:movilidad -> guarda/actualiza la posicion (upsert)
router.put("/:movilidad", async (req, res) => {
  const movilidad = req.params.movilidad;
  const lat = req.body.lat;
  const lng = req.body.lng;

  if (lat == null || lng == null) {
    res.status(400).json({ error: "Faltan 'lat' y/o 'lng'" });
    return;
  }

  const fila = {
    movilidad: movilidad,
    lat: lat,
    lng: lng,
    actualizado_en: new Date()
  };

  // upsert: inserta si no existe, actualiza si ya existe (clave = movilidad)
  const respuesta = await supabase.from(TABLA).upsert(fila, { onConflict: "movilidad" }).select().single();

  if (respuesta.error) {
    res.status(500).json({ error: respuesta.error.message });
    return;
  }

  res.json(respuesta.data);
});

module.exports = router;
