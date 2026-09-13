// ============================================================
//  API de la App Escolar - Node.js + Express + Supabase
//  Sintaxis basica. Todos los metodos HTTP (GET, POST, PUT, DELETE)
//  para: alumnos, comunicados, notas e hijos.
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

// Ruta de prueba (para saber que la API esta viva)
app.get("/", (req, res) => {
  res.json({ mensaje: "API App Escolar funcionando 🚌" });
});

// ============================================================
//  ALUMNOS  (rol Conductor)
// ============================================================

// GET /alumnos -> lista todos
app.get("/alumnos", async (req, res) => {
  const { data, error } = await supabase.from("alumnos").select("*").order("id");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /alumnos/:id -> uno por id
app.get("/alumnos/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("alumnos").select("*").eq("id", req.params.id).single();
  if (error) return res.status(404).json({ error: "Alumno no encontrado" });
  res.json(data);
});

// POST /alumnos -> crear
app.post("/alumnos", async (req, res) => {
  const { nombre, grado, direccion, paradero, hora_entrega, estado } = req.body;
  if (!nombre) return res.status(400).json({ error: "El campo 'nombre' es obligatorio" });

  const { data, error } = await supabase
    .from("alumnos")
    .insert([{ nombre, grado, direccion, paradero, hora_entrega, estado }])
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /alumnos/:id -> actualizar
app.put("/alumnos/:id", async (req, res) => {
  const { nombre, grado, direccion, paradero, hora_entrega, estado } = req.body;
  const { data, error } = await supabase
    .from("alumnos")
    .update({ nombre, grado, direccion, paradero, hora_entrega, estado })
    .eq("id", req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE /alumnos/:id -> borrar
app.delete("/alumnos/:id", async (req, res) => {
  const { error } = await supabase.from("alumnos").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ mensaje: "Alumno eliminado" });
});

// ============================================================
//  COMUNICADOS  (rol Apoderado)
// ============================================================

app.get("/comunicados", async (req, res) => {
  const { data, error } = await supabase.from("comunicados").select("*").order("id");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get("/comunicados/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("comunicados").select("*").eq("id", req.params.id).single();
  if (error) return res.status(404).json({ error: "Comunicado no encontrado" });
  res.json(data);
});

app.post("/comunicados", async (req, res) => {
  const { titulo, detalle, fecha } = req.body;
  if (!titulo) return res.status(400).json({ error: "El campo 'titulo' es obligatorio" });

  const { data, error } = await supabase
    .from("comunicados").insert([{ titulo, detalle, fecha }]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

app.put("/comunicados/:id", async (req, res) => {
  const { titulo, detalle, fecha } = req.body;
  const { data, error } = await supabase
    .from("comunicados").update({ titulo, detalle, fecha })
    .eq("id", req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete("/comunicados/:id", async (req, res) => {
  const { error } = await supabase.from("comunicados").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ mensaje: "Comunicado eliminado" });
});

// ============================================================
//  NOTAS  (rol Apoderado)
// ============================================================

app.get("/notas", async (req, res) => {
  const { data, error } = await supabase.from("notas").select("*").order("id");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get("/notas/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("notas").select("*").eq("id", req.params.id).single();
  if (error) return res.status(404).json({ error: "Nota no encontrada" });
  res.json(data);
});

app.post("/notas", async (req, res) => {
  const { curso, detalle, valor } = req.body;
  if (!curso) return res.status(400).json({ error: "El campo 'curso' es obligatorio" });

  const { data, error } = await supabase
    .from("notas").insert([{ curso, detalle, valor }]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

app.put("/notas/:id", async (req, res) => {
  const { curso, detalle, valor } = req.body;
  const { data, error } = await supabase
    .from("notas").update({ curso, detalle, valor })
    .eq("id", req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete("/notas/:id", async (req, res) => {
  const { error } = await supabase.from("notas").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ mensaje: "Nota eliminada" });
});

// ============================================================
//  HIJOS  (rol Apoderado)
// ============================================================

app.get("/hijos", async (req, res) => {
  const { data, error } = await supabase.from("hijos").select("*").order("id");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get("/hijos/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("hijos").select("*").eq("id", req.params.id).single();
  if (error) return res.status(404).json({ error: "Hijo no encontrado" });
  res.json(data);
});

app.post("/hijos", async (req, res) => {
  const { nombre, grado, movilidad, paradero, contacto_nombre, contacto_rol } = req.body;
  if (!nombre) return res.status(400).json({ error: "El campo 'nombre' es obligatorio" });

  const { data, error } = await supabase
    .from("hijos")
    .insert([{ nombre, grado, movilidad, paradero, contacto_nombre, contacto_rol }])
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

app.put("/hijos/:id", async (req, res) => {
  const { nombre, grado, movilidad, paradero, contacto_nombre, contacto_rol } = req.body;
  const { data, error } = await supabase
    .from("hijos")
    .update({ nombre, grado, movilidad, paradero, contacto_nombre, contacto_rol })
    .eq("id", req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete("/hijos/:id", async (req, res) => {
  const { error } = await supabase.from("hijos").delete().eq("id", req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ mensaje: "Hijo eliminado" });
});

// ============================================================
//  Arranque del servidor
// ============================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor escuchando en el puerto " + PORT);
});
