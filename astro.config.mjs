// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Documentación viva del arnés SDD "Uncle Bob".
// Se despliega en GitHub Pages: https://cenit-digital.github.io/DocsTemplateSSDUncleBob/
export default defineConfig({
  site: 'https://cenit-digital.github.io',
  base: '/DocsTemplateSSDUncleBob',
  integrations: [
    starlight({
      title: 'Arnés SDD · Uncle Bob',
      description:
        'Documentación viva del arnés de desarrollo con IA estilo Robert C. Martin (Uncle Bob): spec conversada → Gherkin → TDD estricto → review → mutación. Agnóstico al lenguaje.',
      defaultLocale: 'root',
      locales: {
        root: { label: 'Español', lang: 'es' },
      },
      social: [
        {
          icon: 'github',
          label: 'Plantilla',
          href: 'https://github.com/Cenit-Digital/TemplateSSDUncleBob',
        },
      ],
      editLink: {
        baseUrl:
          'https://github.com/Cenit-Digital/DocsTemplateSSDUncleBob/edit/main/',
      },
      lastUpdated: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      sidebar: [
        {
          label: 'Empezar',
          items: [
            { label: 'Introducción', slug: 'empezar/introduccion' },
            { label: 'Qué es el arnés SDD', slug: 'empezar/que-es' },
            { label: 'Instalación y uso', slug: 'empezar/uso' },
          ],
        },
        {
          label: 'El método Uncle Bob',
          items: [
            { label: 'El flujo completo', slug: 'metodo/flujo' },
            { label: '1 · Spec conversada', slug: 'metodo/spec' },
            { label: '2 · Gherkin (el contrato)', slug: 'metodo/gherkin' },
            { label: '3 · TDD estricto', slug: 'metodo/tdd' },
            { label: '4 · El juez (review)', slug: 'metodo/judge' },
            { label: '5 · Prueba de mutación', slug: 'metodo/mutacion' },
            { label: 'La puerta humana', slug: 'metodo/puerta-humana' },
            { label: 'Handoffs y estado en disco', slug: 'metodo/handoffs' },
          ],
        },
        {
          label: 'Los agentes',
          items: [{ label: 'Los 6 + 3 agentes', slug: 'agentes/agentes' }],
        },
        {
          label: 'Configuración agnóstica',
          items: [
            { label: 'harness.config.json', slug: 'configuracion/config' },
            { label: 'Adaptadores por stack', slug: 'configuracion/adaptadores' },
          ],
        },
        {
          label: 'Ejemplos verificados',
          items: [
            { label: 'Python (notes-cli)', slug: 'ejemplos/python' },
            { label: 'Node/JS (notes-cli)', slug: 'ejemplos/node' },
          ],
        },
        {
          label: 'Evolución autónoma',
          items: [
            { label: 'El ciclo virtuoso', slug: 'evolucion/ciclo-virtuoso' },
            { label: 'El bot de auto-mejora', slug: 'evolucion/bot' },
            { label: 'Registro de evolución', slug: 'evolucion/changelog' },
          ],
        },
        {
          label: 'Referencia',
          items: [
            { label: 'Checkpoints (C1–C7)', slug: 'referencia/checkpoints' },
            { label: 'Preguntas frecuentes', slug: 'referencia/faq' },
            { label: 'Créditos y fuentes', slug: 'referencia/creditos' },
          ],
        },
      ],
    }),
  ],
});
