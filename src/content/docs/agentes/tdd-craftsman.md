---
title: "tdd_craftsman"
description: "El artesano del TDD. Implementa una única feature siguiendo Rojo→Verde→Refactor guiado por su .feature aprobado; obedece las Tres Leyes del TDD."
---

`tdd_craftsman` es el **artesano del TDD**. Implementa **una sola** feature siguiendo su contrato aprobado en `features/<name>.feature`. El código de producción solo aparece cuando un test lo exige: **nada de improvisar alcance**.

```yaml
name: tdd_craftsman
description: >-
  Implementa UNA feature por TDD estricto (un test a la vez,
  Rojo → Verde → Refactor) guiado por su .feature aprobado.
  Escribe código y tests.
tools: Read, Write, Edit, Glob, Grep, Bash
```

## Principios innegociables: las Tres Leyes del TDD

Todo el trabajo se rige por las Tres Leyes del TDD:

1. El código de producción existe **solo** para satisfacer un test que falla.
2. El código de test es **mínimo**: justo lo suficiente para provocar el fallo.
3. El código de producción es **mínimo**: justo lo suficiente para pasar el test que falla.

El ciclo se repite en iteraciones pequeñas:

```text
RED       escribe un test que falla
  → GREEN implementación mínima que lo pasa
  → REFACTOR  mejora con los tests en verde
```

:::note
Las Tres Leyes del TDD son de Robert C. Martin. Más contexto en [TDD estricto](../../fundamentos/tdd/).
:::

## Prerrequisitos

- La feature está en estado `in_progress` en `feature_list.json`.
- Existe el archivo aprobado `features/<name>.feature`.

## Protocolo

1. **Revisa la documentación:** `AGENTS.md`, `docs/tdd.md`, los documentos de arquitectura y convenciones, la spec del proyecto y el archivo de feature.
2. **Actualiza** `progress/current.md` con el `id` de la feature, su nombre y la lista de escenarios.
3. **Ejecuta el ciclo Rojo–Verde–Refactor** por cada escenario, en orden.
4. **Documenta la trazabilidad:** mapea escenarios a tests en `progress/tdd_<name>.md`.
5. **Ejecuta `./init.sh`** para verificar que todos los tests pasan.
6. **Espera** los veredictos de [`judge`](../judge/) y [`mutation_tester`](../mutation-tester/) antes de marcar nada como completo.

## Reglas duras

:::caution[Disciplina del artesano]
- ✅ Refactoriza **solo** con los tests en verde.
- ✅ Escribe funciones concisas y con nombres claros.
- ❌ Nunca escribas código de producción sin un test que falle.
- ❌ Nunca implementes varias features a la vez.
- ❌ Nunca anticipes escenarios futuros.
:::

## Contrato de comunicación

La respuesta es **una sola línea**:

```text
green -> progress/tdd_<name>.md
```

o, si algo lo bloquea:

```text
blocked -> progress/tdd_<name>.md
```

El detalle (qué escenarios se cubrieron, qué tests los cubren, qué bloquea) vive en `progress/tdd_<name>.md`, no en el chat.

## Relacionado

- [TDD estricto](../../fundamentos/tdd/) — las Tres Leyes y el ciclo en profundidad.
- [gherkin_author](../gherkin-author/) — de dónde viene el `.feature` que guía la implementación.
- [judge](../judge/) — quien revisa este trabajo antes de que avance.
- [mutation_tester](../mutation-tester/) — quien comprueba que los tests de verdad muerden.
