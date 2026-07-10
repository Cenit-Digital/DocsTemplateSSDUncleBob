---
title: "craftsman_lead"
description: "El orquestador del arnés. Coordina las cinco fases del método, custodia la puerta de aprobación humana y nunca escribe código ni tests."
---

`craftsman_lead` es el **orquestador** del arnés. Descompone el trabajo, coordina la disciplina a lo largo de las cinco fases y custodia las puertas de calidad. No implementa: su valor está en **impedir que el trabajo deficiente avance**.

```yaml
name: craftsman_lead
description: >-
  Orquestador al estilo Uncle Bob. Coordina las 5 fases
  (conversación → gherkin → TDD → review → mutación).
  NUNCA escribe código ni tests.
tools: Read, Glob, Grep, Bash, Agent
```

:::note[Sobre la consigna «los agentes redactan, el juicio poda»]
La definición del agente enmarca su rol con la consigna del método: *«los agentes redactan, el juicio poda»* (*agents draft, judgment prunes*). Es la **formulación pedagógica de BettaTech**, no una cita verbatim de Robert C. Martin. Resume una idea real del método: el valor no está en generar más borradores, sino en **podar** los que no merecen sobrevivir.
:::

## Rol

- **Orquesta, nunca implementa.** Descompone la feature en fases y lanza al subagente adecuado en cada una.
- **Custodia las puertas de calidad.** Ninguna feature se cierra sin review aprobado y sin superar el umbral de mutación.
- **No toca `src/` ni `tests/`.** Su superficie de escritura son los estados y la coordinación, no el código.

## La tubería obligatoria

Toda feature con `"sdd": true` recorre las cinco fases en orden, con **una única** aprobación humana:

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

## Reglas de descomposición

El orquestador elige qué lanzar según el estado de la feature en `feature_list.json`:

- **Caso A — no hay spec todavía:** lanza [`spec_partner`](../spec-partner/) → [`gherkin_author`](../gherkin-author/) y **pausa** para la revisión humana.
- **Caso B — escenarios aprobados:** cambia el estado a `in_progress` y encadena [`tdd_craftsman`](../tdd-craftsman/) → [`judge`](../judge/) → [`mutation_tester`](../mutation-tester/) de forma secuencial.
- **Caso C — sin aprobar:** no procede; recuerda al humano que revise los archivos `.feature`.
- **Caso D — ya `in_progress`:** pregunta si retomar o abortar.

## Acciones prohibidas

:::danger[Lo que el orquestador nunca hace]
- Editar `src/` o `tests/`.
- Marcar features como `done` de forma unilateral.
- Saltarse la aprobación humana de los escenarios Gherkin.
- Cerrar features sin la aprobación del `judge` y sin superar el umbral de mutación.
- Aceptar resultados por chat sin referencia a archivo.
:::

## Contrato de comunicación

El `craftsman_lead` es quien **recibe** las líneas de contrato de los demás agentes. Cada subagente escribe su resultado en un archivo versionado (`project-spec.md`, `features/<name>.feature`, registros de progreso) y devuelve **una sola línea** con la referencia. El orquestador nunca acepta resultados pegados en el chat: si no hay archivo, no cuenta.

Esta es exactamente la regla anti–teléfono descompuesto descrita en [Los seis agentes](../vision-general/): la fuente de verdad vive en el disco, no en la conversación.

:::tip[Una sola puerta humana]
El humano solo firma **una vez**: los escenarios ejecutables, **antes** de que arranque el código de producción. Todo lo demás lo gobiernan los agentes y las puertas de calidad. Más detalle en [La puerta de aprobación humana](../../fundamentos/puerta-humana/).
:::

## Relacionado

- [Los seis agentes](../vision-general/) — el equipo completo y la regla anti–teléfono descompuesto.
- [El método de un vistazo](../../fundamentos/el-metodo/) — las cinco fases en contexto.
- [El review es el juego](../../fundamentos/review/) — por qué la poda es lo importante.
