---
title: '4 · El juez: el review es el juego entero'
description: El juicio que poda es el valor escaso. Aprueba o rechaza; no edita.
---

Generar borradores es barato. El modelo teclea infinito. El valor escaso es el **juicio** que decide qué sobrevive.

> "The review step is the whole game. Agents draft, judgment prunes."

Esta es la fase del `judge` (el juez). Un borrador es barato; su trabajo es **podar**: decidir, con criterio, si el trabajo merece sobrevivir. Apruebas o rechazas. No editas código: señalas qué falla, no lo arreglas.

## Qué comprueba el juez

El juez revisa el trabajo del [tdd_craftsman](/DocsTemplateSSDUncleBob/metodo/tdd/) contra el `.feature`, la documentación y `CHECKPOINTS.md`. Cuatro frentes:

- **Cobertura de escenarios (@s ↔ test).** Por cada `@s` del `.feature`, localiza al menos un test concreto que lo verifique. Si algún escenario queda sin cobertura, rechaza.
- **Disciplina TDD.** Revisa `progress/tdd_<name>.md`. ¿Hay evidencia de ciclos Rojo → Verde → Refactor? ¿Hay producción que ningún test exige (alcance inflado)? Si ve código sin test que lo justifique, rechaza.
- **Calidad (lente de artesano)** sobre cada archivo tocado: funciones cortas con un solo motivo para cambiar, nombres reveladores, sin duplicación ni números mágicos, contrato de errores correcto y respeto a la arquitectura (capas, dependencias).
- **Checkpoints.** Recorre `CHECKPOINTS.md` y marca `[x]`/`[ ]`. Además ejecuta `bin/harness init`: tiene que terminar verde.

## El formato del veredicto

La salida es un único bloque en `progress/judge_<name>.md`, con un veredicto claro: **APPROVED** o **CHANGES_REQUESTED**. Dentro van el mapa `@s ↔ test`, la disciplina TDD (¿producción sin test?, ¿evidencia de Rojo→Verde→Refactor?), los hallazgos de calidad con archivo y línea, los checkpoints y, si aplica, la lista de cambios requeridos.

En el chat, la respuesta es una sola línea:

```
APPROVED -> progress/judge_<name>.md
```

o

```
CHANGES_REQUESTED -> progress/judge_<name>.md
```

## Reglas duras

- Nunca apruebes con tests rojos o `bin/harness init` en rojo.
- Nunca apruebes si algún `@s` queda sin test.
- Nunca apruebes producción que ningún test exige.
- Nunca edites el código: dices qué falla, no lo arreglas.
- Sé concreto: cita archivo y línea. Nada de feedback genérico.

## Una puerta distinta a la mutación

El review no es el final del camino. El [mutation_tester](/DocsTemplateSSDUncleBob/metodo/mutation/) corre **después** de la aprobación del juez. El juez juzga diseño y cobertura de escenarios; la mutación mide si los tests realmente muerden. Son puertas distintas: ambas deben pasar.

Poda y mutación son las dos formas de este método de separar el borrador barato del trabajo que merece existir. El review es una puerta de **juicio**; la mutación, una puerta de **compute**. Ninguna edita: cada una decide.
