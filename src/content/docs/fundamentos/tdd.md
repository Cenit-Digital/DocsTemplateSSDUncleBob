---
title: "TDD estricto"
description: "Las Tres Leyes del TDD de Robert C. Martin aplicadas por el agente tdd_craftsman: ciclo Rojo-Verde-Refactor, granularidad por escenario @s, trazabilidad obligatoria y los olores que caza el judge."
---

Con los [archivos Gherkin aprobados](../gherkin/), el subagente
[`tdd_craftsman`](../../agentes/tdd-craftsman/) escribe el código de producción
bajo **TDD estricto**. "Estricto" no es un adjetivo decorativo: significa que
las Tres Leyes de Robert C. Martin se aplican sin excepción, un test cada vez.

## Las Tres Leyes del TDD

Estas **sí** son de Uncle Bob, literalmente
([The Cycles of TDD, 2014](https://blog.cleancoder.com/uncle-bob/2014/12/17/TheCyclesOfTDD.html)):

1. **No escribas código de producción salvo para hacer pasar un test que
   falla.** No hay implementación sin un test en rojo que la exija.

2. **No escribas más de un test de lo suficiente para fallar** — y un error de
   compilación o de importación **cuenta** como fallo. Nada de suites enteras
   escritas por adelantado.

3. **No escribas más código de producción del mínimo necesario** para hacer
   pasar ese único test que falla. Sin especular sobre necesidades futuras.

El pago de esta disciplina: **cero código sin un test que lo justifique**, y
cada test conduce a implementación real. El alcance se mantiene bajo control por
construcción, no por buena voluntad.

## El ciclo Rojo-Verde-Refactor

El ritmo es implacable y pequeño:

:::note[ROJO]
Escribe **un** test que falle a partir del siguiente escenario. Verifica que el
fallo es **genuino** (falla por la razón esperada, no por un typo).
:::

:::tip[VERDE]
Implementa el **mínimo absoluto**. Devolver una constante es legal si ningún
test lo contradice todavía; la generalización llega en el siguiente ciclo, por
diseño.
:::

:::caution[REFACTOR]
Solo con la barra en verde. Elimina duplicación, aclara nombres, parte funciones
largas. Re-ejecuta los tests tras cada cambio: **rojo aquí significa que rompiste
comportamiento**, no que refactorizaste.
:::

La regla de oro del refactor: **nunca se refactoriza en rojo**. Si los tests no
están en verde, no estás refactorizando, estás arreglando.

## Granularidad: un `@s`, uno o más ciclos

Cada escenario (`@s`) del archivo Gherkin exige **al menos un ciclo completo**
Rojo-Verde-Refactor. Los escenarios complejos, con varias condiciones, pueden
necesitar **dos ciclos** para forzar la generalización correcta: el primer ciclo
admite la constante; el segundo la rompe con un nuevo caso y obliga al código a
generalizar.

Esta es exactamente la disciplina que hace honesta la Segunda Ley: no se
escribe código general "porque hará falta", se escribe cuando un segundo test lo
demanda.

## Trazabilidad obligatoria

La cobertura se documenta en `progress/tdd_<name>.md`, enlazando **cada
escenario con su test concreto**:

```text
@s1 (archivo vacío → 0)      → test_count_archivo_vacio
@s2 (tres notas → 3)         → test_count_varias_notas
@s3 (inexistente → error)    → test_count_archivo_inexistente
```

Esta tabla no es burocracia: es la evidencia que verifican las dos puertas de
calidad que siguen.

- [**El judge**](../../agentes/judge/) **falla** si algún escenario se quedó sin
  test.
- [**La prueba de mutación**](../mutacion/) **falla** si los tests
  existen pero no atrapan los defectos inyectados.

## Los olores que caza el judge

Al revisar el trabajo del `tdd_craftsman`, el juez busca señales de que la
disciplina se rompió:

- **Código de producción escrito sin un test en rojo** que lo pidiera (viola la
  Primera Ley — código huérfano).
- **Tests escritos para escenarios futuros** aún no activos (viola la Segunda
  Ley).
- **Refactor intentado con los tests en rojo**.
- **Funciones o nombres que sobrevivieron** a la fase de refactor sin escrutinio.

:::danger[El código huérfano se rechaza]
El olor más grave es el código sin test que lo solicite. El juez lo rechaza sin
negociación: en este método, código que ningún test pidió, sencillamente no
debería existir.
:::

## Un matiz honesto: micro-TDD e IAs

Este método aplica las Tres Leyes en **micro-pasos**. Conviene registrar, sin
diluirlo, que el propio Robert C. Martin ha matizado públicamente esta práctica
**cuando el que programa es una IA**:

> "TDD is very inefficient for AIs. Testing is essential for them but not in the
> micro steps that the three laws of TDD recommend."
> — Robert C. Martin (en X)

En la misma línea, sobre cómo evalúa el trabajo de los agentes:

> "I don't review code written by agents. I measure things like test coverage,
> dependency structure, cyclomatic complexity, module sizes, mutation testing."
> — Robert C. Martin (en X)

La lectura del método no contradice a Martin: **el testing sigue siendo
esencial**, y las Leyes siguen siendo la brújula de la disciplina. Lo que estas
citas subrayan es *por qué* el arnés no se queda en la barra verde y añade
**medición dura** —cobertura, y sobre todo [prueba de mutación](../mutacion/)—
como la verdadera vara para juzgar la robustez del código generado por agentes.

---

**Autor de esta fase:** [`tdd_craftsman`](../../agentes/tdd-craftsman/).
**Siguiente:** el trabajo pasa por [el review](../review/) y la
[prueba de mutación](../mutacion/).
