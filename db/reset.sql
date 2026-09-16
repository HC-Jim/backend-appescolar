-- ============================================================
--  REINICIO COMPLETO de la base (borra TODO y vuelve a crear).
--  Deja las 5 tablas que usa la app con datos por defecto:
--    3 estudiantes + 1 conductor.
--  Ejecutar en: Supabase -> SQL Editor -> New query -> Run
--
--  OJO: esto BORRA los datos actuales. Es irreversible.
-- ============================================================

-- ------------------------------------------------------------
-- 1) Borrar tablas (las de la app + las viejas que ya no se usan)
-- ------------------------------------------------------------
drop table if exists asistencias cascade;
drop table if exists ubicaciones cascade;
drop table if exists comunicados cascade;
drop table if exists notas       cascade;
drop table if exists usuarios    cascade;

-- Tablas del modelo viejo / funciones eliminadas (por si aún existen)
drop table if exists alumnos               cascade;
drop table if exists hijos                 cascade;
drop table if exists pasos_ruta            cascade;
drop table if exists notificacion          cascade;
drop table if exists indicador_recurso     cascade;
drop table if exists abordaje              cascade;
drop table if exists ruta_paradero         cascade;
drop table if exists ruta                  cascade;
drop table if exists evento_participacion  cascade;
drop table if exists evento                cascade;
drop table if exists comunicado            cascade;
drop table if exists nota                  cascade;
drop table if exists justificacion         cascade;
drop table if exists asistencia            cascade;
drop table if exists apoderado_estudiante  cascade;
drop table if exists estudiante            cascade;
drop table if exists paradero              cascade;
drop table if exists vehiculo              cascade;
drop table if exists conductor             cascade;
drop table if exists apoderado             cascade;
drop table if exists curso                 cascade;
drop table if exists aula                  cascade;
drop table if exists codigo_verificacion   cascade;
drop table if exists usuario               cascade;

-- ------------------------------------------------------------
-- 2) USUARIOS (login de estudiantes + conductor precargado)
-- ------------------------------------------------------------
create table usuarios (
  id                  bigint generated always as identity primary key,
  nombre              text not null,
  correo              text not null unique,
  contrasena          text not null,
  pregunta            text,                       -- pregunta de seguridad
  respuesta           text,                       -- respuesta de seguridad
  rol                 text default 'ESTUDIANTE',  -- ESTUDIANTE | CONDUCTOR
  estudiante_nombre   text,
  estudiante_grado    text,
  movilidad           text,
  lat                 double precision,
  lng                 double precision,
  estado              text default 'PENDIENTE',   -- PENDIENTE | ENTREGADO | CANCELADO
  -- Perfil del conductor
  celular             text,
  contacto_emergencia text,
  dni                 text,
  licencia            text,
  placa               text,
  zona                text,
  creado_en           timestamptz default now()
);

-- 3 estudiantes (id 1, 2, 3). Contraseña de prueba: 123456
insert into usuarios (nombre, correo, contrasena, pregunta, respuesta, rol,
                      estudiante_nombre, estudiante_grado, movilidad, lat, lng, estado) values
  ('Marco Zuñiga',       'est1@colegio.com', '123456', '¿Nombre de tu mascota?', 'firulais',
   'ESTUDIANTE', 'Julio Zuñiga',    '5° Primaria', 'Movilidad N°04', -12.0210, -76.9575, 'PENDIENTE'),
  ('Padre de Sofía',     'est2@colegio.com', '123456', '¿Ciudad donde naciste?', 'lima',
   'ESTUDIANTE', 'Sofía Ramírez',   '5° Primaria', 'Movilidad N°04', -12.0199, -76.9542, 'PENDIENTE'),
  ('Padre de Sebastián', 'est3@colegio.com', '123456', '¿Color favorito?', 'azul',
   'ESTUDIANTE', 'Sebastián León',  '5° Primaria', 'Movilidad N°04', -12.0221, -76.9588, 'PENDIENTE');

-- 1 conductor (id 4). No se registra en la app, se precarga aquí.
insert into usuarios (nombre, correo, contrasena, pregunta, respuesta, rol, movilidad,
                      celular, contacto_emergencia, dni, licencia, placa, zona) values
  ('Carlos García', 'conductor@colegio.com', '123456', '¿Ciudad donde naciste?', 'lima',
   'CONDUCTOR', 'Movilidad N°04',
   '961 541 515', '954 784 548', '78445564', 'Ad4c548u4d', 'XYZ-123', 'RUTA 2');

-- ------------------------------------------------------------
-- 3) UBICACIONES (posición del bus en el mapa)
-- ------------------------------------------------------------
create table ubicaciones (
  movilidad      text primary key,
  lat            double precision,
  lng            double precision,
  actualizado_en timestamptz default now()
);

insert into ubicaciones (movilidad, lat, lng) values
  ('Movilidad N°04', -12.0205, -76.9560);

-- ------------------------------------------------------------
-- 4) ASISTENCIAS (días especiales del estudiante)
-- ------------------------------------------------------------
create table asistencias (
  id         bigint generated always as identity primary key,
  usuario_id bigint,
  dia        int,
  estado     text,   -- PRESENTE | TARDANZA | FALTA | JUSTIFICADO | SIN_CLASE
  creado_en  timestamptz default now()
);

-- Ejemplos para los 3 estudiantes (ids 1, 2 y 3). Septiembre 2026.
-- Solo se guardan los dias especiales; el resto la app los pinta PRESENTE/SIN_CLASE.
insert into asistencias (usuario_id, dia, estado) values
  -- Estudiante 1 (Julio)
  (1, 8,  'FALTA'),
  (1, 15, 'TARDANZA'),
  (1, 22, 'JUSTIFICADO'),
  -- Estudiante 2 (Sofía)
  (2, 3,  'TARDANZA'),
  (2, 10, 'FALTA'),
  (2, 24, 'JUSTIFICADO'),
  -- Estudiante 3 (Sebastián)
  (3, 9,  'JUSTIFICADO'),
  (3, 17, 'FALTA'),
  (3, 23, 'TARDANZA');

-- ------------------------------------------------------------
-- 5) COMUNICADOS (avisos del colegio)
-- ------------------------------------------------------------
create table comunicados (
  id        bigint generated always as identity primary key,
  titulo    text not null,
  detalle   text,
  fecha     text,
  creado_en timestamptz default now()
);

insert into comunicados (titulo, detalle, fecha) values
  ('Reunión de padres',   'Reunión general el viernes a las 6:00 pm.', '2026-09-20'),
  ('Simulacro de sismo',  'Mañana se realizará el simulacro a las 10 am.', '2026-09-17');

-- ------------------------------------------------------------
-- 6) NOTAS (calificaciones del estudiante)
-- ------------------------------------------------------------
create table notas (
  id        bigint generated always as identity primary key,
  curso     text not null,
  detalle   text,
  valor     text,
  creado_en timestamptz default now()
);

insert into notas (curso, detalle, valor) values
  ('Matemática',   'Examen bimestral', '18'),
  ('Comunicación', 'Trabajo grupal',   '16'),
  ('Ciencia',      'Proyecto',         '20');
