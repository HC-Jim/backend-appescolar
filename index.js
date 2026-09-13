// ============================================================
//  API de la App Escolar - Node.js + Express + Supabase
//  Sintaxis basica. CRUD de "alumnos" con todos los metodos HTTP.
// ============================================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

// --- Conexion a Supabase ---
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// --- Configuracion del servidor ---
const app = express();
app.use(cors());            // permite que la app Android llame a la API
app.use(express.json());    // permite leer JSON del body

// Nombre de la tabla en Supabase
const TABLA = "alumnos";

// ------------------------------------------------------------
// Ruta de prueba (para saber que la API esta viva)
// GET /
// ------------------------------------------------------------
app.get("/", (req, res) => {
  res.json({ mensaje: "API App Escolar funcionando 🚌" });
});

// ------------------------------------------------------------
// GET /alumnos  -> lista todos los alumnos
// ------------------------------------------------------------
app.get("/alumnos", async (req, res) => {
  const { data, error } = await supabase.from(TABLA).select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// ------------------------------------------------------------
// GET /alumnos/:id  -> un alumno por su id
// ------------------------------------------------------------
app.get("/alumnos/:id", async (req, res) => {
  const id = req.params.id;

  const { data, error } = await supabase
    .from(TABLA)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({ error: "Alumno no encontrado" });
  }
  res.json(data);
});

// ------------------------------------------------------------
// POST /alumnos  -> crea un alumno nuevo
// Body JSON: { "nombre": "...", "grado": "...", "direccion": "...", "paradero": "..." }
// ------------------------------------------------------------
app.post("/alumnos", async (req, res) => {
  const { nombre, grado, direccion, paradero } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: "El campo 'nombre' es obligatorio" });
  }

  const { data, error } = await supabase
    .from(TABLA)
    .insert([{ nombre, grado, direccion, paradero }])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json(data);
});

// ------------------------------------------------------------
// PUT /alumnos/:id  -> actualiza un alumno existente
// ------------------------------------------------------------
app.put("/alumnos/:id", async (req, res) => {
  const id = req.params.id;
  const { nombre, grado, direccion, paradero } = req.body;

  const { data, error } = await supabase
    .from(TABLA)
    .update({ nombre, grado, direccion, paradero })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// ------------------------------------------------------------
// DELETE /alumnos/:id  -> borra un alumno
// ------------------------------------------------------------
app.delete("/alumnos/:id", async (req, res) => {
  const id = req.params.id;

  const { error } = await supabase.from(TABLA).delete().eq("id", id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json({ mensaje: "Alumno eliminado" });
});

// ------------------------------------------------------------
// Arranque del servidor
// ------------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor escuchando en el puerto " + PORT);
});
