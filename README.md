# My Life OS

Una app para organizar toda tu vida desde un solo lugar: checklist diario, ejercicio, alimentación, sueño, hábitos, tips, closet y estudio.

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

| | Sección | Qué resuelve |
|---|---|---|
| A | **Hoy** | Saludo según la hora, anillo de progreso, **checklist diario** (marcar, agregar, borrar), resumen de cada sección y tip del día. |
| B | **Ejercicio** | Rutina para cada día de la semana (L a D) con series y repeticiones, marcar cada ejercicio y temporizador de descanso de 60 s. |
| C | **Alimentación** | Agua (8 vasos), comidas del día, "mi plato" (½ verduras, ¼ proteína, ¼ carbos) y lista del súper. |
| D | **Sueño** | Hora de acostarse y de despertarse (calcula las horas), calidad del sueño, gráfico de la semana con meta de 8 h y rutina de noche. |
| E | **Hábitos** | Cada hábito con sus 7 días para marcar y racha automática. Se pueden agregar y borrar. |
| F | **Aprender** | Pomodoro (25 min foco / 5 min pausa) que suma minutos de estudio, materias con temas vistos y pendientes de estudio. |
| G | **Closet** | Prendas por tipo, outfit de hoy (tocá prendas para armarlo), botón "sorprendeme" y agregar prendas con tipo y color. |
| H | **Tips** | 16 tips por categoría (ejercicio, comida, sueño, estudio, closet, mente) y favoritos con el corazón. |

La barra de abajo tiene **Hoy · Ejercicio · Comida · Sueño · Más**; en **Más** están Hábitos, Aprender, Closet y Tips.

Todo se guarda en el navegador (localStorage). El checklist, el agua, las comidas, el ejercicio y la rutina de noche se reinician cada día; los hábitos, cada semana.

## Sistema visual

**Estilo Soft-UI (neumorfismo)**: todo sale del mismo fondo crema. Dos sombras (luz arriba a la izquierda, sombra abajo a la derecha) levantan tarjetas y botones; sombras internas los hunden cuando están tocados, hechos o elegidos.

**Paleta**

| Nombre | Hex | Tinta | Uso |
|---|---|---|---|
| Dusty Rose | `#C9908F` | `#6B3F3F` | Acciones, ejercicio, estudio, rosa de acento |
| Soft Sage | `#9CAF98` | `#3B5442` | Completado, agua, sueño, progreso |
| Warm Cream | `#F3EADF` | `#6E645A` | Fondo de toda la app y superficies Soft-UI |

Modo noche (botón de la luna): fondo `#3D3331` con las mismas tintas. La elección se recuerda en el navegador.

**Tipografía**: Archivo condensada 800 en mayúsculas para títulos y Archivo expandida para etiquetas (como en la paleta), Nunito para el texto.

**Detalle**: la florcita de cinco pétalos de la paleta es el ícono de la app, el check de cada tarea y la calificación del sueño.
