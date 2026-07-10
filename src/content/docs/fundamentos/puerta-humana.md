---
title: "La puerta de aprobación humana"
description: "La única puerta de sign-off humano del pipeline —sobre los escenarios Gherkin y antes de escribir producción— y cómo el craftsman_lead se detiene a esperarla."
---

En todo el pipeline hay **una sola** puerta de aprobación humana. No está al final,
sobre el código terminado, sino al principio: sobre los **escenarios Gherkin**, y
**antes** de que se escriba una sola línea de producción. Ahí el humano lee el
contrato ejecutable, dice "aprobado", y solo entonces arranca el ciclo TDD.

## Por qué justo ahí

Porque es el punto de **máximo apalancamiento**. Aprobar el contrato mientras
todavía es texto es barato: cambiar un `Scenario` cuesta una edición. Aprobar tarde
—cuando ya hay implementación, tests y refactor construidos sobre un
malentendido— es caro: hay que deshacer trabajo real. El método invierte el orden
tradicional del review para que el juicio humano caiga donde cuesta menos corregir
el rumbo.

:::tip[El principio]
La aprobación ocurre **antes** del código, no después. Firmar la intención es
barato; descubrir la intención equivocada dentro del código ya escrito es caro.
:::

Sobre los escenarios ya aprobados, el resto del pipeline es automatizable con
disciplina: el `tdd_craftsman` implementa, el [judge](../review/) poda y el
`mutation_tester` valida. El único punto donde el sistema **se detiene a esperar a
un humano** es esta puerta.

## Qué hace el craftsman_lead

El `craftsman_lead` es el orquestador: descompone, coordina y guarda la disciplina,
pero **nunca implementa**. Cuando el `gherkin_author` entrega
`features/<name>.feature`, el `craftsman_lead` **se detiene y espera**. La
instrucción es literal:

:::note[Instrucción verbatim del craftsman_lead]
> "Escenarios en `features/<name>.feature`. Léelos y di **'aprobado'** para
> empezar el ciclo TDD, o pídeme cambios."
:::

No puede avanzar al TDD hasta que el humano apruebe **explícitamente** los
escenarios ejecutables. No hay atajo, no hay aprobación por omisión, no hay
"seguramente está bien". Es la única firma humana de todo el pipeline.

## Dónde encaja en el pipeline

Las features marcadas `"sdd": true` recorren cinco fases obligatorias, con la puerta
humana entre la especificación y la implementación:

```text
pending → spec_partner → gherkin_author → ⏸ APROBACIÓN HUMANA → in_progress → tdd_craftsman → judge → mutation_tester → done
```

- **Antes de la puerta:** el `spec_partner` debate las decisiones con el humano y
  escribe `project-spec.md`; el `gherkin_author` extrae los escenarios a archivos
  `.feature`.
- **En la puerta:** el humano lee el contrato y firma con "aprobado" (o pide
  cambios).
- **Después de la puerta:** arranca el ciclo TDD y las fases automatizadas de poda y
  mutación.

## Lo que el craftsman_lead nunca hace

:::caution[Límites del orquestador]
- No escribe ni edita `src/` ni `tests/`.
- No marca features como `done`.
- No se salta la firma humana sobre los archivos `.feature`.
- No cierra una feature sin aprobación del `judge` **y** umbral de mutación
  cumplido.
- No acepta resultados sin referencia a archivo en disco.
:::

Cada subagente escribe sus artefactos en disco —`project-spec.md`, archivos
`.feature`, registros de progreso— y devuelve solo una línea de referencia. El
contenido vive en el control de versiones, no en el chat.

## Relacionado

- El contrato que se firma en esta puerta: [Gherkin: el contrato
  ejecutable](../gherkin/).
- Cómo se conversa la spec previa: [SDD: la spec conversada](../sdd/).
- El orquestador al detalle: [craftsman_lead](../../agentes/craftsman-lead/).
- El agente que extrae los escenarios: [gherkin_author](../../agentes/gherkin-author/).
- Qué pasa después de la firma: [El review es el juego](../review/) y
  [Prueba de mutación](../mutacion/).
