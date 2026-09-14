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

// POST /usuarios/registrar -> crear cuenta
router.post("/registrar", async (req, res) => {
  const nuevo = {
    nombre: req.body.nombre,
    correo: req.body.correo,
    contrasena: req.body.contrasena,
    pregunta: req.body.pregunta,
    respuesta: req.body.respuesta,
    rol: req.body.rol,
    estudiante_nombre: req.body.estudiante_nombre,
    estudiante_grado: req.body.estudiante_grado,
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

  res.status(201).json(respuesta.data);
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

  res.json(respuesta.data);
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
  const nuevaContrasena = req.body.nueva_contrasena;

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

module.exports = router;
