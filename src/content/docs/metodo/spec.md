---
title: 1 · Spec conversada
description: El spec_partner debate la spec con el humano hasta la "hard spec".
---

La fase 1 no consiste en transcribir lo que dice el humano. El `spec_partner`
**conversa y debate** hasta destilar un `project-spec.md` claro: la "hard spec",
una spec sencilla ampliada con casos y decisiones.

> "We debate various topics and decisions."

El resultado de esta fase es un único artefacto: `project-spec.md`.

## No transcribe: debate

El `spec_partner` no es un transcriptor. Es un **interlocutor crítico**. Su
valor está en las preguntas incómodas que el humano no se hizo:

- ¿Qué pasa en el **caso límite** (colección vacía, id inexistente, entrada
  inválida)?
- ¿Cuál es el **contrato exacto de salida** (canal de salida vs error, código
  de salida o estado)?
- ¿Qué **alternativa de diseño** descartamos y por qué?
- ¿Esto **colisiona** con una decisión anterior del `project-spec.md`?

Una spec sin debate esconde los huecos; el debate los saca. En el flujo de
origen esto es pasar de una spec sencilla, hecha a mano, a una **"hard spec"**
ampliada con ayuda de la IA.

## Al menos dos opciones por decisión

En cada decisión no trivial, el `spec_partner` propone **al menos dos
opciones** y argumenta a favor de una. Pero no decide por ti: deja que el
humano elija, y registra la decisión junto a su razón y la alternativa
descartada.

El debate va por turnos. Una pregunta o un bloque de opciones por vez; nunca
un cuestionario entero de golpe.

## Preguntas abiertas

Si una decisión no se cierra, **no se da por resuelta**. Se escribe como
**PREGUNTA ABIERTA** dentro de `project-spec.md` y ahí queda, visible, hasta
que alguien la cierre.

Además, cada afirmación del spec debe poder convertirse en un escenario
Given/When/Then. Si no es comprobable, se refina o se marca como abierta.

## Qué contiene la spec

Cuando hay consenso, el `spec_partner` escribe o amplía `project-spec.md` con
una sección por feature:

- **Propósito** — una frase.
- **Comportamiento** — qué hace, en prosa precisa.
- **Contrato** — entradas, salidas, códigos de error o estado.
- **Casos límite** — enumerados.
- **Decisiones** — cada una con su razón y la alternativa descartada.

## Los límites del agente

El `spec_partner` **para** al terminar la spec. No escribe código, ni tests, ni
Gherkin: eso es trabajo del `gherkin_author` en la
[fase siguiente](/DocsTemplateSSDUncleBob/metodo/gherkin/). Tampoco toca `src/`,
los tests ni `features/`, ni marca la feature como `done`.

El handoff vive en disco, no en el chat: la spec queda en `project-spec.md` y
el agente devuelve una sola línea de referencia. El siguiente agente la lee
desde ahí.
