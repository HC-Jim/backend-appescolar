# API App Escolar

API REST simple hecha con **Node.js + Express** y **Supabase** como base de datos.
Gestiona alumnos con los métodos HTTP: `GET`, `POST`, `PUT`, `DELETE`.

## Endpoints

| Método | Ruta            | Qué hace                     |
|--------|-----------------|------------------------------|
| GET    | `/`             | Comprueba que la API vive    |
| GET    | `/alumnos`      | Lista todos los alumnos      |
| GET    | `/alumnos/:id`  | Devuelve un alumno           |
| POST   | `/alumnos`      | Crea un alumno               |
| PUT    | `/alumnos/:id`  | Actualiza un alumno          |
| DELETE | `/alumnos/:id`  | Borra un alumno              |

Body JSON para POST y PUT:

```json
{ "nombre": "Ana Perez", "grado": "3ro A", "direccion": "Av. Los Olivos 123", "paradero": "Parque Central" }
```

---

## 1. Preparar Supabase

1. Entra en [supabase.com](https://supabase.com) y crea un proyecto.
2. Ve a **SQL Editor → New query**, pega el contenido de `schema.sql` y pulsa **Run**.
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
