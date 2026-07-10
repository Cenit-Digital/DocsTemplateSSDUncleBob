# DocsTemplateSSDUncleBob — Documentación viva y agéntica

Documentación **viva** del arnés SDD "Uncle Bob"
([`Cenit-Digital/TemplateSSDUncleBob`](https://github.com/Cenit-Digital/TemplateSSDUncleBob)),
hecha con [Astro Starlight](https://starlight.astro.build/es/) y desplegada en
**GitHub Pages**:

> **https://cenit-digital.github.io/DocsTemplateSSDUncleBob/**

Es "viva" en dos sentidos: se **despliega sola** en cada push a `main`, y un
**bot de IA la mejora de forma autónoma** dos veces por semana (ver más abajo).

## Desarrollo local

```bash
npm install
npm run dev       # http://localhost:4321/DocsTemplateSSDUncleBob
npm run build     # build de producción (la puerta de calidad de la CI)
npm run preview
```

Requiere **Node.js ≥ 18** (recomendado 22).

## Despliegue (GitHub Pages)

`.github/workflows/deploy.yml` construye el sitio con la action oficial de Astro
y lo publica en Pages en cada push a `main`.

**Paso humano único de Pages:** en el repo, `Settings → Pages → Build and
deployment → Source: GitHub Actions`.

## El ciclo virtuoso: auto-mejora autónoma

`.github/workflows/autonomous-improve.yml` ejecuta un agente de Claude (Claude
Code Action) **martes y viernes**. Cada ejecución:

1. Sincroniza la documentación con la plantilla.
2. Investiga mejoras (fuentes oficiales) y desarrolla una mejora concreta del
   método o de su exposición.
3. Registra el cambio en el *Registro de evolución*.
4. Verifica que `npm run build` pasa en verde.
5. Abre un **Pull Request** y activa el **auto-merge**: sólo se integra si la
   **CI (`ci.yml`) pasa en verde**. Puedes **vetar** cerrando el PR.

Protocolo completo del agente: [`.github/AUTONOMOUS.md`](.github/AUTONOMOUS.md).

### Configuración humana única (para activar el bot)

1. **Genera un token OAuth de tu suscripción Claude Pro/Max** en tu terminal:

   ```bash
   claude setup-token
   ```

2. En el repo: `Settings → Secrets and variables → Actions → New repository
   secret`, nombre **`CLAUDE_CODE_OAUTH_TOKEN`**, valor el token generado.
   (Alternativa: `ANTHROPIC_API_KEY` con una clave de API de pago.)

3. Para el auto-merge: `Settings → General → Pull Requests → Allow auto-merge`
   activado, y una regla de protección de `main` que exija el check **`build`**
   de la CI. *(Estos dos ajustes ya vienen configurados en este repositorio.)*

A partir de ahí, el ciclo funciona **sin intervención humana** salvo el veto.

## Créditos

Método de **Robert C. Martin (Uncle Bob)**, destilado por **BettaTech**.
Documentación y generalización por **Cenit Digital**. Contenido MIT.
