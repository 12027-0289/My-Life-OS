# My Life OS

Una app para organizar toda tu vida desde un solo lugar: checklist diario, ejercicio, alimentación, sueño, hábitos, ánimo y diario, plata, skincare, closet, metas, estudio y tips. Se instala en el celular y funciona sin internet.

Este repositorio contiene, por ahora, el **diseño visual y un prototipo navegable**.

## Ver el prototipo

El archivo que se edita es `prototype/index.html`. Según cómo lo abras, se ve de tres formas:

| Dirección | Cómo se ve | Para qué |
|---|---|---|
| `prototype/index.html` | Como una web: la app a pantalla completa | Navegador / Live Server ("Go Live") |
| `prototype/celular.html` (o `index.html#celular`) | Dentro de un celular, como un simulador | Vista previa de VS Code mientras programás |
| `prototype/index.html#tablero` | Tablero de diseño con pantallas y sistema visual | Ver el diseño completo |

### Celular en VS Code mientras programás

1. Instalá **Live Preview** (Microsoft).
2. Abrí `prototype/celular.html` y tocá el globito (Show Preview).
3. Llevá esa pestaña a la derecha y abrí `prototype/index.html` a la izquierda.

### Web en el navegador

Tocá **Go Live** (Live Server). Abre la carpeta y te lleva directo a la app.

## Secciones

| | Sección | Qué resuelve y cómo se toca |
|---|---|---|
| A | **Hoy** | Anillo grande con el % del día y racha de días seguidos, carrusel con el resumen de cada sección, **checklist diario** (deslizá → para marcar, ← para borrar) y un tip del día que se da vuelta. |
| B | **Ejercicio** | Rutina para cada día. **"Empezar rutina"** abre un modo guiado a pantalla completa: serie por serie, cuenta regresiva para los ejercicios con tiempo y descanso de 30 s entre series. |
| C | **Alimentación** | Un vaso que se llena con olas (tocalo para sumar), comidas como tarjetas que se marcan, plato balanceado que se toca por partes y lista del súper deslizable. |
| D | **Sueño** | **Reloj de 24 h**: arrastrá la luna (me acosté) y el sol (me desperté) y calcula las horas. Calidad del sueño, gráfico de la semana y rutina de noche. |
| E | **Hábitos** | **Mantené apretada la flor** para marcar hoy, tocá los días para los anteriores. Rachas con fueguito y un mapa de la semana. |
| F | **Aprender** | Pomodoro de 15, 25 o 50 min, **tarjetas de repaso** que se dan vuelta ("¡La sabía!" / "Repasar"), materias con progreso y pendientes. |
| G | **Closet** | **Probador**: pasá prendas con las flechas o deslizando (arriba, abajo, zapatos, extra), "Sorprendeme" como tragamonedas y "Guardar look". Ropa por tipo y agregar prendas. |
| H | **Tips** | Podés agregar los tuyos con el +. **Mazo de cartas**: deslizá → para guardar, ← para pasar, botón para volver. Filtros por categoría y lista de favoritos. |

| I | **Ánimo y diario** | Cómo te sentís (5 florcitas), diario del día y "tres cosas lindas". Cruza tu ánimo con el sueño, el ejercicio y el agua ("los días que dormís 7½ h o más tu ánimo es 4,3") y muestra un gráfico de 14 días. |
| J | **Plata** | Gastos del día en colones (₡) por categoría, presupuesto del mes con lo que te queda por día, gastos del mes por categoría y metas de ahorro. |
| K | **Skincare** | Rutina de mañana y de noche armada con tus productos (tipo, cuándo lo usás y color del frasco), con racha de días completos. |
| L | **Metas** | Tablero de sueños con frases o fotos por categoría. "¡Lo logré!" las marca con confeti. |
| M | **Ajustes** | Tu nombre, la paleta de colores, modo noche, recordatorios e instalar la app. |

**Lo que se sumó a cada sección**
- **Hoy**: te saluda por tu nombre; **Florcita**, una plantita que crece de semilla a flor según cuánto te cuidás en el día y sube de nivel con cada cosa que completás; elegir tu ánimo con un toque.
- **Ejercicio**: crear y editar tus propias rutinas y elegir cuál toca cada día; anotar peso y repeticiones de cada ejercicio con gráfico de progreso y récord; calendario de entrenos con racha.
- **Comida**: foto de cada comida; recetas con foto e ingredientes; menú de la semana (almuerzo y cena) y un botón que pasa todos los ingredientes a la lista del súper.
- **Sueño**: sonidos para dormir (lluvia, olas, ruido blanco, ruido marrón) con temporizador y volumen; alarma; siesta de 20, 30 o 90 minutos.
- **Closet**: fotos reales de tu ropa (y editar o borrar prendas); calendario de qué te pusiste cada día; lista de deseos con prioridad que, al comprar, la suma al closet.

La barra de abajo flota y tiene **Hoy · Ejercicio · Comida · Sueño · Más**; en **Más** están Hábitos, Aprender, Closet y Tips.

La app arranca vacía, lista para tus datos reales: los gráficos, rachas y lo que noto del diario se van llenando a medida que la usás. Todo se guarda en el dispositivo (localStorage; las fotos, achicadas, en IndexedDB) y, si conectás Supabase, también en tu cuenta para verlo en todos tus dispositivos. La primera vez te pregunta tu nombre y tus colores. Lo diario (checklist, agua, comidas, ejercicio, rutina de noche, estudio) se reinicia cada día; los hábitos, cada semana.

## Tus datos en todos tus dispositivos (Supabase)

La app guarda todo en el dispositivo y, si la conectás a tu proyecto de Supabase, lo sincroniza: entrás con el mismo email y contraseña en el celular, la tablet o la compu y ves lo mismo. Funciona también sin internet: lo que hagas se sube cuando vuelve la conexión.

**Una sola vez, en Supabase**

1. **Crear la tabla y las fotos**: SQL Editor → New query → pegá el contenido de [`supabase/setup.sql`](supabase/setup.sql) → Run. Crea la tabla `mlos_state` y el bucket privado `mlos-photos`, con reglas para que cada persona solo vea y cambie lo suyo.
2. **Login con email**: Authentication → Sign In / Providers → Email tiene que estar activado (viene así). Si no querés confirmar el email al crear la cuenta, podés apagar "Confirm email".
3. **Dirección de la app**: Authentication → URL Configuration → en *Site URL* y *Redirect URLs* poné la dirección donde publiques la app (por ejemplo `https://TU-USUARIO.github.io/My-Life-OS/prototype/`). Sirve para los links de confirmar cuenta y de cambiar la contraseña.
4. **Copiar los datos de conexión**: Project Settings → API → *Project URL* y la clave pública *anon* (o *publishable*). Pegalos en [`prototype/config.js`](prototype/config.js). La clave pública está hecha para ir dentro de la app; **nunca** pongas la `service_role` ni la `secret`.

> Si no querés tocar `config.js`, también podés pegar esos dos datos en **Ajustes → Sincronizar** en cada dispositivo.

**En cada dispositivo**: Ajustes → Sincronizar → tu email y contraseña → *Crear cuenta* (la primera vez) o *Entrar*. El circulito de la nube en Hoy se pone verde cuando está sincronizado.

**Cómo se juntan los datos**: cada parte de la app (checklist, plata, closet, diario…) guarda la hora de su último cambio. Si cambiás el checklist en el celular y la plata en la tablet, se conservan las dos cosas. Si cambiás la misma parte en los dos sin internet, queda la versión que cambiaste último. La primera vez que entrás en un dispositivo nuevo, se trae lo que ya tenías en la nube. Las fotos van al bucket `mlos-photos`, en una carpeta por persona.

**Calorías con IA (opcional)**: la app calcula un aproximado con lo que escribís aunque no actives nada. Para que también lea las **fotos** de tus comidas (y estime mejor), activá la función `calorias`, que usa Claude:

1. Creá una clave de API en [console.anthropic.com](https://console.anthropic.com) → *API Keys* (necesita saldo cargado; cada cálculo con foto cuesta más o menos 1 a 2 centavos de dólar).
2. En Supabase → **Edge Functions** → **Secrets** → *Add new secret*: nombre `ANTHROPIC_API_KEY`, valor tu clave. Nunca la pongas en `config.js`: el repo es público.
3. **Edge Functions** → **Deploy a new function** → *Via Editor* → nombre `calorias` → pegá el contenido de [`supabase/functions/calorias/index.ts`](supabase/functions/calorias/index.ts) → **Deploy**.
4. Listo: con la sesión iniciada en la app, al subir la foto de una comida se calculan solas las calorías, y en el lápiz de cada comida el botón *Calcular* usa la IA. Solo pueden usarla las personas con sesión en tu app.

**Publicarla para abrirla en la tablet**: GitHub → Settings del repo → Pages → *Deploy from a branch* → elegí la rama y la carpeta `/ (root)`. La app queda en `https://TU-USUARIO.github.io/My-Life-OS/` (te lleva sola a `prototype/`).

## Instalarla en el celular

La app es una PWA: tiene `manifest.webmanifest`, íconos y un service worker (`sw.js`) que la guarda para usarla sin internet.

1. Abrila desde un servidor, no como archivo: con **Go Live** (Live Server) en la compu, o subida a cualquier hosting con https (por ejemplo GitHub Pages).
2. **iPhone**: en Safari, Compartir → "Agregar a inicio". **Android**: en Chrome, menú ⋮ → "Instalar app". También aparece un botón "Instalar" en Ajustes.

**Recordatorios**: en Ajustes activás los avisos y elegís agua (cada 1, 2 o 3 h), hora de dormir, hábitos, skincare de noche y fin del pomodoro. La alarma y la siesta suenan con la app abierta. Los avisos llegan mientras la app está abierta o recién minimizada; para que lleguen con la app cerrada del todo hace falta un servidor de notificaciones push, que esta versión no tiene.

## Sistema visual

**Soft-UI + vidrio**: detrás, manchas de color difuminadas que se mueven despacio (como el fondo de la paleta) y cambian de tono según la sección. Encima, tarjetas de crema esmerilada. Adentro, controles Soft-UI que se levantan con dos sombras y se hunden al tocarlos.

**Paletas**: se elige en Ajustes (o al empezar). La de por defecto es la de abajo; también están **Lavanda y cielo**, **Durazno y oliva** y **Cielo y menta**. Cada paleta define sus colores base y el resto (tonos suaves, sombras, manchas del fondo y modo noche) se calcula a partir de ellos.

| Nombre | Hex | Tinta | Uso |
|---|---|---|---|
| Dusty Rose | `#C9908F` | `#6B3F3F` | Acciones, ejercicio, tarjetas destacadas |
| Soft Sage | `#9CAF98` | `#3B5442` | Completado, agua, descanso, progreso |
| Warm Cream | `#F3EADF` | `#6E645A` | Fondo y superficies Soft-UI |

Manchas del fondo: los tres colores más mauve `#8A5F5F` y taupe `#7A6E62`. Modo noche con el botón de la luna.

**Movimiento**: entrada escalonada de cada pantalla, ondas al tocar, inclinación 3D con el mouse, números que cuentan, florcitas al completar, lluvia de florcitas (confeti) en los logros grandes y vibración en el celular. Si el sistema pide menos movimiento, se apaga.

**Tipografía**: Archivo condensada 800 en mayúsculas para títulos, Archivo expandida para etiquetas, Nunito para el texto.
