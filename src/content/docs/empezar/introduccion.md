---
title: Introducción
description: Qué es esta documentación viva y el arnés SDD estilo Uncle Bob que describe.
---

Esta es la referencia **viva** del arnés SDD estilo Uncle Bob. Viva porque se actualiza sola: no es un documento cerrado, sino una referencia que evoluciona con la plantilla (ver la sección de evolución autónoma). Describe una **plantilla reutilizable para cualquier proyecto** que aplica el flujo de desarrollo con IA de Robert C. Martin (Uncle Bob), popularizado por BettaTech.

## El flujo, en un párrafo

El proceso es fijo y sigue cinco fases encadenadas: **conversar la spec** con un compañero que debate casos límite y decisiones (`project-spec.md`); **destilarla en Gherkin**, escenarios `Given/When/Then` que se vuelven el contrato ejecutable; **tallar el código con TDD estricto**, un test a la vez, rojo → verde → refactor; **podar con juicio** en el review; y **validar con prueba de mutación**, que introduce defectos y exige que algún test falle. Una sola feature a la vez, y el estado vive en disco, no en el chat.

## La idea central

Lo importante no es la app: es **cómo se estructura el trabajo para que un agente de IA desarrolle de forma autónoma y verificable**. El flujo es casi automático, pero deja **una sola puerta de aprobación humana** en el punto de máximo apalancamiento: el contrato Gherkin. Aprobar los escenarios es barato y ocurre **antes** de escribir producción; aprobar tarde, cuando ya hay código, es caro. Un escenario mal definido arrastra todo el TDD.

Dos frases del hilo de Uncle Bob resumen por qué este orden funciona:

> "The review step is the whole game. Agents draft, judgment prunes."

Generar borradores es barato; el valor escaso es el juicio que decide qué sobrevive. Y sobre la validación:

> "Raw computer power is the limiting factor."

Una suite verde solo dice que el código no explota. La prueba de mutación es la medida real de si los tests muerden.

## Los dos repositorios

El material se reparte en dos repos:

- **TemplateSSDUncleBob** — la plantilla en sí: agentes, motor agnóstico de cero dependencias, ejemplos ejecutables y ficheros de gobernanza.
- **DocsTemplateSSDUncleBob** — esta documentación, la referencia viva que amplía la plantilla.

## Por dónde seguir

- [Qué es el arnés SDD](/DocsTemplateSSDUncleBob/empezar/que-es/)
- [El flujo completo](/DocsTemplateSSDUncleBob/metodo/flujo/)
