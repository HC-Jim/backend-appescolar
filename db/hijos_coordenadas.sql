-- ============================================================
--  Agrega coordenadas (lat/lng) a los hijos para el mapa del apoderado.
--  Ejecutar en: Supabase -> SQL Editor -> New query -> Run
--  Punto de referencia: -12.020556, -76.957333
-- ============================================================

alter table hijos add column if not exists lat double precision;
alter table hijos add column if not exists lng double precision;

-- Punto de recogida de cada hijo (cerca del punto de referencia)
update hijos set lat = -12.0210, lng = -76.9575 where nombre = 'Julio Zuñiga';
update hijos set lat = -12.0218, lng = -76.9569 where nombre = 'María Zuñiga';

-- Cualquier otro hijo sin coordenadas recibe una por defecto
update hijos set lat = -12.0205, lng = -76.9573 where lat is null;
