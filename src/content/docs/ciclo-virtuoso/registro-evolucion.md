---
title: "Registro de evolución"
description: "El changelog y registro de decisiones del método. Cada mejora autónoma añade una entrada con fecha, qué cambió, por qué y las fuentes."
---

Este es el **registro de evolución** del método: su changelog y su registro de
decisiones a la vez. Es la memoria del [ciclo virtuoso](../documentacion-viva/).

**Cada mejora autónoma** que el [guardián](../auto-mejora/) fusiona
en `main` **añade una entrada aquí**. Toda entrada responde a cuatro preguntas:

- **Fecha** — cuándo se aplicó.
- **Qué** — qué cambió, de forma concreta.
- **Por qué** — la motivación o el problema que resuelve.
- **Fuentes** — los enlaces oficiales/primarios que la sustentan (regla de cero
  alucinación: sin fuente, no se afirma).

El registro se lee de **arriba abajo, de más reciente a más antiguo**. El bot lo
consulta al empezar cada ejecución para no repetir trabajo y respetar la
dirección tomada.

:::note
Este registro es descriptivo, no decorativo: es una herramienta de trabajo del
propio bot. Mantén el formato (fecha · qué · por qué · fuentes) para que siga
siendo legible por máquina y por humanos.
:::

---

## 2026-07-10 — Génesis

**Qué**

- Creación de la plantilla
  [**TemplateSSDUncleBob**](https://github.com/Cenit-Digital/TemplateSSDUncleBob):
  el arnés SSD de Uncle Bob (edición artesano) **generalizado** a partir del repo
  del método, con el Python de referencia intacto y una **capa de adaptación**
  para reutilizarlo en proyectos nuevos.
- Creación de **esta documentación viva** (Astro + Starlight): fundamentos, los
  seis agentes, referencia, guía de la plantilla, el ciclo virtuoso y las
  fuentes.
- **Semillas de portabilidad** sembradas en el arnés:
  - `init.sh` **autodetecta** el intérprete (`python3` → `python`) para no fallar
    en entornos donde solo existe `python`.
  - Se documenta ejecutar `tools/mutate.py` en **modo UTF-8** en Windows
    (`PYTHONUTF8=1`), para que el subproceso de tests no rompa con
    `UnicodeEncodeError` en consolas no-UTF-8.
- Puesta en marcha del **bot de auto-mejora** (`self-improve.yml`, 2×/semana) con
  gobernanza **PR + auto-merge si CI verde**, y del **despliegue** a GitHub Pages
  (`deploy.yml`).

**Por qué**

- Convertir un repo-ejemplo excelente pero **específico** en una **plantilla
  reutilizable** («Use this template») sin perder su ejemplo trabajado.
- Que el método tenga una **referencia pública, rigurosa y honesta**, y que esa
  referencia **no envejezca**: que se refine sola destilando el estado del arte.
- Cerrar las asperezas de **portabilidad** más comunes (intérprete de Python y
  codificación en Windows) que frenan a quien prueba el arnés por primera vez.

**Fuentes**

- Repo del método: [betta-tech/harness-sdd](https://github.com/betta-tech/harness-sdd)
  (rama `uncle-bob-harness`).
- Plantilla: [Cenit-Digital/TemplateSSDUncleBob](https://github.com/Cenit-Digital/TemplateSSDUncleBob).
- BettaTech, playlist «Aprende a usar la IA para desarrollar» (canal de YouTube).
- Robert C. Martin, [«The Cycles of TDD»](https://blog.cleancoder.com/uncle-bob/2014/12/17/TheCyclesOfTDD.html)
  y [«Mutation Testing»](https://blog.cleancoder.com/uncle-bob/2016/06/10/MutationTesting.html).
- Harness Engineering:
  [LangChain, «The Anatomy of an Agent Harness»](https://www.langchain.com/blog/the-anatomy-of-an-agent-harness)
  y [Birgitta Böckeler (Thoughtworks) en martinfowler.com](https://martinfowler.com/articles/harness-engineering.html).
- Detalle completo de la atribución: [Atribución y fuentes](../../fuentes/atribucion/).

---

*Próximas entradas se añaden encima de esta, empujando «Génesis» hacia abajo.*
