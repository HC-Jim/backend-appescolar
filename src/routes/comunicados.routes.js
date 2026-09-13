// ============================================================
//  Rutas de COMUNICADOS (rol Apoderado) -> montadas en "/comunicados"
// ============================================================
const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();
const TABLA = "comunicados";

// GET /comunicados
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from(TABLA).select("*").order("id");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /comunicados/:id
router.get("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from(TABLA).select("*").eq("id", req.params.id).single();
  if (error) return res.status(404).json({ error: "Comunicado no encontrado" });
  res.json(data);
});

// POST /comunicados
router.post("/", async (req, res) => {
  const { titulo, detalle, fecha } = req.body;
  if (!titulo) return res.status(400).json({ error: "El campo 'titulo' es obligatorio" });

  const { data, error } = await supabase
    .from(TABLA).insert([{ titulo, detalle, fecha }]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /comunicados/:id
router.put("/:id", async (req, res) => {
  const { titulo, detalle, fecha } = req.body;
  const { data, error } = await supabase
    .from(TABLA).update({ titulo, detalle, fecha })
    .eq("id", req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE /comunicados/:id
router.delete("/:id", async (req, res) => {
  const { error } = await supabase.from(TABLA).delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ mensaje: "Comunicado eliminado" });
});

module.exports = router;
