---
title: "Atribución y fuentes"
description: "Transparencia total sobre las fuentes del método: qué es verificable y qué es paráfrasis pedagógica de BettaTech, con enlaces a todo el material primario."
---

Esta página es clave para la **honestidad** del proyecto. Aquí separamos con
claridad tres cosas: lo que está **verificado en fuentes primarias**, lo que es
**paráfrasis pedagógica** de BettaTech, y las **tecnologías** sobre las que se
apoya el sitio. La regla es la misma que rige todo el repositorio: **cero
alucinación**. Si algo no se puede verificar, no se afirma.

## a) El método y BettaTech

El método —el arnés SSD de Uncle Bob, edición artesano— se difunde en el canal de
YouTube **BettaTech**, en la playlist **«Aprende a usar la IA para desarrollar»**
(8 vídeos):

1. Implemento el sistema de Agentes de Uncle Bob, te lo muestro
2. Construyo mi propio arnés de IA… y te enseño cómo hacer el tuyo
3. Esto es lo que Aprendí Adaptando Claude Code para SDD
4. ¿Qué es esto del Harness Engineering?
5. ¿Qué es esto del Loop Engineering?
6. Construí agentes de IA con mi API en OpenClaw
7. Todo lo que necesitas saber sobre el desarrollo con IA
8. La Nueva Forma de Programar (sin VibeCoding)

La descripción oficial del **vídeo 1** (verbatim) resume el enfoque:

> «BettaTech explora un flujo de trabajo para desarrollo de software basado en la
> Inteligencia Artificial, inspirado por Robert C. Martin. Esta metodología
> integra conceptos como la formalización de especificaciones en Gherkin, la
> aplicación rigurosa de TDD mediante agentes especializados y el uso de mutation
> testing para validar la robustez del código generado automáticamente.»

El **destilado concreto** del método —los seis agentes, los checkpoints, el
mutador, el ejemplo trabajado— vive en el repositorio del método:
[**betta-tech/harness-sdd**](https://github.com/betta-tech/harness-sdd), rama
`uncle-bob-harness`.

:::caution[Nota honesta sobre las fuentes]
Las **transcripciones verbatim de los vídeos no son accesibles por máquina**. Por
eso **no citamos frases habladas** de los vídeos como literales. La **fuente de
verdad** de este sitio es el **repositorio** del método (código, agentes,
`docs/`, ejemplo) más la **documentación oficial** de las tecnologías. Cuando
algo procede de un vídeo y no del repo, lo presentamos como interpretación, no
como cita.
:::

## b) Robert C. Martin (Uncle Bob)

Distingue con cuidado lo que **sí** se le puede atribuir de lo que **no**.

### Lo verificado (atribuible a Martin)

- **Las Tres Leyes del TDD.** Fuente:
  [«The Cycles of TDD»](https://blog.cleancoder.com/uncle-bob/2014/12/17/TheCyclesOfTDD.html)
  (blog.cleancoder.com, 2014).
- **Mutation testing como medida de la estabilidad semántica de la suite.**
  Fuente: [«Mutation Testing»](https://blog.cleancoder.com/uncle-bob/2016/06/10/MutationTesting.html)
  (2016). En ese post argumenta que la mutación mide la **estabilidad semántica**
  de la suite de tests (sin lenguaje de «ROI» ni «worth every cycle»).
- **Su postura sobre juzgar el código de los agentes por métricas.** En X ha
  afirmado: *«I don't review code written by agents. I measure things like test
  coverage, dependency structure, cyclomatic complexity, module sizes, mutation
  testing»* y *«TDD is very inefficient for AIs. Testing is essential for them but
  not in the micro steps that the three laws of TDD recommend»*.

### La advertencia (NO son citas de Martin)

:::danger[Estas cuatro consignas son paráfrasis de BettaTech, no citas de Uncle Bob]
Las frases

- «The review step is the whole game»
- «Agents draft, judgment prunes»
- «Raw computer power is the limiting factor»
- mutation testing con «ROI worth every cycle»

**NO son citas verbatim verificadas de Robert C. Martin.** Son la **formulación
pedagógica de BettaTech** que resume el espíritu del método. En todo este sitio
las presentamos como tales —formulación del método— **nunca como cita directa de
Uncle Bob**.
:::

## c) Harness Engineering

La idea de que **«Agente = Modelo + Harness»** —donde el *harness* es todo el
código, la configuración y la lógica de ejecución que **no** es el modelo— se
popularizó a principios de 2026 (término asociado a **Mitchell Hashimoto**) y se
formalizó en dos textos de referencia:

- **LangChain — Vivek Trivedy**, *«The Anatomy of an Agent Harness»*:
  [langchain.com/blog/the-anatomy-of-an-agent-harness](https://www.langchain.com/blog/the-anatomy-of-an-agent-harness).
- **Birgitta Böckeler (Thoughtworks)**, en martinfowler.com:
  [martinfowler.com/articles/harness-engineering.html](https://martinfowler.com/articles/harness-engineering.html).

Ver también [¿Qué es Harness Engineering?](../../fundamentos/harness-engineering/).

## d) Tecnologías

Este sitio y el arnés se apoyan en:

- **Astro** — framework web. [astro.build](https://astro.build) ·
  [docs.astro.build](https://docs.astro.build).
- **Starlight** — el framework de documentación de Astro con el que está hecho
  este sitio. [starlight.astro.build](https://starlight.astro.build).
- **Claude Code GitHub Action** — el motor del bot de auto-mejora.
  [github.com/anthropics/claude-code-action](https://github.com/anthropics/claude-code-action).
- **Herramientas de mutación reales.** Para Python: el `tools/mutate.py` incluido
  (sin dependencias) o [mutmut](https://github.com/boxed/mutmut) /
  [cosmic-ray](https://github.com/sixty-north/cosmic-ray). Para
  JavaScript/TypeScript: [Stryker](https://stryker-mutator.io/). No usamos ni
  citamos herramientas inventadas.

---

:::note
Si detectas en este sitio una afirmación sin fuente, o una paráfrasis presentada
como cita literal, es un **error de honestidad** y debe corregirse. Esa vigilancia
es parte del método: ver [Documentación viva](../../ciclo-virtuoso/documentacion-viva/)
y [Auto-mejora autónoma](../../ciclo-virtuoso/auto-mejora/).
:::
