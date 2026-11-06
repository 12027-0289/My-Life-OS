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

| | Sección | Qué resuelve y cómo se toca |
|---|---|---|
| A | **Hoy** | Anillo grande con el % del día y racha de días seguidos, carrusel con el resumen de cada sección, **checklist diario** (deslizá → para marcar, ← para borrar) y un tip del día que se da vuelta. |
| B | **Ejercicio** | Rutina para cada día. **"Empezar rutina"** abre un modo guiado a pantalla completa: serie por serie, cuenta regresiva para los ejercicios con tiempo y descanso de 30 s entre series. |
| C | **Alimentación** | Un vaso que se llena con olas (tocalo para sumar), comidas como tarjetas que se marcan, plato balanceado que se toca por partes y lista del súper deslizable. |
| D | **Sueño** | **Reloj de 24 h**: arrastrá la luna (me acosté) y el sol (me desperté) y calcula las horas. Calidad del sueño, gráfico de la semana y rutina de noche. |
| E | **Hábitos** | **Mantené apretada la flor** para marcar hoy, tocá los días para los anteriores. Rachas con fueguito y un mapa de la semana. |
| F | **Aprender** | Pomodoro de 15, 25 o 50 min, **tarjetas de repaso** que se dan vuelta ("¡La sabía!" / "Repasar"), materias con progreso y pendientes. |
| G | **Closet** | **Probador**: pasá prendas con las flechas o deslizando (arriba, abajo, zapatos, extra), "Sorprendeme" como tragamonedas y "Guardar look". Ropa por tipo y agregar prendas. |
| H | **Tips** | **Mazo de cartas**: deslizá → para guardar, ← para pasar, botón para volver. Filtros por categoría y lista de favoritos. |

La barra de abajo flota y tiene **Hoy · Ejercicio · Comida · Sueño · Más**; en **Más** están Hábitos, Aprender, Closet y Tips.

Todo se guarda en el navegador (localStorage). Lo diario (checklist, agua, comidas, ejercicio, rutina de noche, estudio) se reinicia cada día; los hábitos, cada semana.

## Sistema visual

**Soft-UI + vidrio**: detrás, manchas de color difuminadas que se mueven despacio (como el fondo de la paleta) y cambian de tono según la sección. Encima, tarjetas de crema esmerilada. Adentro, controles Soft-UI que se levantan con dos sombras y se hunden al tocarlos.

**Paleta**

| Nombre | Hex | Tinta | Uso |
|---|---|---|---|
| Dusty Rose | `#C9908F` | `#6B3F3F` | Acciones, ejercicio, tarjetas destacadas |
| Soft Sage | `#9CAF98` | `#3B5442` | Completado, agua, descanso, progreso |
| Warm Cream | `#F3EADF` | `#6E645A` | Fondo y superficies Soft-UI |

Manchas del fondo: los tres colores más mauve `#8A5F5F` y taupe `#7A6E62`. Modo noche con el botón de la luna.

**Movimiento**: entrada escalonada de cada pantalla, ondas al tocar, inclinación 3D con el mouse, números que cuentan, florcitas al completar, lluvia de florcitas (confeti) en los logros grandes y vibración en el celular. Si el sistema pide menos movimiento, se apaga.

**Tipografía**: Archivo condensada 800 en mayúsculas para títulos, Archivo expandida para etiquetas, Nunito para el texto.
