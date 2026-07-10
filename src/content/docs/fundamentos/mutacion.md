---
title: "Prueba de mutación"
description: "Cómo validar que los tests realmente muerden introduciendo defectos y exigiendo que la suite los detecte, con el mutador tools/mutate.py y un umbral del 100%."
---

Una suite en verde solo dice una cosa: "el código no explota con estas entradas".
**No** dice "los tests fallarían si el código estuviera mal". Un test sin asserts
fuertes pasa siempre y no protege nada. La prueba de mutación lo mide al revés.

## El problema que resuelve

Puedes tener 100% de cobertura de líneas y una red de tests inútil: basta con que
los tests ejecuten el código sin comprobar su resultado. La cobertura mide qué
líneas se *tocan*; no mide si un defecto en esas líneas *rompería* algún test. La
mutación cierra ese hueco.

## Cómo funciona

Se introduce un defecto pequeño e intencional en el código —un **mutante**— y se
observa la suite:

- Si **algún test falla** → el mutante está **muerto** (killed). Bien: la red
  atrapó el defecto.
- Si **todos los tests pasan** → el mutante **sobrevive** (survived). Mal: hay un
  agujero. Falta un assert o falta un caso.

La **puntuación de mutación** es `killed / total`. Cuanto más alta, más muerden
los tests.

## El catálogo de mutaciones

El mutador aplica, uno a uno, un catálogo de transformaciones textuales sobre
operadores, palabras clave, números y sentencias `return`:

| Categoría   | Ejemplo de mutación                     |
|-------------|-----------------------------------------|
| Comparación | `<=` → `<`, `==` → `!=`, `>` → `>=`      |
| Aritmética  | `+` → `-`, `- 1` → `+ 1`                 |
| Booleano    | `and` → `or`, `True` → `False`          |
| Constantes  | `0` → `1`, `1` → `0`                     |
| Retorno     | `return <expr>` → `return None`         |

Cada mutación reproduce un defecto plausible que un humano podría cometer. Si la
suite no distingue el código correcto del mutado, la suite es ciega a ese defecto.

## El mutador incluido: `tools/mutate.py`

El repositorio trae su propio mutador, **sin dependencias externas**
(`requirements.txt` se mantiene vacío). Sus rasgos clave:

- Trabaja a nivel de **token** (módulo `tokenize`), así que **nunca** muta el
  contenido de strings ni comentarios: solo operadores, palabras clave, números y
  `return`.
- Descarta los mutantes que no compilan, para no inflar la puntuación.
- Por cada mutante escribe el archivo mutado, corre
  `python3 -m unittest discover -s tests -q` y **restaura siempre** el original,
  incluso ante Ctrl-C (limpieza en un bloque `finally`).
- Reporta `total`, `killed`, `survived`, `score` y la lista de sobrevivientes
  (archivo:línea + mutación).

```bash
python3 tools/mutate.py src/cli.py            # mutar un archivo
python3 tools/mutate.py src/cli.py --max 80   # acotar nº de mutantes
```

:::note[Nota para Windows]
El script reconfigura su `stdout` a UTF-8 al arrancar, de modo que los símbolos
del reporte (`→`, ✓/✗, etc.) se impriman correctamente también en las consolas de
Windows. No necesitas cambiar la página de códigos de la terminal.
:::

## El umbral

- Por defecto, la feature exige **100% de mutantes muertos sobre las líneas nuevas
  o tocadas** por esa feature.
- El código heredado no tocado por la feature **no bloquea**: se mide, pero no se
  exige umbral sobre él en esta rama.
- Un mutante **equivalente** —uno que no cambia el comportamiento observable, por
  ejemplo mutar un valor que nunca se usa— puede excluirse, pero **solo** con
  justificación explícita escrita en `progress/mutation_<name>.md`. Abusar de esa
  vía es hacer trampa al [judge](../../agentes/judge/).

## Quién hace qué

- El `mutation_tester` **mide** y reporta; no edita código.
- Un mutante sobreviviente es trabajo del `tdd_craftsman`: escribe el test rojo que
  lo mata y vuelve a pasar por el `judge`. Es el ciclo de mejora *compute-bound*:
  el CPU encuentra el hueco, el artesano lo tapa con un test.

## Lo que dijo Uncle Bob (y lo que no)

Robert C. Martin dedicó un post a la prueba de mutación en 2016. Su tesis
verificada es que la mutación mide la **estabilidad semántica** de la suite: si
puedes alterar el significado del programa sin que ningún test se queje, tu suite
no está sujetando el comportamiento que crees.

> Fuente: *Mutation Testing*, Robert C. Martin, 2016 —
> `https://blog.cleancoder.com/uncle-bob/2016/06/10/MutationTesting.html`

:::caution[Cero fabricación sobre el "ROI"]
La guía de este repo enmarca la mutación con frases del tipo *"the ROI on code
correctness is worth every cycle"* y *"shifting from a bottleneck of human typing
speed to a bottleneck of compute-driven validation"*. Esa formulación del **retorno
de inversión** y del cuello de botella *compute-bound* es la **formulación
pedagógica de BettaTech**, no una cita literal de Robert C. Martin. El post de 2016
de Martin habla de estabilidad semántica y **no** usa lenguaje de "ROI" ni de
"worth every cycle". Preséntalo siempre así.
:::

## Herramientas reales de mutación

`tools/mutate.py` es deliberadamente mínimo y pensado para Python con
`unittest`. Para proyectos reales conviene apoyarse en herramientas maduras:

- **Python:** [mutmut](../../referencia/stack-adapter/) o cosmic-ray.
- **JavaScript / TypeScript:** [Stryker](../../referencia/stack-adapter/)
  (stryker-mutator).

Cómo integrar la prueba de mutación en otros lenguajes y frameworks se detalla en
[Adaptar a otro lenguaje](../../referencia/stack-adapter/).

## Relacionado

- El agente que ejecuta esta fase: [mutation_tester](../../agentes/mutation-tester/).
- Por qué el juicio es el cuello de botella: [El review es el juego](../review/).
- La disciplina de tests que la mutación audita: [TDD estricto](../tdd/).
