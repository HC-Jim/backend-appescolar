-- ============================================================
--  Agrega coordenadas (lat/lng) a los alumnos para el mapa.
--  Ejecutar en: Supabase -> SQL Editor -> New query -> Run
--  Punto de referencia: 12 01'14.0"S 76 57'26.4"W  ->  -12.020556, -76.957333
-- ============================================================

-- 1) Nuevas columnas
alter table alumnos add column if not exists lat double precision;
alter table alumnos add column if not exists lng double precision;

-- 2) Coordenadas de ejemplo cerca del punto de referencia
--    (se ubican por nombre; ajusta si tus nombres son distintos)
update alumnos set lat = -12.0188, lng = -76.9555 where nombre = 'José Fernández';
update alumnos set lat = -12.0199, lng = -76.9542 where nombre = 'Sofía Ramírez';
update alumnos set lat = -12.0221, lng = -76.9588 where nombre = 'Sebastián León';
update alumnos set lat = -12.0235, lng = -76.9561 where nombre = 'Mateo Vargas';

-- Si tienes otros alumnos sin coordenadas, dales un valor cercano por defecto:
update alumnos set lat = -12.0205, lng = -76.9573 where lat is null;
