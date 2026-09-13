// ============================================================
//  Rutas de HIJOS (rol Apoderado) -> montadas en "/hijos"
// ============================================================
const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();
const TABLA = "hijos";

// GET /hijos
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from(TABLA).select("*").order("id");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /hijos/:id
router.get("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from(TABLA).select("*").eq("id", req.params.id).single();
  if (error) return res.status(404).json({ error: "Hijo no encontrado" });
  res.json(data);
});

// POST /hijos
router.post("/", async (req, res) => {
  const { nombre, grado, movilidad, paradero, contacto_nombre, contacto_rol } = req.body;
  if (!nombre) return res.status(400).json({ error: "El campo 'nombre' es obligatorio" });

  const { data, error } = await supabase
    .from(TABLA)
    .insert([{ nombre, grado, movilidad, paradero, contacto_nombre, contacto_rol }])
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /hijos/:id
router.put("/:id", async (req, res) => {
  const { nombre, grado, movilidad, paradero, contacto_nombre, contacto_rol } = req.body;
  const { data, error } = await supabase
    .from(TABLA)
    .update({ nombre, grado, movilidad, paradero, contacto_nombre, contacto_rol })
    .eq("id", req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE /hijos/:id
router.delete("/:id", async (req, res) => {
  const { error } = await supabase.from(TABLA).delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ mensaje: "Hijo eliminado" });
});

module.exports = router;
