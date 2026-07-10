---
title: "Cómo usar la plantilla"
description: "Crea tu repositorio desde TemplateSSDUncleBob, abre Claude Code y recorre el flujo spec → gherkin → puerta humana → TDD → juez → mutación con una primera feature."
---

Esta página es el arranque práctico. Partes de la plantilla
[**TemplateSSDUncleBob**](https://github.com/Cenit-Digital/TemplateSSDUncleBob),
creas tu propio repositorio y dejas que el arnés dirija el trabajo. Tú no
escribes el código: **conversas la spec, apruebas la puerta y revisas**. Los
agentes hacen el resto bajo disciplina.

:::note
Si aún no conoces el método, lee antes [El método de un vistazo](../../fundamentos/el-metodo/)
y [¿Qué es Harness Engineering?](../../fundamentos/harness-engineering/). Esta
página asume esos conceptos.
:::

## 1. Crea tu repositorio desde la plantilla

1. Abre [github.com/Cenit-Digital/TemplateSSDUncleBob](https://github.com/Cenit-Digital/TemplateSSDUncleBob).
2. Pulsa el botón verde **«Use this template» → «Create a new repository»**.
3. Nombra tu repositorio y créalo. Obtienes una copia completa del arnés: los
   seis agentes en `.claude/agents/`, el `CLAUDE.md` que fija las reglas, los
   `docs/`, `tools/mutate.py`, `init.sh` y el ejemplo trabajado en
   `examples/notes-cli/`.
4. Clona tu nuevo repositorio en local.

## 2. Abre Claude Code en la raíz

Abre Claude Code en la **raíz** del repositorio (donde están `CLAUDE.md` y
`feature_list.json`). Eso es importante: el `CLAUDE.md` de la plantilla es el
manual de operación del arnés y **fuerza el rol `craftsman_lead`**. Ese agente
descompone, coordina y **custodia la disciplina**; nunca escribe `src/` ni
`tests/` por su cuenta, ni marca features como terminadas: delega en los
subagentes especializados y se detiene en la puerta de aprobación humana.

:::tip
No necesitas invocar a `craftsman_lead` a mano. Al leer `CLAUDE.md`, Claude Code
asume ese rol automáticamente. Tú hablas con el líder; el líder orquesta al
resto. Ver [craftsman_lead](../../agentes/craftsman-lead/).
:::

## 3. Verifica el entorno con `init.sh`

Antes de pedir nada, comprueba que el arnés está sano:

```bash
./init.sh
```

`init.sh` es un script de verificación (sin dependencias) que:

- confirma que hay un Python 3.9+ disponible,
- valida que existen los archivos base (`AGENTS.md`, `feature_list.json`,
  `docs/`, `tools/mutate.py`, `CHECKPOINTS.md`, `progress/current.md`),
- revisa `feature_list.json` (estados válidos, **máximo una** feature
  `in_progress`, y que las features SDD no `pending` tengan su `.feature`),
- ejecuta la suite de tests y
- resume con marcadores `[OK]`, `[WARN]`, `[FAIL]`.

:::caution[Windows]
En Windows ejecuta `init.sh` desde **Git Bash** o **WSL** (es un script de
shell). El script busca primero `python3`; la plantilla añade autodetección para
caer a `python` cuando `python3` no existe. Aun así, verifica que tu Python del
PATH es 3.9 o superior.
:::

## 4. Declara tu primera feature en `feature_list.json`

Toda unidad de trabajo se declara en `feature_list.json`. Edítalo y añade tu
primera feature al array `features`. Para que recorra el flujo completo del
método, márcala con `"sdd": true` y `"status": "pending"`:

```json
{
  "id": 13,
  "name": "cli_tag",
  "title": "Comando tag",
  "description": "Permite etiquetar una nota existente por id.",
  "acceptance": [
    "`python -m src.cli tag <id> --add 'trabajo'` añade la etiqueta y confirma",
    "Etiquetas duplicadas no se repiten",
    "Si el id no existe, exit code != 0 y mensaje en stderr",
    "tests/test_cli.py cubre: alta, duplicado e id inexistente"
  ],
  "sdd": true,
  "status": "pending"
}
```

Campos de una feature:

- **`id`** — entero único e incremental.
- **`name`** — identificador en `snake_case` (da nombre al `.feature` y a los
  informes de `progress/`).
- **`title`** — título humano corto.
- **`description`** — qué hace, en una o dos frases.
- **`acceptance`** — lista de criterios **verificables**. Cuanto más concretos,
  mejor será el Gherkin y más nítida la puerta.
- **`sdd`** — `true` obliga a spec conversada + Gherkin + aprobación humana antes
  de tocar código. Es lo que quieres para features con reglas de negocio.
- **`status`** — empieza en `"pending"`. El arnés la moverá por
  `spec_ready → in_progress → done` (o `blocked`).

:::caution
Solo **una** feature puede estar `in_progress` a la vez. Es una regla del
método: una feature cada vez, terminada de verdad (juez + mutación), antes de
empezar la siguiente.
:::

## 5. Pide implementar la feature pendiente

Con la feature declarada, pídelo en lenguaje natural:

```text
Implementa la siguiente feature pendiente.
```

`craftsman_lead` toma tu petición y dirige el flujo. Para una feature `sdd:true`
la secuencia es siempre la misma:

```text
spec  →  gherkin  →  PUERTA (aprobación humana)  →  tdd  →  judge  →  mutación
```

1. **Spec** — `spec_partner` conversa contigo y refina `project-spec.md`. Debate
   ambigüedades; no las esconde. Ver [SDD: la spec conversada](../../fundamentos/sdd/).
2. **Gherkin** — `gherkin_author` destila los criterios en escenarios
   ejecutables `features/<name>.feature`. Ver
   [Gherkin: el contrato ejecutable](../../fundamentos/gherkin/).
3. **PUERTA humana** — el líder **se detiene** y te pide aprobar los `.feature`.
   Nada de código de producción entra antes de tu visto bueno. Ver
   [La puerta de aprobación humana](../../fundamentos/puerta-humana/).
4. **TDD** — tras tu aprobación, `tdd_craftsman` implementa con TDD estricto
   (Red → Green → Refactor, un test cada vez). Ver [TDD estricto](../../fundamentos/tdd/).
5. **Juez** — `judge` revisa el resultado y aprueba o rechaza. El review es el
   juego: los agentes redactan, el juicio poda. Ver [El review es el juego](../../fundamentos/review/).
6. **Mutación** — `mutation_tester` mide si la suite realmente mata mutantes en
   las líneas de la feature. Ver [Prueba de mutación](../../fundamentos/mutacion/).

Una feature solo llega a `done` cuando **el juez aprueba y la mutación supera el
umbral**. Cada fase deja un informe con marca de tiempo en `progress/`
(`tdd_<name>.md`, `judge_<name>.md`, `mutation_<name>.md`), tu registro de
trazabilidad.

:::tip[Aprobar la puerta]
Cuando el líder se detenga en la puerta, revisa los `.feature`. Si describen el
comportamiento que querías, apruébalos explícitamente para que continúe. Si no,
corrige la conversación de spec: es mucho más barato ajustar el contrato aquí que
después del código.
:::

## 6. Ejecuta la mutación (nota de Windows)

`mutation_tester` usa `tools/mutate.py`, un mutador sin dependencias. Puedes
lanzarlo tú mismo sobre el archivo de la feature:

```bash
python3 tools/mutate.py src/cli.py
python3 tools/mutate.py src/cli.py --max 80   # limita el nº de mutantes
```

Categoriza cada mutante como *killed* (la suite lo detecta) o *survived* (pasa
inadvertido: un agujero en la red) y reporta `total`, `killed`, `survived` y
`score`.

:::caution[Windows: fuerza UTF-8]
El mutador ejecuta la suite como subproceso. En Windows el `stdout` por defecto
no es UTF-8 y las notas con acentos o emojis pueden romper la ejecución con
`UnicodeEncodeError`. Ejecuta el mutador en **modo UTF-8**:

```powershell
# PowerShell
$env:PYTHONUTF8 = "1"; python tools\mutate.py src\cli.py
```

```bash
# Git Bash / WSL
PYTHONUTF8=1 python3 tools/mutate.py src/cli.py
```
:::

## Siguiente paso

La plantilla trae un ejemplo completo ya recorrido de punta a punta. Estúdialo
para ver el flujo con artefactos reales: [El ejemplo: notes-cli](../ejemplo-notes-cli/).
