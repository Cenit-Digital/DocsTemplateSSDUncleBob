---
title: "SDD: la spec conversada"
description: "Spec-Driven Development en el arnés de Uncle Bob: la especificación no se dicta, se debate. De la conversación crítica nace project-spec.md con propósito, contrato, casos límite y decisiones justificadas."
---

**Spec-Driven Development (SDD)** es la primera fase del método. Aquí no se
escribe código ni tests: se escribe **entendimiento**. El artefacto que produce
es `project-spec.md`, la fuente de verdad de la que descienden los archivos
Gherkin, los tests y, finalmente, el código de producción.

La tesis del método es simple y exigente: **una spec vale por el debate que la
precede**. Si nadie discutió los casos límite, el contrato de salida y las
alternativas descartadas, la spec solo aparenta claridad: esconde la ambigüedad
en vez de resolverla.

## La spec nace del debate, no del dictado

El error habitual es tratar la especificación como un dictado: el humano
describe lo que quiere, el agente lo transcribe, y ambos confunden *anotar* con
*acordar*. El arnés lo prohíbe. La documentación del flujo lo resume así:

:::note[Del `docs/workflow.md` del método]
"Spec nace del debate, no del decreto. El documento de especificación emerge de
una conversación donde se exploran casos límite, contratos de salida y
alternativas rechazadas."
:::

Debatir no es un lujo de proceso: es el mecanismo que **expone la ambigüedad
antes** de que contamine el Gherkin, los tests y el código. Corregir una frase
en una conversación cuesta segundos; corregir un comportamiento mal
especificado después de tres ciclos de TDD cuesta el trabajo entero.

## El agente `spec_partner`: socio crítico, no secretario

Esta fase la conduce el subagente [`spec_partner`](../../agentes/spec-partner/).
Su papel no es transcribir, sino **cuestionar**. Trabaja como un socio de
conversación crítico:

- **Busca puntos ciegos.** Hace las preguntas incómodas sobre casos límite,
  contratos de salida, alternativas de diseño y posibles conflictos con
  decisiones anteriores.
- **No decide por ti: te obliga a decidir.** Ante cualquier elección no trivial
  propone **al menos dos opciones** con sus argumentos, deja que el humano elija
  y **registra tanto la elección como su justificación**.
- **Marca lo que sigue abierto.** Las decisiones sin resolver se anotan como
  `OPEN QUESTIONS`, no se dan por zanjadas.
- **Respeta sus límites.** No toca código, tests ni archivos `.feature`: esos
  pertenecen a otros agentes. Su único producto es `project-spec.md`.

:::tip
Si el agente acepta tu primera idea sin oponer una sola pregunta, algo va mal.
La señal de una buena sesión de spec es la cantidad de supuestos que salieron a
la luz, no la velocidad con la que se cerró.
:::

## Anatomía de `project-spec.md`

Cuando surge consenso, el agente amplía `project-spec.md` con una sección por
cada *feature*. Cada sección contiene cinco bloques obligatorios:

| Bloque | Qué fija |
| --- | --- |
| **Propósito** (Purpose) | La intención, en una frase concisa. |
| **Comportamiento** (Behavior) | Descripción precisa en prosa de qué hace. |
| **Contrato** (Contract) | Entradas/salidas exactas: `stdout`, `stderr` y `exit code`. |
| **Casos límite** (Edge cases) | Las condiciones de frontera, enumeradas. |
| **Decisiones** (Decisions) | Cada elección con su razón **y** la alternativa descartada. |

El **contrato** es el corazón medible: no describe intenciones, describe
observables. "Imprime el resultado" no es un contrato; "escribe exactamente `3`
en `stdout` y termina con `exit code` 0" sí lo es. Esa precisión es la que
luego el Gherkin convierte en `Then` verificables.

Las **decisiones** son la memoria del proyecto. Registrar la alternativa
descartada evita volver a debatir lo ya resuelto y explica, meses después, *por
qué* el sistema es como es.

```markdown
## Feature: contar notas

### Propósito
Contar cuántas notas contiene un archivo de notas.

### Comportamiento
Lee el archivo indicado, cuenta las líneas no vacías y reporta el total.

### Contrato
- Entrada: ruta de archivo como primer argumento.
- stdout: el número de notas, seguido de salto de línea.
- stderr: vacío en caso de éxito.
- exit code: 0 en éxito; distinto de 0 si el archivo no existe.

### Casos límite
- Archivo vacío -> 0.
- Archivo inexistente -> error en stderr, exit code distinto de 0.
- Líneas en blanco -> no cuentan.

### Decisiones
- Decisión: las líneas en blanco no cuentan como notas.
  - Razón: una nota vacía no aporta información.
  - Alternativa descartada: contar toda línea física (rechazada por inflar
    el total con separadores).

### OPEN QUESTIONS
- ¿Debe soportar leer de stdin cuando no se pasa ruta? (pendiente)
```

## Dónde encaja en el flujo

SDD es la primera de las cuatro fases del método, y prepara la **puerta de
aprobación humana**:

1. **Conversación** → `project-spec.md` *(esta fase)*
2. **Destilación** → archivos [`.feature` en Gherkin](../gherkin/)
3. **Aprobación humana** — la [puerta crítica](../puerta-humana/)
4. **TDD + Review + Mutación** → código de producción

La puerta humana no se pone sobre el código, sino sobre el **contrato**. Aprobar
un escenario es barato y de máximo apalancamiento; un comportamiento mal
definido en la spec envenena todo el TDD posterior. Por eso el trabajo caro
—escribir tests y código— solo empieza cuando la spec y su destilación en
Gherkin están acordadas.

## La señal de salida

Cada sesión de `spec_partner` cierra con una línea única y trazable:

```text
spec_updated -> project-spec.md (#<id> <name>)
```

Esa línea es el testigo que el resto del arnés espera antes de avanzar a la fase
de destilación.

:::caution[Adaptación a otro lenguaje]
El contrato de ejemplo usa `stdout`/`stderr`/`exit code` porque el stack de
referencia es una CLI en Python. Para otros tipos de programa o lenguajes,
adapta el contrato observable (por ejemplo, código de respuesta HTTP y cuerpo
JSON) siguiendo la guía de [adaptar a otro lenguaje](../../referencia/stack-adapter/).
:::

---

**Siguiente:** con la spec acordada, se destila en
[Gherkin: el contrato ejecutable](../gherkin/).
