---
title: "Checkpoints (C1–C7)"
description: "Los siete criterios objetivos de \"estado final correcto\". El judge recorre C1–C6 y el mutation_tester valida C7. Sin coartadas, sin autoengaño."
---

Un feature no está "hecho" cuando el agente lo dice: está hecho cuando **pasa una lista
objetiva de criterios**. `CHECKPOINTS.md` es esa lista. Convierte "confía en mí" en algo
verificable por otro agente y por una máquina.

:::note[Por qué existen los checkpoints]
Los agentes redactan; el juicio poda. Los checkpoints son la vara del juicio: criterios que
no dependen del tono ni de la confianza del agente, sino de hechos comprobables en disco y
en la suite. Son la definición operativa de "terminado" en el método.
:::

Los checkpoints se agrupan por autoridad de validación:

- **`judge`** recorre **C1–C6** (estructura, coherencia y contrato).
- **`mutation_tester`** valida **C7** (calidad real de la suite).

Los enunciados que siguen están **generalizados**. Donde aparecen nombres concretos
(`requirements.txt`, `tempfile.TemporaryDirectory()`, `unittest`), es el **stack de
referencia (Python)**; C3 y C4 son *stack-neutros* en su intención y se traducen al lenguaje
que uses. Ver [Adaptar a otro lenguaje](../stack-adapter/).

## C1 · Estructura fundacional

El proyecto tiene los archivos base del arnés:

- Los cuatro pilares en la raíz: `AGENTS.md`, `init.sh`, `feature_list.json` y
  `progress/current.md`.
- Los documentos de método en `docs/`.
- **`init.sh` debe terminar con código de salida 0.**

:::tip
C1 es binario: o el esqueleto está completo y `init.sh` arranca limpio, o no. Es lo primero
que mira el `judge` porque sin base no tiene sentido revisar el resto.
:::

## C2 · Coherencia de estado

El estado en disco cuenta una historia consistente:

- **A lo sumo un feature en progreso** (la regla de "un feature por sesión").
- Los features completados tienen sus **tests en verde**.
- `progress/current.md` está **limpio**, sin restos de una sesión anterior.

## C3 · Cumplimiento arquitectónico *(stack-neutro)*

El código respeta los límites que el proyecto se impuso:

- `src/` contiene **solo los módulos planificados**; nada de material huérfano.
- **Sin dependencias externas** no declaradas (en Python: `requirements.txt` vacío o
  justificado; en otro stack, el manifiesto equivalente).
- **Sin `print` de depuración ni `TODO` huérfanos** olvidados en el código.

## C4 · Verificación genuina *(stack-neutro)*

Las pruebas prueban de verdad, no decoran:

- **Al menos un test por módulo** de `src/`.
- Las pruebas usan **artefactos reales y temporales** en vez de *mockear* el sistema de
  archivos (en Python: `tempfile.TemporaryDirectory()`; en otro stack, su equivalente).
- Ejecutar el descubrimiento de tests muestra la suite **en verde**.

:::caution
C4 vigila un antipatrón concreto: tests que solo comprueban "que no lanza excepción" o que
*mockean* el mundo hasta volverse triviales. Un test que no puede fallar no verifica nada.
:::

## C5 · Cierre de sesión correcto

La sesión se cierra sin dejar cabos sueltos:

- **Sin archivos sin seguir** sospechosos (untracked).
- `progress/history.md` **documenta la última sesión**.
- El estado del último feature **refleja el progreso real**, no uno optimista.

## C6 · Contrato Gherkin / BDD

El puente entre spec y código está intacto:

- Los features marcados `"sdd": true` incluyen su `.feature` con escenarios etiquetados
  (`@s1`, `@s2`, …).
- **Cada escenario mapea a tests concretos** (trazabilidad `@s → test`).
- Se mantuvo la **disciplina TDD**: no hubo código de producción sin un test que fallara
  primero.

Aquí el `judge` cierra su recorrido. Ver su rol en [judge](../../agentes/judge/) y la
trazabilidad en [Verificación](../verificacion/).

## C7 · Prueba de mutación

Lo valida el **`mutation_tester`**, no el `judge`. Es la última puerta:

- Los features completados **pasan el análisis de mutación por encima del umbral**.
- Los **mutantes supervivientes** o se **matan con nuevos tests**, o se **documentan como
  equivalentes** en `progress/mutation_<name>.md`.

:::note[Qué mide C7]
La mutación mide la **estabilidad semántica** de la suite: si alteras el código y ningún
test se pone en rojo, la suite no estaba comprobando esa lógica. C7 es lo que impide firmar
un "verde" que en realidad no protege nada. En la formulación pedagógica del método (BettaTech),
la mutación "vale cada ciclo de cómputo"; el fundamento técnico es medir esa estabilidad, no
un retorno de inversión.
:::

Ver el detalle en [Prueba de mutación](../../fundamentos/mutacion/) y el agente en
[mutation_tester](../../agentes/mutation-tester/).

## La regla que ata todo

:::danger[No hay "done" sin C7]
Ningún feature pasa a `done` sin **tests en verde Y** umbral de mutación superado. Un feature
que pasa C1–C6 pero no C7 **no está terminado**: tiene la forma correcta pero su suite no
demuestra que el código haga lo que dice.
:::

Los checkpoints son la contraparte objetiva de la [puerta de aprobación humana](../../fundamentos/puerta-humana/):
el humano aprueba el *contrato* (Gherkin) antes de codificar; los checkpoints verifican el
*resultado* antes de cerrar. Entre ambos, el agente nunca decide solo que su trabajo está bien.
