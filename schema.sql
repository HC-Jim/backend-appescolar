-- Ejecuta esto en Supabase -> SQL Editor -> New query -> Run
-- Crea la tabla "alumnos" que usa la API.

create table if not exists alumnos (
  id         bigint generated always as identity primary key,
  nombre     text not null,
  grado      text,
  direccion  text,
  paradero   text,
  creado_en  timestamptz default now()
);

-- Datos de ejemplo (opcional)
insert into alumnos (nombre, grado, direccion, paradero) values
  ('Ana Perez',  '3ro A', 'Av. Los Olivos 123', 'Parque Central'),
  ('Luis Gomez', '3ro A', 'Jr. Las Flores 456', 'Esquina Mercado');
