// ============================================================
//  Rutas de ALUMNOS (rol Conductor)
//  Se montan bajo "/alumnos" en app.js, por eso aqui las rutas
//  empiezan en "/" y "/:id".
// ============================================================
const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();
const TABLA = "alumnos";

// GET /alumnos -> lista todos
router.get("/", async (req, res) => {
  const respuesta = await supabase.from(TABLA).select("*").order("id");

  if (respuesta.error) {
    res.status(500).json({ error: respuesta.error.message });
    return;
  }

  res.json(respuesta.data);
});

// GET /alumnos/:id -> uno por id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const respuesta = await supabase.from(TABLA).select("*").eq("id", id).single();

  if (respuesta.error) {
    res.status(404).json({ error: "Alumno no encontrado" });
    return;
  }

  res.json(respuesta.data);
});

// POST /alumnos -> crear
router.post("/", async (req, res) => {
  const nombre = req.body.nombre;
  const grado = req.body.grado;
  const direccion = req.body.direccion;
  const paradero = req.body.paradero;
  const horaEntrega = req.body.hora_entrega;
  const estado = req.body.estado;

  if (!nombre) {
    res.status(400).json({ error: "El campo 'nombre' es obligatorio" });
    return;
  }

  const nuevoAlumno = {
    nombre: nombre,
    grado: grado,
    direccion: direccion,
    paradero: paradero,
    hora_entrega: horaEntrega,
    estado: estado
  };

  const respuesta = await supabase.from(TABLA).insert([nuevoAlumno]).select().single();

  if (respuesta.error) {
    res.status(500).json({ error: respuesta.error.message });
    return;
  }

  res.status(201).json(respuesta.data);
});

// PUT /alumnos/:id -> actualizar
router.put("/:id", async (req, res) => {
  const id = req.params.id;

  const cambios = {
    nombre: req.body.nombre,
    grado: req.body.grado,
    direccion: req.body.direccion,
    paradero: req.body.paradero,
    hora_entrega: req.body.hora_entrega,
    estado: req.body.estado
  };

  const respuesta = await supabase.from(TABLA).update(cambios).eq("id", id).select().single();

  if (respuesta.error) {
    res.status(500).json({ error: respuesta.error.message });
    return;
  }

  res.json(respuesta.data);
});

// DELETE /alumnos/:id -> borrar
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const respuesta = await supabase.from(TABLA).delete().eq("id", id);

  if (respuesta.error) {
    res.status(500).json({ error: respuesta.error.message });
    return;
  }

  res.json({ mensaje: "Alumno eliminado" });
});

module.exports = router;
