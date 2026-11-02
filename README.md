# My Life OS

Una app para organizar toda tu vida desde un solo lugar: rutinas de mañana y noche, tareas, calendario y recordatorios, hábitos y metas, progreso semanal y un diario de ánimo.

Este repositorio contiene, por ahora, el **diseño visual y un prototipo navegable**.

## Ver el prototipo

- `prototype/index.html`: el prototipo completo (tablero con pantallas, celular y sistema visual). **Es el archivo que se edita.**
- `prototype/celular.html`: abre el mismo prototipo en **modo celular**, con solo el teléfono, como un simulador. También funciona `index.html#celular`.

### Ver el celular en vivo mientras programás (VS Code)

1. Instalá la extensión **Live Preview** (de Microsoft).
2. Abrí `prototype/index.html` en el editor.
3. Clic derecho en `prototype/celular.html` → **Show Preview**.
4. Arrastrá la pestaña de la vista previa a la derecha. El celular se ajusta solo al tamaño del panel y se actualiza mientras escribís.

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

Derivados: cacao profundo `#2B201E` (fondo), luz de vela `#E8B98C` (mañana, estrellas), coral polvo `#E0907F` (recordatorios). Modo claro: fondo beige `#EEE3DE` con texto Deep Cocoa.

**Tipografía**: Fraunces suave (títulos e itálicas del diario), Nunito (texto), DM Mono (horas y números).

**Principios**: un refugio, no una oficina · rituales chiquitos de un toque · magia sin culpa.
