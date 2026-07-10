# Protocolo del agente de auto-mejora

> Este archivo es el contrato operativo del bot que mantiene viva y mejora esta
> documentación (ver `.github/workflows/autonomous-improve.yml`). El agente lo
> lee al empezar cada ejecución y lo sigue al pie de la letra.

## Objetivo

Que esta documentación sea una referencia **viva** y que el **método** SDD
"Uncle Bob" **mejore con el tiempo de forma autónoma**, igual que un modelo se
entrena con datos sintéticos del estado del arte. Sin intervención humana salvo
la configuración inicial (el secret `CLAUDE_CODE_OAUTH_TOKEN`).

## Gobernanza (no negociable)

- Trabajas **por Pull Request**, nunca directo a `main`.
- El PR sólo se integra si la **CI (`astro build`) pasa en verde** (puerta de
  calidad objetiva). Activa el auto-merge; no lo fuerces si la CI falla.
- El humano puede **vetar** cerrando el PR o desactivando el workflow.
- **Cambios pequeños y revisables.** Un tema por ejecución. Prefiere profundidad
  sobre amplitud. Nada de reescrituras masivas.

## Protocolo por ejecución

1. **Orientación.** Lee `README.md`, `CLAUDE.md`, este archivo y
   `src/content/docs/evolucion/changelog.md` (qué se hizo ya; no repitas).
2. **Sincronización con la plantilla.** Revisa el repo
   [`Cenit-Digital/TemplateSSDUncleBob`](https://github.com/Cenit-Digital/TemplateSSDUncleBob)
   (su `README`, `docs/`, agentes, `harness.config.json`). Si el método cambió
   allí, refleja el cambio aquí. La documentación no debe contradecir la plantilla.
3. **Investigación (con fuentes oficiales).** Busca desarrollos recientes que
   mejoren el método o su exposición: nuevos modelos de Claude, buenas prácticas
   de SDD / ingeniería de arnés, mutación, Astro Starlight. **Cita siempre la
   fuente oficial** (enlace). Si no encuentras nada sólido, mejora la claridad de
   lo que ya hay: no inventes novedades.
4. **Una mejora concreta.** Elige UNA del backlog (abajo) o una que detectes.
   Aplícala: amplía una página, aclara un concepto, añade un ejemplo, corrige una
   imprecisión, o **propón una mejora del método** (razonada y con fuente).
5. **Registro.** Añade una entrada a `evolucion/changelog.md` con fecha (usa la
   fecha real del sistema), resumen, motivo y enlaces a las fuentes.
6. **Verificación.** Ejecuta `npm run build`. **Debe pasar en verde.** Si falla,
   arréglalo antes de continuar (enlaces rotos, frontmatter, MDX inválido).
7. **Pull Request.** Crea la rama `auto-mejora/AAAA-MM-DD`, commitea, empújala y
   abre el PR con un cuerpo que explique el qué, el porqué y las fuentes. Luego
   `gh pr merge --auto --squash <n>` para activar el auto-merge en verde.

## Raíles de seguridad

- **No alucines.** Toda afirmación técnica va respaldada por el repo, la
  plantilla o documentación oficial citada.
- **No toques** `.github/workflows/*`, secretos, ni la configuración de despliegue
  salvo que el objetivo explícito sea mejorarlos (y con extremo cuidado).
- **No borres** contenido en bloque. Amplía o refina.
- **Coherencia:** respeta el tono (español, claro, técnico) y la estructura del
  `sidebar` de `astro.config.mjs`. Si añades una página, enlázala en el sidebar.
- **Idempotencia:** si no hay una mejora clara y con fundamento, haz una mejora
  pequeña de claridad y regístrala; no fuerces cambios artificiales.

## Backlog de mejoras (ideas fundamentadas)

Direcciones sólidas extraídas de las fuentes del método (playlist de BettaTech).
Desarrolla una por ejecución, con su fuente:

- **Loop Engineering**: bucle abierto vs cerrado; *human-in-the-loop* vs
  *human-on-the-loop*; su relación con el arnés.
- **Harness Engineering — los 3 pilares**: repositorio como sistema, orquestación
  multiagente, verificación (que se autovalida y automejora).
- **"Más herramientas = peor rendimiento"**: el caso del agente d0 de Vercel
  (menos tools especializadas, utilidades Unix simples → más velocidad, menos
  tokens). Implicación para el diseño de agentes del arnés.
- **Degradación de contexto**: por qué sacar estado a ficheros (memoria externa)
  y limpiar el contexto pronto; conexión con la regla anti-teléfono-descompuesto.
- **Niveles de SDD** (Martin Fowler / Birgitta Böckeler): *spec-first*,
  *spec-anchor*, *spec-as-source*; dónde se sitúa este arnés.
- **El agent loop**: bucle REPL externo + bucle agéntico interno; las tools las
  ejecuta el arnés, no la LLM.
- **Notación EARS** para requisitos y su traducción directa a tests.
- **Comparativa de herramientas SDD**: Kiro, Spec Kit (GitHub), Tessl.
- **Mutación de producción**: guías por stack (StrykerJS, mutmut, PIT, cargo-mutants…).
- **Nuevos modelos**: cuando salga un modelo Claude superior, actualizar el
  `--model` del bot y las referencias.

> Regla de oro: el objetivo no es cambiar por cambiar, sino que cada semana la
> documentación explique el método **mejor** y, cuando haya evidencia, lo **mejore**.
