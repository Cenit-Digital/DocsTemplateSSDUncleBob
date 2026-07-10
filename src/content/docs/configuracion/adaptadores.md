---
title: Adaptadores por stack
description: Recetas listas para Python, Node/TS y cualquier otro lenguaje.
---

El arnés no sabe de tu lenguaje: solo ejecuta los comandos que declaras en `harness.config.json`. Por eso el proceso es fijo y lo único que cambia por proyecto son esos comandos. Aquí tienes las recetas listas para copiar.

## Python (cero dependencias)

Mapea el arnés a Python usando solo la stdlib. `{{py}}` lo resuelve el motor a `python3` o `python`, así que es portable entre Windows y Unix.

```json
{
  "language": "python",
  "commands": {
    "test": "{{py}} -m unittest discover -s tests -q",
    "mutate": "{{py}} tools/mutate.py {{target}}"
  },
  "mutation": { "threshold": 1.0, "targets": ["src/mi_modulo.py"] }
}
```

El mutador `tools/mutate.py` es propio y sin dependencias: muta operadores, palabras clave, números y `return`, valida que compile y restaura el original. Fuerza salida UTF-8. El layout típico es `src/*.py`, `tests/test_*.py` y `tools/mutate.py`. Tienes un ejemplo ejecutable en `examples/python-notes-cli`: flujo Uncle Bob completo, 47 tests y mutación 100% en los 3 módulos. Cópialo como punto de partida.

### Producción

Para proyectos grandes, cambia el runner a `pytest` y el mutador a [mutmut](https://github.com/boxed/mutmut) o [cosmic-ray](https://github.com/sixty-north/cosmic-ray):

```json
"commands": {
  "lint": "ruff check . && mypy src",
  "test": "pytest -q",
  "mutate": "mutmut run"
}
```

## Node / TypeScript (cero dependencias)

Requiere Node ≥ 18. Los tests corren con el runner integrado `node --test`, sin instalar nada.

```json
{
  "language": "node",
  "commands": {
    "test": "node --test",
    "mutate": "node tools/mutate.mjs {{target}}"
  },
  "mutation": { "threshold": 1.0, "targets": ["src/cli.mjs", "src/notes.mjs", "src/storage.mjs"] }
}
```

El mutador propio `tools/mutate.mjs` enmascara strings y comentarios, muta operadores, palabras, números y `return`, valida con `node --check` y respeta el pragma `// mutate: skip` para mutantes equivalentes. Ver `examples/node-notes-cli`: 29 tests y mutación 100% en los 3 módulos.

### Producción: TypeScript + Vitest + StrykerJS

Es el stack que usa la web corporativa que inspiró esta plantilla.

```json
{
  "language": "node",
  "commands": {
    "install": "pnpm install",
    "lint": "eslint . && tsc --noEmit",
    "test": "vitest run",
    "mutate": "stryker run",
    "build": "vite build"
  }
}
```

La mutación usa [StrykerJS](https://stryker-mutator.io/) con `@stryker-mutator/vitest-runner`; el umbral va en `stryker.config.json`. Requiere `pnpm install`; añade la allowlist de comandos en `.claude/settings.json` si tu agente los usa a menudo.

## Genérico (cualquier stack)

Para cualquier stack no cubierto por un adaptador específico: copia `harness.config.json`, rellena `commands` (`test` sale 0 solo si todos los tests pasan; `mutate` sale != 0 si no supera el umbral), ajusta `paths` si tu layout no usa `src/` / `tests/`, y con `bin/harness init` en verde ya está.

| Stack   | test                | mutación (herramienta)                                              |
| ------- | ------------------- | ------------------------------------------------------------------ |
| Go      | `go test ./...`     | [gremlins](https://github.com/go-gremlins/gremlins) / go-mutesting |
| Rust    | `cargo test`        | [cargo-mutants](https://github.com/sourcefrog/cargo-mutants)       |
| Java    | `mvn test`          | [PIT](https://pitest.org/)                                         |
| C#/.NET | `dotnet test`       | [Stryker.NET](https://stryker-mutator.io/)                         |
| PHP     | `phpunit`           | [Infection](https://infection.github.io/)                          |
| Ruby    | `rspec`             | [mutant](https://github.com/mbj/mutant)                            |

¿Tu stack no tiene mutador maduro? Puedes portar el mutador de los ejemplos (Python/Node): son ~200 líneas sin dependencias que mutan operadores, palabras clave, números y `return`, validan que el mutante compile y restauran el original. Es un buen punto de partida.
