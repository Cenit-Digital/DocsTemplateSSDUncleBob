---
title: harness.config.json
description: 'El único punto agnóstico: declara los comandos de tu stack.'
---

El proceso Uncle Bob (spec → Gherkin → TDD → judge → mutación), los agentes y las puertas son **fijos**. Lo único que cambia por proyecto son los comandos de tu stack, declarados en `harness.config.json`. Eso es lo que hace a esta plantilla agnóstica al lenguaje.

## El motor

`.harness/harness.mjs` es un motor de **cero dependencias**: solo usa la stdlib de Node ≥ 18. Lee `harness.config.json` del directorio actual y ejecuta los comandos que declaras.

Se invoca con los lanzadores:

- POSIX/macOS/Linux: `./init.sh`, `bin/harness <cmd>`
- Windows/PowerShell: `pwsh ./init.ps1`, `bin\harness.ps1 <cmd>`
- Directo: `node .harness/harness.mjs <cmd>`

Comandos disponibles: `init`, `test`, `mutate [target]`, `verify`, `status`, `help`.

## Los campos

- **`project`** (obligatorio): nombre del proyecto.
- **`language`**: etiqueta informativa del stack (`python`, `node`, `go`, `rust`, `generic`).
- **`standalone`**: `true` es autónomo; `false` hereda el arnés raíz (para `examples/`).
- **`commands`** (obligatorio): los comandos de shell de tu stack.
  - `install`: instala dependencias (opcional).
  - `lint`: linter/formato. Vacío para omitir.
  - `test`: ejecuta la suite. Debe salir con código 0 si todo pasa.
  - `mutate`: prueba de mutación. Debe salir != 0 si no supera el umbral.
  - `build`: build de producción (opcional).
- **`paths`**: rutas por si tu layout difiere de los defaults (`src`, `tests`, `features`, `progress`, `spec`, `feature_list`).
- **`mutation.threshold`**: puntuación mínima de mutación (proporción de mutantes muertos) para cerrar una feature. Por defecto `0.8`.
- **`rules`**: las puertas del proceso (`one_feature_at_a_time`, `require_approved_spec_to_implement`, `require_tests_to_close`, `require_mutation_to_close`).

## Tokens en `commands`

- `{{py}}` → se resuelve al intérprete de Python disponible (`python3` o `python`). Útil para portabilidad Windows/Unix.
- `{{target}}` → en `commands.mutate`, recibe el argumento que pases a `bin/harness mutate <target>`.

El motor inserta ambos valores **tal cual**, sin interpretar `$`: una ruta con
`$` en el nombre (legal en POSIX y Windows, habitual en artefactos JVM/Scala
como `Outer$Inner`) no se corrompe. Antes se sustituía con el patrón "string de
reemplazo" de `String.prototype.replace`, donde `$&`, `$$` o `` $` `` tienen
significado especial; un target como `src/a$&b.py` acababa mutado a
`src/a{{target}}b.py` y el mutador corría en silencio sobre una ruta
equivocada, con riesgo de reportar verde sin medir el módulo declarado.

## Validación de `commands` y `paths`

El motor exige que `commands` y `paths`, si aparecen en el JSON, sean
**objetos**. Antes, declararlos por error como string o array (por ejemplo
`"commands": ["go test"]` en vez de `{ "test": "go test" }`) no fallaba: los
valores por defecto (vacíos) sobrevivían en silencio y `init` podía reportar
verde con "no hay comando de tests declarado" aunque sí lo hubieras escrito.
Ahora ese caso falla explícito, con `[FAIL]` legible y código de salida `2`, en
vez de un falso verde.

## `init` corre los tests si viven en `src/` (Go, Rust)

`bin/harness init` decidía si ejecutar `commands.test` mirando **solo** si
`paths.tests` tenía contenido. Eso asume un layout con carpeta de tests
separada (habitual en Python/Node), pero no todos los stacks colocan los
tests ahí:

- **Go**: los `_test.go` viven junto al paquete, no en `tests/`.
- **Rust**: el grueso de los tests unitarios vive en bloques `#[cfg(test)]`
  dentro de cada `.rs` en `src/`. Un proyecto que solo tiene esos tests
  unitarios, siguiendo el `"tests": "tests"` que recomienda
  `.harness/adapters/rust.md`, no tiene carpeta `tests/` en absoluto.

Antes, ese segundo caso era un **falso verde**: `dirHasFiles(paths.tests)`
daba `false`, `init` **omitía** `cargo test` con un simple `[WARN]` y
reportaba `[OK] Entorno listo` con código de salida `0`, aunque hubiera tests
rotos en `src/`. Ahora `init` corre `commands.test` si hay código en
`paths.tests` **o** en `paths.src`, y solo avisa sin fallar cuando **ambos**
están vacíos — el caso real que ese aviso debía cubrir: la plantilla recién
clonada, antes de escribir ningún test.

## `init` no corre el lint sobre un árbol vacío

La misma lógica de la sección anterior (correr `commands.test` solo si hay
código en `paths.tests` o `paths.src`) no se aplicaba a `commands.lint`: la
puerta de lint de `init` corría siempre que hubiera un comando declarado, sin
mirar si había algo que lintar. Muchos linters reales salen con código
distinto de cero cuando su patrón no casa ningún fichero (por ejemplo ESLint
con *flat config*, que falla con "No files matching the pattern were found"),
así que un clon recién hecho de la plantilla que ya declarara `commands.lint`
fallaba en `init` — el `[FAIL] Lint con errores` aparecía sobre un árbol
todavía vacío, antes de escribir una sola línea de código. Ahora el gate de
lint es simétrico al de tests: `[WARN] Sin código todavía … (nada que
lintar)` y `init` sigue en verde si `paths.tests` y `paths.src` están ambos
vacíos; con código presente, el linter corre de verdad y un fallo real sigue
siendo `[FAIL]`.

Fuente: Cenit-Digital/TemplateSSDUncleBob,
[PR #28 «init no corre el lint sobre un árbol vacío (simétrico al gate de tests, #19)»](https://github.com/Cenit-Digital/TemplateSSDUncleBob/pull/28).

## `verify` no da falso verde si la mutación es obligatoria pero `commands.mutate` está vacío

`bin/harness verify` es la puerta de cierre de sesión: "si `verify` está rojo,
no marques nada como `done`". Con `rules.require_mutation_to_close: true`
—el valor por defecto del motor— y `commands.mutate` vacío, la puerta de
mutación se omitía en silencio dentro de `verify`, que aun así imprimía
`[verify] Todo verde. Puedes cerrar la sesión.` con código de salida `0`. La
asimetría que lo delataba: `bin/harness mutate` directo **ya fallaba** ante un
`commands.mutate` vacío ("declara la prueba de mutación"), pero `verify` —la
misma puerta, a nivel de sesión— lo silenciaba. Como un scaffold recién creado
suele no tener mutador declarado todavía, era fácil cerrar una sesión sin
haber corrido ninguna prueba de mutación. Ahora, si `require_mutation_to_close`
es `true` y `commands.mutate` está vacío, `verify` aborta con `[FAIL]` y
código de salida `1`, nombrando las dos salidas legítimas: declarar
`commands.mutate`, o poner `require_mutation_to_close: false` si el proyecto
no cierra por mutación. Con `require_mutation_to_close: false` la puerta se
sigue omitiendo sin ruido, y con un mutador declarado `verify` corre igual que
antes.

Fuente: Cenit-Digital/TemplateSSDUncleBob,
[PR #29 «verify no da falso verde si la mutación es obligatoria pero commands.mutate está vacío»](https://github.com/Cenit-Digital/TemplateSSDUncleBob/pull/29).

## `rules`: cada flag presente debe ser booleano, no solo el contenedor

El guardián de `rules` como objeto (PR #25, más abajo) solo asegura el
**contenedor**; sus valores escalares seguían con coerción muda. Entrecomillar
un booleano en JSON —error de mano clásico, `"require_mutation_to_close":
"false"`— produce el string `"false"`, que es **truthy**: la regla que el
usuario quería desactivar seguía activa, y `verify` abortaba imprimiendo
`require_mutation_to_close es true...`, un mensaje que **contradice** lo que
el usuario acababa de escribir y lo manda a poner `false` sin comillas, que es
justo lo que creía haber puesto. Igual con `one_feature_at_a_time: "false"`,
que seguía exigiendo "máximo 1". Es el hueco que dejó abierto el guardián de
`standalone` (PR #26): se pensó como "el único campo escalar con coerción
muda" pero no cubría los flags **anidados** dentro de `rules`. Ahora cada
flag presente en `rules` (`one_feature_at_a_time`,
`require_approved_spec_to_implement`, `require_tests_to_close`,
`require_mutation_to_close`) debe ser un booleano sin comillas o el motor
falla explícito nombrando la regla y el tipo encontrado; omitir una regla
sigue siendo válido y usa su valor por defecto.

Fuente: Cenit-Digital/TemplateSSDUncleBob,
[PR #30 «un flag de rules no-booleano falla legible, no en coerción muda que contradice al usuario»](https://github.com/Cenit-Digital/TemplateSSDUncleBob/pull/30).

## `verify` no da falso verde si los tests son obligatorios pero `commands.test` está vacío

Hermano simétrico del guardián de mutación de arriba (PR #29). De las cuatro
reglas de `rules`, `require_tests_to_close` (default `true`) era la única que
el motor declaraba pero no enforzaba en ningún sitio: `init` corre
`commands.test` cuando hay código, pero con `commands.test` vacío solo
**avisa** ("No hay comando de tests declarado") y sale `0` — un aviso de
diseño para el clon limpio de la plantilla. `verify` delegaba en `init` la
puerta de tests, así que certificaba `Todo verde. Puedes cerrar la sesión.`
sin que existiera ningún comando de tests que ejecutar, contradiciendo la
regla que el usuario (o el default) tenía activada. Ahora, si
`require_tests_to_close` es `true` y `commands.test` está vacío, `verify`
aborta con `[FAIL]` y código de salida `1`, nombrando las dos salidas
legítimas: declarar `commands.test`, o poner `require_tests_to_close: false`
si el proyecto no cierra por tests. La comprobación corre antes que la de
mutación (orden natural del pipeline: TDD antes que mutación); `init` en la
raíz no cambia — el `[WARN]` de diseño sigue en verde.

Fuente: Cenit-Digital/TemplateSSDUncleBob,
[PR #31 «verify no da falso verde si los tests son obligatorios pero commands.test está vacío (simétrico a #29)»](https://github.com/Cenit-Digital/TemplateSSDUncleBob/pull/31).

## Un comando solo-espacios cuenta como vacío

Los guardianes de arriba (PR #29 y #31) cazan `commands.mutate`/`commands.test`
vacíos comprobando `!cfg.commands.X`, para lo que solo `""` es falsy. Un valor
**solo-espacios** (`"   "`, un desliz de tecla al escribir el JSON a mano) es
**truthy**: esos guardianes lo leían como "comando declarado", pero el
ejecutor interno (`run()`) trata un comando en blanco-tras-`trim` como
**SKIP** y devuelve código `0`. Las dos lecturas se contradecían y reabrían,
por un espacio, el mismo falso verde que #29/#31 habían cerrado para `""`:
`mutate` imprimía "Prueba de mutación superada" sin lanzar mutador, e `init`
"Todos los tests pasan" sin correr la suite — con `verify` certificando el
cierre de sesión encima de cualquiera de los dos. Ahora el motor recorta con
`.trim()` todos los valores de `commands` en `loadConfig`, una sola vez, así
que `"   "` se unifica con `""` y toma la misma rama en **todos** los
llamadores (`init`, `mutate`, `verify`, lint), sin que cada uno tenga que
recordar hacer el recorte. Un comando real con espacios de borde (por
ejemplo `"  go test  "`) se recorta y se sigue ejecutando igual: el trim no
introduce falsos positivos.

Fuente: Cenit-Digital/TemplateSSDUncleBob,
[PR #32 «un comando solo-espacios == sin comando, no un falso verde (gemelo de #29/#31)»](https://github.com/Cenit-Digital/TemplateSSDUncleBob/pull/32).

## `feature_list.json`: `id`/`name` duplicados fallan legible

`validateFeatureList` reportaba `[OK] válido` y código de salida `0` sobre una
`feature_list.json` con dos features que comparten `id` o `name`, aunque
ambos campos son claves del pipeline:

- Los agentes referencian una feature por su `id` ("trabaja la feature 3");
  dos features con `id: 1` hacen ambigua esa orden.
- El motor **deriva rutas de fichero** del `name`: `features/<name>.feature`
  (el contrato que aprueba el humano) y, por la convención anti-teléfono-
  descompuesto del pipeline, `progress/tdd_<name>.md`, `judge_<name>.md`,
  `mutation_<name>.md`. Dos features con el mismo `name` comparten el
  **mismo** `.feature`: la puerta de aprobación humana de una tapa a la otra,
  y sus artefactos de progreso se pisan entre sí.

Ahora el motor falla explícito, en vez de dar el falso verde:

```
[FAIL]  name duplicado en features: "cli_add" (deriva features/cli_add.feature y progress/*_cli_add.md; debe ser único)
```

El `id` se normaliza a string antes de comparar, así que `1` y `"1"` (la
misma "feature 1") cuentan como duplicado. Solo se comparan los valores
presentes: una feature sin `id`/`name` no dispara el chequeo.

Fuente: Cenit-Digital/TemplateSSDUncleBob,
[PR #22 «id/name de features duplicados fallan legible, no en falso 'válido'»](https://github.com/Cenit-Digital/TemplateSSDUncleBob/pull/22).

## `status` propaga el fallo de `feature_list.json` a su código de salida

`bin/harness init` ya salía con código 1 si `validateFeatureList` fallaba, pero
`bin/harness status` **descartaba** ese resultado: imprimía el `[FAIL]`
concreto y aun así salía con código `0`. Sobre una `feature_list.json`
estructuralmente inválida (por ejemplo `"features": 42` en vez de un array),
el resumen de estado mostraba además `(sin features definidas todavía)` — un
texto que contradice al `[FAIL]` de encima: la lista no está vacía, está
corrupta. Ahora `status` termina con `process.exit(v.ok ? 0 : 1)`, y ese
mensaje de "sin features" solo aparece cuando la lista es **válida y** vacía.

## `name` de feature no-string o vacío falla legible

El guardián de unicidad de `name` (PR #22, arriba) solo compara los valores
que ya son un string (`typeof f.name === 'string'`). Un `name` que no lo es
—por ejemplo `"name": 123` o `"name": true`, un simple olvido de comillas— lo
esquivaba por completo: dos features con el mismo `name: 123` pasaban como
`[OK] válido` pese a derivar el mismo `features/123.feature`, exactamente el
choque que la unicidad de `name` existe para evitar. Un `name` vacío o solo
espacios en blanco tiene el mismo problema: deriva `features/.feature`. Ahora
cada `name` presente debe ser un string no vacío (tras `trim`); si no lo es,
el motor falla explícito y `init`/`status` salen con código 1. Una feature sin
`name` en absoluto no dispara este chequeo — el gate `sdd`/`status` ya la
detecta por otra vía, al derivar `features/undefined.feature`.

Fuentes: Cenit-Digital/TemplateSSDUncleBob,
[PR #23 «status propaga el fallo de feature_list a su exit code, no en falso verde»](https://github.com/Cenit-Digital/TemplateSSDUncleBob/pull/23),
[PR #24 «un name de feature no-string/vacío falla legible, no en falso verde»](https://github.com/Cenit-Digital/TemplateSSDUncleBob/pull/24).

## `rules` y `standalone` no válidos fallan legible

`harness.schema.json` declara cuatro contenedores como objeto: `commands`,
`paths`, `mutation` y `rules`. Los tres primeros ya fallaban explícito ante un
valor mal formado (ver secciones de arriba); `rules` era el único que se
**descartaba en silencio**: un `"rules": "estrictas"` (o cualquier valor que
no sea un objeto) no rompía nada, pero tampoco aplicaba lo que el usuario
escribió — `Object.assign` ignora los primitivos, así que los defaults
(estrictos) sobrevivían sin avisar de que la config de reglas se había
ignorado. Ahora falla igual que sus tres hermanos.

`standalone` tenía el mismo problema con un matiz peor: es un campo escalar,
no un contenedor, y **no estaba en el schema** pese a togglear toda la
comprobación de ficheros base (`AGENTS.md`, `CLAUDE.md`, …) que hace `init`.
Un error de mano clásico en JSON — entrecomillar el booleano
(`"standalone": "false"`) — se coercía en silencio a `true`, así que un
sub-proyecto que quería heredar el arnés raíz (`standalone: false`) acababa
comprobando ficheros base que no tiene, y fallaba con una ráfaga de `Falta
archivo base` que no menciona la causa real. Ahora un `standalone` presente
y no-booleano falla explícito nombrando la causa; **ausente** sigue asumiendo
`true` (autónomo), sin cambio de comportamiento por defecto.

Fuentes: Cenit-Digital/TemplateSSDUncleBob,
[PR #25 «un rules no-objeto falla legible, no en descarte mudo»](https://github.com/Cenit-Digital/TemplateSSDUncleBob/pull/25),
[PR #26 «un standalone no-booleano falla legible, no en coerción muda»](https://github.com/Cenit-Digital/TemplateSSDUncleBob/pull/26).

## Una feature SDD sin `name` usable culpa al `name`, no a un fichero fantasma

Una feature con `"sdd": true` en un estado que exige spec
(`spec_ready`/`in_progress`/`done`) deriva la ruta `features/<name>.feature`
de su `name`. Si el `name` **faltaba por completo**, esa derivación producía
literalmente `features/undefined.feature`, y el motor fallaba señalando ese
fichero fantasma en vez de la causa real:

```
[FAIL]  feature 1 (undefined) en in_progress sin features/undefined.feature
```

Si el `name` estaba **presente pero en blanco** (`"   "`), el guardián de
`name` (PR #24, arriba) ya lo reportaba, y esta misma rama añadía un
**segundo** `[FAIL]` redundante sobre `features/   .feature`. Ahora la
derivación se guarda: si el `name` falta, el mensaje nombra la causa (`necesita
un "name" del que derivar features/<name>.feature; falta`) en vez del fichero
fantasma; si es inválido, esta rama calla porque el guardián de `name` ya lo
reportó arriba.

Fuente: Cenit-Digital/TemplateSSDUncleBob,
[PR #27 «una feature sdd sin name usable culpa al name, no a un fichero fantasma»](https://github.com/Cenit-Digital/TemplateSSDUncleBob/pull/27).

## JSON de ejemplo

```jsonc
{
  "$schema": "./harness.schema.json",
  "project": "mi-proyecto",
  "language": "python",          // etiqueta informativa
  "standalone": true,             // false = hereda el arnés raíz (para examples/)
  "commands": {
    "install": "…",               // opcional
    "lint":    "…",               // vacío = se omite
    "test":    "…",               // sale 0 si todo pasa
    "mutate":  "…",               // sale != 0 si no supera el umbral
    "build":   "…"                // opcional
  },
  "paths": {                       // por si tu layout difiere de los defaults
    "src": "src", "tests": "tests", "features": "features",
    "progress": "progress", "spec": "project-spec.md",
    "feature_list": "feature_list.json"
  },
  "mutation": { "threshold": 0.8, "targets": ["src/…"] },
  "rules": {
    "one_feature_at_a_time": true,
    "require_approved_spec_to_implement": true,
    "require_tests_to_close": true,
    "require_mutation_to_close": true
  }
}
```

## Portar a un stack nuevo (checklist)

1. Copia `harness.config.json` y rellena `commands` con los de tu stack.
2. Asegura que `commands.test` sale con código 0 solo si todos los tests pasan.
3. Elige un mutador y ponlo en `commands.mutate` (debe salir != 0 bajo umbral).
4. Ajusta `paths` si tu layout no usa `src/`/`tests/`.
5. `bin/harness init` en verde → listo.

Los adaptadores documentados están en `.harness/adapters/`.
