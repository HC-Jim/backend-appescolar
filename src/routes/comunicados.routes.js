// ============================================================
//  Rutas de COMUNICADOS (rol Apoderado) -> montadas en "/comunicados"
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

// GET /comunicados/:id -> uno por id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const respuesta = await supabase.from(TABLA).select("*").eq("id", id).single();

  if (respuesta.error) {
    res.status(404).json({ error: "Comunicado no encontrado" });
    return;
  }

  res.json(respuesta.data);
});

// POST /comunicados -> crear
router.post("/", async (req, res) => {
  const titulo = req.body.titulo;
  const detalle = req.body.detalle;
  const fecha = req.body.fecha;

  if (!titulo) {
    res.status(400).json({ error: "El campo 'titulo' es obligatorio" });
    return;
  }

  const nuevoComunicado = {
    titulo: titulo,
    detalle: detalle,
    fecha: fecha
  };

  const respuesta = await supabase.from(TABLA).insert([nuevoComunicado]).select().single();

  if (respuesta.error) {
    res.status(500).json({ error: respuesta.error.message });
    return;
  }

  res.status(201).json(respuesta.data);
});

// PUT /comunicados/:id -> actualizar
router.put("/:id", async (req, res) => {
  const id = req.params.id;

  const cambios = {
    titulo: req.body.titulo,
    detalle: req.body.detalle,
    fecha: req.body.fecha
  };

  const respuesta = await supabase.from(TABLA).update(cambios).eq("id", id).select().single();

  if (respuesta.error) {
    res.status(500).json({ error: respuesta.error.message });
    return;
  }

  res.json(respuesta.data);
});

// DELETE /comunicados/:id -> borrar
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const respuesta = await supabase.from(TABLA).delete().eq("id", id);

  if (respuesta.error) {
    res.status(500).json({ error: respuesta.error.message });
    return;
  }

  res.json({ mensaje: "Comunicado eliminado" });
});

module.exports = router;
