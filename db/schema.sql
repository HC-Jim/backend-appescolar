-- ============================================================
--  Esquema completo de la App Escolar (Supabase / PostgreSQL)
--  Ejecutar en: Supabase -> SQL Editor -> New query -> Run
--  Nota: si ya creaste "alumnos" antes, usa "migracion.sql".
-- ============================================================

-- --- Alumnos (rol Conductor: ruta y entregas) ---
create table if not exists alumnos (
  id            bigint generated always as identity primary key,
  nombre        text not null,
  grado         text,
  direccion     text,
  paradero      text,
  hora_entrega  text,
  estado        text default 'PENDIENTE',   -- PENDIENTE | ABORDO | ENTREGADO
  creado_en     timestamptz default now()
);

-- --- Comunicados (rol Apoderado) ---
create table if not exists comunicados (
  id        bigint generated always as identity primary key,
  titulo    text not null,
  detalle   text,
  fecha     text,
  creado_en timestamptz default now()
);

-- --- Notas (rol Apoderado) ---
create table if not exists notas (
  id        bigint generated always as identity primary key,
  curso     text not null,
  detalle   text,
  valor     text,
  creado_en timestamptz default now()
);

-- --- Hijos (rol Apoderado) ---
create table if not exists hijos (
  id              bigint generated always as identity primary key,
  nombre          text not null,
  grado           text,
  movilidad       text,
  paradero        text,
  contacto_nombre text,
  contacto_rol    text,
  creado_en       timestamptz default now()
);

-- ============================================================
--  Datos de ejemplo
-- ============================================================
insert into alumnos (nombre, grado, direccion, paradero, hora_entrega, estado) values
  ('José Fernández', '5° Prim.', 'Av. Los Álamos 145', 'Paradero 1', '07:12', 'ENTREGADO'),
  ('Sofía Ramírez',  '5° Prim.', 'Calle Magnolia 128', 'Paradero 2', '07:18', 'ENTREGADO'),
  ('Sebastián León', '5° Prim.', 'Calle Bolívar 4',    'Paradero 6', null,    'ABORDO'),
  ('Mateo Vargas',   '5° Prim.', 'Jr. Ayacucho 58',    'Paradero 7', null,    'PENDIENTE');

insert into comunicados (titulo, detalle, fecha) values
  ('Reunión de apoderados', 'Aula 5° Primaria · 6:00 p.m.', 'Lun 23'),
  ('Simulacro de sismo',    'Toda la institución',          'Mar 24'),
  ('Entrega de libretas',   'Auditorio principal',          'Mié 25');

insert into notas (curso, detalle, valor) values
  ('Matemática',    'Examen bimestral',    '18'),
  ('Comunicación',  'Comprensión lectora', '17'),
  ('Ciencia y Tec.', 'Proyecto de feria',  '20');

insert into hijos (nombre, grado, movilidad, paradero, contacto_nombre, contacto_rol) values
  ('Julio Zuñiga', '5° Primaria', 'Movilidad N°04', 'Paradero Av. Principal', 'Carlos García', 'Conductor'),
  ('María Zuñiga', '1° Primaria', 'Movilidad N°04', 'Paradero Av. Principal', 'Carlos García', 'Conductor');
