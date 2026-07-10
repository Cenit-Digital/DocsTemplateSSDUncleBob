---
title: Instalación y uso
description: Cómo usar la plantilla en tu proyecto y los comandos del arnés.
---

import { Aside, Steps, Tabs, TabItem } from '@astrojs/starlight/components';

Esta plantilla aplica el flujo de desarrollo con IA de Uncle Bob de forma
**agnóstica al lenguaje**. El proceso y las puertas son fijos; lo único que
cambia por proyecto son los comandos de tu stack, declarados en
`harness.config.json`.

## Pon en marcha la plantilla

<Steps>

1. En GitHub, pulsa **«Use this template»** (o clona el repo).

2. Cumple el requisito único del arnés: **Node.js ≥ 18** (para el motor). Tu
   proyecto usa el runtime que quieras.

3. Edita `harness.config.json` con los comandos de tu stack. Puedes copiar un
   ejemplo de `examples/` o seguir la
   [Configuración](/DocsTemplateSSDUncleBob/empezar/configuracion/).

4. Verifica el entorno con el lanzador de tu plataforma (ver más abajo).

5. Abre **Claude Code** en la raíz del proyecto. `CLAUDE.md` fuerza el rol
   `craftsman_lead`, que orquesta y no teclea. Pídele:
   **«implementa la siguiente feature pendiente»**.

</Steps>

## Verifica el entorno

El motor `.harness/harness.mjs` es de **cero dependencias** (solo la stdlib de
Node ≥ 18). Lee `harness.config.json` del directorio actual y ejecuta tus
comandos.

<Tabs>
  <TabItem label="POSIX / macOS / Linux">

```bash
./init.sh
# o directamente en cualquier plataforma:
node .harness/harness.mjs init
```

  </TabItem>
  <TabItem label="Windows / PowerShell">

```powershell
pwsh ./init.ps1
# o directamente en cualquier plataforma:
node .harness/harness.mjs init
```

  </TabItem>
</Tabs>

<Aside type="tip">
Un `init` en verde significa que el entorno, los ficheros base, la
`feature_list` y los tests están listos.
</Aside>

## Comandos del arnés

Invócalos con `bin/harness <comando>` (en Windows, `bin\harness.ps1 <comando>`).

| Comando                  | Qué hace                                              |
| ------------------------ | ---------------------------------------------------- |
| `bin/harness init`       | Verifica entorno, ficheros base, feature_list, tests |
| `bin/harness test`       | La suite de tests declarada                           |
| `bin/harness mutate [t]` | La prueba de mutación                                 |
| `bin/harness verify`     | init + mutación (puerta de cierre)                   |
| `bin/harness status`     | Resumen de `feature_list.json`                        |

## Y a trabajar

Con el entorno en verde, deja que el pipeline haga su trabajo: conversar la
spec, destilarla en Gherkin, tallar con TDD estricto, podar con juicio y validar
con prueba de mutación. Una sola feature a la vez, con una única puerta de
aprobación humana sobre los escenarios Gherkin.

La revisión no es un trámite: en el flujo de Uncle Bob "el review es el juego
entero". Por eso el agente `judge` poda antes de cerrar y el `mutation_tester`
comprueba que los tests realmente muerden.
