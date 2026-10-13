---
title: Checkpoints (C1–C7)
description: Criterios objetivos de "estado final correcto" que usa el juez.
---

En sistemas multi-agente no se evalúa el camino, se evalúa el destino. Estos checkpoints son los criterios objetivos que un juez (humano o IA) usa para decidir si el proyecto está sano.

Son **agnósticos al lenguaje**: los comandos concretos salen de `harness.config.json`.

## C1 — El arnés está completo

- Existen los ficheros base: `AGENTS.md`, `CLAUDE.md`, `CHECKPOINTS.md`, `harness.config.json`, `feature_list.json`, `progress/current.md`.
- Existen los docs: `docs/workflow.md`, `docs/architecture.md`, `docs/conventions.md`, `docs/verification.md`.
- `bin/harness init` termina con exit code 0.

## C2 — El estado es coherente

- Como mucho una feature en `in_progress` en `feature_list.json`.
- Toda feature `done` tiene tests asociados que pasan.
- `progress/current.md` está vacío o describe la sesión activa (no contiene basura de sesiones anteriores).

## C3 — El código respeta la arquitectura

- `src/` solo contiene los módulos previstos en `docs/architecture.md`.
- No hay dependencias externas no justificadas.
- No hay logs de debug sueltos, ni TODOs sin contexto.

## C4 — La verificación es real

- Hay al menos un test por módulo de `src/`.
- Los tests usan aislamiento real (p. ej. directorios temporales), no mocks de sistema de ficheros.
- `bin/harness test` muestra > 0 tests y todos verdes.

### Los 5 niveles de verificación

La plantilla desglosa "la verificación es real" en cinco niveles, de obligatorios a recomendados:

1. **Tests unitarios (obligatorio).** Toda función pública en `src/` tiene al menos un test que cubre el camino feliz y, si la función puede fallar, al menos un camino de error.
2. **Test de integración de la interfaz (obligatorio en features de UI/CLI).** Se ejecuta la interfaz real contra un entorno aislado (directorio temporal, base de datos efímera…), nunca con mocks del sistema de ficheros.
3. **Smoke test manual (recomendado).** Antes de cerrar, un flujo end-to-end con datos desechables, limpiado después.
4. **Trazabilidad de escenarios (obligatorio para `"sdd": true`).** Cada `@s` del `.feature` mapea a un test concreto, el mismo mapa que exige C6 (ver [TDD](/DocsTemplateSSDUncleBob/metodo/tdd/)).
5. **Prueba de mutación (obligatorio para cerrar una feature sdd).** Es C7 (ver [Mutación](/DocsTemplateSSDUncleBob/metodo/mutacion/)).

Y marca cuatro anti-patrones explícitos como "no hacer": afirmar que algo "debería funcionar" sin test ejecutable; un test que solo comprueba que la función no lanza excepción, sin verificar el resultado concreto; mockear el sistema de ficheros en vez de usar aislamiento real; y marcar una feature como `done` sin haber pasado `bin/harness init`.

Fuente: Cenit-Digital/TemplateSSDUncleBob,
[`docs/verification.md`](https://github.com/Cenit-Digital/TemplateSSDUncleBob/blob/main/docs/verification.md).

## C5 — La sesión se cerró bien

- No hay archivos sin trackear sospechosos (temporales, cachés fuera del `.gitignore`).
- `progress/history.md` tiene una entrada por la última sesión.
- La última feature trabajada está reflejada en su estado correcto.

## C6 — Contrato Gherkin (BDD)

- Toda feature con `"sdd": true` en estado `spec_ready`, `in_progress` o `done` tiene su `features/<name>.feature` y una sección en `project-spec.md`.
- El `.feature` usa Gherkin con escenarios tagueados `@s1`, `@s2`, … y cada `Then` afirma algo medible (ver [Gherkin](/DocsTemplateSSDUncleBob/metodo/gherkin/)).
- Cada escenario `@s` está cubierto por al menos un test concreto (mapa `@s → test` en `progress/tdd_<name>.md`).
- No hay código de producción que ningún test rojo haya pedido (disciplina TDD, ver [TDD](/DocsTemplateSSDUncleBob/metodo/tdd/)).

## C7 — Prueba de mutación

- La feature `done` superó la prueba de mutación (`bin/harness mutate`) con la puntuación por encima del umbral de `harness.config.json` (`mutation.threshold`).
- Cualquier mutante sobreviviente queda documentado en `progress/mutation_<name>.md` (matado con un test nuevo, o justificado como equivalente).

## Cómo usar este archivo

El agente `judge` (`.claude/agents/judge.md`) recorre C1-C6 y el `mutation_tester` valida C7.

Se rechaza el cierre de sesión si quedan casillas vacías.
