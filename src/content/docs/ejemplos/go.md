---
title: Ejemplo Go (notes-cli)
description: 'CLI de notas en Go, cero dependencias: 35 tests, mutación 100%.'
---

`examples/go-notes-cli` es el gemelo en Go de
[`python-notes-cli`](/DocsTemplateSSDUncleBob/ejemplos/python/): la misma CLI
minimalista de notas, con **cero dependencias** — todo con la stdlib de Go.

## Qué demuestra

El mismo flujo Uncle Bob de punta a punta, pero en un stack sin ecosistema de
mutación maduro y listo para usar sin instalar nada por red:

- **Tests con el runner integrado** `go test ./...`.
- **Mutador propio** `tools/mutate.go`, sobre `go/scanner`.
- **Umbral de mutación al 100 %** sobre tres módulos: `src/cli.go`,
  `src/notes.go` y `src/storage.go`.

Los comandos vienen de `harness.config.json`:

```json
"commands": {
  "test": "go test ./...",
  "mutate": "go run ./tools {{target}}"
}
```

## Estructura

```
cmd/notes/   main.go
src/         cli.go  notes.go  storage.go  (+ *_test.go colocados)
tools/       mutate.go
features/
```

El layout separa el paquete `src` (reutilizable, con la lógica y sus tests
colocados) del pegamento en `cmd/notes/main.go`. `paths.tests` apunta a `src`,
no a una carpeta `tests/` separada: en Go los `_test.go` viven junto al
paquete que prueban.

## El mutador propio

`tools/mutate.go` trabaja a nivel de *token* con `go/scanner` de la stdlib, así
que nunca muta el contenido de strings ni comentarios: solo operadores,
enteros y las constantes `true`/`false`. Descarta los mutantes que no
compilan (`go build ./...`), restaura siempre el archivo original y respeta el
pragma `// mutate: skip` para mutantes equivalentes — el mismo diseño que
`tools/mutate.py` y `tools/mutate.mjs` de los otros dos ejemplos.

## Métricas

**35 tests** y **mutación 100 %** (66 mutantes, 0 supervivientes) en los tres
módulos objetivo:

- `src/cli.go` → 52/52 mutantes muertos.
- `src/notes.go` → 7/7 mutantes muertos.
- `src/storage.go` → 7/7 mutantes muertos.

Un único mutante se marca `// mutate: skip` por ser **equivalente**: el
comparador `byCreatedAtDesc` usa `>`, y sobre claves distintas `>` y `>=`
producen el mismo orden — mutar ese operador no es un agujero en los tests,
es indetectable por definición.

## Cómo ejecutarlo

```bash
cd examples/go-notes-cli
node ../../.harness/harness.mjs init
node ../../.harness/harness.mjs mutate src/cli.go
```

## Para producción

Este ejemplo usa un mutador casero para ser autocontenido y determinista en
CI, sin `go install` por red. Un proyecto Go real usaría
[gremlins](https://github.com/go-gremlins/gremlins) como mutador — documentado
en el [adaptador de Go](/DocsTemplateSSDUncleBob/configuracion/adaptadores/).

Fuente: Cenit-Digital/TemplateSSDUncleBob,
[PR #8 «añade examples/go-notes-cli (Go, cero deps, mutación 100%)»](https://github.com/Cenit-Digital/TemplateSSDUncleBob/pull/8).
