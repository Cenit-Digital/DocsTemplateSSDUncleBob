// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Documentación viva del método "Arnés SSD de Uncle Bob (edición artesano)".
// Despliegue: GitHub Pages como project page.
//   URL final = site + base + '/'  ->  https://cenit-digital.github.io/DocsTemplateSSDUncleBob/
//   `site` = origen github.io (host en minúsculas, sin ruta).
//   `base` = nombre del repo con barra inicial y SIN barra final.
// https://astro.build/config
export default defineConfig({
	site: 'https://cenit-digital.github.io',
	base: '/DocsTemplateSSDUncleBob',
	integrations: [
		starlight({
			title: 'Arnés SSD · Uncle Bob',
			// Español como idioma raíz (sin prefijo /es/). i18n-ready: para añadir
			// inglés más adelante, agrega `en: { label: 'English', lang: 'en' }`.
			defaultLocale: 'root',
			locales: {
				root: { label: 'Español', lang: 'es' },
			},
			social: [
				{
					icon: 'github',
					label: 'GitHub (plantilla)',
					href: 'https://github.com/Cenit-Digital/TemplateSSDUncleBob',
				},
			],
			editLink: {
				baseUrl:
					'https://github.com/Cenit-Digital/DocsTemplateSSDUncleBob/edit/main/',
			},
			lastUpdated: true,
			sidebar: [
				{
					label: 'Inicio',
					items: [{ label: 'Presentación', slug: 'index' }],
				},
				{
					label: 'Fundamentos',
					items: [
						{ label: '¿Qué es Harness Engineering?', slug: 'fundamentos/harness-engineering' },
						{ label: 'El método de un vistazo', slug: 'fundamentos/el-metodo' },
						{ label: 'SDD: la spec conversada', slug: 'fundamentos/sdd' },
						{ label: 'Gherkin: el contrato ejecutable', slug: 'fundamentos/gherkin' },
						{ label: 'TDD estricto', slug: 'fundamentos/tdd' },
						{ label: 'El review es el juego', slug: 'fundamentos/review' },
						{ label: 'Prueba de mutación', slug: 'fundamentos/mutacion' },
						{ label: 'La puerta de aprobación humana', slug: 'fundamentos/puerta-humana' },
					],
				},
				{
					label: 'Los agentes',
					items: [
						{ label: 'Los seis agentes', slug: 'agentes/vision-general' },
						{ label: 'craftsman_lead', slug: 'agentes/craftsman-lead' },
						{ label: 'spec_partner', slug: 'agentes/spec-partner' },
						{ label: 'gherkin_author', slug: 'agentes/gherkin-author' },
						{ label: 'tdd_craftsman', slug: 'agentes/tdd-craftsman' },
						{ label: 'judge', slug: 'agentes/judge' },
						{ label: 'mutation_tester', slug: 'agentes/mutation-tester' },
					],
				},
				{
					label: 'Referencia',
					items: [
						{ label: 'Estructura y artefactos', slug: 'referencia/estructura' },
						{ label: 'Checkpoints (C1–C7)', slug: 'referencia/checkpoints' },
						{ label: 'Verificación', slug: 'referencia/verificacion' },
						{ label: 'Adaptar a otro lenguaje', slug: 'referencia/stack-adapter' },
					],
				},
				{
					label: 'La plantilla',
					items: [
						{ label: 'Cómo usar la plantilla', slug: 'plantilla/como-usar' },
						{ label: 'El ejemplo: notes-cli', slug: 'plantilla/ejemplo-notes-cli' },
					],
				},
				{
					label: 'El ciclo virtuoso',
					items: [
						{ label: 'Documentación viva', slug: 'ciclo-virtuoso/documentacion-viva' },
						{ label: 'Auto-mejora autónoma', slug: 'ciclo-virtuoso/auto-mejora' },
						{ label: 'Registro de evolución', slug: 'ciclo-virtuoso/registro-evolucion' },
					],
				},
				{
					label: 'Fuentes',
					items: [{ label: 'Atribución y fuentes', slug: 'fuentes/atribucion' }],
				},
			],
		}),
	],
});
