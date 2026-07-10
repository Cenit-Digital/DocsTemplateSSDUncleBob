---
title: Handoffs y estado en disco
description: Los agentes escriben en ficheros y se pasan el trabajo; nada vive en el chat.
---

En un flujo multi-agente, pasar contenido de un agente a otro por el chat es un
juego de "teléfono descompuesto": cada salto pierde matices y quema tokens. La
plantilla lo evita con una regla dura: **el estado vive en disco, no en el chat**.

## La regla anti-teléfono-descompuesto

Cada fase del pipeline la ejecuta un subagente distinto. Ese subagente
**escribe su resultado en un fichero** y te devuelve solo **una línea** de
referencia. El siguiente agente lo lee. El contenido nunca circula por el chat.

Cuando el `craftsman_lead` lanza un subagente, lo instruye para escribir en un
archivo concreto (`project-spec.md`, `features/<name>.feature`,
`progress/tdd_<name>.md`, `progress/judge_<name>.md`,
`progress/mutation_<name>.md`) y responder con una sola línea. Así cada eslabón
del pipeline recoge exactamente lo que necesita del disco, no de una
conversación que se degrada.

## Por qué en disco y no en el chat

Esto no es cosmético. Escribir el estado en ficheros aporta tres beneficios
concretos:

- **Contexto mínimo por agente (optimización de tokens).** Cada subagente ve
  solo lo que necesita para su fase, no el historial completo. Esto mantiene el
  consumo de tokens bajo control en un flujo multi-agente.
- **Sobrevive a reinicios y a ventanas de contexto reventadas.** Si una sesión
  se corta o el contexto se satura, el trabajo ya está en disco. No se pierde.
- **Queda versionado.** Los artefactos son ficheros del repositorio: se
  commitean, se revisan y se comparan como cualquier otro código.

## Mapa de artefactos (quién escribe qué)

Cada fila es un handoff: quién lo escribe y qué contiene. Esta es la memoria
compartida del pipeline.

| Archivo                        | Lo escribe                     | Contiene                                            |
| ------------------------------ | ------------------------------ | --------------------------------------------------- |
| `project-spec.md`              | spec_partner                   | Spec conversada: propósito, contrato, decisiones    |
| `features/<name>.feature`      | gherkin_author                 | Escenarios Gherkin `@s1..@sn` (el contrato firmado) |
| `src/`, `tests/`               | tdd_craftsman                  | Código y tests, tallados por TDD                    |
| `progress/tdd_<name>.md`       | tdd_craftsman                  | Bitácora de ciclos + mapa `@s → test`               |
| `progress/judge_<name>.md`     | judge                          | Veredicto de review + checkpoints                   |
| `progress/mutation_<name>.md`  | mutation_tester                | Score de mutación + mutantes sobrevivientes         |
| `feature_list.json`            | craftsman_lead / tdd_craftsman | `pending → spec_ready → in_progress → done`         |

## El flujo, resumido

El humano no vigila un chat interminable: sigue un rastro de ficheros. La spec
se conversa y aterriza en `project-spec.md`; se destila en Gherkin; se talla el
código con [TDD](/DocsTemplateSSDUncleBob/metodo/tdd/); el `judge` poda; el
`mutation_tester` valida. En cada salto, el resultado queda escrito antes de
pasar el testigo. El estado es el disco, y el disco es la fuente de verdad.
