// ============================================================
//  Rutas de HIJOS (rol Apoderado) -> montadas en "/hijos"
// ============================================================
const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();
const TABLA = "hijos";

// GET /hijos -> lista todos
router.get("/", async (req, res) => {
  const respuesta = await supabase.from(TABLA).select("*").order("id");

  if (respuesta.error) {
    res.status(500).json({ error: respuesta.error.message });
    return;
  }

  res.json(respuesta.data);
});

// GET /hijos/:id -> uno por id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const respuesta = await supabase.from(TABLA).select("*").eq("id", id).single();

  if (respuesta.error) {
    res.status(404).json({ error: "Hijo no encontrado" });
    return;
  }

  res.json(respuesta.data);
});

// POST /hijos -> crear
router.post("/", async (req, res) => {
  const nombre = req.body.nombre;
  const grado = req.body.grado;
  const movilidad = req.body.movilidad;
  const paradero = req.body.paradero;
  const contactoNombre = req.body.contacto_nombre;
  const contactoRol = req.body.contacto_rol;

  if (!nombre) {
    res.status(400).json({ error: "El campo 'nombre' es obligatorio" });
    return;
  }

  const nuevoHijo = {
    nombre: nombre,
    grado: grado,
    movilidad: movilidad,
    paradero: paradero,
    contacto_nombre: contactoNombre,
    contacto_rol: contactoRol
  };

  const respuesta = await supabase.from(TABLA).insert([nuevoHijo]).select().single();

  if (respuesta.error) {
    res.status(500).json({ error: respuesta.error.message });
    return;
  }

  res.status(201).json(respuesta.data);
});

// PUT /hijos/:id -> actualizar
router.put("/:id", async (req, res) => {
  const id = req.params.id;

  const cambios = {
    nombre: req.body.nombre,
    grado: req.body.grado,
    movilidad: req.body.movilidad,
    paradero: req.body.paradero,
    contacto_nombre: req.body.contacto_nombre,
    contacto_rol: req.body.contacto_rol
  };

  const respuesta = await supabase.from(TABLA).update(cambios).eq("id", id).select().single();

  if (respuesta.error) {
    res.status(500).json({ error: respuesta.error.message });
    return;
  }

  res.json(respuesta.data);
});

// DELETE /hijos/:id -> borrar
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const respuesta = await supabase.from(TABLA).delete().eq("id", id);

  if (respuesta.error) {
    res.status(500).json({ error: respuesta.error.message });
    return;
  }

  res.json({ mensaje: "Hijo eliminado" });
});

module.exports = router;
