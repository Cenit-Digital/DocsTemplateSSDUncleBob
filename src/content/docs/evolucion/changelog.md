---
title: Registro de evolución
description: Bitácora de las mejoras del método y la documentación a lo largo del tiempo.
---

Esta es la bitácora del proyecto. Es un registro **append-only**: solo se añaden entradas, nunca se borran ni se reescriben. Aquí el bot y las personas dejan constancia de cada mejora del método o de la documentación, con su fecha.

La idea es sencilla. La documentación es viva. Cada vez que algo cambia, queda registrado. Así cualquiera puede reconstruir cómo llegamos hasta aquí.

## Formato de las entradas

Cada entrada sigue el mismo patrón. Corta y clara:

**`fecha` — resumen del cambio — [enlace al PR]**

- **fecha**: en formato `AAAA-MM-DD`.
- **resumen**: una o dos frases que expliquen qué se mejoró y por qué.
- **enlace al PR**: la Pull Request que introdujo el cambio.

Las entradas se ordenan de más reciente a más antigua. La más nueva arriba.

## Entradas

### 2026-07-10 — Corrige enlaces rotos en "Introducción"

En `empezar/introduccion.md`, la sección "Por dónde seguir" enlazaba a slugs
que no existen (`empezar/que-es-el-arnes-sdd/`, `metodo/flujo-completo/`).
El build de Astro no lo detecta porque no hay comprobador de enlaces
configurado, así que era un 404 silencioso desde la primera página que lee
cualquier persona. Corregido a los slugs reales del sidebar
(`empezar/que-es/`, `metodo/flujo/`, ver `astro.config.mjs`).

### 2026-07-10 — Génesis

Creación de la plantilla agnóstica al lenguaje y de esta documentación viva.

Qué entró en esta primera versión, según el `README`:

- Un **motor de cero dependencias** (`.harness/harness.mjs`, solo Node ≥ 18) que lee `harness.config.json` y ejecuta los comandos de tu stack. El proceso, los agentes y las puertas son fijos; lo único que cambia por proyecto son los comandos.
- **Adaptadores** para distintos stacks en `.harness/adapters/` (Python, Node y genérico), de modo que el mismo arnés sirve para Python, Node/TS, Go, Rust, Java…
- **Dos ejemplos ejecutables, verificados al 100 %**:
  - `examples/python-notes-cli` — Python (stdlib), 47 tests, mutación 100 %.
  - `examples/node-notes-cli` — Node/JS (cero deps), 29 tests, mutación 100 %.
- Esta **documentación viva**, publicada y ampliada de forma continua.

El método que sostiene todo esto es el flujo de Robert C. Martin (Uncle Bob), destilado por BettaTech: **conversar la spec, destilarla en Gherkin, tallar con TDD estricto, podar con juicio (review) y validar con prueba de mutación.** Con una sola puerta de aprobación humana en el punto de máximo apalancamiento: el contrato Gherkin.

## Cómo añadir una entrada

Cuando cierres una mejora, añade tu entrada arriba del todo, justo debajo del título **Entradas**. Respeta el formato `fecha — resumen — enlace al PR` y no toques las entradas anteriores.

Para entender el flujo completo antes de proponer un cambio, revisa el [método](/DocsTemplateSSDUncleBob/metodo/tdd/).
