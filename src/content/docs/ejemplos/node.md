---
title: Ejemplo Node/JS (notes-cli)
description: 'CLI de notas en Node cero dependencias: 29 tests, mutación 100%.'
---

`examples/node-notes-cli` es el ejemplo de referencia en JavaScript. Es una CLI de notas escrita en ESM (módulos `.mjs`), con **cero dependencias**. Solo necesita Node ≥ 18.

## Qué demuestra

Demuestra el flujo Uncle Bob end-to-end sobre un proyecto pequeño y sin instalar nada:

- **Tests con el runner integrado** `node --test` (Node 18+).
- **Mutador propio** `tools/mutate.mjs`.
- **Umbral de mutación al 100%** sobre tres módulos: `src/cli.mjs`, `src/notes.mjs` y `src/storage.mjs`.

Los comandos vienen de `harness.config.json`:

```json
"commands": {
  "test": "node --test",
  "mutate": "node tools/mutate.mjs {{target}}"
}
```

## El mutador propio

El mutador `tools/mutate.mjs` no depende de librerías externas. Su lógica:

1. **Enmascara strings y comentarios** para no mutar dentro de ellos.
2. **Muta** operadores, palabras clave, números y `return`.
3. **Valida** cada mutante con `node --check`.
4. **Respeta el pragma** `// mutate: skip` para descartar mutantes equivalentes.

## Métricas

El ejemplo alcanza los resultados que se piden para cerrar una feature:

- **29 tests** en total.
- **Mutación 100%** en los tres módulos:
  - `notes`: 4/4
  - `storage`: 4/4
  - `cli`: 34/34

Las reglas del proyecto (en `harness.config.json`) exigen tests y mutación para cerrar: `require_tests_to_close` y `require_mutation_to_close`, además de una feature a la vez y una spec aprobada antes de implementar.

## La feature `count`

La feature `features/count.feature` ("Contar notas") recorre el flujo completo con tres escenarios etiquetados `@s1`, `@s2` y `@s3`:

- **`@s1`** — Almacén vacío imprime `0` y el código de salida es `0`.
- **`@s2`** — Un almacén con 3 notas imprime el total exacto `3`.
- **`@s3`** — `count` no crea el almacén cuando no existe: el código de salida es `0` y el archivo de notas sigue sin existir.

Cada escenario define su comportamiento observable en Given/When/Then, sin ambigüedad.

## Para producción

Este ejemplo es de referencia, no un stack de producción. Como indica su propia descripción, un proyecto TypeScript real usaría otro conjunto de herramientas:

- **TypeScript** con `tsc --noEmit` para el chequeo de tipos.
- **Vitest** (`vitest run`) como runner de tests.
- **StrykerJS** (`stryker run`) para mutación, con `@stryker-mutator/vitest-runner` y el umbral en `stryker.config.json`.

Ese es el stack que usa la web corporativa que inspiró esta plantilla. Requiere `pnpm install`; conviene añadir la allowlist de comandos en `.claude/settings.json` si tu agente los usa a menudo.
