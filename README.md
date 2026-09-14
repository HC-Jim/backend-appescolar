# API - Transporte Escolar

API REST de la aplicación de transporte escolar. Está hecha con Node.js, Express y
Supabase (PostgreSQL) como base de datos.

## Estructura

```
├── index.js              # arranca el servidor
├── src/
│   ├── app.js            # configura Express y engancha las rutas
│   ├── config/
│   │   └── supabase.js   # conexión a Supabase
│   └── routes/           # un archivo por recurso
│       ├── usuarios.routes.js
│       ├── alumnos.routes.js
│       ├── comunicados.routes.js
│       ├── notas.routes.js
│       ├── hijos.routes.js
│       └── ubicaciones.routes.js
└── db/                   # scripts SQL para crear las tablas
```

Una petición pasa por: `index.js` → `src/app.js` (elige la ruta según el prefijo)
→ `src/routes/<recurso>.routes.js` (hace la consulta) → `src/config/supabase.js`.

## Recursos

- **usuarios** — registro, inicio de sesión y recuperación de contraseña.
- **alumnos** — lista de estudiantes y su estado de entrega (rol conductor).
- **comunicados, notas, hijos** — información del estudiante (rol apoderado).
- **ubicaciones** — posición del bus para el seguimiento en el mapa.

Los recursos alumnos, comunicados, notas e hijos manejan los métodos
`GET`, `POST`, `PUT` y `DELETE`.

## Ejecutar en local

1. Instalar dependencias:

   ```
   npm install
   ```

2. Copiar `.env.example` a `.env` y completar `SUPABASE_URL` y `SUPABASE_KEY`
   (se obtienen en Supabase, en Project Settings → API).

3. Crear las tablas: en Supabase, ir a SQL Editor y correr los scripts de la
   carpeta `db/`.

4. Iniciar el servidor:

   ```
   npm start
   ```

   Queda disponible en `http://localhost:3000`.

## Desplegar en Render

- Build Command: `npm install`
- Start Command: `npm start`
- Variables de entorno: `SUPABASE_URL` y `SUPABASE_KEY`

Al terminar, Render entrega una URL pública que la app Android usa como servidor.
