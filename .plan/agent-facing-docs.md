# Documentacion alcanzable por agentes

> Repo: `luna-form` (monorepo, `main`, HEAD `e039ec2`). Datos verificados contra
> el arbol el 2026-08-20. Motivacion: en `luna-flow`, un subagente que construye
> plugins necesita las reglas de `react-luna-form` y hoy no tiene de donde
> sacarlas; las redescubre por prueba y error, o las falla en silencio.

## Punto de partida

`docs/` ya existe y no esta mal: **7 archivos, 1517 lineas**, organizados por
tema.

| Archivo                                | Lineas |
| -------------------------------------- | ------ |
| `docs/events/change.md`                | 369    |
| `docs/validation/overview.md`          | 318    |
| `docs/fields/list.md`                  | 230    |
| `docs/fields/specialized-selectors.md` | 175    |
| `docs/fields/select.md`                | 171    |
| `docs/fields/input.md`                 | 126    |
| `docs/interpolation/format-filters.md` | 128    |

El problema no es escribirlos. Es que **no llegan a nadie**, por tres paredes
independientes:

1. **No se publican.** `packages/luna-react/package.json` declara
   `files: ["dist"]`, igual que `luna-core`. `docs/` vive en la raiz del
   monorepo, fuera de cualquier paquete, asi que no entra en el tarball. Quien
   instala `react-luna-form@0.0.81` recibe `dist` y `LICENSE`.
2. **Los agentes del propio repo no saben que existen.** `AGENTS.md` de
   `luna-form` no menciona `docs/` en ninguna linea. Un barrido por todo el
   arbol no encuentra una sola referencia a `docs/` fuera de `docs/` mismo.
3. **Ningun paquete tiene README.** La pagina de npm esta vacia, y un agente que
   busque documentacion por el camino habitual no encuentra nada.

El precedente que se copia es Next: envia `node_modules/next/dist/docs/`
(`01-app`, `02-pages`, `03-architecture`, `04-community`, `index.md`) y el
`AGENTS.md` de los repos que lo consumen obliga a leerlo antes de escribir
codigo. Es exactamente esta idea, ya validada.

## Analisis de huecos

Comprobado por busqueda de palabra clave sobre `docs/`. **Aviso: esto detecta si
el tema aparece, no si la trampa esta explicada.** La Fase 1 incluye releer los
cuatro "cubiertos" para confirmar que dicen lo que hace falta.

| Trampa (cada una costo una sesion de depuracion)                                                             | Estado                                                  |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| `chips` necesita `defaultValue` como array aunque `multiple` sea `false`; un escalar se descarta en silencio | **NO documentado**                                      |
| El contrato del input custom: `defineCustomInput`, reenvio de `id`, asociacion `htmlFor`                     | **NO documentado**                                      |
| `validation` es un objeto entero; sobrescribirlo con una sola clave apaga `showError`                        | **NO documentado**                                      |
| `validation.requiredWhen` aplica a campos `hidden`; `required` no                                            | aparece en `fields/input.md`, `validation/overview.md`  |
| Las reglas `state` solo disparan en un cambio real, nunca en el valor inicial                                | aparece en `events/change.md`, `validation/overview.md` |
| Propagacion de listas anidadas                                                                               | aparece en `events/change.md`, `validation/overview.md` |
| Un cambio a cadena vacia desde un input custom se traga; hay que emitir un centinela                         | aparece en `validation/overview.md`                     |

El segundo hueco es el que mas pesa: sin el contrato del input custom
documentado, no se puede construir un agente que fabrique campos especializados
(un selector de personas, por ejemplo). Es el bloqueo concreto que este plan
levanta.

## Fase 0 - Publicar lo que ya existe - HECHA (2026-08-20)

Ejecutada moviendo los docs dentro del paquete, no copiandolos en el build.

**Correccion sobre lo que decia este plan.** La primera version proponia
`scripts/copy-docs.mjs` a `dist/docs/` espejando a Next. Al bajar al detalle,
esa via arrastra dos problemas evitables: un script que mantener, y el cache de
turbo (`inputs` no incluye los docs, asi que cambiar solo documentacion daria
cache hit y publicaria la version anterior; arreglarlo exige `$TURBO_ROOT$`,
que no se pudo verificar en turbo 2.10.10 porque el binario es nativo).

Next copia porque **genera** sus docs. Aqui estan escritos a mano, asi que mover
es mas simple y elimina las dos fuentes de fallo.

Lo aplicado:

1. `git mv docs packages/luna-react/docs`
2. `files: ["dist"]` -> `["dist", "docs"]` en `packages/luna-react/package.json`
3. `docs/index.md` nuevo: enrutado por tarea, los cuatro puntos de entrada del
   paquete, y tres trampas que no estaban en ningun sitio
4. Seccion **Form documentation** en `AGENTS.md`, que hasta ahora no referenciaba
   `docs/` en ninguna linea

Sin tocar `turbo.json`, sin scripts nuevos.

**Medicion, verificada:** el tarball de `pnpm pack` pasa de 127 entradas y 84K a
**135 entradas y 104K**, con los ocho `.md` bajo `package/docs/`. Un consumidor
los encuentra en `node_modules/react-luna-form/docs/`.

Coste real de la fase: +20K comprimido sobre 84K.

**Erratas corregidas al escribir `index.md`.** Se afirmo de memoria que
"`validation` es un objeto entero y sobrescribirlo apaga `showError`". Verificado
contra `packages/luna-react/src/config/index.ts:52`, la trampa existe pero es del
**config**, no del campo: `config.validation = options.validation ?? {...}`, o sea
que pasar `validation` a `defineConfig` descarta los cuatro defaults
(`blur`, `change`, `showError`, `submit`). El indice ya lo dice asi.

## Fase 1 - Cerrar los huecos - HECHA (2026-08-20)

Los cinco entregables mas los dos menores. Lo escrito abajo es el plan original;
lo que se hizo, y lo que cambio al bajar al codigo:

- `fields/custom-inputs.md` y `setup.md`, nuevos.
- `fields/select.md`: la coercion a array de `chips`, y dos lineas que eran
  imprecisas — `defaultValue` no aclaraba el caso de chips, y `multiple` daba a
  entender que el array depende de el. No: el valor de un `chips` es siempre un
  array, y `multiple` por defecto es `true`.
- `fields/input.md`: el tipo `input` pelado (que resuelve a `text`), mas
  `textarea` y `checkbox`, que no tenian pagina.
- `events/change.md`: los eventos `change` que corren al montar.
- La trampa de `validation` acabo en `setup.md`, no en `validation/overview.md`:
  al leer el codigo resulto ser del **config**, no del campo.
- Releidos los cuatro "cubiertos". `requiredWhen` en campos `hidden` esta bien
  explicado en `validation/overview.md:277`, con el matiz de que `pattern` si
  dispara. La propagacion de listas anidadas **no es una trampa vigente**: eran
  bugs, arreglados en 0.0.67 y 0.0.80, y documentarlos en unos docs que viajan
  con 0.0.81 seria ruido.

Dos correcciones a afirmaciones que se habian escrito de memoria, ambas falsas
y ambas cazadas al ir al codigo:

1. "Las reglas `state` solo disparan en un cambio real, no en el valor inicial."
   **Falso.** `input-base.tsx` procesa los eventos `change` al montar cuando hay
   `value` o `defaultValue`, una sola vez; en select espera a que carguen las
   opciones. Es lo contrario de lo que decia el indice, ahora corregido.
2. "Un tipo no registrado cae al input base." **Falso**, ya corregido antes: no
   renderiza nada.

Y un hallazgo del propio codigo, documentado como trampa: **`defaultValue: false`
en un `checkbox` marca la casilla**. `prepareDefaultValue` hace
`defaultChecked: isValidValue(value)`, e `isValidValue(false)` es `true`. El
camino de `value` no tiene el problema; solo el atajo `defaultValue`. Parece un
bug de la libreria, no de los docs — pendiente de decidir.

Sin hacer todavia: la linea en el `AGENTS.md` del consumidor (Fase 2b).

### Plan original

Por orden de valor.

1. **`docs/fields/custom-inputs.md`** - el contrato del adaptador. Que props
   recibe el componente, que debe reenviar (`id`, `{...props}`) y por que: la
   asociacion `htmlFor`/`id` que emite la libreria es lo unico que da nombre
   accesible al campo, y un input custom que no reenvie `id` la rompe sin que
   falle nada. Como se registra con `defineCustomInput`. Y el detalle de que un
   cambio a cadena vacia se traga, con el patron del centinela.
   Referencias reales que existen en `luna-flow`: `input-password` (41 lineas,
   el caso minimo), `input-delay` (133), `input-webhook` (99), `input-secret`
   (277, el complejo).
2. **`chips` y su `defaultValue` array** - ampliar `docs/fields/select.md`.
3. **`validation` como objeto entero y `showError`** - ampliar
   `docs/validation/overview.md`.
4. **Releer los cuatro "cubiertos"** y confirmar que explican la trampa, no solo
   el tema. Si solo la mencionan, ampliarlos.

Regla de redaccion, tomada de lo que hace util a estos docs: cada trampa dice
**que pasa cuando la incumples**, no solo cual es la regla. "Un escalar se
descarta en silencio" ensena mas que "usa un array".

## Inventario de huecos, medido (2026-08-20)

Hecho comparando lo que la libreria implementa contra lo que los docs nombran,
no por intuicion. El metodo es repetible y es el germen del check fuerte de la
Fase 3.

### Eje 1: tipos de campo

De los 22 tipos renderizables que declara `luna-core/src/util/constant.ts`:

| Tipo                 | Estado                                                        |
| -------------------- | ------------------------------------------------------------- |
| `input` (sin sufijo) | **sin documentar**                                            |
| `textarea`           | **sin documentar**, pese a tener su propio `defineTextArea`   |
| `checkbox`           | solo aparece de pasada en `fields/list.md`, sin pagina propia |
| `input/email`        | solo de pasada en `fields/list.md`                            |
| `input/number`       | solo de pasada en `validation/overview.md`                    |
| los otros 17         | cubiertos en la pagina de su familia                          |

`data-table` era caso aparte, y se **borro** (2026-08-20). Una sola linea en
todo el repo, introducida el 2026-02-18 en el mismo commit que `LIST` como
hermano especulativo, sin implementacion en ningun momento de la historia y sin
quedar expuesta por ninguna entrada del paquete. No era un hueco de
documentacion: era un plan que nunca se ejecuto, y una constante sin
implementacion es indistinguible de una funcionalidad sin documentar para
cualquier auditoria futura.

### Eje 2: superficie de API

Aqui esta el hueco estructural. Los docs describen el **formato de datos** con
detalle y la **API programatica** en ninguna parte. De los 12 exports publicos:

| Entrada   | Export                                            | Documentado                   |
| --------- | ------------------------------------------------- | ----------------------------- |
| `.`       | `Form`                                            | de pasada                     |
| `.`       | `withDeclaredFields`                              | **no**                        |
| `/server` | `Form`, `Fallback`                                | `Fallback` de pasada          |
| `/config` | `defineConfig`                                    | solo mencionado en `index.md` |
| `/config` | `defineCustomInput`                               | solo mencionado en `index.md` |
| `/config` | `defineChips`, `defineTextArea`, `defineCheckbox` | **no**                        |
| `/config` | `defineInput`, `defineRadio`, `defineSelect`      | **no**                        |
| `/schema` | `buildFormSchema`, `collectIssues`                | de pasada                     |

Ademas, `defineConfig` acepta `fetcher.remotePatterns`, que gobierna a que
hosts puede llamar un `source` remoto. Es superficie de seguridad y no aparece
en ninguna linea de los docs.

### Lo que esto anade a la Fase 1

Un quinto entregable, y por valor va el segundo despues de `custom-inputs.md`:

5. **`docs/setup.md`** - montar el formulario: `defineConfig` con sus opciones
   (`inputs`, `style`, `validation`, `fetcher.remotePatterns`, `alert`,
   `env`), los cuatro puntos de entrada y cuando usar cada uno, `Form` cliente
   contra `Form` de servidor, y `withDeclaredFields`.

Y dos menores, ambos resueltos: `textarea` y `checkbox` tienen ahora seccion en
`fields/input.md`, y `data-table` se borro (ver arriba).

## Fase 2 - Que los agentes los encuentren

**Dentro de luna-form.** Anadir a su `AGENTS.md` una seccion que apunte a
`docs/` y diga cuando leer cual. Hoy no hay una sola referencia.

**En los repos que consumen.** Una linea en el `AGENTS.md` del consumidor, al
estilo de la que Next ya impone:

```
- Read the relevant guide in `node_modules/react-luna-form/dist/docs/` before
  writing form JSON or a custom input.
```

Next automatiza esa inyeccion (`generate-agent-files.js` la reescribe en cada
`next dev`). Copiar esa maquinaria es opcional y probablemente excesivo para la
primera version: una linea a mano cubre el 90 por ciento.

**Nota operativa:** en `luna-flow` el guard de `PreToolUse` bloquea editar
`AGENTS.md`, asi que esa linea la anade una persona, no un agente.

## Fase 3 - Que no deriven

El riel. Sin esto, la Fase 0 se deshace sola la primera vez que alguien toque
`files` o el build.

**Check minimo, inmediato:** un spec de vitest en `tests/unit/` (el runner real
de este repo; ver la correccion mas abajo) que ejecute `pnpm pack --dry-run`
sobre `packages/luna-react` y afirme que el tarball contiene `dist/docs/`. Es
barato y ataja la regresion que importa: que los docs dejen de publicarse en
silencio.

**Check fuerte, despues:** que todo tipo de campo que la libreria implementa
tenga entrada en los docs. Es el analogo de `plugins:check` en `luna-flow`, y
requiere una exploracion previa de como se registran los tipos internamente.

## Deriva encontrada de paso

`AGENTS.md` de este repo es incorrecto en dos afirmaciones, y es el primer
archivo que lee cualquier agente:

1. **Documenta `packages/luna-svelte`, que no existe.** Solo hay `luna-core` y
   `luna-react`.
2. **Dice "Framework: Playwright (not Jest or Vitest)" para los unit tests.**
   Falso: `test:unit` es `vitest run`, configurado en `vitest.config.ts` sobre
   `tests/unit/**/*.spec.ts`, entorno node y `globals: false`. Playwright es
   solo para e2e. Un agente que obedezca esta linea escribe specs de Playwright
   para pruebas unitarias.

La afirmacion sobre WebKit **si** es correcta aqui: `playwright.config.ts`
declara chromium, firefox y webkit. (En `luna-flow` la misma frase es falsa, y
casi con seguridad se copio desde este repo.)

Arreglar estas dos lineas es mas urgente que cualquier fase de este plan: cuesta
un minuto y hoy esta desviando trabajo.

## Decisiones abiertas

1. **README de paquete.** Los docs publicados no arreglan la pagina de npm, que
   sigue vacia. Se genera un README desde `docs/index.md`, o se deja?
2. **Alcance de `@luna-form/core`.** Los docs describen sobre todo el JSON del
   esquema, que conceptualmente es de `core`. Se publican solo en `luna-react`
   por pragmatismo. Si algun dia alguien consume `core` directamente, habra que
   revisarlo.
3. **Versionado.** Publicar los docs dentro del paquete los ata a la version,
   que es justo lo que se busca: no pueden desviarse del codigo instalado. El
   precio es que corregir una errata exige publicar version. Se acepta?
4. **Traduccion.** Los docs actuales estan en ingles. Se mantiene solo ingles.

## Orden

Fase 0, la correccion de `AGENTS.md`, y luego 1, 2, 3.

La Fase 0 y la correccion de `AGENTS.md` valen por si solas, aunque nunca se
construya ningun agente: hacen alcanzable documentacion que ya esta escrita y
pagada. La Fase 3 es lo que evita tener que repetir la Fase 0 dentro de seis
meses.
