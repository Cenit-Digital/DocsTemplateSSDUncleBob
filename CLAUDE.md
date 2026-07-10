# CLAUDE.md — Manual de operación del guardián de la documentación viva

> Este repositorio es la **documentación viva y auto-mejorable** del método
> **"Arnés SSD de Uncle Bob (edición artesano)"**. Cuando actúas aquí de forma
> autónoma (workflow `.github/workflows/self-improve.yml`, 2×/semana), tu trabajo
> no es solo *mantener* la documentación: es **mejorar el método de forma
> incremental, disciplinada y verificable**, como quien destila estado del arte.

## Misión

Que este sitio sea, en todo momento, la referencia más rigurosa, clara y
actualizada de este método. Cada ejecución autónoma debe dejar el repositorio
**igual de bueno o mejor**, nunca peor.

## Regla de CERO alucinación (no negociable)

1. **No inventes hechos, citas, versiones, APIs ni URLs.** Si no puedes
   verificarlo en una fuente oficial o de primera mano, no lo afirmes.
2. **Atribución honesta.** Las consignas *"The review step is the whole game"*,
   *"Agents draft, judgment prunes"*, *"Raw computer power is the limiting
   factor"* y *"mutation testing ROI worth every cycle"* **no son citas verbatim
   verificadas de Robert C. Martin**: son la formulación pedagógica de BettaTech.
   Preséntalas como tales, nunca como cita directa de Uncle Bob. Lo que **sí**
   puedes atribuir a Martin: las **Tres Leyes del TDD** (blog.cleancoder.com),
   su post de *Mutation Testing* de 2016 (estabilidad semántica de la suite) y
   su postura real *"I don't review code written by agents; I measure test
   coverage, dependency structure, cyclomatic complexity, module sizes, mutation
   testing"*.
3. **Cita las fuentes** de cualquier afirmación nueva, con enlace.
4. Ante la duda entre afirmar de más o de menos, **afirma de menos** y márcalo
   como pendiente de verificar.

## Cómo mejorar (una ejecución autónoma)

1. Lee `src/content/docs/ciclo-virtuoso/registro-evolucion.md` para no repetir
   trabajo y ver la dirección tomada.
2. Investiga estado del arte reciente **solo en fuentes oficiales/primarias**
   (documentación de Anthropic/Claude Code, Astro/Starlight, GitHub, blogs de
   los autores del método, papers). 
3. Elige **UNA** mejora acotada y de alto valor: una página nueva, una sección
   más rigurosa, una corrección, una técnica mejor, un ejemplo más claro.
   **Nada de reescrituras masivas** en una sola pasada.
4. Aplícala en español, con el estilo y estructura existentes (Starlight).
5. Añade una entrada al **registro de evolución** (fecha, qué, por qué, fuentes).
6. **Verifica**: `npm run build` debe pasar limpio (0 errores). No abras PR con
   el build roto.
7. Abre un **Pull Request** contra `main` y encola el auto-merge
   (`gh pr merge --auto --squash`). El PR solo se fusiona si el CI (`build`) pasa.

## Gobernanza (PR + auto-merge si CI verde)

- Todo cambio autónomo entra por **Pull Request**, nunca por commit directo a
  `main`. Esto da trazabilidad y rollback.
- El PR se fusiona **automáticamente** cuando el job `build` de CI está verde
  (protección de rama). Si el build falla, el PR **no** se fusiona: queda como
  señal de que algo hay que revisar.
- Si en una ejecución no hay ninguna mejora sólida y verificable, **no abras
  ningún PR**. Preferimos no tocar nada a degradar el método.

## Qué NO hacer

- ❌ Inventar citas, datos, versiones o fuentes.
- ❌ Reescrituras masivas o cambios de alcance no acotado.
- ❌ Romper el build o dejar enlaces internos rotos.
- ❌ Eliminar la sección de atribución/fuentes ni diluir la honestidad sobre qué
  es cita real y qué es paráfrasis.
- ❌ Cambiar `astro.config.mjs` (`site`/`base`) sin una razón de despliegue clara.

## Estructura del contenido

- `src/content/docs/` — todas las páginas (español, raíz sin prefijo `/es/`).
  - `fundamentos/` — el método y sus piezas.
  - `agentes/` — los seis subagentes.
  - `referencia/` — estructura, checkpoints, verificación, adaptación de stack.
  - `plantilla/` — cómo usar `TemplateSSDUncleBob` y el ejemplo `notes-cli`.
  - `ciclo-virtuoso/` — documentación viva, auto-mejora y registro de evolución.
  - `fuentes/` — atribución y fuentes (mantener la honestidad de citas).
- `astro.config.mjs` — sidebar, i18n y despliegue. El sidebar debe reflejar las
  páginas que crees o muevas.

---

## Astro / Starlight (notas técnicas)

Servidor de desarrollo en segundo plano:

```
astro dev --background
```

Gestión: `astro dev stop`, `astro dev status`, `astro dev logs`. Documentación:
https://starlight.astro.build y https://docs.astro.build (colecciones de
contenido, i18n). Construcción de producción: `npm run build`.
