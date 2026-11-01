# My Life OS

Una app para organizar toda tu vida desde un solo lugar: rutinas de mañana y noche, tareas, calendario y recordatorios, hábitos y metas, progreso semanal y un diario de ánimo.

Este repositorio contiene, por ahora, el **diseño visual y un prototipo navegable**.

## Ver el prototipo

Abrí `prototype/index.html` en el navegador. No necesita build ni servidor.

- `prototype/my-life-os.html` es la fuente (fragmento HTML con estilos y script).
- `prototype/index.html` es la versión autónoma, generada envolviendo la fuente con `<html>`/`<head>`/`<body>`.

## Pantallas

| | Pantalla | Qué resuelve |
|---|---|---|
| A | **Hoy** | Arco del día (despertar → dormir), rutinas, recordatorio próximo, tareas, hábitos con un toque y registro rápido de ánimo. |
| B | **Rutinas** | Mañana y noche paso a paso, con horario, duración, anillo de progreso y racha. |
| C | **Agenda** | Calendario mensual con puntos por tipo de evento y la línea de tiempo del día elegido. Botón + para crear tareas con recordatorio. |
| D | **Hábitos y metas** | Hábitos con la semana en barras y racha; metas anuales con marca de *ritmo esperado*. |
| E | **Progreso** | Puntaje semanal, cumplimiento por día, estadísticas, ánimo de la semana, una observación y mapa de las últimas 12 semanas. |
| F | **Diario** | Escala de ánimo de 5 niveles, etiquetas, texto libre, 3 agradecimientos e historial. |

## Sistema visual

**Principios**
1. *El día es un arco.* Todo se ordena entre despertar y dormir. Ámbar = mañana, índigo = noche; se repiten en rutinas, agenda y metas.
2. *Un toque, no un formulario.* Marcar un hábito, un paso o el ánimo es un solo toque; escribir es opcional.
3. *Progreso honesto.* Las metas muestran el ritmo esperado, no solo el porcentaje.

**Color** (claro / oscuro)

| Token | Rol | Claro | Oscuro |
|---|---|---|---|
| `--accent` Musgo | Marca, completado | `#2E6B4C` | `#72C194` |
| `--sun` Amanecer | Mañana, rachas | `#C97A12` | `#F1AD4E` |
| `--moon` Anochecer | Noche, observaciones | `#4A4E9E` | `#A3A7F2` |
| `--alert` Aviso | Urgente, vencimientos | `#B9473F` | `#EC8178` |
| `--ink` Tinta | Texto | `#16201A` | `#E5ECE6` |
| `--bg` Luz de día | Fondo | `#E9EDE7` | `#0D120F` |

Escala de ánimo: Pésimo · Bajo · Neutro · Bien · Pleno (de índigo a ámbar).

**Tipografía**
- Títulos: Bricolage Grotesque 700–800, tracking negativo.
- Texto: Onest 400–600.
- Horas y números: JetBrains Mono, cifras tabulares.

**Forma**: radios de 22 / 14 / 9 px; tarjetas sin sombra sobre fondo verdoso; checks cuadrados para tareas y redondos para pasos de rutina.
