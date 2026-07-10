---
title: "Auto-mejora autónoma"
description: "Cómo funciona el bot autónomo que mejora el método dos veces por semana, su gobernanza por Pull Request con auto-merge, la configuración única que hace el humano y sus límites honestos."
---

El guardián de esta documentación es un **bot autónomo**: dos veces por semana
investiga el estado del arte, propone **una** mejora acotada, verifica que el
sitio compila y abre un **Pull Request** que se fusiona solo si el CI está verde.
Esta página explica cómo funciona y, sobre todo, cómo se **gobierna**.

## El workflow en una imagen

```text
cron (lun y jue, 05:30 UTC)
      │
      ▼
self-improve.yml  →  claude-code-action
      │                    │
      │   investiga · elige 1 mejora · edita docs · npm run build
      │                    │
      ▼                    ▼
   crea rama  →  abre Pull Request  →  gh pr merge --auto --squash
                                             │
                                   CI (job «build») verde ─── sí ──▶ merge a main ──▶ deploy
                                             │
                                             └─ no ──▶ el PR queda abierto (señal de revisión)
```

## Anatomía del bot (`self-improve.yml`)

- **Cuándo.** `cron: '30 5 * * 1,4'` — lunes (1) y jueves (4) a las **05:30
  UTC**, dos veces por semana. También se puede lanzar a mano con
  `workflow_dispatch` desde la pestaña *Actions*.
- **Con qué se autentica.** Con tu **suscripción** (Claude Pro/Max), no con una
  API de pago. Generas un token con `claude setup-token` y lo guardas como
  secret `CLAUDE_CODE_OAUTH_TOKEN`.
- **Qué hace.** Usa `anthropics/claude-code-action`. El *prompt* le ordena leer
  `CLAUDE.md` y el registro de evolución, investigar solo en fuentes
  oficiales/primarias, aplicar **una** mejora, ejecutar `npm run build`, y —si
  compila— crear una rama, abrir el PR y **encolar el auto-merge**.
- **Con qué permisos.** `contents: write` (crear rama y commits) y
  `pull-requests: write` (abrir el PR). La propia Action abre el PR; no hace
  falta una acción de terceros para ello.

:::caution[Sobre el token de suscripción]
`CLAUDE_CODE_OAUTH_TOKEN` (de `claude setup-token`) tiene una validez larga
(del orden de **un año**) y consume **los límites de uso de tu suscripción**: el
trabajo del bot cuenta contra tu cuota de Pro/Max, no es un canal aparte. Tenlo
en cuenta si el bot compite con tu uso interactivo.
:::

## La gobernanza elegida: PR + auto-merge si CI verde

La decisión de diseño de este proyecto es **autonomía con red de seguridad**:

- **Nunca commit directo a `main`.** Todo cambio autónomo entra por **Pull
  Request**. Eso da **trazabilidad** (cada mejora es un PR con su diff y su
  justificación) y **rollback** (revertir un PR es trivial).
- **Auto-merge condicionado al CI.** El PR se encola con
  `gh pr merge --auto --squash` y **solo se fusiona cuando el job `build` de CI
  pasa**. Si el build falla, el PR **no** se fusiona: queda abierto como señal de
  que algo hay que revisar.
- **Preferir no tocar antes que degradar.** Si en una ejecución no hay ninguna
  mejora sólida y verificable, el bot **no abre ningún PR**.

Para que ese auto-merge sea real, `main` debe estar **protegida** exigiendo el
check `build`. El CI es la puerta; el bot no puede saltársela.

:::danger[El detalle que rompe el ciclo si lo ignoras]
Los Pull Requests abiertos con el `GITHUB_TOKEN` por defecto **no disparan otros
workflows** (es una protección de GitHub contra bucles recursivos de Actions).
Consecuencia: si el bot abre el PR con `GITHUB_TOKEN`, **el CI `build` nunca se
ejecuta**, el required check nunca se cumple y **el auto-merge nunca ocurre**.

La solución es abrir el PR con una identidad que **sí** dispara workflows:

- la **GitHub App de Claude** (instalada con `/install-github-app`), o
- un **PAT de grano fino** guardado como secret `BOT_GH_TOKEN`.

Por eso el workflow usa `github_token: ${{ secrets.BOT_GH_TOKEN || secrets.GITHUB_TOKEN }}`:
si defines `BOT_GH_TOKEN`, el PR **disparará** el CI del que depende el
auto-merge; si no, cae al `GITHUB_TOKEN` y el ciclo se queda a medias.
:::

## Configuración única (lo que hace el humano una sola vez)

El bot es autónomo en operación, pero **necesita que un humano lo prepare una
vez**. Estos pasos son manuales y se hacen una sola vez:

1. **Genera el token de suscripción** en tu máquina:

   ```bash
   claude setup-token
   ```

2. **Guarda el secret** `CLAUDE_CODE_OAUTH_TOKEN` en el repositorio
   (*Settings → Secrets and variables → Actions → New repository secret*) con el
   valor del paso 1.

3. **Habilita una identidad que dispare workflows.** Elige una:
   - instala la **GitHub App de Claude** ejecutando `/install-github-app` en
     Claude Code, **o**
   - crea un **PAT de grano fino** (con permisos de *contents* y *pull requests*
     sobre este repo) y guárdalo como secret `BOT_GH_TOKEN`.

4. **Activa GitHub Pages con Actions:** *Settings → Pages → Source = GitHub
   Actions* (necesario para que `deploy.yml` publique el sitio).

5. **Permite que Actions cree y apruebe PRs:** *Settings → Actions → General →
   Workflow permissions →* marca *«Allow GitHub Actions to create and approve
   pull requests»*.

6. **Habilita el auto-merge del repositorio:** *Settings → General → Pull
   Requests →* activa *«Allow auto-merge»* (sin esto, `gh pr merge --auto` no
   tiene efecto).

7. **Protege `main` exigiendo el check `build`:** *Settings → Branches → Add
   branch protection rule* para `main`, requiriendo el status check **`build`**
   (el del `ci.yml`). Esa es la puerta que condiciona el auto-merge.

:::tip
Haz estos siete pasos **antes** de confiar en el cron. Sin el paso 3, el CI no
corre; sin el 5/6/7, el auto-merge no ocurre; sin el 4, el sitio no se publica.
:::

## Límites honestos (léelos)

La autonomía es real, pero no es magia. Sé consciente de estos *caveats*:

- **Los cron pueden fallar el chequeo OIDC de escritura.** Hay reportes en el
  issue tracker de `anthropics/claude-code-action` de ejecuciones **programadas**
  (a diferencia de las manuales) que fallan validaciones de token/permisos de
  escritura. No lo des por infalible.
- **Valida con `workflow_dispatch` antes de confiar del todo.** Lanza el workflow
  a mano desde la pestaña *Actions* al menos una vez y comprueba de punta a punta:
  que abre el PR, que el CI `build` se dispara, que el auto-merge se activa y que
  el merge desencadena el `deploy`. Solo entonces déjalo en piloto automático.
- **El bot compite por tu cuota.** Como usa tu suscripción (ver aviso arriba), un
  bot muy activo puede comerse límites que quieres para tu trabajo interactivo.
- **Revisa los PRs de vez en cuando.** Auto-merge si CI verde significa que un
  cambio *que compila* se fusiona sin ojos humanos. El CI garantiza que el sitio
  **construye**, no que cada matiz sea perfecto. La red de seguridad última sigue
  siendo tu revisión ocasional y el rollback por PR.

## Relación con el resto del ciclo

Este bot es el motor de la [Documentación viva](../documentacion-viva/):
lo que fusiona se publica solo vía `deploy.yml`. Cada ejecución que aporta algo
deja constancia en el [Registro de evolución](../registro-evolucion/).
