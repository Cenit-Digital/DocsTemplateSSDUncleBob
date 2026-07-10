# DocsTemplateSSDUncleBob — Documentación viva y auto-mejorable

Documentación **viva, siempre actualizada y auto-mejorable** del método
**"Arnés SSD de Uncle Bob (edición artesano)"**, la forma de trabajo que
implementa la plantilla [`TemplateSSDUncleBob`](https://github.com/Cenit-Digital/TemplateSSDUncleBob).

**Sitio publicado:** https://cenit-digital.github.io/DocsTemplateSSDUncleBob/

Construido con [Astro](https://astro.build) + [Starlight](https://starlight.astro.build),
desplegado en **GitHub Pages** y mantenido al día por un **bot autónomo de Claude**
dos veces por semana (ciclo virtuoso: investiga el estado del arte → propone una
mejora acotada → abre un PR → auto-merge si el CI pasa).

> El repositorio contiene la fuente de la documentación (`src/content/docs/`),
> no la web construida. El contenido y la gobernanza del bot están descritos en
> el propio sitio, en la sección **El ciclo virtuoso**.

---

## Comandos

Desde la raíz del proyecto:

| Comando           | Acción                                             |
| :---------------- | :------------------------------------------------- |
| `npm install`     | Instala dependencias                               |
| `npm run dev`     | Servidor local en `localhost:4321`                 |
| `npm run build`   | Construye el sitio de producción en `./dist/`      |
| `npm run preview` | Previsualiza la build antes de desplegar           |

Node 20+ recomendado (probado con Node 22). Astro `^7`, `@astrojs/starlight` `^0.41`.

---

## Cómo se despliega

`.github/workflows/deploy.yml` construye el sitio con `withastro/action` y lo
publica en GitHub Pages en cada push a `main`. La configuración de despliegue
(`site`, `base`) vive en `astro.config.mjs`.

`.github/workflows/ci.yml` (job **`build`**) compila la documentación en cada
Pull Request: es la **puerta de calidad** de la que depende el auto-merge.

---

## El bot autónomo (ciclo virtuoso)

`.github/workflows/self-improve.yml` se ejecuta **los lunes y jueves a las 05:30
UTC** (`cron: '30 5 * * 1,4'`). Claude lee `CLAUDE.md` (su manual de operación),
investiga el estado del arte en fuentes oficiales, aplica **una** mejora acotada
a la documentación/método, actualiza el registro de evolución, verifica que el
sitio compila, abre un Pull Request y encola el auto-merge. **Gobernanza:** PR +
auto-merge si el CI (`build`) está verde; nunca commit directo a `main`.

### Configuración única (lo que haces tú una vez)

Todo lo demás es autónomo. Solo hay que dejarlo configurado:

1. **Token de suscripción.** En tu máquina, ejecuta `claude setup-token`
   (requiere plan Pro/Max/Team/Enterprise) y copia el token de un año que
   imprime (empieza por `sk-ant-oat01-`).
2. **Secret del modelo.** En el repo → *Settings → Secrets and variables →
   Actions → New repository secret* → nombre **`CLAUDE_CODE_OAUTH_TOKEN`**,
   valor el token anterior. *(Alternativa de pago por uso: usa un secret
   `ANTHROPIC_API_KEY` y cámbialo en `self-improve.yml`.)*
3. **Que el PR del bot dispare el CI.** Los PR abiertos con el `GITHUB_TOKEN`
   por defecto **no** disparan otros workflows, así que instala la **GitHub App
   de Claude** (ejecuta `/install-github-app` en Claude Code) **o** crea un
   *fine-grained PAT* (permisos Contents + Pull requests: write) y guárdalo como
   secret **`BOT_GH_TOKEN`**. Sin esto, el CI no correría sobre el PR del bot y
   el auto-merge esperaría indefinidamente.
4. **GitHub Pages.** *Settings → Pages → Build and deployment → Source =
   "GitHub Actions"*.
5. **Permitir PRs de Actions.** *Settings → Actions → General → Workflow
   permissions* → activa **"Allow GitHub Actions to create and approve pull
   requests"**.
6. **Auto-merge.** *Settings → General* → activa **"Allow auto-merge"**
   (o `gh repo edit Cenit-Digital/DocsTemplateSSDUncleBob --enable-auto-merge`).
7. **Protección de rama.** Protege `main` exigiendo el check de estado
   **`build`** (*Settings → Branches → Add rule*), para que el auto-merge espere
   a que el CI pase.

Prueba manual antes de confiar en el cron: pestaña **Actions → Auto-mejora del
método → Run workflow** (`workflow_dispatch`).

> Nota honesta: hay reportes en el issue tracker de `anthropics/claude-code-action`
> de que los disparadores `cron` pueden fallar el chequeo de acceso de escritura
> vía OIDC; valida una ejecución manual antes de dejarlo desatendido. El token de
> suscripción caduca a ~1 año: regénéralo con `claude setup-token`.

---

## Créditos

Método inspirado en las ideas de **Robert C. Martin (Uncle Bob)** y en el trabajo
de **BettaTech** ([betta-tech/harness-sdd](https://github.com/betta-tech/harness-sdd)).
La atribución detallada y la honestidad sobre qué es cita literal y qué es
paráfrasis están en la sección **Fuentes** del sitio.
