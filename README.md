# My Life OS

Una app para organizar toda tu vida desde un solo lugar: rutinas de mañana y noche, tareas, calendario y recordatorios, hábitos y metas, progreso semanal y un diario de ánimo.

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

## Pantallas

Temática cute, cozy y misteriosa: noche de cacao, luz de vela, fases de la luna y Miso, el gatito de la app.

| | Pantalla | Qué resuelve |
|---|---|---|
| A | **Hoy** | Arco del día (despertar → a soñar), carta del día para dar vuelta, rituales, recordatorio, pendientes, velitas y "¿Cómo te sentís hoy?". |
| B | **Rituales** | Ritual del amanecer y ritual de la luna, paso a paso con horario, duración y racha. |
| C | **Agenda lunar** | Calendario con las fases reales de la luna, planes del día elegido y botón + para pendientes con recordatorio. |
| D | **Velitas y constelaciones** | Cada hábito es una velita que se enciende; cada meta es una constelación que se ilumina estrella por estrella. |
| E | **Bola de cristal** | Puntaje semanal, día por día, estadísticas, lunas de la semana, un patrón detectado y "tu cielo" de 12 semanas. |
| F | **Diario** | Ánimo en fases de la luna (Tormenta → Luna llena), etiquetas, texto libre, tres cositas lindas e historial. |

## Sistema visual

**Paleta base**

| Nombre | Hex | Uso |
|---|---|---|
| Mushroom | `#A89A94` | Textos suaves, luna |
| Blush Beige | `#D9C4BC` | Botones, completado |
| Deep Cocoa | `#4A3835` | Tarjetas, noche |

Modo día (por defecto): fondo beige rosado `#F5EAE5` con lunares, tarjetas `#FFF9F6` con sombra suave, texto y botones Deep Cocoa, luz de vela `#C47D4A`. Modo noche (botón "Modo noche"): fondo cacao `#2B201E`. La elección se recuerda en el navegador.

**Pasteles** (combinan con la paleta y dan color a cada cosa): rosa `#E79AA8`, salvia `#93B784`, lavanda `#AC97D6`, manteca `#E9BF4F`, cielo `#84B2D6`, durazno `#EE9B74`. Cada hábito, meta y tipo de evento tiene su color.

**Interacciones**: anillos de "Tu día" que se llenan con pendientes, velitas y rituales; contador de agüita (8 vasos enciende la velita); explosión de florcitas, corazones y estrellas al completar cosas; Miso salta y cambia lo que dice según tu ánimo; la tarjeta de ánimo toma el color de tu luna.

**Tipografía**: Fraunces suave (títulos e itálicas del diario), Nunito (texto), DM Mono (horas y números).

**Principios**: un refugio, no una oficina · rituales chiquitos de un toque · magia sin culpa.
