---
title: Ejemplo Python (notes-cli)
description: 'CLI de notas en Python: 47 tests, mutación 100%. Verificado.'
---

`examples/python-notes-cli` es una CLI minimalista de notas escrita en Python usando solo la biblioteca estándar (cero dependencias). Es un ejemplo de referencia tomado del arnés de BettaTech, y está verificado. Sirve como ejemplo didáctico de Harness Engineering: demuestra el flujo Uncle Bob de punta a punta.

## Qué es

Una CLI para gestionar notas: añadir, listar, ver, borrar, buscar, editar y filtrar por fecha. El proyecto es de referencia, así que su valor no está solo en el código sino en cómo se construyó: una feature cada vez, con spec aprobada antes de implementar, tests para cerrar y mutación para verificar la calidad de esos tests.

## harness.config.json

El proyecto no es standalone: se apoya en el arnés compartido. Sus dos comandos clave son:

- **test**: `{{py}} -m unittest discover -s tests -q` — ejecuta la suite con `unittest`.
- **mutate**: `{{py}} tools/mutate.py {{target}}` — lanza el mutador propio sobre un archivo.

El motor resuelve `{{py}}` a `python3` o `python`. La configuración fija un umbral de mutación de `1.0` (100%) sobre tres objetivos: `src/cli.py`, `src/notes.py` y `src/storage.py`. Las reglas activadas son: una feature a la vez, spec aprobada para implementar, tests para cerrar y mutación para cerrar.

## Estructura

```
src/       notes.py  storage.py  cli.py
tests/     test_*.py
tools/     mutate.py
features/
```

- `src/storage.py`: lectura/escritura atómica de notas en JSON (escritura a temporal + rename).
- `src/notes.py`: el modelo `Note` con id incremental y `created_at` en ISO 8601.
- `src/cli.py`: los comandos (`add`, `list`, `show`, `delete`, `search`, `edit`, `recent`, `count`, `since`...).
- `tools/mutate.py`: el mutador propio, sin dependencias. Muta operadores, palabras clave, números y `return`, valida que el código compile y restaura el original. Fuerza salida UTF-8, así que es portable en Windows.

## Métricas

47 tests y mutación 100% en los 3 módulos objetivo. Esa cobertura de mutación al 100% es la que da confianza: no basta con que los tests pasen, tienen que *matar* las mutaciones.

## Cómo ejecutarlo

```bash
cd examples/python-notes-cli
node ../../.harness/harness.mjs init
node ../../.harness/harness.mjs mutate src/cli.py
```

`init` prepara el proyecto y `mutate` lanza el mutador sobre el archivo indicado.

## El ciclo mutación → test

Este ejemplo muestra el ciclo real: al correr la mutación se detectaron tests laxos (mutaciones que sobrevivían porque ningún test las cazaba). Se cerraron esos huecos añadiendo asserts hasta llegar al 100%. Es exactamente el punto del paso de mutación: no confiar en que los tests son buenos solo porque están verdes, sino obligarlos a demostrarlo.

Para proyectos grandes puedes cambiar el runner a `pytest` y el mutador a `mutmut` o `cosmic-ray`. Para empezar, copia este ejemplo como punto de partida.
