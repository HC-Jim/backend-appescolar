// ============================================================
//  Rutas de ALUMNOS (rol Conductor)
//  Se montan bajo "/alumnos" en app.js, por eso aquí las rutas
//  empiezan en "/" y "/:id".
// ============================================================
const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();
const TABLA = "alumnos";

// GET /alumnos -> lista todos
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from(TABLA).select("*").order("id");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /alumnos/:id -> uno por id
router.get("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from(TABLA).select("*").eq("id", req.params.id).single();
  if (error) return res.status(404).json({ error: "Alumno no encontrado" });
  res.json(data);
});

// POST /alumnos -> crear
router.post("/", async (req, res) => {
  const { nombre, grado, direccion, paradero, hora_entrega, estado } = req.body;
  if (!nombre) return res.status(400).json({ error: "El campo 'nombre' es obligatorio" });

  const { data, error } = await supabase
    .from(TABLA)
    .insert([{ nombre, grado, direccion, paradero, hora_entrega, estado }])
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /alumnos/:id -> actualizar
router.put("/:id", async (req, res) => {
  const { nombre, grado, direccion, paradero, hora_entrega, estado } = req.body;
  const { data, error } = await supabase
    .from(TABLA)
    .update({ nombre, grado, direccion, paradero, hora_entrega, estado })
    .eq("id", req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE /alumnos/:id -> borrar
router.delete("/:id", async (req, res) => {
  const { error } = await supabase.from(TABLA).delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ mensaje: "Alumno eliminado" });
});

module.exports = router;
