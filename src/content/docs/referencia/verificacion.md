---
title: "Verificación"
description: "Los cinco niveles de verificación del arnés. El agente no dice \"funciona\": lo demuestra con evidencia ejecutable. Comandos del stack de referencia (Python)."
---

El principio rector es una sola frase:

:::note[El principio]
**El agente no dice "funciona": lo demuestra.** Los agentes prueban que algo funciona con
*evidencia ejecutable*, no con afirmaciones. "Pasa los tests" es una salida de terminal que
otro puede reproducir, no una opinión.
:::

Ese principio se despliega en **cinco niveles**. Los primeros verifican comportamiento; el
último verifica que los propios tests sirven para algo. Los comandos concretos son del
**stack de referencia (Python)**; para tu lenguaje, tradúcelos siguiendo
[Adaptar a otro lenguaje](../stack-adapter/).

## Nivel 1 · Tests unitarios *(obligatorio)*

Toda función pública de `src/` necesita al menos un test en `tests/` que cubra:

- el camino feliz, y
- al menos un escenario de error (si aplica).

```bash
python3 -m unittest discover -s tests -v
```

## Nivel 2 · Tests de integración de CLI *(obligatorio para features de interfaz)*

Los features que añaden comandos de CLI se validan **ejecutando la CLI real** contra
archivos temporales, no simulando su interior:

```python
import subprocess, tempfile, os
with tempfile.TemporaryDirectory() as d:
    env = {**os.environ, "NOTES_FILE": os.path.join(d, "notes.json")}
    out = subprocess.check_output(
        ["python3", "-m", "src.cli", "add", "hola", "--body", "mundo"],
        env=env, text=True,
    )
    assert "id=" in out
```

## Nivel 3 · Smoke test manual *(recomendado)*

Un recorrido de punta a punta antes de cerrar la sesión, para ver el sistema vivo:

```bash
NOTES_FILE=/tmp/notes_demo.json python3 -m src.cli add "test" --body "x"
NOTES_FILE=/tmp/notes_demo.json python3 -m src.cli list
rm /tmp/notes_demo.json
```

## Nivel 4 · Trazabilidad de escenarios `@s → test` *(obligatorio para `"sdd": true`)*

Cada escenario Gherkin (`@s1`, `@s2`, …) del `.feature` debe mapear a **tests concretos**.
Esa correspondencia se documenta en `progress/tdd_<name>.md`, enlazando cada escenario con
las funciones de test que lo cubren.

:::tip[La trazabilidad es el hilo que cierra el círculo]
El contrato lo escribe [gherkin_author](../../agentes/gherkin-author/), lo aprueba el humano,
y la trazabilidad demuestra que **cada** cláusula del contrato tiene una prueba detrás. Sin
ella, "implementamos la feature" es una afirmación sin respaldo. Es exactamente lo que
verifica el checkpoint [C6](../checkpoints/).
:::

## Nivel 5 · Prueba de mutación *(requerido para cerrar un feature)*

Pasar los tests **no basta**: los tests tienen que ser capaces de **detectar cambios** en el
código. El mutador introduce mutaciones y comprueba que la suite se ponga en rojo:

```bash
python3 tools/mutate.py src/cli.py
```

Todo mutante superviviente exige **un test nuevo que lo mate** o una **justificación
documentada** como equivalente. Es el checkpoint [C7](../checkpoints/), a cargo de
[mutation_tester](../../agentes/mutation-tester/). El fundamento del nivel se explica en
[Prueba de mutación](../../fundamentos/mutacion/).

## Antipatrones prohibidos

El arnés rechaza explícitamente las formas de "verde falso":

- Afirmar que algo funciona **sin prueba ejecutable**.
- Tests que solo verifican **la ausencia de excepciones**.
- **Mockear el sistema de archivos** en lugar de usar `tempfile.TemporaryDirectory()` real.
- Marcar un feature como completo **sin pasar los scripts de validación**.

## Checklist final de verificación

Antes de dar un feature por terminado, dos comandos tienen que salir limpios:

```bash
./init.sh                            # debe completar con [OK]
python3 tools/mutate.py src/cli.py   # score por encima del umbral
```

:::danger[Condición de cierre]
**No marques un feature como completo** si `./init.sh` falla o si sobreviven mutantes sin
justificar. La verificación no es un trámite final: es la evidencia que convierte "creo que
está bien" en "aquí está la salida que lo prueba".
:::

Los niveles 1–4 son el territorio del [judge](../../agentes/judge/) (checkpoints C1–C6); el
nivel 5 es el del [mutation_tester](../../agentes/mutation-tester/) (C7). Juntos garantizan
que ningún feature pase a `done` por confianza: pasa por demostración.
