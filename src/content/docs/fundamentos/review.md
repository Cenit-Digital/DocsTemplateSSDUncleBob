---
title: "El review es el juego"
description: "Por qué el juicio que poda —no la generación de borradores— es el recurso escaso, y cómo el agente judge aprueba o rechaza sin editar."
---

Generar código es barato. Un agente produce un borrador de implementación en
segundos y otro más si el primero no sirve. Lo escaso no es la escritura: es el
**juicio** que decide qué borrador sobrevive y cuál se descarta. En este método
ese juicio se encarna en un agente, el `judge`, y se ejerce como una puerta de
poda, no como una edición.

:::note[Formulación del método]
"El review es el juego entero. Los agentes redactan; el juicio poda"
(*"The review step is the whole game. Agents draft, judgment prunes"*) es la
formulación pedagógica de **BettaTech** dentro del arnés, tal como aparece en la
guía del agente `judge`. Resume el principio, no es una cita literal de Robert
C. Martin.
:::

## El judge aprueba o rechaza; nunca edita

El `judge` tiene una única autoridad: **decidir si el trabajo redactado
sobrevive**. No corrige, no reescribe, no toca `src/` ni `tests/`. Si algo viola
el contrato, lo rechaza con una cita concreta y devuelve el trabajo al ciclo. Esa
separación es deliberada: quien redacta y quien juzga son roles distintos, y el
cuello de botella del proceso es el segundo, no el primero.

## Qué revisa el judge

El protocolo del `judge` recorre, en orden, la documentación fundacional
(workflow, disciplina TDD, convenciones, arquitectura, checkpoints) y luego audita
el trabajo de la feature activa contra su registro de progreso:

1. **Cobertura de escenarios.** Cada escenario Gherkin etiquetado debe tener al
   menos un test concreto que lo ejercite. Si un escenario no tiene prueba, el
   veredicto es rechazo.
2. **Disciplina TDD.** Confirma los ciclos rojo-verde-refactor. Rechaza cualquier
   código de producción que no esté justificado por un test previo que lo exija.
3. **Artesanía (craftsmanship).** Evalúa brevedad de funciones, claridad de
   nombres, manejo de errores y alineación con la arquitectura.
4. **Build verde.** Ejecuta `./init.sh`; si falla, rechaza.
5. **Checkpoints.** Marca el estado del checkpoint correspondiente.
6. **Veredicto.** Emite una única línea de aprobación o de cambios requeridos.

:::caution[Reglas duras]
- Nunca aprueba con tests en rojo o build roto.
- Rechaza si algún escenario carece de cobertura.
- Rechaza código de producción sin test que lo justifique.
- Cita siempre `archivo:línea`; nunca da feedback genérico.
- Nunca modifica el código fuente.
:::

El `judge` escribe su dictamen en disco —`progress/judge_<name>.md`— documentando
cobertura, disciplina TDD, hallazgos de calidad, estado del checkpoint y cambios
requeridos, y devuelve solo una línea con el veredicto. El contenido vive en el
control de versiones, no en el chat.

## Juzgar por métricas, no por lectura

Esta es la conexión con la postura **verificada** de Robert C. Martin sobre el
código escrito por agentes. Martin ha declarado en X que no *lee* ese código:
lo *mide*.

:::note[Postura verificada de Uncle Bob (en X)]
*"I don't review code written by agents. I measure things like test coverage,
dependency structure, cyclomatic complexity, module sizes, mutation testing."*

*"TDD is very inefficient for AIs. Testing is essential for them but not in the
micro steps that the three laws of TDD recommend."*
:::

El `judge` del arnés opera en ese mismo espíritu: no dictamina por gusto estético
sino por criterios comprobables —cobertura de escenarios, disciplina de tests,
tamaño de funciones, build verde— y delega en la [prueba de
mutación](../mutacion/) la medición de si esos tests realmente muerden. Leer cada
línea no escala; medir, sí.

## Dónde encaja en el flujo

El `judge` es la cuarta fase del pipeline, después de que el `tdd_craftsman`
ejecuta sus ciclos y antes de que el `mutation_tester` valide la robustez. Ninguna
feature llega a `done` sin su aprobación **y** sin superar el umbral de mutación.

- El contrato que el `judge` hace cumplir se firma antes, en la [puerta de
  aprobación humana](../puerta-humana/) sobre los escenarios [Gherkin](../gherkin/).
- La disciplina que audita se define en [TDD estricto](../tdd/).
- El agente y su protocolo completo: [judge](../../agentes/judge/).
- Fuentes y atribución: [Atribución y fuentes](../../fuentes/atribucion/).
