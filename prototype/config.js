// Conexión con tu proyecto de Supabase (para tener tus datos en todos tus dispositivos).
// Copiá los dos datos de Supabase → Project Settings → API:
//   url:     "Project URL", por ejemplo https://abcdefgh.supabase.co
//   anonKey: la clave pública "anon" (empieza con eyJ…) o "publishable" (empieza con sb_publishable_…)
// Esta clave es pública: está hecha para ir dentro de la app. Lo que protege tus datos son las reglas
// de supabase/setup.sql (cada persona solo puede ver y cambiar lo suyo).
// Nunca pongas acá la clave "service_role" ni la "secret".
// Si lo dejás vacío, podés cargar los datos desde Ajustes → Sincronizar en cada dispositivo.
window.MLOS_SUPABASE = {
  url: 'https://pmedkcicgwfjrhfzwxgp.supabase.co',
  anonKey: '' // ← pegá acá tu clave sb_publishable_… (botón de copiar en Project Settings → API Keys)
};
