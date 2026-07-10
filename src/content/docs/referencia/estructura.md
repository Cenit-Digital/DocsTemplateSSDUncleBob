---
title: "Estructura y artefactos"
description: "El árbol de directorios de la plantilla y el mapa de \"quién escribe qué\". Por qué el estado vive en disco y sobrevive a los reinicios de sesión."
---

El arnés no es un prompt gigante: es un **repositorio con forma**. Cada carpeta y cada
archivo tiene un dueño y un momento de uso. Esta página describe el árbol de la plantilla
y el mapa de artefactos —qué agente produce cada archivo— para que sepas dónde mirar y
dónde no debes tocar a mano.

:::note
El principio operativo del arnés: **los agentes escriben en disco y devuelven referencias,
no pasan contenido por el chat.** El repositorio *es* la memoria. Todo lo que importa queda
en un archivo versionable, no en la ventana de contexto.
:::

## Árbol de la plantilla

```text
plantilla-ssd-uncle-bob/
├── CLAUDE.md                # Reglas operativas del harness para Claude Code
├── AGENTS.md                # Mapa de navegación para agentes (progressive disclosure)
├── CHECKPOINTS.md           # Criterios objetivos de "estado final correcto" (C1–C7)
├── README.md                # Puesta en marcha
├── project-spec.md          # Spec conversada  ← spec_partner
├── feature_list.json        # Estado de cada feature (pending → done)
├── init.sh                  # Arranque: verifica y corre la suite; debe salir con código 0
│
├── .claude/
│   ├── agents/              # Los 6 agentes especializados (uno por archivo)
│   │   ├── craftsman_lead.md
│   │   ├── spec_partner.md
│   │   ├── gherkin_author.md
│   │   ├── tdd_craftsman.md
│   │   ├── judge.md
│   │   └── mutation_tester.md
│   └── settings.json        # Permisos y hooks del harness
│
├── docs/                    # Conocimiento del método (lectura bajo demanda)
│   ├── workflow.md          # Fases completas del pipeline
│   ├── tdd.md               # Las Tres Leyes; Red-Green-Refactor
│   ├── gherkin.md           # Guía para escribir escenarios
│   ├── mutation-testing.md  # Proceso de validación por mutación
│   ├── verification.md      # Niveles de verificación
│   ├── architecture.md      # Estándares de calidad del proyecto (por stack)
│   └── conventions.md       # Convenciones del proyecto (por stack)
│
├── features/                # Contratos Gherkin ejecutables  ← gherkin_author
├── progress/                # Estado en disco (memoria entre sesiones)
│   ├── current.md           # Estado de la sesión actual
│   └── history.md           # Bitácora append-only de sesiones
│
├── tools/
│   └── mutate.py            # Mutador sin dependencias (stack de referencia: Python)
│
├── src/                     # Código de TU proyecto  ← tdd_craftsman
├── tests/                   # Pruebas de TU proyecto  ← tdd_craftsman
│
└── examples/
    └── notes-cli/           # Ejemplo de referencia, resuelto de punta a punta
```

:::tip[El ejemplo vive resuelto]
`examples/notes-cli/` reproduce el mismo esqueleto pero **completamente poblado**: sus
`features/` contienen contratos reales (`cli_count.feature`, `cli_since.feature`,
`cli_recent.feature`), su `progress/` guarda los rastros de cada agente
(`tdd_cli_count.md`, `judge_cli_since.md`, `mutation_cli_count.md`…) y su `src/`/`tests/`
muestran el código tallado por TDD. Es la referencia viva para leer "cómo se ve un feature
bien terminado". Ver [El ejemplo: notes-cli](../../plantilla/ejemplo-notes-cli/).
:::

## Mapa de artefactos: quién escribe qué

Cada artefacto tiene **un único autor**. Si un archivo aparece con contenido inesperado,
el mapa te dice qué agente debe haberlo generado —y por tanto dónde revisar.

| Artefacto | Autor | Propósito |
|-----------|-------|-----------|
| `project-spec.md` | `spec_partner` | Spec razonada, incluyendo las decisiones debatidas |
| `features/<name>.feature` | `gherkin_author` | Escenarios Gherkin ejecutables, etiquetados `@s1..@sn` |
| `src/`, `tests/` | `tdd_craftsman` | Código y pruebas tallados por TDD |
| `progress/tdd_<name>.md` | `tdd_craftsman` | Bitácora de ciclos + mapa escenario→test |
| `progress/judge_<name>.md` | `judge` | Veredicto de revisión y checkpoints |
| `progress/mutation_<name>.md` | `mutation_tester` | Score de mutación + mutantes supervivientes |
| `feature_list.json` | `craftsman_lead` / `tdd_craftsman` | Estado de cada feature (pending → done) |

Esa cadena de autoría es exactamente el pipeline:

```text
pending → spec_partner → gherkin_author → [aprobación humana] →
in_progress → tdd_craftsman → judge → mutation_tester → done
```

Ver la coreografía completa en [Los seis agentes](../../agentes/vision-general/) y las
fases en `docs/workflow.md`.

## Mapa de lectura: qué consulta cada agente y cuándo

`AGENTS.md` no da órdenes: expone los artefactos con *progressive disclosure*, para que el
agente lea solo lo que necesita en cada fase.

| Ubicación | Contenido | Cuándo se lee |
|-----------|-----------|---------------|
| `feature_list.json` | Estado de las tareas | Siempre, al iniciar sesión |
| `progress/current.md` | Estado de la sesión actual | Siempre, al iniciar sesión |
| `progress/history.md` | Bitácora append-only | Cuando se necesita contexto histórico |
| `project-spec.md` | Spec conversada | Antes de Gherkin o de implementar |
| `features/<name>.feature` | Escenarios Gherkin | Antes del ciclo TDD |
| `docs/workflow.md` | Fases del pipeline | Antes de coordinar |
| `docs/tdd.md` | Las Tres Leyes; Red-Green-Refactor | Antes de codificar |
| `docs/gherkin.md` | Guía de escenarios | Antes de redactar |
| `docs/mutation-testing.md` | Proceso de validación por mutación | Antes de validar la suite |
| `docs/architecture.md` | Estándares de calidad | Antes de implementar |
| `CHECKPOINTS.md` | Criterios objetivos de cierre | Autoevaluación |

## El estado vive en disco

Tres artefactos forman la **memoria persistente** del arnés. No están en el contexto del
modelo: están en archivos que se leen al arrancar y se reescriben al cerrar.

- **`project-spec.md`** — el *qué* y el *por qué*. Recoge la conversación con
  `spec_partner`, incluidas las decisiones y sus razones. Es la fuente antes de destilar
  Gherkin o de implementar.
- **`features/`** — el *contrato*. Los `.feature` con escenarios `@s1..@sn` que el humano
  aprobó. Nada se implementa sin un contrato aprobado detrás.
- **`progress/`** — el *diario*. `current.md` es el estado de la sesión en curso;
  `history.md` es la bitácora append-only; y los `tdd_<name>.md`, `judge_<name>.md` y
  `mutation_<name>.md` son los rastros por feature.

### Por qué sobrevive a los reinicios

Un agente no tiene memoria entre sesiones: cada arranque es una tabla rasa. El arnés
resuelve esto **externalizando el estado al repositorio**. Al iniciar, el flujo lee
`feature_list.json` y `progress/current.md` para reconstruir *dónde estaba*; al terminar
un tramo, escribe el resultado en disco antes de ceder el turno.

:::caution[Regla de oro]
Si algo no está escrito en un artefacto, para el arnés **no existe**. Por eso ningún agente
"recuerda" nada de palabra: lee el estado en disco y deja el estado en disco. Un reinicio,
un cambio de máquina o un modelo distinto retoman el trabajo leyendo los mismos archivos.
:::

Esta disciplina es la que permite tratar cada sesión como reanudable y hace del repositorio
—no del chat— la **documentación viva** del proyecto. Los criterios que decretan cuándo un
feature está realmente terminado se detallan en [Checkpoints (C1–C7)](../checkpoints/) y las
pruebas que lo demuestran, en [Verificación](../verificacion/).
