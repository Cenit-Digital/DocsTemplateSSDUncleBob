---
title: "¿Qué es Harness Engineering?"
description: "El encuadre Agent = Model + Harness. Qué es un arnés de IA, de dónde viene el término (Hashimoto, LangChain, Thoughtworks) y por qué este método es, él mismo, un harness."
---

## La ecuación central

> **Agent = Model + Harness**

Un **agente** de IA no es solo un modelo. Es un modelo **más** todo lo que lo
rodea. A ese "todo lo que lo rodea" se le llama **harness** (arnés): el código,
la configuración y la lógica de ejecución que **no** son el modelo.

El modelo aporta capacidad lingüística y de razonamiento. El arnés aporta lo
demás: qué herramientas puede invocar, qué contexto recibe y en qué orden, qué
reglas debe respetar, cómo se orquestan varios pasos, dónde se detiene a pedir
aprobación y cómo se verifica su trabajo. **La ingeniería está en el arnés.**

:::note[Definición operativa]
Un harness es **todo el código, la configuración y la lógica de ejecución que
NO es el modelo**. Si lo puedes versionar, revisar y probar en tu repositorio,
es parte del arnés; el modelo, no.
:::

## De dónde viene el término

*Harness Engineering* es un encuadre reciente. Sus referencias principales:

- **Mitchell Hashimoto** popularizó el término a **principios de 2026**,
  poniendo el foco en que el trabajo de ingeniería con agentes ocurre en el
  arnés, no en el modelo.
- **LangChain** lo formalizó en el artículo de **Vivek Trivedy**, *"Anatomy of
  an Agent Harness"*:
  [langchain.com/blog/the-anatomy-of-an-agent-harness](https://www.langchain.com/blog/the-anatomy-of-an-agent-harness).
- **Birgitta Bockeler** (Thoughtworks) desarrolló el concepto en *Harness
  Engineering*, publicado en el sitio de Martin Fowler:
  [martinfowler.com/articles/harness-engineering.html](https://martinfowler.com/articles/harness-engineering.html).

Estas fuentes coinciden en un desplazamiento del foco: como el modelo es un
componente que se sustituye o mejora, **la ventaja de ingeniería sostenible está
en diseñar bien el arnés** que lo gobierna.

## Este método ES un harness

El Arnés SSD de Uncle Bob no describe un harness: **es** uno. Sus piezas se
corresponden con las partes que la literatura atribuye a un arnés de agentes:

- **El repositorio es el sistema.** El estado no vive en el chat: vive en disco.
  `feature_list.json` registra los estados de cada feature, `progress/` guarda
  las bitácoras y `docs/` contiene la guía por fase. La referencia circula; el
  contenido no viaja por conversación. Esto evita el efecto
  "teléfono-descompuesto" entre agentes.
- **Divulgación progresiva vía `AGENTS.md`.** El `AGENTS.md` no es un reglamento
  monolítico: es **un mapa**. Entrega el contexto por etapas —configuración,
  mapa del repositorio, reglas duras, pipeline, cierre de sesión— y remite a
  documentos especializados (`docs/tdd.md`, `docs/gherkin.md`, …) solo cuando se
  necesitan. Así cada agente consume información **cuando la necesita**, sin
  sobrecarga de contexto.
- **Orquestación multi-agente.** El arnés coordina agentes especializados
  —`craftsman_lead`, `spec_partner`, `gherkin_author`, `tdd_craftsman`, `judge`,
  `mutation_tester`— con entradas, salidas y transiciones de estado definidas.
  Consulta [Los seis agentes](../../agentes/vision-general/).
- **SDD (Spec-Driven Development).** El flujo empieza por una spec conversada y
  la destila en un contrato Gherkin ejecutable, no por código improvisado. Ver
  [SDD: la spec conversada](../sdd/) y
  [Gherkin: el contrato ejecutable](../gherkin/).
- **Supervisión y verificación.** El arnés impone una
  [puerta de aprobación humana](../puerta-humana/) sobre el contrato y cierra el
  ciclo con [review](../review/) y [prueba de mutación](../mutacion/), que
  miden si el trabajo del agente es realmente correcto.

:::tip[La consecuencia práctica]
Cambiar de modelo no te obliga a reinventar el proceso: el arnés —reglas,
orquestación, artefactos y verificación— permanece. Por eso este sitio invierte
en documentar el arnés, no en describir un modelo concreto.
:::

## Sigue leyendo

- [El método de un vistazo](../el-metodo/) — el pipeline de cinco fases completo.
- [Los seis agentes](../../agentes/vision-general/) — quién ejecuta cada fase.
- [Atribución y fuentes](../../fuentes/atribucion/) — referencias verificadas.
