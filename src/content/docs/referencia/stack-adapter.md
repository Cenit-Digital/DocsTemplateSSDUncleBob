---
title: "Adaptar a otro lenguaje"
description: "Qué del arnés es agnóstico al stack y qué se cambia por lenguaje. Mini-recetas para Python (referencia) y JavaScript/TypeScript con Stryker."
---

El arnés está diseñado para ser **agnóstico al lenguaje**. La disciplina —conversar la spec,
destilar Gherkin, tallar por TDD, revisar y validar por mutación— no depende de Python. Lo
que cambia al portar a otro stack es un puñado de piezas concretas y bien delimitadas.

:::note[La regla del portado]
Todo lo que define *el método* se queda igual. Solo se tocan las piezas que dependen del
lenguaje: **cómo se corren los tests, cómo se mutan, y qué convenciones sigue el proyecto.**
Si te encuentras reescribiendo un agente o el pipeline, te desviaste.
:::

## Lo que NO se cambia (agnóstico)

Estas piezas son idénticas en cualquier lenguaje:

- **Los seis agentes** de `.claude/agents/` (`craftsman_lead`, `spec_partner`,
  `gherkin_author`, `tdd_craftsman`, `judge`, `mutation_tester`).
- **El pipeline**: `pending → spec_partner → gherkin_author → [aprobación humana] →
  in_progress → tdd_craftsman → judge → mutation_tester → done`.
- **`project-spec.md`**: la spec conversada.
- **Gherkin** (`features/*.feature`) con escenarios etiquetados `@s1..@sn`.
- **`feature_list.json`**: el seguimiento de estado.
- **`progress/`**: la memoria en disco (`current.md`, `history.md` y los rastros por feature).
- **`CHECKPOINTS.md`**: los criterios C1–C7 (C3 y C4 son stack-neutros; solo cambia su
  traducción, no su intención). Ver [Checkpoints (C1–C7)](../checkpoints/).

## Lo que SÍ se cambia (por stack)

Cinco puntos de adaptación:

1. **El comando de tests en `init.sh`.** Reemplaza el descubrimiento de `unittest` por el
   *runner* de tu lenguaje. `init.sh` debe seguir saliendo con **código 0** cuando la suite
   está en verde (checkpoint C1).
2. **El mutador.** El motor de mutación es específico del lenguaje (ver tabla abajo). Es lo
   que valida el checkpoint C7.
3. **`docs/architecture.md` y `docs/conventions.md`.** Su *contenido* describe los estándares
   y convenciones de **tu** proyecto y lenguaje. La plantilla trae los del ejemplo Python;
   reescríbelos para tu stack.
4. **Los hooks de `.claude/settings.json`.** Cualquier hook que invoque comandos del stack
   (formateadores, linters, el runner de tests) apunta a las herramientas de tu lenguaje.
5. **Los permisos.** Ajusta la lista de permisos de `.claude/settings.json` a los binarios y
   scripts que tu stack necesita ejecutar (por ejemplo `npx`, `node`, `pytest`).

### Motor de mutación por lenguaje

| Stack | Mutador | Cómo se invoca |
|-------|---------|----------------|
| **Python** (referencia) | `tools/mutate.py` incluido (sin dependencias), o `mutmut` / `cosmic-ray` | `python3 tools/mutate.py src/cli.py` |
| **JavaScript / TypeScript** | **Stryker** (`stryker-mutator`) | `npx stryker run` |

:::caution[No inventes herramientas]
Usa solo motores de mutación reales para tu stack. Para Python: el `tools/mutate.py` de la
plantilla, `mutmut` o `cosmic-ray`. Para JS/TS: **Stryker**. Si tu lenguaje no aparece aquí,
verifica cuál es su mutador establecido antes de configurarlo; no supongas un nombre.
:::

## Mini-receta: Python *(stack de referencia)*

Es la configuración que trae la plantilla; sirve como plantilla mental para portar.

1. **Runner de tests** en `init.sh`:

   ```bash
   python3 -m unittest discover -s tests -v
   ```

2. **Mutación** (checkpoint C7):

   ```bash
   python3 tools/mutate.py src/cli.py
   ```

3. **`docs/architecture.md` / `docs/conventions.md`**: estándares del proyecto Python
   (módulos en `src/`, tests en `tests/`, sin dependencias externas no justificadas).
4. **Verificación**: los cinco niveles descritos en [Verificación](../verificacion/) usan los
   comandos Python tal cual.

## Mini-receta: JavaScript / TypeScript

Mismo esqueleto, herramientas del ecosistema Node.

1. **Runner de tests** en `init.sh`: invoca tu runner (por ejemplo el script `test` de
   `package.json`). Debe salir con **código 0** en verde:

   ```bash
   npm test
   ```

2. **Mutación con Stryker** (checkpoint C7):

   ```bash
   npx stryker run
   ```

   Configura el umbral y los archivos a mutar en la configuración de Stryker; los mutantes
   supervivientes se matan con nuevos tests o se documentan como equivalentes en
   `progress/mutation_<name>.md`, igual que en Python.
3. **`docs/architecture.md` / `docs/conventions.md`**: reescríbelos con las convenciones de tu
   proyecto JS/TS (estructura de módulos, estilo, gestión de dependencias).
4. **Hooks y permisos de `.claude/settings.json`**: permite `npx`, `node` y lo que tus hooks
   ejecuten; apunta los hooks a tu formateador/linter y a `npm test`.

:::tip[Checklist de portado]
Un portado está completo cuando: `init.sh` corre tu suite y sale con 0; el mutador de tu stack
produce un score y respeta el umbral; `architecture.md`/`conventions.md` describen tu proyecto;
y los hooks y permisos de `settings.json` apuntan a tus herramientas. Nada más se toca.
:::

Con esas piezas ajustadas, los [seis agentes](../../agentes/vision-general/), el pipeline y los
[checkpoints](../checkpoints/) funcionan sin cambios: la disciplina viaja, las herramientas se
enchufan.
