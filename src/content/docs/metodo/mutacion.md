---
title: 5 · Prueba de mutación
description: Validar que los tests muerden. El cuello de botella es compute-bound.
---

## El problema que resuelve

Una suite verde dice "el código no explota con estas entradas". **No** dice "los tests fallarían si el código estuviera mal". Un test sin asserts fuertes pasa siempre y no protege nada.

La prueba de mutación lo mide al revés. Introduce un defecto pequeño en el código (un *mutante*) y observa la suite.

- Si **algún test falla** → el mutante está **muerto** (killed). Bien: la red atrapó el defecto.
- Si **todos los tests pasan** → el mutante **sobrevive** (survived). Mal: hay un agujero. Falta un assert o un caso.

**Puntuación de mutación** = `killed / total`. Cuanto más alta, más muerden los tests. El umbral vive en `harness.config.json` → `mutation.threshold` (por defecto `0.8`).

## Cómo se corre

Siempre a través del arnés, que ejecuta el comando declarado en tu config:

```bash
bin/harness mutate            # mutación del proyecto según config.commands.mutate
bin/harness mutate src/cli.py # el token {{target}} recibe este argumento
```

## Adaptadores de mutación por stack

El arnés no impone un mutador: cada stack declara el suyo en `commands.mutate`. Los ejemplos traen dos, ambos **sin dependencias externas**.

**Python — `tools/mutate.py` (cero dependencias).** `"mutate": "{{py}} tools/mutate.py {{target}}"`. Lee un archivo de `src/` y aplica, uno a uno, un catálogo de mutaciones textuales: comparación (`<=` → `<`, `==` → `!=`), aritmética (`+` → `-`), booleano (`and` → `or`, `True` → `False`), constantes (`0` → `1`) y retorno (`return <expr>` → `return None`). Por cada mutante escribe el archivo mutado, corre la suite y restaura el original (limpieza en `finally`, incluso si lo interrumpes). Reporta `total`, `killed`, `survived`, `score` y la lista de sobrevivientes. Sale != 0 si el `score` está por debajo del umbral.

**Node/TypeScript — `tools/mutate.mjs` (cero dependencias).** `"mutate": "node tools/mutate.mjs {{target}}"`. Mismo contrato de salida, con un escáner que respeta strings y comentarios y valida cada mutante con `node --check` antes de correr la suite (`node --test`).

**Node/TypeScript de producción — StrykerJS.** Para proyectos reales el mutador recomendado es **StrykerJS** con `@stryker-mutator/vitest-runner`: `"mutate": "stryker run"`, umbral en `stryker.config.json`. Es más potente (cobertura, incremental, informe HTML) a cambio de añadir dependencias.

## Umbral y mutantes equivalentes

Por defecto se exige superar `mutation.threshold` sobre las líneas nuevas o tocadas por la feature. Un mutante **equivalente** (no cambia el comportamiento observable) puede excluirse, pero **solo** con justificación explícita escrita en `progress/mutation_<name>.md`. Abusar de esta vía es hacer trampa al juez.

## Quién hace qué

- El `mutation_tester` **mide** y reporta. No edita código.
- Un mutante sobreviviente es trabajo del `tdd_craftsman`: escribe el test rojo que lo mata (ver [TDD](/DocsTemplateSSDUncleBob/metodo/tdd/)) y vuelve a pasar por el `judge`.

Es el ciclo de mejora compute-bound: el CPU encuentra el hueco, el artesano lo tapa con un test.

> "Mutation testing is resource-heavy, but the ROI on code correctness is worth every cycle."

> "Raw computer power is the limiting factor."
