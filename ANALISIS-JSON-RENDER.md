# Análisis: ¿Vale la pena integrar `@json-render/directives` en luna-form?

## Contexto

Luna Form es una librería de formularios **schema-driven** basada en Zod + Jotai, con bindings para React (y un paquete planificado para Svelte). Su valor está en la validación tipada, eventos reactivos entre campos (`state`, `value`, `source`, `proxy`), y listas anidadas.

El usuario pregunta si incluir [@json-render/directives](https://json-render.dev/docs/api/directives#install) traería mejoras. La respuesta corta es **no de forma directa**, pero sí hay conceptos valiosos que conviene adoptar internamente. Este documento sustenta esa recomendación.

---

## 1. Qué es realmente json-render

json-render **no es una librería de formularios**. Es un framework de **UI generativa por IA** que renderiza interfaces completas a partir de specs JSON. Su modelo:

- **Catalog/Registry**: el desarrollador declara qué componentes y acciones puede usar la IA.
- **Spec JSON**: árbol plano de elementos con `props`, `children`, `data bindings`, `visibility`.
- **Directivas**: funciones puras serializables como `{ "$format": "currency", "value": 99.99 }` que se resuelven en runtime.
- **Multi-renderer**: React, Vue, Svelte, React Native, PDF, email, 3D.

### Directivas que ofrece `@json-render/directives`

| Directiva             | Propósito                                              |
| --------------------- | ------------------------------------------------------ |
| `$format`             | Formato locale-aware (currency, date, number, percent) |
| `$math`               | Aritmética (add, sub, mul, div, round)                 |
| `$concat`             | Concatenar strings desde estado                        |
| `$count`              | Longitud de array/string                               |
| `$truncate`           | Truncar texto con sufijo                               |
| `$pluralize`          | Forma singular/plural según contador                   |
| `$join`               | Unir elementos de array con separador                  |
| `createI18nDirective` | i18n con interpolación de parámetros                   |

---

## 2. Solapamiento real con luna-form

### Lo que luna-form ya hace

- **Interpolación de strings** (`{field}`, `{parent.child}`) en `packages/luna-core/src/util/string.ts` — equivale parcialmente a `$concat` y `$state`.
- **Validación rica** vía Zod en `packages/luna-core/src/util/schema.ts` — supera al subsistema de validación de json-render.
- **Eventos reactivos** (`state-event`, `value-event`, `source-event`, `proxy-event`) en `packages/luna-core/src/handle/` — equivale a watchers/computed values de json-render, pero acoplados al modelo de formulario.
- **Traducciones** multi-idioma (sin pluralización).
- **Date/time** vía `date-fns`.

### Lo que NO hace luna-form y json-render sí

| Capacidad json-render                                               | ¿Falta en luna-form?                                       |
| ------------------------------------------------------------------- | ---------------------------------------------------------- |
| Formato locale-aware unificado (currency, percent, compact numbers) | Sí — hoy se resuelve ad-hoc                                |
| Aritmética declarativa (`$math`)                                    | Sí — no se puede sumar `precio * cantidad` desde el schema |
| Pluralización i18n                                                  | Sí                                                         |
| Truncado declarativo                                                | Sí (irrelevante para forms)                                |
| Composición anidada de directivas                                   | Sí — la interpolación actual es plana                      |

---

## 3. Por qué la integración directa **no encaja**

1. **Propósito divergente**. json-render renderiza UIs completas desde JSON; luna-form gestiona estado/validación de formularios. Adoptar el ecosistema implica reescribir el render path React entero (`packages/luna-react/src/component/form.tsx` y los hooks en `client/hook/`).
2. **Dependencia transitiva**. `@json-render/directives` no funciona aislado; requiere `@json-render/core` + un renderer (`@json-render/react`). No se puede "tomar solo las directivas".
3. **Modelos de estado incompatibles**. json-render usa paths tipo JSON Pointer (`{ "$state": "/user/name" }`); luna-form usa Jotai atoms con interpolación `{user.name}`. Mezclarlos rompe la coherencia API.
4. **Validación duplicada**. La validación de json-render es básica; la de luna-form (Zod + `superRefine` cross-field) es superior. Integrar json-render obligaría a degradar o duplicar.
5. **Coste de bundle y mantenimiento**. Añadir `@json-render/core` + `@json-render/react` + `@json-render/directives` por aprovechar 3-4 helpers de formato es desproporcionado.

---

## 4. Recomendación

**No integrar `@json-render/directives` como dependencia.** En cambio, **inspirarse en su API** para extender el motor de expresiones existente con tres capacidades concretas que sí aportan valor:

### 4.1 Formateo locale-aware (alta prioridad)

Hoy no hay forma declarativa de mostrar `{precio}` como `$1,234.56`. Proponer extender la sintaxis de interpolación en `packages/luna-core/src/util/string.ts` para soportar pipes nativos:

```
{precio | format:currency:USD}
{fechaCreacion | format:date:relative}
{descuento | format:percent}
```

Implementación: `Intl.NumberFormat` / `Intl.DateTimeFormat` (ya disponibles, sin nueva dependencia).

### 4.2 Aritmética declarativa en `value-event` (media prioridad)

`packages/luna-core/src/handle/value-event.ts` hoy solo permite copiar valores. Extender para soportar expresiones simples:

```ts
event: { change: { target: 'total', compute: { op: 'mul', a: '{precio}', b: '{cantidad}' } } }
```

Esto desbloquea casos como totales calculados sin un effect externo en React.

### 4.3 Pluralización en i18n (baja prioridad)

Aprovechar `Intl.PluralRules` para soportar plurales en las traducciones existentes. Patrón:

```
{count | pluralize:item:items}
```

### 4.4 Lo que NO hace falta

- `$truncate`, `$join`, `$count`: poco aplicables al dominio de forms.
- `createI18nDirective`: el sistema de traducciones actual ya cubre los casos.

---

## 5. Archivos críticos si se decide implementar las extensiones

- `packages/luna-core/src/util/string.ts` — motor de interpolación; aquí se añadirían pipes/filters.
- `packages/luna-core/src/handle/value-event.ts` — evento de cómputo.
- `packages/luna-core/src/type.ts` — tipado de los nuevos campos en `event.change`.
- `packages/luna-react/src/client/hook/use-input-core.ts` — consumo en React.
- Tests en `tests/unit/` (Playwright `@unit`) — cobertura de cada nuevo formato/operación.

---

## 6. Verificación

Si se aprueba alguna extensión:

1. `pnpm install` y `pnpm run build` — `luna-core` debe compilar antes que `luna-react`.
2. Tests unitarios para cada pipe/operación nueva en `tests/unit/`.
3. `pnpm run serve` y validar manualmente un formulario con campos calculados y formateados.
4. Verificar que no hay regresiones en los benchmarks existentes (`benchmark/`).

---

## TL;DR

- `@json-render/directives` está pensado para UIs generativas por IA, no para formularios.
- Importar el paquete obliga a traer `@json-render/core` + renderer, lo cual reemplazaría el stack actual (Zod + Jotai + React).
- Las ideas valiosas (formato, aritmética, pluralización) se pueden implementar en luna-core en ~3 archivos sin nuevas dependencias.
- Recomendación: **no integrar**, **sí extender** el motor de expresiones propio inspirándose en la API.
