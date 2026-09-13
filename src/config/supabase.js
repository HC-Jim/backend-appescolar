// ============================================================
//  Conexión a Supabase (se crea UNA sola vez y se reutiliza)
// ============================================================
const { createClient } = require("@supabase/supabase-js");

// Lee las credenciales de las variables de entorno (.env / Render).
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = supabase;
