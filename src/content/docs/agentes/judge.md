---
title: "judge"
description: "El juez del arnés. Aprueba o rechaza el trabajo del tdd_craftsman contra el .feature, docs/ y CHECKPOINTS.md; no edita código, solo poda."
---

`judge` (el juez) aprueba o rechaza el trabajo de [`tdd_craftsman`](../tdd-craftsman/) contra el `.feature`, la carpeta `docs/` y `CHECKPOINTS.md`. Su autoridad se basa en **podar**: decidir si un borrador merece sobrevivir. **No edita código.**

```yaml
name: judge
description: >-
  El review es el juego entero. Aprueba o rechaza el trabajo del
  tdd_craftsman contra el .feature, docs/ y CHECKPOINTS.md.
  No edita código.
tools: Read, Glob, Grep, Bash
```

:::note[Sobre la consigna «el review es el juego entero»]
La definición del agente lo resume así: *«el review es el juego entero; los agentes redactan, el juicio poda»* (*the review step is the whole game; agents draft, judgment prunes*). Es la **formulación pedagógica de BettaTech**, no una cita verbatim de Robert C. Martin. La idea de fondo es real: cuando generar borradores es barato, el cuello de botella —y el valor— pasa a estar en el **juicio que descarta**. Contexto en [El review es el juego](../../fundamentos/review/).
:::

## Protocolo de review (7 pasos)

1. **Estudia los documentos fundacionales:** `workflow.md`, `tdd.md`, `conventions.md`, `architecture.md`, `CHECKPOINTS.md`.
2. **Localiza la feature activa** y abre su archivo `.feature` y su registro de progreso.
3. **Cobertura de escenarios:** cada etiqueta `@s` exige al menos un test concreto; la cobertura faltante provoca **rechazo**.
4. **Disciplina TDD:** comprueba que en el registro de progreso hay ciclos Rojo–Verde–Refactor; señala cualquier código de producción sin test que lo respalde.
5. **Revisión de artesanía** en los archivos tocados: brevedad de funciones, claridad de nombres, contratos de error, cumplimiento arquitectónico.
6. **Ejecuta `./init.sh`** y verifica el verde.
7. **Marca los checkpoints** y emite el veredicto.

## Reglas duras

:::danger[Lo que el juez nunca hace]
- ❌ Nunca aprueba con tests en rojo o con `./init.sh` fallando.
- ❌ Nunca aprueba escenarios sin cobertura.
- ❌ Nunca aprueba código de producción sin test.
- ❌ Nunca edita código: solo **identifica** fallos.
- ✅ Siempre cita archivo y número de línea.
:::

## Contrato de comunicación

El veredicto es **una sola línea** en el chat, respaldada por el archivo de veredicto:

```text
APPROVED -> progress/judge_<name>.md
```

o, si hay que corregir:

```text
CHANGES_REQUESTED -> progress/judge_<name>.md
```

El detalle —qué falló, en qué archivo y línea, qué escenario quedó sin cubrir— vive en `progress/judge_<name>.md`. Los defectos vuelven al [`tdd_craftsman`](../tdd-craftsman/) para corregirlos.

## Relacionado

- [El review es el juego](../../fundamentos/review/) — por qué la poda es el centro del método.
- [Checkpoints (C1–C7)](../../referencia/checkpoints/) — las puertas que el juez marca.
- [mutation_tester](../mutation-tester/) — la validación que sigue a un review aprobado.
