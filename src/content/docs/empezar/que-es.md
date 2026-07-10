---
title: Qué es el arnés SDD
description: 'El porqué del arnés: proceso, no herramienta. Los insights de Robert C. Martin.'
---

Un **arnés** (harness) de desarrollo con IA no es una herramienta más. Es una forma de estructurar el trabajo para que un agente desarrolle de forma **autónoma y verificable**. Lo importante no es la app: es cómo se organiza el proceso alrededor del agente.

Esta plantilla aplica **SDD (Spec-Driven Development)** en el estilo de **Robert C. Martin (Uncle Bob)**, popularizado por BettaTech. En una frase:

> conversar la spec → destilarla en Gherkin → tallar con TDD estricto → podar con juicio (review) → validar con prueba de mutación.

Hay una sola puerta de aprobación humana, en el punto de máximo apalancamiento: el contrato Gherkin.

## Los 6 insights del hilo

**1. La spec nace de una conversación, no de un dictado.** El humano no entrega un documento cerrado. Debate con el agente: casos límite, contratos de salida, alternativas descartadas. El resultado incluye las **decisiones** y su porqué. "Una spec sin debate esconde los huecos; el debate los saca."

**2. Gherkin convierte la prosa en un contrato ejecutable.** Cada comportamiento se vuelve un `Scenario` con `Given/When/Then` verificable. Esto es lo que el humano firma. A partir de aquí, la ambigüedad es un bug del contrato, no del código.

**3. La puerta humana va sobre el contrato, no sobre el código.** Aprobar tarde (cuando ya hay código) es caro. Aprobar el `.feature` es barato y de máximo apalancamiento: un escenario mal definido arrastra todo el TDD. El flujo **para** aquí y espera a un humano.

**4. TDD estricto: un test a la vez.** No se escriben todos los tests por adelantado. Se vive el ciclo pequeño: un test rojo → el mínimo verde → refactor en verde. "El código que ningún test pidió no existe."

**5. El review es el juego entero.** Generar borradores es barato; el modelo teclea infinito. El valor escaso es el **juicio** que decide qué sobrevive.

> "The review step is the whole game. Agents draft, judgment prunes."

**6. La validación es compute-bound, con mutación.** Una suite verde solo dice que el código no explota, no que los tests sirvan. La prueba de mutación introduce defectos y exige que algún test falle. Es cara en CPU, pero es la medida real de si la red atrapa peces.

> "Raw computer power is the limiting factor."

## El marco más amplio: Harness Engineering

En la serie de BettaTech, **Harness Engineering** es la *disciplina* de automatizar
cualquier flujo de trabajo con IA; **SDD es uno de esos flujos** concretos. Un
"arnés" es el entorno alrededor del modelo —contexto, herramientas, memoria y
verificación— que te permite "cambiar el cerebro" (el modelo) sin rehacer el
envoltorio. Se apoya en tres pilares:

1. **El repositorio como sistema** — la estructura del repo (init, `feature_list`,
   `progress/`, docs, hooks) guía al agente.
2. **Orquestación multiagente** — un líder que descompone y lanza subagentes con
   contexto mínimo.
3. **Verificación** — el arnés se autovalida (tests, mutación) porque la IA está
   entrenada para *parecer* verosímil, no para tener razón: debe **demostrar**.

Dos hallazgos contraintuitivos del método guían su diseño:

- **Más herramientas = peor rendimiento.** El agente `d0` de Vercel eliminó el
  80 % de sus tools hiperespecializadas y dejó utilidades tipo Unix (grep, cat,
  ls): más de **3× de velocidad y un 37 % menos de tokens**. Menos superficie,
  mejor criterio.
- **El contexto se degrada mucho antes de llenarse.** Por eso el estado vive en
  ficheros (memoria externa) y el contexto se mantiene limpio: es la misma razón
  de la regla anti-teléfono-descompuesto.

### Dónde encaja: los niveles de SDD

Según el artículo de Birgitta Böckeler en el blog de Martin Fowler, hay tres
niveles: **spec-first** (escribes la spec y delegas la implementación),
**spec-anchor** (la spec se mantiene y evoluciona junto al código) y
**spec-as-source** (la spec es la fuente; el humano nunca toca el código). Este
arnés vive entre *spec-first* y *spec-anchor*, con una **puerta humana** sobre el
contrato Gherkin — deliberadamente, no busca eliminar al humano del bucle.

> Fuentes: playlist [«Aprende a usar la IA para desarrollar» de BettaTech](https://www.youtube.com/playlist?list=PLJkcleqxxobX8POJ0sMoG62VyyZGrvhM2)
> y el [blog de Martin Fowler sobre SDD](https://martinfowler.com/).

## Agnóstico al lenguaje

El proceso, los agentes y las puertas son **fijos**. Lo único que cambia por proyecto son los comandos de tu stack, declarados en `harness.config.json`:

```json
{
  "commands": {
    "test":   "…tu comando de tests…",
    "mutate": "…tu prueba de mutación…"
  },
  "mutation": { "threshold": 0.8 }
}
```

Un motor de cero dependencias lee esa config y ejecuta tus comandos. Así el mismo arnés sirve para Python, Node/TS, Go, Rust o Java: el proceso no cambia; el stack sí.

Otra idea clave: los handoffs viven **en disco, no en el chat**. Cada fase la ejecuta un subagente distinto que escribe su resultado en un fichero y devuelve una línea de referencia. Esto limita el contexto de cada agente, sobrevive a reinicios y mantiene el consumo de tokens bajo control.

Sigue con el [método y el flujo completo](/DocsTemplateSSDUncleBob/metodo/flujo/).
