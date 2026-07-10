---
title: Preguntas frecuentes
description: Dudas comunes sobre el arnés SDD Uncle Bob.
---

Respuestas breves a las dudas más habituales sobre el arnés. Todo lo que sigue sale del flujo, la prueba de mutación y la configuración de la plantilla.

## ¿Es un flujo 100% automático?

No. Hay una única puerta humana, y va sobre el contrato: el humano aprueba los escenarios Gherkin **antes** de escribir producción. El `craftsman_lead` **para** ahí y espera. Como dice el flujo: "No es un flujo 100% automático: hay un humano en el bucle en este punto exacto." Aprobar el `.feature` es barato; aprobar tarde, cuando ya hay código, es caro.

## ¿Sirve para mi lenguaje?

Sí. El proceso (spec → Gherkin → TDD → judge → mutación), los agentes y las puertas son **fijos**. Lo único que cambia por proyecto son los comandos de tu stack, declarados en `harness.config.json` bajo `commands` (`test`, `mutate`, y opcionales como `lint` o `build`). Eso es lo que hace a la plantilla agnóstica al lenguaje: hay recetas para Python, Node/TypeScript y Go.

## ¿Por qué prueba de mutación si ya tengo tests?

Porque una suite verde solo dice "el código no explota con estas entradas". **No** dice que los tests fallarían si el código estuviera mal. Un test sin asserts fuertes pasa siempre y no protege nada. La mutación lo mide al revés: introduce un defecto (un *mutante*) y exige que algún test falle. "Mutation testing is resource-heavy, but the ROI on code correctness is worth every cycle."

## ¿Por qué un test a la vez?

Porque se vive el ciclo pequeño de las Tres Leyes del TDD: un test rojo → el mínimo verde → refactor en verde. No se escriben todos los tests por adelantado. Así no se infla el alcance: "El código que ningún test pidió no existe."

## ¿Necesito Node aunque mi proyecto sea Python?

Sí, pero solo para el motor del arnés. `.harness/harness.mjs` es un motor de **cero dependencias** que solo usa la stdlib de Node ≥ 18. Ejecuta los comandos que tú declaras para tu stack; tu proyecto sigue siendo Python (o Go, o lo que sea).

## ¿Qué es un mutante equivalente?

Un mutante que no cambia el comportamiento observable del código. Puede excluirse del cálculo del score, pero **solo** con justificación explícita escrita en `progress/mutation_<name>.md`. Abusar de esta vía es hacer trampa al juez.

## ¿Puedo usar StrykerJS?

Sí, por configuración. Para proyectos reales, el mutador recomendado en Node/TypeScript es **StrykerJS** con `@stryker-mutator/vitest-runner`: pones `"mutate": "stryker run"` y el umbral en `stryker.config.json`. Es más potente (cobertura, incremental, informe HTML) a cambio de añadir dependencias. Igual que el mutador, tu runner de tests es el que declares en `commands.test`.

## ¿Quién arregla un mutante sobreviviente?

El `mutation_tester` solo **mide** y reporta; no edita código. Un mutante que sobrevive es trabajo del `tdd_craftsman`: escribe el test rojo que lo mata y vuelve a pasar por el `judge`. Es el ciclo compute-bound: el CPU encuentra el hueco, el artesano lo tapa con un test.
