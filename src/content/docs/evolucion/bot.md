---
title: El bot de auto-mejora
description: Cómo funciona el agente de GitHub Actions que mantiene y mejora la documentación.
---

Esta documentación no se mantiene sola por casualidad. Un agente la cuida.
Es un bot que revisa, sincroniza y mejora la doc de forma autónoma, con una
única puerta de calidad que evita que se desvíe.

## El mecanismo, a alto nivel

Todo arranca desde un **workflow programado** de GitHub Actions. Se dispara por
`cron` varias veces por semana (dos o más). No espera a que alguien empuje un
commit: trabaja por su cuenta, en su horario.

El workflow usa la **GitHub Action oficial de Claude Code**
(`anthropics/claude-code-action`). Esa acción lleva un agente de IA dentro del
pipeline y le da acceso al repositorio.

## Autenticación con tu suscripción

El agente se autentica con tu **suscripción Claude Pro o Max**, no con pago por
uso. La clave es un token OAuth guardado como secret del repositorio:
`CLAUDE_CODE_OAUTH_TOKEN`. Lo generas una vez con el comando
`claude setup-token`.

¿Alternativa? Si prefieres la API por uso, puedes usar `ANTHROPIC_API_KEY` en
su lugar.

## El único paso humano

Aquí está lo importante: **el único paso manual es dejar ese secret
configurado**. Una vez está, el bot se ocupa del resto. Nadie tiene que lanzar
nada a mano cada semana.

## Qué hace en cada ejecución

En cada disparo el agente sigue el mismo ciclo:

1. **Sincroniza** la documentación con la plantilla, para que no se quede atrás.
2. **Investiga mejoras** del método de trabajo (el flujo estilo Uncle Bob).
3. **Abre un Pull Request** con los cambios y explica el porqué de cada uno.
4. **La CI construye el sitio y valida.** Si pasa en verde, el PR se
   **auto-mergea**. Si algo falla, queda **para revisión** humana.

Ese ciclo es el mismo espíritu del arnés: agentes que proponen, y una puerta
que decide. Como recuerda el método, "el review es el juego entero".

:::caution[Un bucle autónomo necesita una puerta]
Un bot que se auto-mejora sin control puede derivar o alucinar con el tiempo.
La **CI en verde** es esa puerta de calidad: solo se fusiona lo que construye y
valida bien. Sin ella, no hay auto-merge. Con ella, el bucle se mantiene
honesto.
:::

## El bucle del agente: quién ejecuta las herramientas

Cuando el workflow dispara `claude-code-action`, ese agente no es un modelo
suelto que "hace cosas": corre dentro del **agent loop** de Claude Code. El
modelo nunca toca el disco ni la red directamente. En cada turno decide *qué*
herramienta usar (`Bash`, `Edit`, `Read`…) y con qué parámetros; quien la
**ejecuta de verdad** es el proceso que lo envuelve — aquí, el runner de
GitHub Actions con el CLI de Claude Code dentro.

La documentación oficial del Agent SDK (la misma librería que da forma al CLI)
marca esta frontera con un contraste explícito entre usar la API a pelo y usar
el SDK:

```python
# Client SDK: tú implementas el bucle de herramientas
response = client.messages.create(...)
while response.stop_reason == "tool_use":
    result = your_tool_executor(response.tool_use)  # tu código ejecuta
    response = client.messages.create(tool_result=result, **params)

# Agent SDK: Claude maneja las herramientas de forma autónoma
async for message in query(prompt="Fix the bug in auth.py"):
    print(message)
```

En ambos casos la ejecución real ocurre en `your_tool_executor` — nunca dentro
del modelo. El Agent SDK simplemente automatiza ese bucle por ti, pero sigue
corriendo "dentro de tu propio proceso", como dice la propia documentación.

Esto conecta directo con el segundo pilar de Harness Engineering (ver
[Qué es el arnés SDD](/DocsTemplateSSDUncleBob/empezar/que-es/)): la
orquestación multiagente de este proyecto —`craftsman_lead` lanzando a
`spec_partner`, `gherkin_author`, `tdd_craftsman`, `judge`,
`mutation_tester`— también es el arnés (aquí, Claude Code) el que ejecuta cada
subagente y le pasa el resultado, nunca un modelo decidiendo por su cuenta
fuera de esa frontera.

> Fuente: Anthropic, [«Agent SDK overview»](https://code.claude.com/docs/en/agent-sdk/overview),
> sección "Agent SDK vs Client SDK".

## Dónde vive la configuración

La configuración detallada del workflow vive en **`.github/workflows`** dentro
del repositorio de la documentación. Ahí están el `cron`, la acción de Claude
Code y los pasos de build y validación.

Si quieres entender el flujo humano detrás del arnés, mira cómo encaja con el
[método](/DocsTemplateSSDUncleBob/metodo/tdd/) que este bot ayuda a difundir.
