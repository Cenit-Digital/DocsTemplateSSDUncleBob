---
title: "Los seis agentes"
description: "Visión general del equipo de subagentes del arnés (craftsman_lead, spec_partner, gherkin_author, tdd_craftsman, judge, mutation_tester), qué escribe cada uno y cómo se orquestan sin teléfono descompuesto."
---

El arnés no es un único modelo haciéndolo todo: es un **equipo de seis subagentes especializados**, cada uno con un rol estrecho, límites duros y una responsabilidad única. Uno de ellos, `craftsman_lead`, orquesta a los demás a lo largo de cinco fases. Los otros cinco hacen el trabajo concreto y **devuelven siempre una sola línea** que apunta al archivo donde dejaron su resultado.

Esta separación es deliberada: un agente que conversa la spec no es el mismo que la convierte en contrato ejecutable, ni el mismo que escribe el código, ni el mismo que lo juzga. La disciplina la impone la **estructura del equipo**, no la buena voluntad de un modelo generalista.

## El equipo de un vistazo

| Agente | Rol | Qué escribe | Contrato de una línea |
| --- | --- | --- | --- |
| [`craftsman_lead`](../craftsman-lead/) | Orquestador de las 5 fases. Nunca escribe código ni tests. | Actualiza estados en `feature_list.json` y coordina; **recibe** referencias. | (orquesta; consume las líneas de los demás) |
| [`spec_partner`](../spec-partner/) | Conversa y debate con el humano para producir la especificación. | `project-spec.md` | `spec_updated -> project-spec.md (#<id> <name>)` |
| [`gherkin_author`](../gherkin-author/) | Convierte una sección de la spec en un contrato ejecutable. | `features/<name>.feature` | `spec_ready -> features/<name>.feature (<n> escenarios)` |
| [`tdd_craftsman`](../tdd-craftsman/) | Implementa **una** feature por TDD estricto (Rojo→Verde→Refactor). | `src/`, `tests/`, `progress/tdd_<name>.md` | `green -> progress/tdd_<name>.md` |
| [`judge`](../judge/) | Revisa el trabajo contra el `.feature`, `docs/` y `CHECKPOINTS.md`. No edita código. | `progress/judge_<name>.md`, checkpoints | `APPROVED -> progress/judge_<name>.md` |
| [`mutation_tester`](../mutation-tester/) | Valida que los tests **muerden** con prueba de mutación. No edita código. | `progress/mutation_<name>.md` | `PASS -> progress/mutation_<name>.md (score N%)` |

:::note
Solo dos agentes tocan `src/` y `tests/`: `tdd_craftsman` los escribe; el resto **lee, juzga o conversa**. `craftsman_lead`, `judge` y `mutation_tester` tienen prohibido editar código de producción.
:::

## La regla anti–teléfono descompuesto

El mayor riesgo de un equipo de agentes es el **teléfono descompuesto**: que un agente resuma lo que hizo en el chat, ese resumen pierda o distorsione detalles, y el siguiente agente trabaje sobre una versión degradada de la realidad.

El arnés lo evita con una regla dura:

:::tip[Regla de comunicación]
Cada subagente **escribe su resultado en un archivo versionado del disco** y devuelve al orquestador **una sola línea** con la referencia a ese archivo. Nunca pega el contenido completo en el chat.
:::

Las consecuencias son concretas:

- La **fuente de verdad** es el archivo (`project-spec.md`, `features/<name>.feature`, `progress/*.md`), no la conversación.
- El orquestador y el humano siempre pueden **abrir el artefacto** en lugar de confiar en un resumen.
- El estado avanza por **estados en `feature_list.json`** (`pending`, `spec_ready`, `in_progress`, `done`), no por afirmaciones sueltas.
- Un resultado aceptado por chat, sin referencia a archivo, **no cuenta**: el `craftsman_lead` lo rechaza.

Por eso las líneas de contrato de la tabla anterior tienen todas la misma forma `veredicto -> ruta/al/archivo`.

## Cómo los orquesta el `craftsman_lead`

El orquestador coordina, **nunca implementa**. Toda feature marcada con `"sdd": true` recorre la misma tubería obligatoria de cinco fases, con **una única puerta de aprobación humana**:

```text
pending
  → spec_partner        (conversación)
  → gherkin_author      (escenarios)
  → ⏸ APROBACIÓN HUMANA
  → in_progress
  → tdd_craftsman       (Rojo → Verde → Refactor)
  → judge               (review)
  → mutation_tester     (validación)
  → done
```

El `craftsman_lead` decide qué lanzar según el estado de la feature:

- **Caso A — sin spec todavía:** lanza `spec_partner` → `gherkin_author` y se **detiene** para la revisión humana.
- **Caso B — escenarios aprobados:** pone la feature `in_progress` y encadena `tdd_craftsman` → `judge` → `mutation_tester` de forma secuencial.
- **Caso C — sin aprobar:** no avanza; recuerda al humano que revise los archivos `.feature`.
- **Caso D — ya `in_progress`:** pregunta si retomar o abortar.

:::caution[La puerta humana es innegociable]
Hay **una sola** puerta de aprobación humana: el humano firma los escenarios Gherkin ejecutables **antes** de que empiece el código de producción. Ningún agente puede saltársela ni cerrar una feature sin la aprobación del `judge` y sin superar el umbral de mutación. Detalle en [La puerta de aprobación humana](../../fundamentos/puerta-humana/).
:::

## Siguiente paso

Lee la ficha de cada agente para conocer su protocolo, sus reglas duras y su contrato exacto:

1. [`craftsman_lead`](../craftsman-lead/) — el orquestador.
2. [`spec_partner`](../spec-partner/) — la spec conversada.
3. [`gherkin_author`](../gherkin-author/) — el contrato ejecutable.
4. [`tdd_craftsman`](../tdd-craftsman/) — el código por TDD.
5. [`judge`](../judge/) — el review.
6. [`mutation_tester`](../mutation-tester/) — la prueba de mutación.

Para el marco conceptual completo, ve a [El método de un vistazo](../../fundamentos/el-metodo/).
