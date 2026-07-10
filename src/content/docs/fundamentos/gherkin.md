---
title: "Gherkin: el contrato ejecutable"
description: "El arnés de Uncle Bob destila la spec en archivos .feature con escenarios Given/When/Then. Reglas duras, un ejemplo y la traducción manual de Gherkin a tests sin añadir dependencias BDD."
---

Una vez acordada [la spec conversada](../sdd/), el método la
**destila** en archivos Gherkin. Estos `.feature` no son documentación
decorativa: son el **contrato ejecutable**, el pacto entre lo que se especificó
y lo que se implementará. Son, en palabras del método, *"el mapa que el
`tdd_craftsman` recorre"*, y viven en `features/<name>.feature`.

Aquí también ocurre la [puerta de aprobación humana](../puerta-humana/):
aprobar un `.feature` es barato; un escenario mal definido contamina todo el TDD
que viene después.

## Estructura básica

Cada archivo declara una `Feature` y uno o más `Scenario`, cada escenario escrito
con la tríada `Given` / `When` / `Then`:

```gherkin
Feature: <propósito en una frase>
  Como <rol> quiero <capacidad> para <beneficio>.

  @s1
  Scenario: <comportamiento observable>
    Given <estado inicial>
    When <acción del usuario>
    Then <resultado medible>
```

- **`Given`** fija el estado inicial (el mundo antes de la acción).
- **`When`** ejecuta **una sola** acción observable.
- **`Then`** afirma un resultado **medible**, no una impresión.

## Un ejemplo real

```gherkin
Feature: contar notas
  Como usuario quiero contar las notas de un archivo para conocer su tamaño.

  @s1
  Scenario: archivo vacío
    Given un archivo de notas vacío
    When ejecuto la orden de conteo sobre ese archivo
    Then stdout es exactamente "0"
    And el exit code es 0

  @s2
  Scenario: varias notas
    Given un archivo con tres notas
    When ejecuto la orden de conteo sobre ese archivo
    Then stdout es exactamente "3"

  @s3
  Scenario: archivo inexistente
    Given una ruta que no apunta a ningún archivo
    When ejecuto la orden de conteo sobre esa ruta
    Then stderr contiene un mensaje de error
    And el exit code es distinto de 0
```

Observa que el camino de error (`@s3`) es un escenario de pleno derecho, no una
nota al pie.

## Cuatro reglas duras

1. **Un escenario por comportamiento observable** — incluidos los **caminos de
   error** (ID inexistente, flags inválidos, archivos vacíos). Si un fallo es
   observable, es un `Scenario`.

2. **Tags estables** — `@s1`, `@s2`, etc. Funcionan como **identificadores**
   que enlazan la spec con los tests y con la cobertura. No los reordenes ni los
   reutilices: son la columna vertebral de la trazabilidad.

3. **Afirmaciones medibles en `Then`** — prohibido lo vago. Válido: *"stdout es
   exactamente `3`"* o *"el exit code es distinto de 0"*. Inválido: *"funciona"*,
   *"muestra el resultado"*.

4. **Un único `When` por escenario** — si necesitas dos acciones, son **dos
   escenarios distintos**. Un escenario prueba una acción y sus consecuencias, no
   una secuencia.

:::tip
La regla del `Then` medible y la del `When` único son las que más disciplina
imponen: obligan a que cada escenario sea directamente traducible a un test que
pasa o falla sin interpretación.
:::

## De Gherkin a test

El stack de referencia es Python y **no usa ningún runner BDD** (ni `behave` ni
`pytest-bdd`): añadir esa dependencia contradiría la austeridad del método. En
su lugar, cada escenario se traduce **a mano** a un test de `unittest`, usando el
tag como nombre trazable:

- `@s1` (archivo vacío → 0) → `test_count_archivo_vacio`
- `@s2` (varias notas → 3) → `test_count_varias_notas`
- `@s3` (archivo inexistente → error) → `test_count_archivo_inexistente`

El `.feature` permanece como la **fuente de verdad legible**; el archivo de
progreso (`progress/tdd_<name>.md`) documenta el avance Rojo → Verde →
Refactor de cada escenario. Esta traducción manual es también la puerta de
entrada al [TDD estricto](../tdd/): cada tag se convierte en uno o
más ciclos.

```python
class TestContarNotas(unittest.TestCase):
    def test_count_archivo_vacio(self):        # @s1
        ...
    def test_count_varias_notas(self):         # @s2
        ...
    def test_count_archivo_inexistente(self):  # @s3
        ...
```

:::caution[Otros lenguajes]
La traducción manual funciona bien en el stack de referencia (Python). Para
JavaScript/TypeScript u otros stacks, consulta cómo se adapta la cadena
Gherkin → test → mutación en [adaptar a otro lenguaje](../../referencia/stack-adapter/).
:::

## Trazabilidad de punta a punta

El tag `@s` es el hilo que atraviesa todo el arnés:

```text
spec (comportamiento) → @s1 → Scenario Gherkin → test_count_archivo_vacio → cobertura/mutación
```

Gracias a él, [`el judge`](../../agentes/judge/) puede comprobar que **ningún
escenario quedó sin test**, y la [prueba de mutación](../mutacion/)
puede verificar que ese test realmente atrapa defectos.

---

**Autor de esta fase:** [`gherkin_author`](../../agentes/gherkin-author/).
**Siguiente:** con los `.feature` aprobados, empieza el
[TDD estricto](../tdd/).
