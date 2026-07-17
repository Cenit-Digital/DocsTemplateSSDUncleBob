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

### 2026-07-17 — Añade la notación EARS a la fase de spec conversada

En `metodo/spec.md` se añade la sección "EARS: frasear requisitos sin
ambigüedad": las cinco plantillas de EARS (ubicua, guiada por estado, guiada
por evento, característica opcional, comportamiento no deseado) y cómo la
plantilla completa (`While…when…the <sistema> shall…`) mapea casi
literalmente a Given/When/Then. Se conecta con la regla ya existente de que
toda afirmación del `project-spec.md` debe poder convertirse en un escenario
comprobable.

Motivo: es un tema del backlog de `.github/AUTONOMOUS.md`
("Notación EARS para requisitos y su traducción directa a tests") que aún no
tenía desarrollo propio. EARS da al `spec_partner` una sintaxis restringida
concreta para detectar afirmaciones ambiguas antes de que lleguen a Gherkin.

Fuente: Alistair Mavin, [«EARS: Easy Approach to Requirements Syntax»](https://alistairmavin.com/ears/)
(publicada originalmente en Rolls-Royce PLC, RE'09, 2009).

### 2026-07-14 — Documenta la memoria organizacional (el tercer bucle)

Nueva página `evolucion/memoria-organizacional.md` (más su entrada en el
sidebar): qué es el repositorio privado `SistemaDeMemoriaUncleBob`, cómo su
bot mensual destila patrones validados del histórico de los proyectos
(descubrimiento dinámico de repos por la API, máximo 1-2 patrones por
ejecución con origen verificable, fusión siempre humana) y cómo cada proyecto
los consume en el paso 2bis de su Protocolo de arranque.

Motivo: el sistema de memoria organizacional se implementó hoy en la
organización (la plantilla y WebEmpresa ya llevan el paso 2bis y sus scripts
de sincronización); esta documentación pública describe el mecanismo — el
contenido de la memoria es privado por diseño, porque destila proyectos de
cliente.

Fuentes: [Claude Code GitHub Action](https://code.claude.com/docs/en/github-actions);
[fine-grained PATs de GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens);
implementación: [Cenit-Digital/SistemaDeMemoriaUncleBob](https://github.com/Cenit-Digital/SistemaDeMemoriaUncleBob) (privado).

### 2026-07-14 — Añade "Loop Engineering" a la puerta humana

En `metodo/puerta-humana.md` se añade la sección "Loop Engineering: HITL en la
puerta, HOTL en el resto". Cubre un tema del backlog que aún no estaba
desarrollado: la diferencia entre *human-in-the-loop* (el sistema se detiene y
espera aprobación) y *human-on-the-loop* (el sistema corre solo y el humano
supervisa e interviene solo ante una excepción). Se conecta con el diseño real
del arnés: una única puerta HITL sobre el `.feature` de Gherkin, y HOTL para el
resto del ciclo (TDD, review, mutación), donde el humano supervisa vía
`progress/*.md` en vez de aprobar paso a paso.

Motivo: es la primera idea de la playlist de BettaTech
(*"¿Qué es esto del Loop Engineering?"*, vídeo 1) y todavía no tenía una
sección propia, a pesar de estar en el backlog de `.github/AUTONOMOUS.md`.

Fuentes: BettaTech, [«¿Qué es esto del Loop Engineering?»](https://www.youtube.com/watch?v=18FeGXyB-sI);
webreactiva, [«Loop engineering: qué es y en qué se diferencia del harness»](https://www.webreactiva.com/blog/loop-engineering);
n8n, [«Human-in-the-Loop vs. Human-on-the-Loop»](https://blog.n8n.io/human-in-the-loop-vs-human-on-the-loop/).

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
