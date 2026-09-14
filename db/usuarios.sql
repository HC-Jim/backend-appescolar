-- ============================================================
--  Tabla de USUARIOS (login, registro, recuperación de contraseña)
--  Cada usuario tiene UN solo estudiante asociado (para el rol Apoderado).
--  Ejecutar en: Supabase -> SQL Editor -> New query -> Run
-- ============================================================

create table if not exists usuarios (
  id                 bigint generated always as identity primary key,
  nombre             text not null,
  correo             text not null unique,
  contrasena         text not null,
  pregunta           text,              -- pregunta de seguridad
  respuesta          text,              -- respuesta de seguridad
  rol                text default 'ESTUDIANTE',  -- ESTUDIANTE | CONDUCTOR
  -- Datos del único estudiante del usuario (para el rol Apoderado)
  estudiante_nombre  text,
  estudiante_grado   text,
  movilidad          text,
  lat                double precision,
  lng                double precision,
  creado_en          timestamptz default now()
);

-- Usuarios de ejemplo (contraseña de prueba: 123456)
insert into usuarios (nombre, correo, contrasena, pregunta, respuesta, rol,
                      estudiante_nombre, estudiante_grado, movilidad, lat, lng) values
  ('Marco Zuñiga', 'apoderado@colegio.com', '123456', '¿Nombre de tu mascota?', 'firulais',
   'ESTUDIANTE', 'Julio Zuñiga', '5° Primaria', 'Movilidad N°04', -12.0210, -76.9575),
  ('Carlos García', 'conductor@colegio.com', '123456', '¿Ciudad donde naciste?', 'lima',
   'CONDUCTOR', null, null, 'Movilidad N°04', null, null)
on conflict (correo) do nothing;

-- Si ya tenías filas con el rol viejo, actualízalas:
update usuarios set rol = 'ESTUDIANTE' where rol = 'APODERADO';
