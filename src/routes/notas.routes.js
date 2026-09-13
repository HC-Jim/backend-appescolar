// ============================================================
//  Rutas de NOTAS (rol Apoderado) -> montadas en "/notas"
// ============================================================
const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();
const TABLA = "notas";

// GET /notas
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from(TABLA).select("*").order("id");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /notas/:id
router.get("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from(TABLA).select("*").eq("id", req.params.id).single();
  if (error) return res.status(404).json({ error: "Nota no encontrada" });
  res.json(data);
});

// POST /notas
router.post("/", async (req, res) => {
  const { curso, detalle, valor } = req.body;
  if (!curso) return res.status(400).json({ error: "El campo 'curso' es obligatorio" });

  const { data, error } = await supabase
    .from(TABLA).insert([{ curso, detalle, valor }]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /notas/:id
router.put("/:id", async (req, res) => {
  const { curso, detalle, valor } = req.body;
  const { data, error } = await supabase
    .from(TABLA).update({ curso, detalle, valor })
    .eq("id", req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE /notas/:id
router.delete("/:id", async (req, res) => {
  const { error } = await supabase.from(TABLA).delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ mensaje: "Nota eliminada" });
});

module.exports = router;
