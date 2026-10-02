// ============================================================
//  Rutas de ASISTENCIAS -> montadas en "/asistencias"
//  GET /asistencias/:usuarioId  -> CALENDARIO COMPLETO del mes del estudiante
//
//  El servidor arma el calendario: días de semana PRESENTE, fines de semana
//  SIN_CLASE, y encima los días especiales (FALTA/TARDANZA/JUSTIFICADO) que
//  están guardados en la base. Antes esa lógica la hacía la app; ahora solo
//  consume este calendario ya listo.
// ============================================================
const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();
const TABLA = "asistencias";

// Mes que representa el calendario (los días especiales de la base son de este mes).
// 'MES' es 1-12; en JavaScript los meses van 0-11, por eso se resta 1 al usar Date.
const NOMBRE_MES = "Septiembre 2026";
const ANIO = 2026;
const MES = 9; // Septiembre

router.get("/:usuarioId", async (req, res) => {
  const usuarioId = req.params.usuarioId;

  // 1) Traer solo los días especiales guardados de ese estudiante.
  const respuesta = await supabase
    .from(TABLA).select("dia, estado").eq("usuario_id", usuarioId);

  if (respuesta.error) {
    res.status(500).json({ error: respuesta.error.message });
    return;
  }

  // Mapa rápido: dia -> estado especial.
  const especiales = {};
  for (const fila of respuesta.data) {
    especiales[fila.dia] = fila.estado;
  }

  // 2) Datos del mes calculados en el servidor.
  const diasDelMes = new Date(ANIO, MES, 0).getDate();          // 30 en septiembre
  const offsetPrimerDia = new Date(ANIO, MES - 1, 1).getDay();  // 0=Dom ... 6=Sáb

  // 3) Armar el estado de cada día del mes como un mapa { dia: estado }.
  //    La app lo consume directo (día -> estado), sin convertir.
  const asistencia = {};
  for (let d = 1; d <= diasDelMes; d++) {
    const diaSemana = new Date(ANIO, MES - 1, d).getDay();
    // Base: fin de semana = sin clase; día de semana = presente.
    let estado = (diaSemana === 0 || diaSemana === 6) ? "SIN_CLASE" : "PRESENTE";
    // Si hay un día especial guardado, ese manda.
    if (especiales[d]) estado = especiales[d];
    asistencia[d] = estado;
  }

  res.json({
    mes: NOMBRE_MES,
    diasDelMes: diasDelMes,
    offsetPrimerDia: offsetPrimerDia,
    asistencia: asistencia
  });
});

module.exports = router;
