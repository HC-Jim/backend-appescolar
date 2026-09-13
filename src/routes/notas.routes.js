// ============================================================
//  Rutas de NOTAS (rol Apoderado) -> montadas en "/notas"
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

// GET /notas/:id -> una por id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const respuesta = await supabase.from(TABLA).select("*").eq("id", id).single();

  if (respuesta.error) {
    res.status(404).json({ error: "Nota no encontrada" });
    return;
  }

  res.json(respuesta.data);
});

// POST /notas -> crear
router.post("/", async (req, res) => {
  const curso = req.body.curso;
  const detalle = req.body.detalle;
  const valor = req.body.valor;

  if (!curso) {
    res.status(400).json({ error: "El campo 'curso' es obligatorio" });
    return;
  }

  const nuevaNota = {
    curso: curso,
    detalle: detalle,
    valor: valor
  };

  const respuesta = await supabase.from(TABLA).insert([nuevaNota]).select().single();

  if (respuesta.error) {
    res.status(500).json({ error: respuesta.error.message });
    return;
  }

  res.status(201).json(respuesta.data);
});

// PUT /notas/:id -> actualizar
router.put("/:id", async (req, res) => {
  const id = req.params.id;

  const cambios = {
    curso: req.body.curso,
    detalle: req.body.detalle,
    valor: req.body.valor
  };

  const respuesta = await supabase.from(TABLA).update(cambios).eq("id", id).select().single();

  if (respuesta.error) {
    res.status(500).json({ error: respuesta.error.message });
    return;
  }

  res.json(respuesta.data);
});

// DELETE /notas/:id -> borrar
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const respuesta = await supabase.from(TABLA).delete().eq("id", id);

  if (respuesta.error) {
    res.status(500).json({ error: respuesta.error.message });
    return;
  }

  res.json({ mensaje: "Nota eliminada" });
});

module.exports = router;
