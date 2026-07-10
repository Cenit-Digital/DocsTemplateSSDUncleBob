---
title: "El ejemplo notes-cli"
description: "El ejemplo trabajado de punta a punta que trae la plantilla en examples/notes-cli, una copia fiel del repo del método, para estudiar el proceso con artefactos reales."
---

La plantilla incluye en `examples/notes-cli/` un proyecto **completo y ya
recorrido de punta a punta**: un CLI de notas en Python. El código es
**deliberadamente simple** —almacenamiento JSON, un modelo `Note`, comandos de
línea— porque el ejemplo no enseña complejidad de dominio: enseña **el proceso**
(Harness Engineering, edición artesano). Lo valioso no es el CLI, es la traza que
deja al construirse.

:::note
`examples/notes-cli/` es una **copia fiel** del repositorio fuente del método,
[betta-tech/harness-sdd](https://github.com/betta-tech/harness-sdd), rama
`uncle-bob-harness`. La plantilla lo empaqueta como ejemplo de referencia.
:::

## Qué contiene

```text
examples/notes-cli/
├── project-spec.md        # la spec viva del proyecto (conversada)
├── feature_list.json      # 12 features declaradas (varias sdd:true)
├── features/              # contratos Gherkin ejecutables
│   ├── cli_count.feature
│   ├── cli_recent.feature
│   └── cli_since.feature
├── progress/              # informes con marca de tiempo (la traza)
│   ├── tdd_cli_count.md      judge_cli_count.md    mutation_cli_count.md
│   ├── tdd_cli_since.md      judge_cli_since.md    mutation_cli_since.md
│   ├── review_cli_edit.md    review_cli_recent.md
│   ├── explore_*.md          current.md            history.md
├── src/                   # el código de producción
│   ├── cli.py             # argparse: add, list, show, delete, search,
│   │                      #           edit, recent, count, since…
│   ├── notes.py           # el modelo Note (id, title, body, created_at)
│   └── storage.py         # persistencia JSON atómica (temp + os.replace)
├── tests/                 # la suite (unittest, solo stdlib)
│   ├── test_cli.py  test_notes.py  test_storage.py
├── tools/
│   └── mutate.py          # mutador sin dependencias
└── init.sh                # verificación del entorno y del arnés
```

Cada carpeta cuenta una parte de la historia:

- **`project-spec.md`** — la especificación viva. Nace de la conversación con
  `spec_partner` y crece feature a feature. Principios que fija: sin dependencias
  externas (solo `argparse`, `json`, `tempfile`, `unittest`), almacenamiento JSON
  **atómico** (escritura a temporal + `os.replace()`), y manejo de errores
  uniforme (errores de dominio a `stderr` con exit code ≠ 0; salida útil a
  `stdout`, para poder componer comandos).
- **`feature_list.json`** — 12 features declaradas. Las últimas
  (`cli_recent`, `cli_count`, `cli_since`…) llevan `"sdd": true`: recorren el
  flujo completo con Gherkin y puerta humana.
- **`features/`** — los `.feature`. Son el **contrato ejecutable** de las
  features SDD: describen el comportamiento en escenarios Gherkin antes de que
  exista una línea de código.
- **`progress/`** — el diario del arnés. Por cada feature SDD hay un informe de
  TDD (`tdd_*.md`), uno del juez (`judge_*.md`) y uno de mutación
  (`mutation_*.md`). Es la trazabilidad: quién decidió qué y por qué.
- **`src/` y `tests/`** — el resultado. Nada aquí se escribió «a mano libre»:
  cada línea de `src/` nació de un test que primero falló.

## Cómo reproducirlo

Sitúate en el ejemplo y verifica el arnés:

```bash
cd examples/notes-cli
./init.sh
```

`init.sh` comprueba el entorno, valida `feature_list.json`, exige **máximo una**
feature `in_progress` y **ejecuta la suite completa**. La suite (**43 tests**)
pasa en verde. Ese verde es la línea base sobre la que se mide todo lo demás.

Luego ejecuta la **prueba de mutación** sobre el archivo que concentra las
features SDD:

```bash
python3 tools/mutate.py src/cli.py
```

El mutador introduce cambios pequeños (invertir `<=`↔`<`, `==`↔`!=`, `+`↔`-`,
`and`↔`or`, `True`↔`False`, incrementar enteros, sustituir `return` por
`return None`) y verifica si la suite los **mata**. La mutación se concentra en
las **líneas de las features SDD**: es ahí donde el método promete una red de
tests que no deja pasar mutantes.

:::caution[Windows: fuerza UTF-8]
El mutador corre la suite como subproceso; en Windows el `stdout` por defecto no
es UTF-8 y las notas con acentos pueden provocar `UnicodeEncodeError`. Ejecútalo
en modo UTF-8:

```powershell
# PowerShell
$env:PYTHONUTF8 = "1"; python tools\mutate.py src\cli.py
```

```bash
# Git Bash / WSL
PYTHONUTF8=1 python3 tools/mutate.py src/cli.py
```
:::

## Cómo leerlo para aprender el método

No leas el ejemplo como se lee un programa. Léelo como un **expediente**:

1. Elige una feature SDD, por ejemplo `cli_since`.
2. Abre su `features/cli_since.feature`: ese es el contrato que se aprobó en la
   puerta.
3. Lee `progress/tdd_cli_since.md`: cómo se construyó, test a test.
4. Lee `progress/judge_cli_since.md`: qué revisó el juez y por qué aprobó.
5. Lee `progress/mutation_cli_since.md`: qué mutantes sobrevivieron (si alguno) y
   qué dice eso de la suite.
6. Solo entonces mira `src/cli.py` y `tests/test_cli.py`.

Ese recorrido —contrato, TDD, juicio, mutación— es el método. El CLI es la
excusa.

## Enlaces

- Arranca tu propio proyecto: [Cómo usar la plantilla](../como-usar/).
- La técnica de fondo: [Prueba de mutación](../../fundamentos/mutacion/) y
  [Estructura y artefactos](../../referencia/estructura/).
- De dónde viene todo esto: [Atribución y fuentes](../../fuentes/atribucion/).
