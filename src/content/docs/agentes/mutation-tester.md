---
title: "mutation_tester"
description: "El validador de la suite. Corre tools/mutate.py sobre el código de la feature y exige una puntuación de mutación por encima del umbral; no edita código."
---

`mutation_tester` valida que **los tests muerden**. Inyecta defectos intencionados en el código fuente y confirma que los tests **fallan** ante ellos. Si un defecto sobrevive, la suite tiene un agujero. **No edita código.**

```yaml
name: mutation_tester
description: >-
  Valida que los tests muerden. Corre tools/mutate.py sobre el código
  de la feature y exige una puntuación de mutación por encima del umbral.
  No edita código.
tools: Read, Glob, Grep, Bash
```

## El concepto

> Una suite de tests que pasa solo demuestra que el código **no revienta**, no que los tests funcionen.

La prueba de mutación cierra esa brecha: si mutar una línea (cambiar un `+` por `-`, un `>` por `>=`, un `True` por `False`) **no rompe ningún test**, ese test no está comprobando de verdad ese comportamiento.

:::note[Qué mide la mutación, según Uncle Bob]
En su post *Mutation Testing* (2016), Robert C. Martin argumenta que la mutación mide la **estabilidad semántica** de la suite. El lenguaje de «ROI» o «vale cada ciclo» que a veces acompaña al método es **formulación pedagógica de BettaTech**, no una cita de Martin. Contexto en [Prueba de mutación](../../fundamentos/mutacion/).
:::

## Protocolo

1. **Verifica** la aprobación previa del [`judge`](../judge/) y que la inicialización pasa.
2. **Identifica** los archivos de `src/` modificados a partir de los registros de progreso de la feature.
3. **Ejecuta** la herramienta de mutación sobre cada archivo relevante:
   ```bash
   python3 tools/mutate.py src/<archivo>.py
   ```
4. **Compara** la puntuación de mutación con el umbral documentado (por defecto: **≥100 % en líneas nuevas o modificadas**).
5. **Documenta los mutantes supervivientes** en `progress/mutation_<name>.md` con archivo, línea, tipo de mutación y descripción del test que falta.
6. **Emite el veredicto.**

:::tip[Tooling de mutación real]
Para Python, el arnés incluye `tools/mutate.py` (sin dependencias); también sirven `mutmut` o `cosmic-ray`. Para JavaScript/TypeScript, la herramienta es **Stryker** (`stryker-mutator`). No inventes otras.
:::

## Reglas duras

:::danger[Límites del mutation_tester]
- Nunca aprueba por debajo del umbral.
- Nunca edita `src/` ni `tests/` para forzar un resultado en verde.
- Los equivalentes de comportamiento genuinos se documentan como **exclusiones justificadas** (úsalas con moderación).
:::

El agente **mide e informa, pero no modifica** código ni tests. Los mutantes supervivientes pasan al [`tdd_craftsman`](../tdd-craftsman/), que escribe los tests que faltan.

## Contrato de comunicación

El veredicto es **una sola línea**:

```text
PASS -> progress/mutation_<name>.md (score N%)
```

o, si la suite no muerde lo suficiente:

```text
FAIL -> progress/mutation_<name>.md (score N%, K survivors)
```

## Relacionado

- [Prueba de mutación](../../fundamentos/mutacion/) — qué mide y por qué, con la postura real de Uncle Bob.
- [judge](../judge/) — la aprobación que precede a esta validación.
- [tdd_craftsman](../tdd-craftsman/) — quien escribe los tests que matan a los mutantes supervivientes.
