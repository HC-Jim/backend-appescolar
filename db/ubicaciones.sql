-- ============================================================
--  Tabla de UBICACIONES (seguimiento del bus en el mapa)
--  Ejecutar en: Supabase -> SQL Editor -> New query -> Run
--  Guarda UNA fila por movilidad; se sobrescribe con la última posición.
-- ============================================================

create table if not exists ubicaciones (
  movilidad      text primary key,        -- ej. "Movilidad N°04"
  lat            double precision,
  lng            double precision,
  actualizado_en timestamptz default now()
);

-- Fila de ejemplo (opcional, para probar el GET)
insert into ubicaciones (movilidad, lat, lng) values
  ('Movilidad N°04', -12.046374, -77.042793)
on conflict (movilidad) do nothing;
