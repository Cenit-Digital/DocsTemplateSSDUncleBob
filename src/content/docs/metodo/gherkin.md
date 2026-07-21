---
title: '2 · Gherkin: el contrato ejecutable'
description: Destilar la spec en escenarios Given/When/Then que el humano firma.
---

Una vez terminada la `project-spec.md`, se destila en un conjunto de archivos `.feature`. En palabras de Uncle Bob: "Once the project-spec.md is done, I have it create a set of .feature files from the project-spec.md."

Los `.feature` son lo que el humano aprueba en la puerta, y el mapa que el `tdd_craftsman` recorre. Los archivos viven en `features/<name>.feature`, donde `<name>` coincide con el campo `name` de `feature_list.json`.

## Estructura

```gherkin
Feature: <propósito en una frase>
  Como <rol> quiero <capacidad> para <beneficio>.   # contexto opcional

  @s1
  Scenario: <comportamiento observable>
    Given <estado de partida>
    When <acción concreta del usuario>
    Then <resultado medible: salida / error / código de salida / estado>

  @s2
  Scenario: <caso límite o error>
    Given ...
    When ...
    Then ...
```

## Reglas duras

- **Un `Scenario` por comportamiento observable**, incluidos los caminos de error (id inexistente, entrada inválida, estado vacío). Si la `project-spec.md` menciona un caso límite, tiene su escenario.
- **Tags estables** `@s1`, `@s2`, … Son el identificador que el `tdd_craftsman` (mapa `@s → test`) y el `judge` (cobertura) citan.
- **Cada `Then` afirma algo medible.** Prohibido "el sistema funciona". Se vale: "Then la salida es exactamente `3`", "Then el código de salida es distinto de 0", "Then el error contiene `--limit`".
- **Un solo `When` por escenario** (la acción bajo prueba). Si necesitas dos acciones, probablemente son dos escenarios.
- **Sin detalles de implementación.** El `.feature` describe comportamiento, no funciones ni nombres de variables.

## Ejemplo: feature `count`

Un ejemplo agnóstico, con el camino feliz, el borde y una garantía sobre el estado:

```gherkin
Feature: Contar notas
  Como usuario quiero saber cuántas notas tengo para tener una visión rápida.

  @s1
  Scenario: Almacén vacío imprime 0
    Given un almacén de notas vacío
    When ejecuto el comando "count"
    Then la salida estándar es exactamente "0"
    And el código de salida es 0

  @s2
  Scenario: Varias notas imprime el total exacto
    Given un almacén con 3 notas
    When ejecuto el comando "count"
    Then la salida estándar es exactamente "3"

  @s3
  Scenario: count no modifica el almacén
    Given un almacén con 2 notas
    When ejecuto el comando "count"
    Then el archivo de notas queda byte a byte igual que antes
```

## De Gherkin a test

No usamos un runner BDD (behave, pytest-bdd, cucumber-js) para no añadir dependencias externas ni acoplar el contrato a un framework. En su lugar, cada `Scenario` se traduce **a mano** a un test cuyo nombre cita el escenario:

```
@s1 → test_count_archivo_vacio
@s2 → test_count_varias_notas
@s3 → test_count_no_muta_archivo
```

El `tdd_craftsman` escribe estos tests uno a uno (Rojo→Verde→Refactor) y deja el mapa en `progress/tdd_<name>.md`. Así el `.feature` sigue siendo la fuente de verdad legible por el humano, sin pagar el coste de un framework.

## Los tres niveles del SDD (Böckeler)

Birgitta Böckeler (Thoughtworks), en el blog de Martin Fowler, distingue tres
niveles de rigor en el "spec-driven development". Cada uno resuelve un fallo
del anterior, a cambio de más inversión:

- **Spec-first**: la spec se escribe primero y se usa para la tarea en curso;
  luego se puede descartar.
- **Spec-anchored**: la spec se mantiene viva más allá de la tarea, para la
  evolución y el mantenimiento de la feature.
- **Spec-as-source**: la spec es el fichero fuente principal con el tiempo;
  solo la edita el humano, que nunca toca el código directamente.

¿Dónde cae este arnés? En **spec-anchored**. El `.feature` no se descarta al
cerrar la feature: queda versionado en `features/<name>.feature` como la
fuente de verdad legible por el humano, y el mapa `@s → test` de
`progress/tdd_<name>.md` lo mantiene trazable si la feature evoluciona. Pero no
llega a spec-as-source: el código y los tests los sigue escribiendo el
`tdd_craftsman` a mano vía TDD, no se regeneran automáticamente desde el
`.feature`.

El mismo artículo evalúa tres herramientas contra estos niveles: **Kiro** se
queda en spec-first (sin mecanismo para mantener la spec entre tareas);
**GitHub Spec Kit** aspira a spec-anchored pero en la práctica sigue siendo
spec-first (crea una rama por spec en vez de un artefacto vivo); **Tessl** es
la única que persigue spec-anchored en serio, con exploraciones de
spec-as-source (código marcado `GENERATED FROM SPEC — DO NOT EDIT`).

Fuente: Birgitta Böckeler, blog de Martin Fowler,
[«Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl»](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html).

Desde aquí, el siguiente paso es el ciclo de [TDD](/DocsTemplateSSDUncleBob/metodo/tdd/).
