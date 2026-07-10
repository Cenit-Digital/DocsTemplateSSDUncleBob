---
title: "gherkin_author"
description: "El autor del contrato ejecutable. Convierte una sección de project-spec.md en un archivo .feature con escenarios Gherkin trazables; no escribe código ni tests."
---

`gherkin_author` convierte una sección de `project-spec.md` en un **contrato ejecutable**: un archivo `.feature` escrito en Gherkin. Su único trabajo es **redactar el contrato**, no el código de producción ni los tests unitarios.

```yaml
name: gherkin_author
description: >-
  Convierte una sección de project-spec.md en un contrato
  ejecutable (.feature). No escribe código ni tests unitarios.
tools: Read, Write, Edit, Glob, Grep, Bash
```

## Responsabilidad central

> Tu único trabajo es convertir una sección de `project-spec.md` en un **contrato ejecutable**.

El `.feature` es el punto de encuentro entre lo que el humano aprobó y lo que el código deberá cumplir. Por eso todo criterio de aceptación de la spec debe **mapearse a, al menos, un escenario**.

## Protocolo

1. **Revisa la documentación fundacional:** `AGENTS.md`, `docs/gherkin.md`, `docs/conventions.md`.
2. **Selecciona** la feature `pending` de menor `id` con `"sdd": true`.
3. **Genera el archivo `.feature`**: una declaración `Feature`, un escenario por comportamiento y pasos `Given/When/Then` concretos.
4. **Etiqueta los escenarios** numéricamente (`@s1`, `@s2`, …) para la trazabilidad.
5. **Actualiza** el estado en `feature_list.json` a `spec_ready`.
6. **Detente** y espera la aprobación humana antes de cualquier handoff.

```gherkin
@s1
Feature: Añadir una nota
  Scenario: Guardar una nota nueva por línea de comandos
    Given un almacén de notas vacío
    When ejecuto "notes add 'comprar pan'"
    Then el código de salida es 0
    And stdout contiene "Nota #1 guardada"
```

## Reglas duras

:::danger[Límites del gherkin_author]
- Prohibido editar `src/` o `tests/`.
- Prohibido marcar features como `in_progress` o `done`.
- Obligatorio: cada criterio de aceptación mapea a **al menos un escenario**.
- Obligatorio: nada de pasos vagos; toda aserción es **medible** (stdout, stderr, códigos de salida).
:::

Las etiquetas `@s1`, `@s2`… no son decorativas: son la clave de trazabilidad que [`judge`](../judge/) usará para exigir que **cada escenario tenga al menos un test concreto**.

## Contrato de comunicación

El agente devuelve **una sola línea** con la referencia al archivo y el número de escenarios:

```text
spec_ready -> features/<name>.feature (<n> escenarios)
```

Tras esta línea, el flujo **se detiene** en la puerta de aprobación humana. Solo cuando el humano firma los escenarios, el [`craftsman_lead`](../craftsman-lead/) pasa la feature a `in_progress`.

## Relacionado

- [Gherkin: el contrato ejecutable](../../fundamentos/gherkin/) — la sintaxis y el porqué del contrato.
- [La puerta de aprobación humana](../../fundamentos/puerta-humana/) — qué firma el humano y por qué es la única puerta.
- [tdd_craftsman](../tdd-craftsman/) — el agente que implementa contra este `.feature`.
