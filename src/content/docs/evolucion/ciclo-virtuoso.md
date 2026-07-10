---
title: 'El ciclo virtuoso: documentación viva'
description: Cómo esta documentación se mantiene viva y mejora el método de forma autónoma.
---

Esta documentación no es un manual congelado. Es **documentación viva**: se revisa, se amplía y se corrige a sí misma. Y lo hace de forma agéntica, casi sin humanos.

La idea es sencilla. Los modelos de IA punteros ya se entrenan, en parte, con datos sintéticos generados por el modelo estado-del-arte del momento. El sistema se alimenta de su propia mejor versión y sube un peldaño. Aquí aplicamos ese mismo bucle a la documentación de un método.

## Qué significa "viva y agéntica"

El [README](https://cenit-digital.github.io/DocsTemplateSSDUncleBob/) ya apunta la idea: *"Documentación viva y ampliada"*. No es una etiqueta bonita. Un bot de GitHub trabaja sobre este repositorio de forma continua.

Su trabajo tiene tres partes:

- **Revisa y amplía** la documentación al menos dos veces por semana.
- **Investiga** desarrollos recientes: nuevos modelos, mejores prácticas de SDD (spec-driven development) y de agentes.
- **Propone** mejoras al propio método a partir de lo que encuentra.

No espera a que alguien le pida nada. Observa, aprende y sugiere.

## Por qué esto tiene sentido

El método de Uncle Bob que documentamos se apoya en una idea central: los agentes producen, y el juicio poda. En el pipeline, el paso de `judge` es donde se decide qué sobrevive. *"el review es el juego entero"*.

El ciclo virtuoso lleva esa misma filosofía un nivel más arriba. El bot **borra la línea entre escribir el método y usarlo**: genera propuestas (produce) y las somete a una puerta de calidad (poda). El método se mejora con el método.

## La válvula de seguridad

Autonomía no es barra libre. Aquí está el freno.

El bot nunca escribe directamente en la rama principal. Abre **Pull Requests**. Y esos PR **solo se auto-mergean si la CI pasa en verde**. La CI no es otra cosa que el propio arnés: init más prueba de mutación sobre los ejemplos, tal como describe el flujo del proyecto.

Es decir: el mismo arnés que verifica el código verifica la evolución de la documentación. Si una propuesta rompe algo, no entra.

Y por encima de todo queda el humano. Puede **vetar** cualquier Pull Request. El sistema funciona sin participación humana salvo la configuración inicial, pero el control final de aprobación sigue siendo humano, igual que la única puerta de aprobación del pipeline.

## En resumen

- El repositorio se auto-mejora, como un modelo que aprende de su mejor versión.
- Un bot revisa, investiga y propone, al menos dos veces por semana.
- Las propuestas viajan como PR y solo entran si la CI (el arnés) está en verde.
- El humano puede vetar; no necesita hacer nada más.

Los detalles técnicos del workflow (cómo se dispara, qué acciones ejecuta) se explican aparte, en [El bot de auto-mejora](/DocsTemplateSSDUncleBob/evolucion/bot/).
