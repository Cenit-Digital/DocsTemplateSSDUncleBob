---
title: "El método de un vistazo"
description: "El pipeline de cinco fases del Arnés SSD de Uncle Bob, con su diagrama de estados, la regla de una feature a la vez y la única puerta de aprobación humana."
---

El método reorganiza el desarrollo alrededor de un proceso descrito por
**Robert C. Martin**: primero se **conversa** una especificación, luego se
**destila** en un contrato ejecutable, se **aprueba** ese contrato, y solo
entonces se **implementa** bajo TDD estricto y se **valida** con review y
mutación. Una feature a la vez, gobernada de principio a fin.

## El pipeline de cinco fases

1. **Conversación** → `spec_partner` conversa y debate contigo hasta producir
   `project-spec.md` (decisiones razonadas). Ver [SDD](../sdd/).
2. **Destilación** → `gherkin_author` transforma la spec en
   `features/<name>.feature`: escenarios ejecutables. Ver [Gherkin](../gherkin/).
3. **Puerta humana** ⏸ → apruebas el contrato Gherkin antes de que exista una
   sola línea de código. Ver [La puerta de aprobación humana](../puerta-humana/).
4. **Implementación** → `tdd_craftsman` ejecuta rojo-verde-refactor en `src/` y
   `tests/`, un test a la vez. Ver [TDD estricto](../tdd/).
5. **Validación** → `judge` revisa disciplina y calidad; `mutation_tester` mide
   la cobertura real. Ver [El review es el juego](../review/) y
   [Prueba de mutación](../mutacion/).

## El diagrama del pipeline

```text
 pending
    │
    ▼
 spec_partner        ── CONVERSACIÓN ──▶  project-spec.md
    │
    ▼
 gherkin_author      ── DESTILACIÓN ───▶  features/<name>.feature
    │
    ▼
 ┌───────────────────────────────────────────────┐
 │  PUERTA HUMANA  ⏸   (aprobación del contrato)  │
 └───────────────────────────────────────────────┘
    │
    ▼
 in_progress
    │
    ▼
 tdd_craftsman       ── ROJO / VERDE / REFACTOR ─▶  src/ + tests/
    │
    ▼
 judge               ── REVIEW ─────────▶  veredicto
    │
    ▼
 mutation_tester     ── MUTACIÓN ───────▶  score de mutación
    │
    ▼
 done
```

Los estados de la feature transitan `pending` → `in_progress` → `done`; los
agentes marcan cada avance en `feature_list.json` y dejan bitácora en
`progress/`.

## Las dos reglas que sostienen el método

:::caution[Una sola feature a la vez]
No se mezclan features en una misma sesión. El `craftsman_lead` detecta la
siguiente feature pendiente y **pausa antes de escribir código**, esperando la
aprobación humana del contrato Gherkin. Terminar una antes de empezar otra
mantiene el estado del repositorio inequívoco y el review acotado.
:::

:::danger[Una sola puerta de aprobación humana]
Existe **una** puerta, y está sobre los escenarios `.feature`, **no** sobre
código ya escrito. Aprobar el contrato es barato y de máximo apalancamiento;
aprobar tarde —cuando el código ya existe— es caro. Mueve el juicio humano al
punto donde cambiar de idea aún no cuesta casi nada.
:::

## Las consignas del método

Estas frases resumen la intención del arnés. Son **formulación pedagógica del
método (divulgada por BettaTech)**, no citas verbatim de Robert C. Martin:

- **"El review es el juego."** La revisión no es un trámite final: es donde se
  decide la calidad. Ver [El review es el juego](../review/).
- **"Los agentes redactan; el juicio poda."** El agente propone en volumen; la
  disciplina —tests, review y mutación— descarta lo que no se sostiene.
- **La mutación "vale cada ciclo de cómputo".** El coste de mutar y re-ejecutar
  la suite se justifica por la confianza que da medir su estabilidad semántica.
  Ver [Prueba de mutación](../mutacion/).

:::note[Postura verificada de Uncle Bob]
Lo que sí está documentado de Robert C. Martin: las **Tres Leyes del TDD**, y su
uso de la **prueba de mutación** para medir la *estabilidad semántica* de la
suite (sin lenguaje de "ROI"). También ha señalado que mide "cobertura de
tests, estructura de dependencias, complejidad ciclomática, tamaño de módulos y
mutation testing", y que el TDD en micro-pasos resulta ineficiente para las IA
aunque las pruebas sigan siendo esenciales. Detalle y fuentes en
[Atribución y fuentes](../../fuentes/atribucion/).
:::

## Sigue el hilo

Cada fase tiene su página. Recórrelas en orden:

- [¿Qué es Harness Engineering?](../harness-engineering/) — el encuadre general.
- [SDD: la spec conversada](../sdd/) — fase 1.
- [Gherkin: el contrato ejecutable](../gherkin/) — fase 2.
- [La puerta de aprobación humana](../puerta-humana/) — la puerta ⏸.
- [TDD estricto](../tdd/) — fase 4.
- [El review es el juego](../review/) — fase 5 (revisión).
- [Prueba de mutación](../mutacion/) — fase 5 (mutación).
