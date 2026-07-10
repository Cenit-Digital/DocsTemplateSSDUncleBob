# Instrucciones para Claude — DocsTemplateSSDUncleBob

Este repositorio es la **documentación viva** del arnés SDD "Uncle Bob"
(plantilla en [`Cenit-Digital/TemplateSSDUncleBob`](https://github.com/Cenit-Digital/TemplateSSDUncleBob)).
Sitio hecho con **Astro Starlight**, en **español**, desplegado en **GitHub Pages**.

## Comandos

- `npm install` — dependencias.
- `npm run dev` — servidor de desarrollo (http://localhost:4321/DocsTemplateSSDUncleBob).
- `npm run build` — build de producción. **Debe pasar en verde** (falla ante
  enlaces internos rotos, frontmatter inválido o MDX mal formado). Es la puerta
  de calidad de la CI y del auto-merge.
- `npm run preview` — sirve el build.

## Estructura

- `astro.config.mjs` — configuración de Starlight: `site` + `base` para GitHub
  Pages (`/DocsTemplateSSDUncleBob`), idioma español y el `sidebar`. **Si añades
  una página, enlázala en el sidebar.**
- `src/content/docs/**` — las páginas (`.md`/`.mdx`) con frontmatter
  `title` + `description`.
- `.github/workflows/` — `deploy.yml` (Pages), `ci.yml` (build gate),
  `autonomous-improve.yml` (el bot).
- `.github/AUTONOMOUS.md` — protocolo del bot de auto-mejora.

## Reglas de contenido

- **Español**, tono claro y técnico. Frases cortas.
- **No inventes.** Toda afirmación se apoya en la plantilla o en documentación
  oficial citada con enlace.
- **Enlaces internos** con el base: `/DocsTemplateSSDUncleBob/<ruta>/`.
- Antes de dar por terminado cualquier cambio: `npm run build` en verde.

## El bot de auto-mejora

Ver `.github/AUTONOMOUS.md`. Si actúas como ese agente, sigue ese protocolo:
trabaja por PR, no rompas el build, cita fuentes, cambios pequeños, registra en
`src/content/docs/evolucion/changelog.md`.
