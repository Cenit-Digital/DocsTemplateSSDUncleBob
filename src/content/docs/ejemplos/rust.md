---
title: Ejemplo Rust (notes-cli)
description: 'CLI de notas en Rust, cero dependencias: 58 tests, mutación 100%.'
---

`examples/rust-notes-cli` es el gemelo en Rust de
[`python-notes-cli`](/DocsTemplateSSDUncleBob/ejemplos/python/): la misma CLI
minimalista de notas, con **cero dependencias** — todo con la stdlib de Rust.

## Qué demuestra

El mismo flujo Uncle Bob de punta a punta, con una particularidad: la stdlib
de Rust no trae JSON (a diferencia de Python, Node y Go), así que el ejemplo
implementa uno mínimo a mano en `src/json.rs` — dominio con sustancia extra
para la prueba de mutación.

- **Tests con el runner integrado** `cargo test --quiet`.
- **Mutador propio** `tools/mutate.rs`, compilado como binario aparte.
- **Umbral de mutación al 100 %** sobre cuatro módulos: `src/cli.rs`,
  `src/notes.rs`, `src/json.rs` y `src/storage.rs`.

Los comandos vienen de `harness.config.json`:

```json
"commands": {
  "test": "cargo test --quiet",
  "mutate": "cargo build --quiet --bin mutate && ./target/debug/mutate {{target}}"
}
```

## Estructura

```
src/     lib.rs  main.rs  cli.rs  notes.rs  json.rs  storage.rs
tools/   mutate.rs
features/
```

El dominio (y los mutantes que hay que matar) vive en la librería `notes`
(`src/lib.rs` + módulos); `src/main.rs` es solo el pegamento que la conecta a
`std::env::args`. Los tests unitarios van colocados en un módulo
`#[cfg(test)]` dentro de cada `.rs`, la convención de Rust — por eso
`paths.tests` también apunta a `src/`, como en el ejemplo de Go.

## El mutador propio

`tools/mutate.rs` enmascara cadenas, comentarios, literales de carácter y los
propios módulos `#[cfg(test)]` antes de escanear, para no mutar nunca el
código de test. Descarta los mutantes que no compilan
(`cargo test --lib --no-run`), restaura siempre el archivo original y respeta
el pragma `// mutate: skip` — el mismo diseño que `tools/mutate.go`,
`mutate.mjs` y `mutate.py` de los otros ejemplos.

## Métricas

**58 tests** y **mutación 100 %** (78 mutantes, 0 supervivientes) en los
cuatro módulos objetivo:

- `src/cli.rs` → 59/59 mutantes muertos.
- `src/json.rs` → 15/15 mutantes muertos.
- `src/notes.rs` → 3/3 mutantes muertos.
- `src/storage.rs` → 1/1 mutantes muertos.

A diferencia del ejemplo de Go, este no necesitó ningún `// mutate: skip`: el
orden de notas se hace con `slice::sort_by`/`Ord::cmp`, que no tiene ningún
operador de comparación que mutar, así que no aparece ningún mutante
equivalente.

## Cómo ejecutarlo

```bash
cd examples/rust-notes-cli
node ../../.harness/harness.mjs init
node ../../.harness/harness.mjs mutate src/cli.rs
```

## Para producción

Este ejemplo usa un mutador casero para ser autocontenido y determinista en
CI, sin `cargo install` por red. Un proyecto Rust real usaría
[cargo-mutants](https://github.com/sourcefrog/cargo-mutants) — documentado en
el [adaptador de Rust](/DocsTemplateSSDUncleBob/configuracion/adaptadores/) y
ya recomendado en la sección de [mutadores de producción](/DocsTemplateSSDUncleBob/metodo/mutacion/).

Fuente: Cenit-Digital/TemplateSSDUncleBob,
[PR #9 «añade examples/rust-notes-cli (Rust, cero deps, mutación 100%)»](https://github.com/Cenit-Digital/TemplateSSDUncleBob/pull/9).
