# API App Escolar

API REST simple hecha con **Node.js + Express** y **Supabase** como base de datos.
Gestiona alumnos, comunicados, notas e hijos con los métodos HTTP: `GET`, `POST`, `PUT`, `DELETE`.

## Estructura del proyecto

```
├── index.js              ← arranca el servidor (punto de entrada)
├── src/
│   ├── app.js            ← configura Express y engancha las rutas
│   ├── config/
│   │   └── supabase.js   ← conexión a Supabase (una sola vez)
│   └── routes/           ← una archivo de rutas por recurso
│       ├── alumnos.routes.js
│       ├── comunicados.routes.js
│       ├── notas.routes.js
│       └── hijos.routes.js
└── db/
    ├── schema.sql        ← crea todas las tablas (proyecto nuevo)
    └── migracion.sql     ← añade lo que falta (proyecto existente)
```

**Cómo fluye una petición:** `index.js` → `src/app.js` (elige la ruta según el prefijo)
→ `src/routes/<recurso>.routes.js` (ejecuta la consulta) → `src/config/supabase.js` (habla con Supabase).

## Endpoints

Cada recurso tiene los 5 métodos (mismo patrón): `GET` lista, `GET /:id` uno,
`POST` crear, `PUT /:id` actualizar, `DELETE /:id` borrar.

| Recurso        | Rutas                                             | Rol       |
|----------------|---------------------------------------------------|-----------|
| Estado API     | `GET /`                                           | —         |
| **alumnos**    | `/alumnos`, `/alumnos/:id`                         | Conductor |
| **comunicados**| `/comunicados`, `/comunicados/:id`                | Apoderado |
| **notas**      | `/notas`, `/notas/:id`                            | Apoderado |
| **hijos**      | `/hijos`, `/hijos/:id`                            | Apoderado |

Ejemplos de body JSON para `POST` / `PUT`:

```json
// alumnos
{ "nombre": "Ana Perez", "grado": "5° Prim.", "direccion": "Av. Los Olivos 123", "paradero": "Paradero 1", "hora_entrega": "07:20", "estado": "PENDIENTE" }

// comunicados
{ "titulo": "Reunión", "detalle": "Aula 5° · 6 p.m.", "fecha": "Lun 23" }

// notas
{ "curso": "Matemática", "detalle": "Examen bimestral", "valor": "18" }

// hijos
{ "nombre": "Julio Zuñiga", "grado": "5° Primaria", "movilidad": "Movilidad N°04", "paradero": "Paradero Av. Principal", "contacto_nombre": "Carlos García", "contacto_rol": "Conductor" }
```

> `estado` de un alumno: `PENDIENTE`, `ABORDO` o `ENTREGADO`.

---

## 1. Preparar Supabase

1. Entra en [supabase.com](https://supabase.com) y crea un proyecto.
2. Ve a **SQL Editor → New query** y pulsa **Run** con:
   - `db/schema.sql` → si es un proyecto **nuevo** (crea todas las tablas).
   - `db/migracion.sql` → si **ya** habías creado la tabla `alumnos` antes (añade columnas y tablas nuevas sin borrar datos).
3. Ve a **Project Settings → API** y copia:
   - **Project URL** → será tu `SUPABASE_URL`
   - La clave **`service_role`** (en "Project API keys") → será tu `SUPABASE_KEY`

## 2. Ejecutar en tu PC

```bash
npm install
```

Copia `.env.example` a `.env` y rellena tus datos de Supabase. Luego:

```bash
npm start
```

Abre http://localhost:3000/alumnos en el navegador.

## 3. Desplegar en Render

1. Sube esta carpeta a un repositorio de GitHub.
2. En [render.com](https://render.com) → **New → Web Service** → conecta ese repo.
3. Configura:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. En **Environment → Add Environment Variable** añade:
   - `SUPABASE_URL` = tu Project URL
   - `SUPABASE_KEY` = tu service_role key
   > No hace falta añadir `PORT`: Render lo asigna solo.
5. **Create Web Service**. Al terminar tendrás una URL pública tipo
   `https://backend-appescolar.onrender.com` para usar desde la app Android.
