---
title: 'Memoria organizacional: el tercer bucle'
description: Cómo los patrones validados de un proyecto cruzan a todos los demás sin perder la puerta humana.
---

El arnés ya tiene dos bucles de aprendizaje. El primero vive dentro de cada proyecto: el estado en disco (`progress/history.md`, la bitácora append-only) hace que lo aprendido en una sesión sobreviva a la siguiente. El segundo es [el ciclo virtuoso](/DocsTemplateSSDUncleBob/evolucion/ciclo-virtuoso/): esta documentación y la plantilla se mejoran solas, con bots que abren Pull Requests.

Faltaba el tercero: **que lo aprendido en un proyecto cruce a los demás**. Sin él, cada proyecto nuevo empieza en blanco aunque el anterior ya haya resuelto el mismo problema tres veces.

## Dónde vive

En `Cenit-Digital/SistemaDeMemoriaUncleBob`, un repositorio **privado** de la organización. Privado a propósito: la memoria destila conocimiento de proyectos de cliente reales, y eso no puede vivir en un repo público como este. Lo que sí es público es el mecanismo — esta página.

La memoria en sí es una carpeta `patterns/` con un archivo Markdown por patrón validado, organizado por categorías (`responsive`, `tokens`, `animacion`, `testing`, `arquitectura`, `tooling`). Cada patrón declara su **origen verificable** (repo + feature + fecha), en qué repos está **validado** (su señal de confianza, que crece con el tiempo), por qué se eligió esa alternativa y —obligatorio— **cuándo NO aplica**.

## Cómo se alimenta

Un bot mensual, del mismo linaje que [el bot de auto-mejora](/DocsTemplateSSDUncleBob/evolucion/bot/) de esta documentación:

- **Descubre los repos fuente dinámicamente** por la API de GitHub: todos los de la organización menos los meta-repos (plantilla, docs, la propia memoria). Un proyecto nuevo entra solo, sin listas que mantener a mano.
- Lee su `progress/history.md` y `CHECKPOINTS.md` — el conocimiento ya masticado que el arnés exige escribir al cerrar cada sesión.
- Propone **como mucho 1-2 patrones por ejecución**, como Pull Request. La regla número uno de su mandato: **cero patrones inventados** — sin un origen citable que el bot haya leído en esa misma ejecución, no propone nada. Un mes sin propuestas es un resultado válido, no un fallo.
- **Nunca fusiona.** Cada PR pasa por [la puerta humana](/DocsTemplateSSDUncleBob/metodo/puerta-humana/): una CI valida el esquema de cada patrón, un guardián etiqueta cualquier PR que toque la correa del propio bot, y la fusión es siempre de una persona.

Si dos proyectos resolvieron el mismo problema de formas distintas, el bot no elige: lo declara como discrepancia en la primera línea del PR, y decide el humano.

## Cómo se consume

Cada proyecto del arnés lleva un paso **2bis** en su Protocolo de arranque (`CLAUDE.md`): un script (`scripts/sync-memoria.sh`, con gemelo PowerShell en la plantilla) clona la memoria en `.memoria-cache/` —ignorada por git— y el agente consulta los patrones de la categoría relevante **antes de diseñar desde cero**, leyendo primero su "Cuándo NO aplica".

El paso es **no bloqueante por diseño**: sin red, o sin acceso al repo privado (por ejemplo, alguien usando la plantilla pública desde fuera de la organización), el script avisa y la sesión sigue exactamente igual. La memoria es una ventaja, nunca un punto único de fallo.

## Por qué encaja con el método

El mismo principio que gobierna todo el arnés — *los agentes producen, el juicio poda* — aplicado un nivel más arriba. El bot generaliza (produce); el esquema con origen verificable, la CI de validación y la fusión humana podan. Y el camino de vuelta no cuesta nada: escribir un `progress/history.md` rico y concreto, que es lo que el arnés ya exige, ES alimentar la memoria de toda la organización.
