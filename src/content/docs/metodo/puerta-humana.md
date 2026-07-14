---
title: La puerta humana
description: La única aprobación humana va sobre el contrato Gherkin, no sobre el código.
---

Este flujo no es 100% automático. Hay un humano en el bucle. Pero solo en un punto exacto: justo después del Gherkin y antes de escribir producción.

## Una sola puerta

El pipeline tiene cinco fases, pero **una sola puerta de aprobación humana**. Va sobre los escenarios Gherkin, no sobre el código.

```
gherkin_author  → features/<name>.feature   (spec_ready)
  ⏸ HUMANO APRUEBA los escenarios
in_progress
  → tdd_craftsman  ciclo Rojo → Verde → Refactor
```

El humano no firma el código. Firma el **contrato ejecutable**: los `Scenario` con `Given/When/Then` que definen cada comportamiento.

## Por qué aquí y no después

Aprobar tarde es caro. Aprobar el `.feature` es barato.

La puerta va sobre el contrato porque es el **punto de máximo apalancamiento**: "un escenario mal definido arrastra todo el TDD". Si el humano espera a ver el código para dar su visto bueno, ya se ha pagado el coste de tallarlo con TDD, revisarlo y mutarlo. Corregir entonces significa deshacer trabajo.

En cambio, el `.feature` es solo prosa vuelta contrato. Cambiar un escenario ahí cuesta minutos. A partir de que se firma, "la ambigüedad es un bug del contrato, no del código".

## El craftsman_lead para y espera

El [craftsman_lead](/DocsTemplateSSDUncleBob/agentes/agentes/) es el orquestador. Cuando el `gherkin_author` destila `features/<name>.feature`, la feature pasa a estado `spec_ready` y el orquestador **para**:

> "Escenarios en `features/<name>.feature`. Léelos y di **'aprobado'** para empezar el ciclo TDD, o pide cambios."

No avanza solo. Entre sus reglas de "qué NO hace" está saltarse esta puerta: nunca continúa a TDD si los `.feature` no están aprobados. Si la feature sigue sin aprobación humana, no sigue: le recuerda al humano que le toca leer los escenarios.

## Qué hace el humano

El trabajo del humano en esta puerta es breve y concreto:

1. **Leer** los escenarios del `.feature`.
2. **Pedir cambios** si algún escenario está mal definido o incompleto.
3. **Aprobar** diciendo "aprobado".

Solo tras ese "aprobado" el orquestador cambia el status a `in_progress` y lanza el `tdd_craftsman` con el `.feature` y la sección correspondiente de `project-spec.md`.

## Loop Engineering: HITL en la puerta, HOTL en el resto

Un agente no es solo un prompt suelto: es un **bucle** que decide si repetir, verificar, escalar o parar. Esa decisión de verificación —¿hemos cumplido el objetivo?— es lo que distingue un bucle real de una automatización que ejecuta siempre la misma secuencia.

Esa distinción se traduce en dos formas de meter al humano en el bucle:

- **Human-in-the-loop (HITL)**: el sistema se detiene y espera aprobación humana antes de seguir. Prioriza control sobre velocidad; encaja en decisiones de alto riesgo o difíciles de deshacer.
- **Human-on-the-loop (HOTL)**: el sistema decide y ejecuta de forma autónoma; el humano supervisa el resultado y solo interviene ante una excepción.

Este arnés combina ambos, y a propósito:

- **Una sola puerta HITL**: el `.feature` de Gherkin. Aquí el `craftsman_lead` **para de verdad** y no sigue sin un "aprobado" explícito, porque un escenario mal definido arrastra todo el TDD posterior y corregirlo tarde es caro.
- **HOTL en el resto**: el ciclo Rojo→Verde→Refactor, el review y la prueba de mutación corren solos. El humano no aprueba cada test; supervisa a través de `progress/*.md` y `feature_list.json` ([handoffs en disco](/DocsTemplateSSDUncleBob/metodo/handoffs/)), e interviene solo si algo se desvía.

> Fuentes: BettaTech, [«¿Qué es esto del Loop Engineering?»](https://www.youtube.com/watch?v=18FeGXyB-sI); webreactiva, [«Loop engineering: qué es y en qué se diferencia del harness»](https://www.webreactiva.com/blog/loop-engineering); n8n, [«Human-in-the-Loop vs. Human-on-the-Loop»](https://blog.n8n.io/human-in-the-loop-vs-human-on-the-loop/).

## El resto lo talla la disciplina

Fuera de esta puerta, el valor humano no está en teclear la solución, sino en el juicio. Como recuerda el hilo de Uncle Bob:

> "Agents draft, judgment prunes."

El borrador es barato; el juicio es el juego entero. La puerta humana concentra ese juicio donde más rinde: en el contrato, antes de que exista una sola línea de producción.

Ver también: [El flujo completo](/DocsTemplateSSDUncleBob/metodo/flujo/) y [Gherkin como contrato](/DocsTemplateSSDUncleBob/metodo/gherkin/).
