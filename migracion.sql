-- ============================================================
--  MIGRACIÓN: úsalo SOLO si ya habías corrido el schema.sql viejo
--  (la tabla "alumnos" ya existe con nombre/grado/direccion/paradero).
--  Añade columnas nuevas y crea las tablas que faltan, sin borrar datos.
--  Ejecutar en: Supabase -> SQL Editor -> New query -> Run
-- ============================================================

-- 1) Nuevas columnas en alumnos
alter table alumnos add column if not exists hora_entrega text;
alter table alumnos add column if not exists estado text default 'PENDIENTE';

-- 2) Tablas nuevas
create table if not exists comunicados (
  id        bigint generated always as identity primary key,
  titulo    text not null,
  detalle   text,
  fecha     text,
  creado_en timestamptz default now()
);

create table if not exists notas (
  id        bigint generated always as identity primary key,
  curso     text not null,
  detalle   text,
  valor     text,
  creado_en timestamptz default now()
);

create table if not exists hijos (
  id              bigint generated always as identity primary key,
  nombre          text,
  grado           text,
  movilidad       text,
  paradero        text,
  contacto_nombre text,
  contacto_rol    text,
  creado_en       timestamptz default now()
);

-- 3) Datos de ejemplo para las tablas nuevas
insert into comunicados (titulo, detalle, fecha) values
  ('Reunión de apoderados', 'Aula 5° Primaria · 6:00 p.m.', 'Lun 23'),
  ('Simulacro de sismo',    'Toda la institución',          'Mar 24'),
  ('Entrega de libretas',   'Auditorio principal',          'Mié 25');

insert into notas (curso, detalle, valor) values
  ('Matemática',   'Examen bimestral',    '18'),
  ('Comunicación', 'Comprensión lectora', '17');

insert into hijos (nombre, grado, movilidad, paradero, contacto_nombre, contacto_rol) values
  ('Julio Zuñiga', '5° Primaria', 'Movilidad N°04', 'Paradero Av. Principal', 'Carlos García', 'Conductor'),
  ('María Zuñiga', '1° Primaria', 'Movilidad N°04', 'Paradero Av. Principal', 'Carlos García', 'Conductor');
