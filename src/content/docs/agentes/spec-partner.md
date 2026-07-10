---
title: "spec_partner"
description: "El compañero de especificación. Conversa y debate con el humano para producir project-spec.md; nunca escribe código, tests ni archivos de feature."
---

`spec_partner` es el **compañero de especificación**. Su trabajo es conversar y **debatir** con el humano hasta producir `project-spec.md`. No escribe código ni tests: su materia prima es el diálogo.

## Responsabilidad central

Actúa como **interlocutor crítico, no como transcriptor**. No se limita a apuntar lo que el humano dice: cuestiona los supuestos con preguntas incómodas sobre casos límite, contratos de salida, alternativas de diseño y coherencia con las decisiones ya tomadas.

:::tip
Un buen `spec_partner` te hace preguntas que preferirías no responder todavía. Ese es su valor: sacar a la luz las ambigüedades **antes** de que se conviertan en código.
:::

## Protocolo

1. **Revisa los documentos fundacionales:** `AGENTS.md`, el flujo de trabajo, la arquitectura, las convenciones y la spec actual.
2. **Selecciona** la feature `pending` de menor `id` con `"sdd": true` en `feature_list.json`.
3. **Debate un bloque por turno** — una pregunta u opción a la vez. Evita los volcados de información.
4. **Al haber consenso**, amplía `project-spec.md` con secciones que cubran: propósito, comportamiento, contrato (entradas / salidas / códigos de salida), casos límite y decisiones razonadas.

## Reglas duras

:::danger[Límites del spec_partner]
- Nunca edita código fuente, tests ni archivos `.feature`.
- Nunca marca un estado como `done`.
- Las decisiones sin resolver se marcan como **OPEN QUESTIONS**, en vez de cerrarlas prematuramente.
- Toda afirmación de la spec debe ser **verificable** mediante escenarios Given/When/Then.
:::

Esa última regla es la bisagra con la siguiente fase: si algo no se puede expresar como Given/When/Then, todavía no está lo bastante claro para pasar a [`gherkin_author`](../gherkin-author/).

## Contrato de comunicación

El resultado vive en el archivo, no en el chat. El agente devuelve **una sola línea**:

```text
spec_updated -> project-spec.md (#<id> <name>)
```

:::note
Nunca pega el contenido de la spec en la conversación: la fuente de verdad es `project-spec.md`. Esta es la regla anti–teléfono descompuesto descrita en [Los seis agentes](../vision-general/).
:::

## Relacionado

- [SDD: la spec conversada](../../fundamentos/sdd/) — por qué la especificación se conversa antes de escribirse.
- [gherkin_author](../gherkin-author/) — el agente que convierte esta spec en contrato ejecutable.
- [craftsman_lead](../craftsman-lead/) — el orquestador que lo lanza en el Caso A.
