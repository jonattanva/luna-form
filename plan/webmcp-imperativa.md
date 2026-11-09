# Plan: WebMCP imperativo en luna-form

Estado: propuesta, sin implementar. Escrito el 2026-11-08.

Objetivo: que un formulario de luna pueda exponerse como herramientas
(_tools_) para agentes de IA con la API imperativa de WebMCP
(`document.modelContext.registerTool`), generadas desde la misma definición
JSON que ya lo renderiza y lo valida, sin código extra por formulario y sin
costo alguno donde el navegador no tiene la API.

## 1. Qué ofrece la API imperativa

Según la especificación (borrador de Community Group del 2 de noviembre de 2026) y la documentación de Chrome:

```webidl
partial interface Document {
  [SecureContext, SameObject] readonly attribute ModelContext modelContext;
};

interface ModelContext : EventTarget {
  Promise<undefined> registerTool(ModelContextTool tool, optional ModelContextRegisterToolOptions options = {});
  Promise<sequence<RegisteredTool>> getTools(optional ModelContextGetToolOptions options = {});
  Promise<DOMString> executeTool(RegisteredTool tool, optional object inputObject, optional ModelContextExecuteToolOptions options = {});
  attribute EventHandler ontoolchange;
  attribute EventHandler ontoolactivated;
  attribute EventHandler ontoolcancel;
};

dictionary ModelContextTool {
  required DOMString name;
  USVString title;
  required DOMString description;
  object inputSchema;
  object outputSchema;
  required ToolExecuteCallback execute; // (inputObject, { signal }) => Promise<any>
  ToolAnnotations annotations;          // readOnlyHint, untrustedContentHint, consequentialHint, debugging
};
```

Lo que importa para el diseño:

- **Desregistro:** no hay `unregisterTool()`. Se pasa `{ signal }` al
  registrar y se aborta. Desde Chrome 153 abortar no corta una ejecución en
  curso.
- **Resultado:** `execute` devuelve cualquier valor serializable. La guía de
  Chrome recomienda devolver los errores recuperables como datos, no lanzar, para
  que el agente se corrija.
- **Validación:** no hay que contar con que el navegador valide la entrada
  contra `inputSchema` ni aplique valores por defecto. Se valida en `execute`.
- **Anotaciones:** `consequentialHint` marca acciones significativas o
  irreversibles, para que el agente o el navegador pidan confirmación.
  `untrustedContentHint` marca salidas con contenido externo o de usuarios.
- **Restricciones:** solo en contexto seguro (localhost lo es).
  Permissions-Policy `tools`, por defecto `self`. Los tools no son visibles
  desde otros orígenes salvo con `exposedTo`.
- **Estado:** origin trial desde Chrome 149. En local, con
  `chrome://flags/#enable-webmcp-testing`. La API ya cambió (de `navigator` a
  `document.modelContext`, desregistro por `AbortSignal`, deprecaciones en
  Chrome 155 y 156) y va a seguir cambiando.

## 2. Objetivos y no objetivos

Objetivos:

1. Un `Form` del cliente registra, si el autor lo pide, dos tools: uno que
   rellena el formulario y otro que lo envía.
2. El esquema de entrada sale de la definición: mismos nombres, tipos, opciones,
   obligatoriedad y límites que valida el submit.
3. Los valores que escribe un agente pasan por el mismo camino que los del
   usuario: transformaciones, eventos `value`, `state` y `source`, validación
   y aviso al host con `onValueChange`.
4. El agente recibe errores estructurados por campo y puede corregirse.
5. Costo cero donde no se usa: sin la prop, o sin `document.modelContext`, no se
   descarga, no se registra nada y no cambia ningún render.

No objetivos, al menos en las fases 0 y 1:

- La API declarativa (atributos `toolname` en el `<form>`). Infiere el esquema
  de controles nativos y rellena el DOM, y la mayoría de los widgets de luna son
  personalizados. Queda como posible fase posterior para la entrada de servidor.
- Exponer tools a otros orígenes (`exposedTo`).
- Tools de autoría en el editor, como `set_definition`. Se evalúan en la fase 2.

## 3. Diseño

### 3.1 Vista general

```
definición JSON ──► buildToolSchema (core) ──► inputSchema
                                               │
Form agent={...} ──► useAgentTools (cliente) ──┤ registerTool(<name>_fill)
                         │                     └ registerTool(<name>_submit)
                         │
        execute(fill) ───┼──► registro de useSchema: apply(valor) por campo
                         │      └─ el mismo onChange de InputBase
                         ├──► listas: pendingListRowsAtom (como un evento `value`)
                         └──► validación por campo ──► { ok, applied, skipped, errors }

        execute(submit) ─┴──► <form>.requestSubmit() ──► useFormState
                                   └─ se espera el nuevo `state` ──► { ok, data | error }
```

### 3.2 API pública propuesta

Una prop opcional en el `Form` del cliente (`client/component/form.tsx`):

```tsx
<Form
  sections={sections}
  config={config}
  action={action}
  agent={{
    name: 'signup', // prefijo de los tools: signup_fill y signup_submit
    description: 'Crea una cuenta nueva con un email y una contraseña.',
    consequential: true, // signup_submit lleva consequentialHint
    submit: true, // por defecto: true si el Form tiene `action`
  }}
/>
```

- **Sin `agent`** no se registra nada, así que es opt-in.
- **`name`** debe ser único en la página: dos formularios con el mismo nombre
  serían un error de autor, que se avisa con `logger.warn`. Límite nominal de
  128 caracteres según la spec.
- **`description`** la escribe el autor. No se arma con texto interpolado: ver
  3.9.

Opciones por campo, en la definición (cambio del contrato JSON, se documenta):

```json
{ "name": "password", "type": "input/password", "advanced": { "agent": false } }
```

- `advanced.agent: false` deja el campo fuera del tool, por ejemplo para datos
  sensibles o personales que el agente no debería pedir.
- `advanced.agent: { "description": "…" }` reemplaza la descripción que ve el
  agente.

### 3.3 Esquema de entrada: `buildToolSchema` (core)

Función pura nueva en `packages/luna-core/src/util/tool-schema.ts`:

```ts
export function buildToolSchema(
  sections: Sections,
  options: Readonly<{
    context?: Record<string, unknown>
    definition?: Definition
    localization?: Localization
  }>
): JsonSchemaObject
```

- Resuelve primero `$ref` y `definition` con `prepare`, lo mismo que hace el
  render, y recorre secciones, columnas y listas.
- Devuelve JSON Schema 2020-12: `type: "object"`, `properties`, `required` y
  `additionalProperties: false`.
- `title` sale de la etiqueta traducida y `description` de la descripción del
  campo sin interpolar, más las notas que agrega el mapeo.

Mapeo por tipo:

| Tipo de campo                                                | JSON Schema                                                                                                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input`, `input/text`, `input/tel`, `textarea`               | `string`                                                                                                                                          |
| `input/email`                                                | `string`, `format: "email"`                                                                                                                       |
| `input/password`                                             | fuera por defecto; incluido solo con `advanced.agent`                                                                                             |
| `input/number`                                               | `number`                                                                                                                                          |
| `input/date`                                                 | `string`, `format: "date"` (ISO `yyyy-MM-dd`). En modo rango, un array de 2 fechas. Mínimo, máximo y días reservados se explican en `description` |
| `input/time`                                                 | `string`, `pattern: "^\\d{2}:\\d{2}$"` (HH:mm de 24 h)                                                                                            |
| `checkbox`                                                   | `boolean`                                                                                                                                         |
| `select`, `radio` con `source` estático                      | `oneOf: [{ const, title }]`, con títulos traducidos                                                                                               |
| `select`, `radio` con `source` remoto                        | `string`; la descripción dice de dónde salen las opciones                                                                                         |
| `chips`                                                      | `array` de `oneOf`, con `uniqueItems`; `maxItems: 1` si `multiple: false`                                                                         |
| `chips/day`, `chips/month`                                   | `array` de enum con los días o los meses                                                                                                          |
| `select/day`, `select/month`, `select/year`, `select/active` | enum generado con los helpers de core que ya construyen esas opciones                                                                             |
| `select/timezone`                                            | `string` con zona IANA y ejemplos en la descripción, para no enviar unas 400 opciones                                                             |
| `list`                                                       | `array` de objetos (las hojas de la fila), con `minItems`/`maxItems` desde `advanced.length`; si es `fixed`, longitud exacta                      |
| `column`                                                     | se aplana: sus campos van al mismo nivel                                                                                                          |
| tipos personalizados (`defineCustomInput`)                   | `string`, salvo que el campo declare `advanced.agent.schema` (pregunta abierta en 7)                                                              |

Reglas de validación:

- **Se traducen a JSON Schema** las que tienen equivalente directo: `required`
  pasa a `required`; `pattern` a `pattern`; `length` a
  `minLength`/`maxLength`; mínimo y máximo a `minimum`/`maximum`; `step` a
  `multipleOf`; y la aserción `oneOf` a un `enum`.
- **Se describen en texto** las condicionales o entre campos (`requiredWhen`,
  `rules` con `when`, `custom`). Quien manda es la validación en `execute`.

Visibilidad:

- **Se incluyen:** los campos que un evento `state` puede revelar, con una nota
  "solo aplica cuando …".
- **Se excluyen:** los campos `hidden` que nada revela, los `transient` (solo
  disparan eventos) y los `disabled` o de solo lectura en la definición.

Pruebas: `tests/unit/tool-schema.spec.ts`, un caso por fila de la tabla, más
`$ref`, columnas, listas anidadas, traducciones y exclusiones. Como verificación
cruzada: todo valor que `buildFormSchema` acepta debe cumplir el esquema del
tool.

### 3.4 Tool de rellenado: `<name>_fill`

El problema es escribir un valor desde fuera del campo pasando por su propia
lógica. La solución es el registro que ya existe.

- **Puente en el registro:** `useSchema` (`client/hook/use-schema.ts`) guarda
  `{ field, schema, offered }` por nombre. Se agrega `apply(value)`, registrado
  por `InputBase` (`client/component/input-base.tsx`) como
  `onChange({ target: { value } })`. Para que tenga identidad estable se pasa
  por `useLatest`. Es exactamente el camino del usuario:
  - el bloqueo de `disabled` y de solo lectura;
  - `getValue` de la estrategia (por ejemplo `holdValue` para fechas);
  - `transform`;
  - `setValue` y el aviso al host;
  - la validación en `change`;
  - los eventos de cambio.
- **Formato de entrada:** el que se guarda internamente: fechas ISO, horas
  `HH:mm`, `chips` como array, `checkbox` como booleano, `select` con el
  `value` de la opción. El esquema de 3.3 ya lo declara así.
- **Listas:** se asignan como lo hace un evento `value` dirigido a una lista,
  escribiendo `pendingListRowsAtom` (`client/lib/list-store.ts`). La lista
  aplica las filas con `applyRows`, que normaliza, recorta a `min`/`max`, siembra
  los valores y avisa al host.
- **Campos condicionales, en varias pasadas:**
  1. Aplicar los valores de los campos registrados.
  2. Esperar a que React confirme el commit y terminen las transiciones de los
     eventos `state`.
  3. Volver a aplicar los valores de los campos que acaban de aparecer.
  4. Repetir hasta que nada cambie o hasta un máximo de 5 pasadas.
- **Espera del debounce:** los campos de texto y fecha corren sus eventos 300 ms
  después del último cambio (`dispatchTypedChange`). El tool espera a que el
  hilo quede libre después de ese plazo antes de validar y responder.
  Alternativa a medir en la fase 1: un camino inmediato, sin debounce, para
  valores aplicados por un tool.
- **Validación y errores:** cada campo aplicado se valida con su esquema del
  registro (más `validation.custom`). Los errores se reportan en la UI igual que
  en `blur`, para que el usuario los vea, y se devuelven:

```json
{
  "ok": false,
  "applied": ["email", "country"],
  "skipped": [{ "name": "frequency", "reason": "hidden" }],
  "errors": { "email": ["Invalid email address"] }
}
```

- **Motivos de `skipped`:** `hidden` (no está visible al terminar),
  `locked` (deshabilitado o de solo lectura), `unknown` (no existe en la
  definición) y `excluded` (`advanced.agent: false`).
- **Anotaciones:** ninguna de las cuatro. No es de solo lectura, porque cambia el
  estado del formulario, pero tampoco es consecuencial: no envía nada.

### 3.5 Tool de envío: `<name>_submit`

- **El `<form>`:** `component/form.tsx` acepta una prop `formRef` (en React 19
  el `ref` es una prop más) y `FormContent` le pasa la suya. En la entrada de
  servidor no se pasa, así que no cambia nada ahí.
- **`execute`:** llama `formRef.current.requestSubmit()`. Entra por el
  `onSubmit` de `useFormState` (`client/hook/use-form-action.ts`), así que la
  validación completa, la acción, el estado pendiente, los errores y el reset
  ocurren como con un clic. Un _resolver_ guardado en un ref se completa en el
  efecto que observa el siguiente `state` de `useActionState`:

```json
{ "ok": true, "data": { "…": "lo que devolvió la acción" } }
{ "ok": false, "error": { "title": "…", "description": "…", "details": ["…"] }, "errors": { "email": ["…"] } }
```

- **Anotaciones:** `consequentialHint: agent.consequential` y
  `untrustedContentHint: true`, porque devuelve datos del servidor que pueden
  traer contenido de usuarios.
- **Cancelación:** si llega el `signal` de `execute` abortado antes del commit,
  el tool responde `{ ok: false, cancelled: true }`. No intenta deshacer un
  envío que ya salió.
- **`outputSchema`:** se declara para los dos tools.

### 3.6 Ciclo de vida del registro

- Hook nuevo `client/hook/use-agent-tools.ts`, llamado desde `FormContent`.
  Corre en un efecto, nunca en el servidor.
- Un `AbortController` por registro. Se aborta al desmontar, al cambiar
  `agent` y al cambiar el esquema (memoizado sobre `sections`, `definition`,
  `context` y la localización). El doble montaje de StrictMode queda cubierto:
  aborta y vuelve a registrar.
- Lo que leen los `execute` (store, registro, `formRef`) va en refs, así los
  tools no se reconstruyen en cada render y nada vuelve a registrarse por una
  tecla.
- Si `registerTool` rechaza (nombre duplicado, política de permisos), se avisa
  con `logger.warn` y el formulario sigue igual.

### 3.7 Carga diferida y costo cero

- El efecto comprueba `'modelContext' in document` y solo entonces hace
  `import('./agent-tools')`. Con `splitting` de esbuild en ESM queda como un
  chunk aparte.
- El bundle CJS no divide código: ahí el módulo va incluido. Hay que medir
  cuánto suma y decidir si se acepta.
- Objetivo: el chunk principal crece menos de 0.5 kB gzip. Se mide con
  `lib-size` antes y después y se compara contra el límite de 285 kB del job
  `bundle-size`.

### 3.8 Tipos de TypeScript

`lib.dom` todavía no incluye la API. Se declara un tipo mínimo propio en
`client/lib/model-context.ts`, a partir del IDL de la sección 1, sin `any`.
Ejemplo: entrada `Record<string, ToolValue>`, donde `ToolValue` es `Value`, un
array de filas o `null`. Si la API cambia, se cambia en ese único archivo.

### 3.9 Seguridad y privacidad

- **Inyección de instrucciones:** `description` y los textos de los campos se
  toman de la definición **sin interpolar**. `{context…}`, `{env…}` y `{value}`
  pueden llevar datos del host o del usuario. Se documenta que la definición es
  contenido de confianza del autor.
- **Sobre-parametrización:** la spec advierte que los parámetros opcionales
  invitan al agente a aportar datos personales. Por eso `input/password` queda
  fuera por defecto y existe `advanced.agent: false`. La documentación recomienda
  exponer solo lo que el formulario necesita.
- **Acciones consecuenciales:** el envío nunca es implícito: rellenar no envía.
  Los formularios de pago o borrado deben declarar `consequential: true`.
- **Entradas no confiables:** los argumentos del agente se tratan como entrada
  de usuario: pasan por el bloqueo de campos y por la validación de Zod, igual
  que lo que se escribe a mano.
- **Desactivación:** un sitio puede apagarlo con `Permissions-Policy: tools=()`
  sin tocar luna.

## 4. Fases y tareas

### Fase 0: prototipo en el editor, sin tocar la librería (1 a 2 días)

Objetivo: medir el valor con un agente real y confirmar los límites que
justifican la fase 1.

- [ ] En `apps/react-luna-editor/app/reactive/reactive-form-preview.tsx`,
      registrar `fill_form` (llama `setValues`) y `submit_form`
      (`requestSubmit()` y espera `onSuccess`) cuando exista
      `document.modelContext`.
- [ ] Esquema con `z.toJSONSchema(buildFormSchema(form.sections))`. Requiere
      agregar `zod` como dependencia del editor, que hoy solo la tiene
      `luna-react` como peer.
- [ ] Probar con el flag de Chrome y la extensión Model Context Tool Inspector.
      Medir con un agente (sección 6).
- [ ] Documentar los límites esperados:
  - los cambios del host no disparan eventos `value` (es intencional);
  - una lista toma las filas del host solo al montarse (`useFieldList`);
  - el host no se entera de los errores de validación, porque el `Form` no
    expone un `onError`.

### Fase 1: librería (aproximadamente 1 semana)

- [ ] `packages/luna-core/src/util/tool-schema.ts` con `buildToolSchema`
      (3.3), exportado también por `react-luna-form/schema` para quien quiera
      registrar tools propios. Más `tests/unit/tool-schema.spec.ts`.
- [ ] Registro: `apply` en `useSchema` y su registro desde `InputBase` (3.4).
- [ ] `client/lib/agent-tools.ts`: los tools de rellenado (varias pasadas, listas,
      validación y respuesta) y de envío (`requestSubmit` y _resolver_).
- [ ] `client/hook/use-agent-tools.ts`: detección, import diferido, registro y
      `AbortController` (3.6, 3.7).
- [ ] Prop `agent` en el `Form` del cliente y `formRef` en
      `component/form.tsx`.
- [ ] `advanced.agent` en los tipos de core (`type.ts`).
- [ ] Documentación: `packages/luna-react/docs/agents/webmcp.md` y una fila en
      la tabla "Where to look" de `docs/index.md`. `CLAUDE.md` pide mantener
      los docs al día porque se publican con el paquete.
- [ ] e2e (sección 5) y la medición antes/después (sección 6).

### Fase 2: pulido (3 a 5 días)

- [ ] Elegir, con mediciones, entre esperar el debounce o el camino inmediato
      (3.4).
- [ ] Usar `toolactivated` y `toolcancel` para resaltar el formulario mientras
      un agente lo usa (por ejemplo con un atributo `data-agent-active`).
- [ ] Fuentes remotas: valorar un tercer tool de solo lectura
      (`<name>_options`, `readOnlyHint`) que devuelva las opciones ya cargadas.
- [ ] En el editor, tools de autoría (`set_definition`, `get_definition`) para
      armar formularios desde lenguaje natural.

### Fase 3: endurecimiento

- [ ] Revisión de seguridad contra los riesgos de la spec (inyección, intención
      mal representada, sobre-parametrización).
- [ ] Seguir los cambios de la API y del origin trial, versión por versión de
      Chrome.
- [ ] Opcional: atributos declarativos en `react-luna-form/server` para
      formularios simples sin JavaScript.

## 5. Pruebas

- **Unitarias (Vitest):** el mapeo de 3.3 completo. Y para el puente de
  `apply`, las funciones puras que ordenan las pasadas y arman la respuesta.
- **e2e (Playwright):** un proyecto nuevo `chromium-webmcp` con el flag de
  WebMCP activado. Firefox y WebKit no lo tienen y se saltan esos specs, que
  deben comprobar que sin la API no se registra nada ni aparece ningún error.
  - Hay que confirmar el nombre de la _feature_ de Chromium que corresponde a
    `#enable-webmcp-testing` para pasarlo en `launchOptions.args`.
  - Los tools se ejecutan con `document.modelContext.getTools()` y
    `executeTool()` dentro de `page.evaluate`.
  - Casos:
    - registro al montar y desregistro al desmontar y al cambiar la
      definición;
    - rellenado de texto, email, número, fecha, hora, select, radio,
      checkbox, chips y una lista con filas;
    - un evento `state` que revela un campo, en dos pasadas;
    - autocompletado con un evento `value` y `transform`;
    - un campo bloqueado reportado en `skipped`;
    - errores estructurados;
    - envío con éxito y con fallo de validación;
    - `consequentialHint` presente;
    - sin la prop `agent`, cero tools.
- **Render budgets:** los 11 existentes siguen igual, y uno nuevo comprueba que
  una tecla en un formulario con `agent` no vuelve a registrar los tools.
- **Bundle:** el job `bundle-size` sigue bajo el límite, y el chunk principal no
  crece más de 0.5 kB gzip.

## 6. Medición antes y después

Lo que se mide:

- **Línea base:** un agente (la extensión agéntica de ejemplo de Chrome o un
  bucle propio con un LLM) llena tres formularios de referencia con
  automatización del DOM:
  1. uno simple de texto;
  2. uno condicional, con un evento `state` y un autocompletado `value`;
  3. uno con una lista de filas, una fecha y un select.
- **Después:** los mismos tres formularios con los tools.
- **Métricas:** tasa de éxito (valores correctos enviados), tiempo total, tokens,
  número de acciones o llamadas y número de reintentos.
- **Protocolo:** 10 corridas por formulario y por modo, alternadas, en el mismo
  modelo y la misma máquina.
- **Sin regresión para quien no lo usa:** tamaño del bundle con `lib-size`, render
  budgets e interacción con `ab-timing`, con la prop presente y ausente.

## 7. Riesgos y preguntas abiertas

Riesgos:

| Riesgo                                     | Mitigación                                                                                         |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| La API cambia o el origin trial termina    | Opt-in, detección de soporte, tipos y llamadas aislados en dos archivos, sin dependencias externas |
| Solo Chromium                              | Mejora progresiva: sin la API no pasa nada                                                         |
| El esquema no expresa reglas condicionales | Descripción en texto y validación en `execute` con errores accionables                             |
| Un agente rellena datos sensibles          | `input/password` fuera por defecto, `advanced.agent: false` y documentación                        |
| Inyección vía textos interpolados          | Descripciones sin interpolar (3.9)                                                                 |
| Los tools se registran de más por renders  | Esquema memoizado y `execute` leyendo refs; budget nuevo                                           |

Preguntas abiertas:

1. ¿El nombre de la prop: `agent`, `tool` o `webmcp`?
2. ¿El tool de rellenado debe mostrar los errores en la UI o solo
   devolverlos?
3. ¿Los tipos personalizados de `defineCustomInput` deben poder declarar su
   esquema (`advanced.agent.schema`) o se registra en `defineConfig`?
4. ¿Un solo tool con `submit: boolean` en lugar de dos? La guía comunitaria
   recomienda separarlos para poder marcar solo el envío como consecuencial.
5. ¿Esperar el debounce de 300 ms o agregar un camino inmediato para valores
   aplicados por un tool?
6. ¿Exportar `buildToolSchema` en `react-luna-form/schema` desde la fase 1?

## 8. Criterios de aceptación

- [ ] Sin la prop `agent`, o en un navegador sin WebMCP, ningún tool registrado,
      ningún render extra y el chunk principal crece menos de 0.5 kB gzip.
- [ ] Con la prop:
  - `getTools()` devuelve `<name>_fill` y `<name>_submit` con el esquema de
    3.3;
  - rellenar dispara las mismas transformaciones y eventos que escribir a mano;
  - los errores llegan por campo;
  - enviar devuelve el resultado de la acción.
- [ ] Tipos, lint, tests unitarios y e2e en verde, incluido el proyecto
      `chromium-webmcp`.
- [ ] La medición de la sección 6 está publicada con la tasa de éxito, el tiempo,
      los tokens y las acciones, por formulario y por modo.
- [ ] La documentación (`docs/agents/webmcp.md`) describe la prop,
      `advanced.agent`, el mapeo de tipos y las consideraciones de seguridad.

## Fuentes

- [WebMCP, Chrome for Developers](https://developer.chrome.com/docs/ai/webmcp?hl=es-419)
- [Especificación WebMCP, W3C Web Machine Learning Community Group](https://webmachinelearning.github.io/webmcp/)
- [WebMCP: API imperativa](https://developer.chrome.com/docs/ai/webmcp/imperative-api)
- [WebMCP: API declarativa](https://developer.chrome.com/docs/ai/webmcp/declarative-api?hl=en)
- [GoogleChromeLabs/use-webmcp-tool](https://github.com/GoogleChromeLabs/use-webmcp-tool)
- [Lighthouse: Registered WebMCP tools](https://developer.chrome.com/docs/lighthouse/agentic-browsing/registered-webmcp-tools)
