// ============================================================
//  Rutas de USUARIOS (autenticación) -> montadas en "/usuarios"
//
//  - POST /usuarios/registrar          crea una cuenta
//  - POST /usuarios/login              valida correo + contraseña
//  - GET  /usuarios/pregunta/:correo   devuelve la pregunta de seguridad
//  - POST /usuarios/restablecer        cambia la contraseña respondiendo la pregunta
// ============================================================
const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();
const TABLA = "usuarios";

// Devuelve el usuario con la forma EXACTA que usa la app (camelCase), para que la
// app lo consuma directo sin convertir. Proyecto universitario: por simplicidad se
// incluyen también las credenciales (en una app real NO se devolverían).
function aUsuario(u) {
  if (!u) return null;
  return {
    id: u.id,
    nombre: u.nombre,
    correo: u.correo,
    rol: u.rol,
    contrasena: u.contrasena,
    pregunta: u.pregunta,
    respuesta: u.respuesta,
    estudianteNombre: u.estudiante_nombre,
    estudianteGrado: u.estudiante_grado,
    movilidad: u.movilidad,
    lat: u.lat,
    lng: u.lng,
    celular: u.celular,
    contactoEmergencia: u.contacto_emergencia,
    dni: u.dni,
    licencia: u.licencia,
    placa: u.placa,
    zona: u.zona,
    estado: u.estado
  };
}

// POST /usuarios/registrar -> crear cuenta
router.post("/registrar", async (req, res) => {
  const nuevo = {
    nombre: req.body.nombre,
    correo: req.body.correo,
    contrasena: req.body.contrasena,
    pregunta: req.body.pregunta,
    respuesta: req.body.respuesta,
    rol: req.body.rol,
    estudiante_nombre: req.body.estudianteNombre,
    estudiante_grado: req.body.estudianteGrado,
    movilidad: req.body.movilidad,
    lat: req.body.lat,
    lng: req.body.lng
  };

  if (!nuevo.nombre || !nuevo.correo || !nuevo.contrasena) {
    res.status(400).json({ error: "Nombre, correo y contraseña son obligatorios" });
    return;
  }

  const respuesta = await supabase.from(TABLA).insert([nuevo]).select().single();

  if (respuesta.error) {
    // 23505 = correo duplicado (unique)
    if (respuesta.error.code === "23505") {
      res.status(400).json({ error: "El correo ya está registrado" });
      return;
    }
    res.status(500).json({ error: respuesta.error.message });
    return;
  }

  res.status(201).json(aUsuario(respuesta.data));
});

// POST /usuarios/login -> validar credenciales
router.post("/login", async (req, res) => {
  const correo = req.body.correo;
  const contrasena = req.body.contrasena;

  const respuesta = await supabase
    .from(TABLA).select("*").eq("correo", correo).eq("contrasena", contrasena).single();

  if (respuesta.error || !respuesta.data) {
    res.status(401).json({ error: "Correo o contraseña incorrectos" });
    return;
  }

  res.json(aUsuario(respuesta.data));
});

// GET /usuarios/pregunta/:correo -> pregunta de seguridad de ese correo
router.get("/pregunta/:correo", async (req, res) => {
  const correo = req.params.correo;

  const respuesta = await supabase
    .from(TABLA).select("pregunta").eq("correo", correo).single();

  if (respuesta.error || !respuesta.data) {
    res.status(404).json({ error: "No existe una cuenta con ese correo" });
    return;
  }

  res.json({ pregunta: respuesta.data.pregunta });
});

// POST /usuarios/restablecer -> cambia la contraseña si la respuesta coincide
router.post("/restablecer", async (req, res) => {
  const correo = req.body.correo;
  const respuestaSeguridad = req.body.respuesta;
  const nuevaContrasena = req.body.nuevaContrasena;

  if (!nuevaContrasena) {
    res.status(400).json({ error: "Debes indicar la nueva contraseña" });
    return;
  }

  // Busca el usuario y compara la respuesta de seguridad.
  const usuario = await supabase
    .from(TABLA).select("id, respuesta").eq("correo", correo).single();

  if (usuario.error || !usuario.data) {
    res.status(404).json({ error: "No existe una cuenta con ese correo" });
    return;
  }

  if ((usuario.data.respuesta || "").toLowerCase() !== (respuestaSeguridad || "").toLowerCase()) {
    res.status(400).json({ error: "La respuesta de seguridad no coincide" });
    return;
  }

  const actualizado = await supabase
    .from(TABLA).update({ contrasena: nuevaContrasena }).eq("id", usuario.data.id);

  if (actualizado.error) {
    res.status(500).json({ error: actualizado.error.message });
    return;
  }

  res.json({ mensaje: "Contraseña actualizada" });
});

// GET /usuarios/estudiantes/:movilidad -> estudiantes de esa movilidad (para el conductor)
// Devuelve la forma "alumno" ya lista para la app (la app la consume directo, sin convertir).
router.get("/estudiantes/:movilidad", async (req, res) => {
  const movilidad = req.params.movilidad;
  const respuesta = await supabase
    .from(TABLA).select("*").eq("rol", "ESTUDIANTE").eq("movilidad", movilidad).order("id");

  if (respuesta.error) {
    res.status(500).json({ error: respuesta.error.message });
    return;
  }

  // Transforma cada usuario en un "alumno" con los nombres y campos que usa la app.
  const alumnos = respuesta.data.map((u) => ({
    id: String(u.id),
    nombre: u.estudiante_nombre || u.nombre || "Estudiante",
    grado: u.estudiante_grado || "",
    direccion: "",
    paradero: u.movilidad || "",
    estado: u.estado || "PENDIENTE",   // PENDIENTE | ENTREGADO | CANCELADO
    lat: u.lat,
    lng: u.lng
  }));

  res.json(alumnos);
});

// PUT /usuarios/estudiantes/:movilidad/reiniciar
// Reinicia la ruta: pone TODOS los estudiantes de la movilidad en PENDIENTE
// en una sola operación (antes la app hacía una llamada por cada estudiante).
router.put("/estudiantes/:movilidad/reiniciar", async (req, res) => {
  const movilidad = req.params.movilidad;
  const respuesta = await supabase
    .from(TABLA)
    .update({ estado: "PENDIENTE" })
    .eq("rol", "ESTUDIANTE")
    .eq("movilidad", movilidad)
    .select();

  if (respuesta.error) {
    res.status(500).json({ error: respuesta.error.message });
    return;
  }

  res.json({ actualizados: respuesta.data.length });
});

// GET /usuarios/:id -> devuelve un usuario (para consultar su estado)
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const respuesta = await supabase.from(TABLA).select("*").eq("id", id).single();

  if (respuesta.error || !respuesta.data) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }

  res.json(aUsuario(respuesta.data));
});

// PUT /usuarios/:id/estado -> cambia el estado del estudiante (PENDIENTE/ENTREGADO/CANCELADO)
router.put("/:id/estado", async (req, res) => {
  const id = req.params.id;
  const estado = req.body.estado;

  const respuesta = await supabase
    .from(TABLA).update({ estado: estado }).eq("id", id).select().single();

  if (respuesta.error) {
    res.status(500).json({ error: respuesta.error.message });
    return;
  }

  res.json(aUsuario(respuesta.data));
});

// PUT /usuarios/:id -> actualiza los datos personales del perfil.
// Solo cambia los campos que llegan en el body (nombre, celular, correo, contrasena).
router.put("/:id", async (req, res) => {
  const id = req.params.id;

  const cambios = {};
  if (req.body.nombre !== undefined) cambios.nombre = req.body.nombre;
  if (req.body.celular !== undefined) cambios.celular = req.body.celular;
  if (req.body.correo !== undefined) cambios.correo = req.body.correo;
  // La contraseña solo se cambia si llega y no viene vacía.
  if (req.body.contrasena) cambios.contrasena = req.body.contrasena;

  if (Object.keys(cambios).length === 0) {
    res.status(400).json({ error: "No hay datos para actualizar" });
    return;
  }

  const respuesta = await supabase
    .from(TABLA).update(cambios).eq("id", id).select().single();

  if (respuesta.error) {
    res.status(500).json({ error: respuesta.error.message });
    return;
  }

  res.json(aUsuario(respuesta.data));
});

module.exports = router;
