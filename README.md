# Mi Glow Up

Mi plan de glow up como app para el celular: entreno, comida, skincare, maquillaje y cabello, con checklist diaria, vasos de agua y **recordatorios que te llegan al teléfono aunque la app esté cerrada**. Se instala como app y funciona sin internet.

## Secciones

| Pestaña | Qué tiene |
|---|---|
| **Hoy** | Tira con los días de la semana (toca uno para ver qué toca), entreno del día, checklist diaria con anillo de progreso, 8 vasos de agua, qué toca de piel y cabello, metas de energía y qué esperar. |
| **Entreno** | La semana, la rutina de glúteos y piernas (toca cada ejercicio para ver la técnica y el video), cómo progresar, videos de cardio y abs y bíceps. |
| **Comida** | El plato, las reglas y un día de ejemplo. |
| **Piel** | Skincare (mañana y semana de ácidos) y Maquillaje (pasos y productos essence). |
| **Cabello** | Calendario capilar, lavado, mascarillas, cuidado de puntas y productos económicos. |
| **Campanita** | Tus recordatorios: crear, editar, apagar y borrar; ideas rápidas de tu plan; agua y hora de dormir; tu cuenta y los avisos al teléfono. |

Lo diario (checklist y agua) se reinicia cada día. Todo se guarda en el dispositivo y, si entras con tu cuenta, también en Supabase.

## Ver la app

- Con **Go Live** (Live Server) en VS Code: abre la carpeta y te lleva a `prototype/index.html`.
- Publicada con **GitHub Pages**: Settings del repo → Pages → *Deploy from a branch* → la rama y la carpeta `/ (root)`. Queda en `https://TU-USUARIO.github.io/My-Life-OS/`.

## Instalarla en el celular

1. Ábrela desde https (GitHub Pages) o Live Server, no como archivo.
2. **iPhone**: Safari → Compartir → **Agregar a inicio**. **Android**: Chrome → menú ⋮ → **Instalar app**.

## Recordatorios al teléfono

Los recordatorios funcionan igual que en la versión anterior de la app y usan las mismas piezas de Supabase:

- **Con la app abierta**, te avisa siempre.
- **Con la app cerrada** llegan por Web Push (gratis). Un reloj de Supabase (pg_cron) llama cada minuto a la función `avisos`, que lee tus recordatorios de la tabla `mlos_state` y manda los que toquen a cada dispositivo activado. El de agua no suena si ya tomaste tus 8 vasos.

**Una sola vez, en Supabase** (si ya lo hiciste para la app anterior, no hace falta repetirlo):

1. **SQL Editor** → pega [`supabase/setup.sql`](supabase/setup.sql) → **Run**. Crea la tabla `mlos_state` con reglas para que cada persona solo vea lo suyo.
2. **Authentication → Sign In / Providers → Email** activado. En **URL Configuration** pon la dirección de la app en *Site URL* y *Redirect URLs*.
3. **Edge Functions → Deploy a new function → Via Editor** → nombre `avisos` → pega [`supabase/functions/avisos/index.ts`](supabase/functions/avisos/index.ts) → **Deploy**. En sus ajustes apaga **Verify JWT**.
4. **SQL Editor** → pega [`supabase/avisos.sql`](supabase/avisos.sql) → **Run**. Crea las tablas de avisos y el reloj de cada minuto.
5. Los datos de conexión van en [`prototype/config.js`](prototype/config.js) (Project URL y la clave pública *anon* o *publishable*; nunca la `service_role`).

**En cada teléfono**: campanita → **Tu cuenta** → entra con tu email y contraseña → **Activar avisos**. Llega un aviso de prueba. En iPhone, primero instala la app con "Agregar a inicio" y ábrela desde el ícono (iOS 16.4 o más nuevo).

Si tenías recordatorios de la app anterior, al entrar se juntan con los nuevos y aparecen en la lista.

## Archivos

| Archivo | Qué es |
|---|---|
| `prototype/index.html` | La app completa |
| `prototype/sw.js` | Guarda la app para usarla sin internet y muestra los avisos |
| `prototype/manifest.webmanifest`, `icon*` | Para instalarla como app |
| `prototype/config.js` | Conexión con Supabase |
| `prototype/vendor/supabase.js` | Cliente de Supabase |
| `supabase/setup.sql` | Tabla donde se guardan tus datos |
| `supabase/avisos.sql`, `supabase/functions/avisos/` | Avisos con la app cerrada |
