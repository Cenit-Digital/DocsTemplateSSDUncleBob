---
title: Registro de evolución
description: Bitácora de las mejoras del método y la documentación a lo largo del tiempo.
---

Esta es la bitácora del proyecto. Es un registro **append-only**: solo se añaden entradas, nunca se borran ni se reescriben. Aquí el bot y las personas dejan constancia de cada mejora del método o de la documentación, con su fecha.

La idea es sencilla. La documentación es viva. Cada vez que algo cambia, queda registrado. Así cualquiera puede reconstruir cómo llegamos hasta aquí.

## Formato de las entradas

Cada entrada sigue el mismo patrón. Corta y clara:

**`fecha` — resumen del cambio — [enlace al PR]**

- **fecha**: en formato `AAAA-MM-DD`.
- **resumen**: una o dos frases que expliquen qué se mejoró y por qué.
- **enlace al PR**: la Pull Request que introdujo el cambio.

Las entradas se ordenan de más reciente a más antigua. La más nueva arriba.

## Entradas

### 2026-08-21 — Documenta dos guardianes más del motor (`init` lint sobre árbol vacío, `verify` con mutación obligatoria)

En `configuracion/config.md` se documentan dos correcciones más de
`.harness/harness.mjs` en la plantilla, de la misma familia de guardianes
contra falsos verdes que las entradas anteriores de este registro: (1) la
puerta de lint de `init` corría siempre que hubiera un `commands.lint`
declarado, sin mirar si había código en `paths.tests`/`paths.src` — un clon
recién hecho de la plantilla podía fallar `init` con `[FAIL] Lint con
errores` sobre un árbol todavía vacío, porque muchos linters reales (p. ej.
ESLint con *flat config*) salen con código distinto de cero cuando su patrón
no casa ningún fichero; ahora el gate de lint es simétrico al de tests (PR
#19), que ya tenía este cuidado; (2) `verify` — la puerta de cierre de
sesión — silenciaba en su propio código la puerta de mutación cuando
`rules.require_mutation_to_close` (el default) es `true` pero
`commands.mutate` está vacío, e igualmente imprimía "Todo verde. Puedes
cerrar la sesión." con exit `0`, aunque el comando `mutate` directo ya
fallaba ante esa misma config; ahora `verify` aborta nombrando la causa y las
dos salidas legítimas (declarar `commands.mutate`, o desactivar la regla).

Motivo: paso 2 del protocolo de `.github/AUTONOMOUS.md` (sincronización con la
plantilla). Ambos fixes se fusionaron en la plantilla el 2026-08-14 y el
2026-08-17, después de la última sincronización registrada aquí (PR #25/#26/#27);
config.md es donde ya se documentan los guardianes previos de esta misma
familia, así que sin esta entrada la doc describía un motor menos estricto
del que realmente hay.

Fuentes: Cenit-Digital/TemplateSSDUncleBob,
[PR #28 «init no corre el lint sobre un árbol vacío (simétrico al gate de tests, #19)»](https://github.com/Cenit-Digital/TemplateSSDUncleBob/pull/28),
[PR #29 «verify no da falso verde si la mutación es obligatoria pero commands.mutate está vacío»](https://github.com/Cenit-Digital/TemplateSSDUncleBob/pull/29).

### 2026-08-14 — Documenta tres guardianes más del motor (`rules`, `standalone`, feature SDD sin `name`)

En `configuracion/config.md` se documentan tres correcciones más de
`.harness/harness.mjs` en la plantilla, todas de la misma familia de
guardianes contra falsos verdes que las entradas anteriores de este registro:
(1) `rules` no-objeto (p. ej. `"rules": "estrictas"`) ya no se descarta en
silencio vía `Object.assign` — era el único de los cuatro contenedores de
`harness.schema.json` (`commands`, `paths`, `mutation`, `rules`) sin este
guardián; (2) `standalone` no-booleano (p. ej. `"standalone": "false"`
entrecomillado) ya no se coercía en silencio a `true`, lo que hacía que un
sub-proyecto pensado para heredar el arnés raíz fallara con una ráfaga de
"Falta archivo base" que no señalaba la causa real; de paso, `standalone` se
añade al schema, donde no estaba pese a togglear esa comprobación; (3) una
feature `"sdd": true` sin `name` ya no deriva el fichero fantasma
`features/undefined.feature` en el mensaje de fallo — ahora señala que le
falta el `name` del que derivar `features/<name>.feature`, y si el `name`
está presente pero en blanco ya no duplica el `[FAIL]` que el guardián de
`name` (PR #24) ya reporta.

Motivo: paso 2 del protocolo de `.github/AUTONOMOUS.md` (sincronización con la
plantilla). Los tres fixes se fusionaron en la plantilla entre el
2026-08-11 y el 2026-08-13, después de la última sincronización registrada
aquí (PR #23/#24); config.md es donde ya se documentan los guardianes previos
de esta misma familia, así que sin esta entrada la doc describía un motor
menos estricto del que realmente hay.

Fuentes: Cenit-Digital/TemplateSSDUncleBob,
[PR #25 «un rules no-objeto falla legible, no en descarte mudo»](https://github.com/Cenit-Digital/TemplateSSDUncleBob/pull/25),
[PR #26 «un standalone no-booleano falla legible, no en coerción muda»](https://github.com/Cenit-Digital/TemplateSSDUncleBob/pull/26),
[PR #27 «una feature sdd sin name usable culpa al name, no a un fichero fantasma»](https://github.com/Cenit-Digital/TemplateSSDUncleBob/pull/27).

### 2026-08-11 — Documenta dos guardianes más contra falsos verdes en `feature_list.json`

En `configuracion/config.md` se documentan dos correcciones más de
`.harness/harness.mjs` en la plantilla, ambas de la misma familia que la
entrada anterior de este registro (id/name duplicados): (1) `bin/harness
status` descartaba el resultado de `validateFeatureList` y salía siempre con
código `0`, incluso con un `[FAIL]` impreso encima y un mensaje contradictorio
de "sin features definidas todavía" sobre una lista que en realidad estaba
corrupta, no vacía; ahora `status` propaga ese fallo a su exit code, igual que
ya hacía `init`. (2) El guardián de unicidad de `name` solo comparaba valores
que ya eran string, así que un `name` numérico o booleano (p. ej. `123` en vez
de `"123"`) esquivaba el chequeo por completo: dos features con el mismo
`name: 123` pasaban en verde pese a derivar el mismo `features/123.feature`.
Un `name` vacío o en blanco tenía el mismo problema. Ahora cada `name`
presente debe ser un string no vacío o el motor falla explícito.

Motivo: paso 2 del protocolo de `.github/AUTONOMOUS.md` (sincronización con la
plantilla). Ambos fixes se fusionaron en la plantilla los días 2026-08-07 y
2026-08-09, después de la última sincronización registrada aquí (PR #22);
config.md es donde ya se documentan los guardianes previos de esta misma
familia, así que sin esta entrada la doc describía un motor menos estricto
del que realmente hay.

Fuentes: Cenit-Digital/TemplateSSDUncleBob,
[PR #23 «status propaga el fallo de feature_list a su exit code, no en falso verde»](https://github.com/Cenit-Digital/TemplateSSDUncleBob/pull/23),
[PR #24 «un name de feature no-string/vacío falla legible, no en falso verde»](https://github.com/Cenit-Digital/TemplateSSDUncleBob/pull/24).

### 2026-08-07 — Documenta el guardián contra `id`/`name` duplicados en `feature_list.json`

En `configuracion/config.md` se documenta otra corrección de
`.harness/harness.mjs` en la plantilla: `validateFeatureList` reportaba
`[OK] válido` y salida `0` sobre una `feature_list.json` con dos features que
comparten `id` o `name`, aunque ambos campos son claves — los agentes
referencian una feature por su `id`, y el motor deriva de `name` las rutas de
`features/<name>.feature` y `progress/*_<name>.md`. Dos features con el mismo
`name` compartían el mismo `.feature`: la puerta de aprobación humana de una
tapaba a la otra y sus artefactos de progreso se pisaban. Ahora el motor falla
explícito con `[FAIL]`, la misma familia de guardianes que las entradas
anteriores de este registro.

Motivo: paso 2 del protocolo de `.github/AUTONOMOUS.md` (sincronización con la
plantilla). El fix se fusionó en la plantilla hoy mismo, y config.md es donde
ya se documentan los guardianes previos del motor (commands/paths, mutation,
sustitución de tokens); sin esta entrada la doc no reflejaba esta protección
nueva sobre la fuente de verdad de las features.

Fuente: Cenit-Digital/TemplateSSDUncleBob,
[PR #22 «id/name de features duplicados fallan legible, no en falso 'válido'»](https://github.com/Cenit-Digital/TemplateSSDUncleBob/pull/22).

### 2026-08-04 — Documenta que `init` ya corre tests colocados en `src/` (Go, Rust)

En `configuracion/config.md` se documenta otra corrección de
`.harness/harness.mjs` en la plantilla: `init` decidía si ejecutar
`commands.test` mirando solo `paths.tests`. Los stacks que colocan los tests
junto al código (Go: `_test.go` en el paquete; Rust: `#[cfg(test)]` dentro de
cada `.rs`) podían no tener carpeta `tests/` en absoluto, así que el motor
**saltaba** `cargo test`/`go test` con un `[WARN]` y reportaba `[OK]` en verde
aunque hubiera tests rotos en `src/` — el mismo patrón de falso verde que las
entradas anteriores. Ahora `init` corre `commands.test` si hay código en
`paths.tests` **o** en `paths.src`, y solo avisa sin fallar cuando ambos están
vacíos (la plantilla recién clonada).

Motivo: paso 2 del protocolo de `.github/AUTONOMOUS.md` (sincronización con la
plantilla). El fix está fusionado en la plantilla el 2026-08-03, un día
después de la última sincronización registrada aquí; sin esta actualización,
la doc seguía describiendo el comportamiento antiguo (solo `paths.tests`)
justo en la sección que explica el guardián de `init`.

Fuente: Cenit-Digital/TemplateSSDUncleBob,
[PR #19 «init corre los tests si viven en src/ (Go/Rust), no solo en tests/»](https://github.com/Cenit-Digital/TemplateSSDUncleBob/pull/19).

### 2026-07-31 — Documenta dos guardianes del motor contra falsos verdes

En `configuracion/config.md` se documentan dos correcciones recientes de
`.harness/harness.mjs` en la plantilla: (1) `commands`/`paths` declarados por
error como string o array (en vez de objeto) ya no se pierden en silencio —
antes el motor podía reportar verde con "no hay comando de tests declarado"
aunque el usuario sí lo hubiera escrito; ahora falla explícito con `[FAIL]` y
código de salida `2`; (2) la sustitución de `{{py}}`/`{{target}}` ya no usa el
patrón de reemplazo con significado especial de `$` en
`String.prototype.replace`, así que un target con `$` en la ruta (habitual en
artefactos JVM/Scala tipo `Outer$Inner`) ya no se corrompe silenciosamente.

Motivo: paso 2 del protocolo de `.github/AUTONOMOUS.md` (sincronización con la
plantilla). Ambos cambios están fusionados en la plantilla y afectan
directamente lo que esta página promete sobre `commands` y los tokens; sin
esta actualización la doc describía un comportamiento (sustitución simple,
sin validación de tipo) que ya no es el real.

Fuentes: Cenit-Digital/TemplateSSDUncleBob,
[PR #18 «commands/paths no-objeto fallan legible»](https://github.com/Cenit-Digital/TemplateSSDUncleBob/pull/18),
[PR #17 «{{target}} con `$` se inserta literal»](https://github.com/Cenit-Digital/TemplateSSDUncleBob/pull/17).

### 2026-07-28 — Mutadores de producción por stack (Python, Java, Rust)

En `metodo/mutacion.md` se añade la sección "Mutadores de producción en otros
stacks". Ya existía la recomendación de StrykerJS para Node/TypeScript de
producción, pero solo eso: se completa con **mutmut** (Python), **PIT/pitest**
(Java/JVM) y **cargo-mutants** (Rust), cada uno con su comando de instalación,
cómo declararlo en `commands.mutate` y qué lo distingue (mutmut prioriza
facilidad de uso; PIT mide *mutation coverage* vía plugin Maven/Gradle;
cargo-mutants se instala como subcomando de Cargo). Se cierra remarcando que el
contrato con el arnés no cambia: `commands.mutate` sigue siendo el único punto
de integración sea cual sea el mutador.

Motivo: cubre "Mutación de producción: guías por stack (StrykerJS, mutmut,
PIT, cargo-mutants…)" del backlog de `.github/AUTONOMOUS.md`, que solo tenía
desarrollado el caso de StrykerJS.

Fuentes: [mutmut docs](https://mutmut.readthedocs.io/),
[PIT (pitest)](https://pitest.org/),
[cargo-mutants](https://mutants.rs/).

### 2026-07-24 — Explica el agent loop: quién ejecuta las herramientas

En `evolucion/bot.md` se añade la sección "El bucle del agente: quién ejecuta
las herramientas". Aclara, con la documentación oficial del Agent SDK, que el
modelo nunca ejecuta código ni toca el disco directamente: decide qué
herramienta usar y con qué parámetros, pero es el proceso que lo envuelve (el
CLI de Claude Code, aquí corriendo dentro de `claude-code-action`) quien la
ejecuta de verdad y le devuelve el resultado. Se conecta con el segundo pilar
de Harness Engineering (orquestación multiagente) ya descrito en
`empezar/que-es.md`: el `craftsman_lead` orquesta subagentes de la misma
manera — el arnés ejecuta, el modelo decide.

Motivo: cubre "El agent loop" del backlog de `.github/AUTONOMOUS.md` (bucle
externo del CLI + bucle agéntico de herramientas; las tools las ejecuta el
arnés, no la LLM), que aún no tenía desarrollo propio.

Fuente: Anthropic, [«Agent SDK overview»](https://code.claude.com/docs/en/agent-sdk/overview),
sección "Agent SDK vs Client SDK".

### 2026-07-21 — Sitúa el arnés en los tres niveles del SDD (Böckeler)

En `metodo/gherkin.md` se añade la sección "Los tres niveles del SDD
(Böckeler)": la distinción de Birgitta Böckeler (Thoughtworks) entre
spec-first, spec-anchored y spec-as-source, y un análisis de dónde cae este
arnés (spec-anchored: el `.feature` queda versionado y trazable como fuente de
verdad, pero el código lo sigue tallando el `tdd_craftsman` a mano vía TDD, no
se regenera desde la spec). De paso se resume cómo el mismo artículo clasifica
Kiro, GitHub Spec Kit y Tessl frente a esos tres niveles.

Motivo: cubre "Niveles de SDD (Martin Fowler / Birgitta Böckeler)" del backlog
de `.github/AUTONOMOUS.md`, que aún no tenía desarrollo propio, y sitúa
explícitamente el método frente al panorama de herramientas SDD (otro punto
del mismo backlog), sin necesidad todavía de una comparativa completa aparte.

Fuente: Birgitta Böckeler, blog de Martin Fowler,
[«Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl»](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html).

### 2026-07-17 — Añade la notación EARS a la fase de spec conversada

En `metodo/spec.md` se añade la sección "EARS: frasear requisitos sin
ambigüedad": las cinco plantillas de EARS (ubicua, guiada por estado, guiada
por evento, característica opcional, comportamiento no deseado) y cómo la
plantilla completa (`While…when…the <sistema> shall…`) mapea casi
literalmente a Given/When/Then. Se conecta con la regla ya existente de que
toda afirmación del `project-spec.md` debe poder convertirse en un escenario
comprobable.

Motivo: es un tema del backlog de `.github/AUTONOMOUS.md`
("Notación EARS para requisitos y su traducción directa a tests") que aún no
tenía desarrollo propio. EARS da al `spec_partner` una sintaxis restringida
concreta para detectar afirmaciones ambiguas antes de que lleguen a Gherkin.

Fuente: Alistair Mavin, [«EARS: Easy Approach to Requirements Syntax»](https://alistairmavin.com/ears/)
(publicada originalmente en Rolls-Royce PLC, RE'09, 2009).

### 2026-07-14 — Documenta la memoria organizacional (el tercer bucle)

Nueva página `evolucion/memoria-organizacional.md` (más su entrada en el
sidebar): qué es el repositorio privado `SistemaDeMemoriaUncleBob`, cómo su
bot mensual destila patrones validados del histórico de los proyectos
(descubrimiento dinámico de repos por la API, máximo 1-2 patrones por
ejecución con origen verificable, fusión siempre humana) y cómo cada proyecto
los consume en el paso 2bis de su Protocolo de arranque.

Motivo: el sistema de memoria organizacional se implementó hoy en la
organización (la plantilla y WebEmpresa ya llevan el paso 2bis y sus scripts
de sincronización); esta documentación pública describe el mecanismo — el
contenido de la memoria es privado por diseño, porque destila proyectos de
cliente.

Fuentes: [Claude Code GitHub Action](https://code.claude.com/docs/en/github-actions);
[fine-grained PATs de GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens);
implementación: [Cenit-Digital/SistemaDeMemoriaUncleBob](https://github.com/Cenit-Digital/SistemaDeMemoriaUncleBob) (privado).

### 2026-07-14 — Añade "Loop Engineering" a la puerta humana

En `metodo/puerta-humana.md` se añade la sección "Loop Engineering: HITL en la
puerta, HOTL en el resto". Cubre un tema del backlog que aún no estaba
desarrollado: la diferencia entre *human-in-the-loop* (el sistema se detiene y
espera aprobación) y *human-on-the-loop* (el sistema corre solo y el humano
supervisa e interviene solo ante una excepción). Se conecta con el diseño real
del arnés: una única puerta HITL sobre el `.feature` de Gherkin, y HOTL para el
resto del ciclo (TDD, review, mutación), donde el humano supervisa vía
`progress/*.md` en vez de aprobar paso a paso.

Motivo: es la primera idea de la playlist de BettaTech
(*"¿Qué es esto del Loop Engineering?"*, vídeo 1) y todavía no tenía una
sección propia, a pesar de estar en el backlog de `.github/AUTONOMOUS.md`.

Fuentes: BettaTech, [«¿Qué es esto del Loop Engineering?»](https://www.youtube.com/watch?v=18FeGXyB-sI);
webreactiva, [«Loop engineering: qué es y en qué se diferencia del harness»](https://www.webreactiva.com/blog/loop-engineering);
n8n, [«Human-in-the-Loop vs. Human-on-the-Loop»](https://blog.n8n.io/human-in-the-loop-vs-human-on-the-loop/).

### 2026-07-10 — Corrige enlaces rotos en "Introducción"

En `empezar/introduccion.md`, la sección "Por dónde seguir" enlazaba a slugs
que no existen (`empezar/que-es-el-arnes-sdd/`, `metodo/flujo-completo/`).
El build de Astro no lo detecta porque no hay comprobador de enlaces
configurado, así que era un 404 silencioso desde la primera página que lee
cualquier persona. Corregido a los slugs reales del sidebar
(`empezar/que-es/`, `metodo/flujo/`, ver `astro.config.mjs`).

### 2026-07-10 — Génesis

Creación de la plantilla agnóstica al lenguaje y de esta documentación viva.

Qué entró en esta primera versión, según el `README`:

- Un **motor de cero dependencias** (`.harness/harness.mjs`, solo Node ≥ 18) que lee `harness.config.json` y ejecuta los comandos de tu stack. El proceso, los agentes y las puertas son fijos; lo único que cambia por proyecto son los comandos.
- **Adaptadores** para distintos stacks en `.harness/adapters/` (Python, Node y genérico), de modo que el mismo arnés sirve para Python, Node/TS, Go, Rust, Java…
- **Dos ejemplos ejecutables, verificados al 100 %**:
  - `examples/python-notes-cli` — Python (stdlib), 47 tests, mutación 100 %.
  - `examples/node-notes-cli` — Node/JS (cero deps), 29 tests, mutación 100 %.
- Esta **documentación viva**, publicada y ampliada de forma continua.

El método que sostiene todo esto es el flujo de Robert C. Martin (Uncle Bob), destilado por BettaTech: **conversar la spec, destilarla en Gherkin, tallar con TDD estricto, podar con juicio (review) y validar con prueba de mutación.** Con una sola puerta de aprobación humana en el punto de máximo apalancamiento: el contrato Gherkin.

## Cómo añadir una entrada

Cuando cierres una mejora, añade tu entrada arriba del todo, justo debajo del título **Entradas**. Respeta el formato `fecha — resumen — enlace al PR` y no toques las entradas anteriores.

Para entender el flujo completo antes de proponer un cambio, revisa el [método](/DocsTemplateSSDUncleBob/metodo/tdd/).
