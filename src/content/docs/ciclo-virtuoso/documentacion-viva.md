---
title: "Documentación viva"
description: "La visión del proyecto: una documentación que se mejora sola destilando el estado del arte, publicada en GitHub Pages con Astro y Starlight."
---

Este repositorio no es una documentación que se escribe una vez y envejece. Es
**documentación viva**: un sistema que se **mejora a sí mismo** de forma
disciplinada, incremental y verificable. Cada pocos días revisa el estado del
arte, elige **una** mejora acotada, la aplica y la publica —bajo gobernanza, con
puerta de CI y trazabilidad por Pull Request.

## La analogía: destilar el estado del arte

Los modelos de lenguaje SOTA se entrenan, en parte, con **datos sintéticos
generados por el mejor modelo del momento**: el estado del arte se destila y se
reinvierte en el siguiente sistema. Aquí aplicamos la misma idea al **método**:

- El «mejor modelo del momento» es el estado del arte público en desarrollo
  asistido por IA, harness engineering, SDD, TDD con agentes y prueba de
  mutación.
- El «dato sintético» es cada mejora que el guardián autónomo destila de esas
  fuentes y **reinvierte** en esta documentación.
- El resultado es un método que **no se queda quieto**: se refina a medida que
  avanza el campo.

:::note
La analogía es exactamente eso, una analogía. Aquí no se entrena ningún modelo:
se **refina un método** y su documentación. Lo que se comparte con el
entrenamiento es la forma —destilar lo mejor disponible y reinvertirlo— no la
maquinaria.
:::

## Disciplina, no deriva

«Se mejora sola» no significa «cambia sin control». Todo lo contrario. El
guardián opera bajo reglas duras (ver [CLAUDE.md](https://github.com/Cenit-Digital/TemplateSSDUncleBob)):

- **Cero alucinación.** No inventa hechos, citas, versiones ni URLs. Si no puede
  verificarlo en una fuente oficial o de primera mano, no lo afirma.
- **Atribución honesta.** Distingue siempre lo verificable (las Tres Leyes del
  TDD, el post de mutación de Uncle Bob) de las paráfrasis pedagógicas de
  BettaTech. Ver [Atribución y fuentes](../../fuentes/atribucion/).
- **Una mejora por vez.** Nada de reescrituras masivas: una página nueva, una
  sección más rigurosa, una corrección. Igual que el método exige una feature por
  vez.
- **Verificable o no entra.** Cada cambio debe compilar limpio (`npm run build`)
  y pasar el CI antes de fusionarse.

## Cómo se publica

El sitio está hecho con **Astro** y **Starlight** (el framework de documentación
de Astro). El despliegue es automático:

- El workflow `.github/workflows/deploy.yml` se dispara en cada `push` a `main`.
- Construye el sitio con `withastro/action` y lo publica en **GitHub Pages**
  usando OIDC (`pages: write`, `id-token: write`).
- La URL final combina `site` y `base` de `astro.config.mjs`:
  `https://cenit-digital.github.io/DocsTemplateSSDUncleBob/`.

```text
push a main  →  deploy.yml  →  astro build  →  GitHub Pages (publicado)
```

Así, cada mejora que el guardián fusiona en `main` queda **publicada
automáticamente**, sin intervención humana. El ciclo se cierra solo.

## El ciclo completo

```text
estado del arte  →  guardián autónomo (self-improve.yml)  →  Pull Request
      ↑                                                          ↓
   (se reinvierte)  ←  GitHub Pages  ←  deploy.yml  ←  merge si CI verde
```

El «cómo» de ese guardián —su cron, su autenticación, sus permisos y, sobre todo,
su **gobernanza y sus límites honestos**— está en la página siguiente:
[Auto-mejora autónoma](../auto-mejora/). El rastro de lo que ha
ido cambiando está en el [Registro de evolución](../registro-evolucion/).
