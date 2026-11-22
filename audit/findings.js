// Findings of every audit of the project, in one place. Shown by
// audit/index.html (open it directly in a browser) and updated by the /audit
// and /test-audit commands. Field names and enum values are fixed; the text of
// every title, summary and section is written in Spanish. After editing:
// `pnpm exec prettier --write audit/`, then open the page to check it loads.
//
// audits[]: one entry per audit run, oldest first.
//   id       unique slug, e.g. 'audit-2026-11-20', 'audit-pr172' or
//            'test-audit-2026-11-20'
//   title    short name shown in the filter and the detail view
//   date     YYYY-MM-DD
//   doc      optional: link to a separate report
//   summary  optional: short HTML with the summary and key measurements
//            (<p>, <ul>, <table> inside <div class="table-wrap">, <code>)
//
// findings[]: one entry per finding. An ID exists once: when a later audit
// returns to it, the entry is updated, never duplicated.
//   code      unique ID, never reused (prefixes in each command)
//   title     one line, plain text
//   sev       'crit' | 'mejora' | 'optim'
//   cat       lowercase area: seguridad, errores, renders, react, jotai,
//             contrato, rendimiento, bundle, a11y, agentes, duplicado,
//             código muerto, pruebas
//   st        'pendiente' | 'probado' | 'medido' | 'estatico' | 'investigar'
//             | 'sin-estado' | 'corregido' | 'plan'. Anything other than
//             'corregido' or 'plan' counts as open.
//   stLabel   optional: the status in more detail ('Corregido en #180')
//   sevNote   optional: a nuance of the severity
//   audit     id of the audit that found it
//   sections  [{ label, html, audit? }], in this order when they apply:
//             Dónde, Qué pasa, Riesgo, Prueba, Evidencia, Mutaciones, Costo,
//             Propuesta, Corrección, Plan de corrección. The html is short
//             and escaped (<code>, <p>, <ul>, <b>, <a>). A section added by a
//             later audit carries `audit` with that run's id.
window.AUDIT = {
  audits: [
    {
      id: 'test-audit-2026-11-19',
      title: 'Auditoría de pruebas',
      date: '2026-11-19',
      summary:
        '<p>Primera auditoría de la suite, sobre <code>main</code> en <code>3e06819</code>. La suite está sana en lo estático: ningún caso sin aserción, ningún <code>waitForTimeout</code>, <code>networkidle</code>, <code>describe.serial</code> ni <code>beforeAll</code>, y los <code>if</code> alrededor de un <code>expect</code> son narrowing de tipos después de una aserción incondicional. Las unitarias son baratas y no dependen del orden. El costo y el riesgo están en las e2e.</p>' +
        '<p><b>8 hallazgos: 1 crítico, 5 mejoras y 2 optimizaciones, una de ellas para investigar.</b> Lo crítico es un hueco: la segunda capa de la guarda contra el prototipo en <code>extract.ts</code> se puede romper sin que falle ninguna prueba (HUE-01). Lo que más tiempo ahorra es correr las e2e de CI con más de un worker (OPT-02) y sobre <code>next start</code> (OPT-03). Los 4 casos que CI reintentó en 3 corridas tienen la misma causa: un clic en Submit antes de que el editor lea la definición inyectada (FLK-01), que los reintentos esconden (GUA-01).</p>' +
        '<div class="table-wrap"><table><thead><tr><th>Suite</th><th>Casos</th><th>Tiempo</th><th>Condiciones</th></tr></thead><tbody>' +
        '<tr><td>Unitarias (Vitest)</td><td>1257 en 67 archivos</td><td>2,4 a 3,4 s</td><td>local, 3 corridas; el caso más lento tarda 79 ms</td></tr>' +
        '<tr><td>Unitarias en orden aleatorio</td><td>1257</td><td>sin fallos</td><td>semillas 1, 9, 42, 777, 2026 y 31337</td></tr>' +
        '<tr><td>E2E en CI, suma de las pruebas</td><td>2250 caso-navegador</td><td>Chromium 653 a 814 s, Firefox 897 a 1010 s, WebKit 1106 a 1444 s</td><td>reportes blob de 3 corridas de PR del 19/11, 1 worker</td></tr>' +
        '<tr><td>E2E Chromium local, <code>next dev</code></td><td>743</td><td>1 worker 645 y 522 s, 2 workers 268 s, 4 workers 156 s</td><td>11 núcleos, <code>--retries=0</code>, 0 fallos; carga 4,6 a 20 en la primera de 1 worker y 3,8 a 6,3 en la segunda</td></tr>' +
        '<tr><td>E2E Chromium local, <code>next start</code></td><td>743</td><td>1 worker 420 y 412 s, 4 workers 109 s</td><td>mismas condiciones, 0 fallos; carga 2,5 a 8,4</td></tr>' +
        '</tbody></table></div>' +
        '<div class="table-wrap"><table><thead><tr><th>Job de CI</th><th>Mediana</th><th>Rango</th></tr></thead><tbody>' +
        '<tr><td>Veredicto completo (del primer job al último)</td><td>838 s</td><td>759 a 953 s</td></tr>' +
        '<tr><td>e2e-test webkit 2/2 (camino crítico)</td><td>713 s</td><td>584 a 865 s</td></tr>' +
        '<tr><td>e2e-test webkit 1/2</td><td>603 s</td><td>537 a 747 s</td></tr>' +
        '<tr><td>e2e-test firefox 2/2 y 1/2</td><td>677 y 577 s</td><td>536 a 767 y 470 a 596 s</td></tr>' +
        '<tr><td>e2e-test chromium 2/2 y 1/2</td><td>509 y 431 s</td><td>447 a 527 y 377 a 450 s</td></tr>' +
        '<tr><td>render-budget, bundle-size, lint, build, unit-test, e2e-report</td><td>77, 53, 47, 43, 33 y 33 s</td><td></td></tr>' +
        '</tbody></table></div>' +
        '<p class="muted">8 corridas exitosas de <code>build-and-test.yml</code> entre el 18 y el 19/11 (<code>gh run view --json jobs</code>). En los jobs e2e, la corrida de pruebas es casi todo: instalar y construir otra vez tarda menos de 5 s cada uno gracias a la caché de turbo, y el contenedor de Playwright 23 s. Las mutaciones se aplicaron sobre el código fuente, con la librería reconstruida y el servidor reiniciado antes de cada corrida e2e, y se revirtieron (<code>git status</code> limpio).</p>' +
        '<p>Quedó fuera: la matriz completa de funcionalidad por nivel y el mapa de cobertura (INV-01), y las e2e de Firefox y WebKit con varios workers.</p>',
    },
    {
      id: 'audit-2026-11-19',
      title: 'Auditoría de la librería',
      date: '2026-11-19',
      summary:
        '<p>Primera auditoría de la librería, sobre <code>main</code> en <code>3e06819</code>. Rendimiento y renders están dentro de sus presupuestos; lo que aparece está en cómo se arman textos y URLs con valores que vienen de afuera, en dos checks que nadie corre, y en el banco de pruebas.</p>' +
        '<p><b>7 hallazgos: 4 mejoras y 3 optimizaciones.</b> Lo más urgente es que un valor interpolado en una descripción se lee como enlace markdown (SEC-01) y que un valor entra sin codificar en la URL de un origen remoto (BUG-01). Cada uno tiene una prueba marcada como fallo esperado, que pasa a rojo el día que se corrija. Sin regresiones: es la primera corrida.</p>' +
        '<div class="table-wrap"><table><thead><tr><th>Medición</th><th>Resultado</th><th>Condiciones</th></tr></thead><tbody>' +
        '<tr><td>Bundle: total de todos los archivos</td><td>390,5 de 400 kB</td><td rowspan="3">el cálculo del job <code>bundle-size</code>, después de <code>pnpm build</code>; todo lo externo es peer</td></tr>' +
        '<tr><td>Bundle: camino principal, esm, gzip</td><td>31,1 de 33 kB</td></tr>' +
        '<tr><td>Bundle: chunk de agent tools, gzip</td><td>12,3 de 14 kB</td></tr>' +
        '<tr><td>Presupuestos de renders (<code>@render</code>)</td><td>13 de 13 pasan</td><td>producción con sondas (<code>benchmark:probes --strict</code>, 12 aplicadas), Chromium</td></tr>' +
        '<tr><td>Agregar una fila a una lista de 5 o 20 filas</td><td>2 renders de campo, 2 esquemas, 1 fila</td><td>igual en <code>/</code> y <code>/reactive</code>, 3 corridas idénticas</td></tr>' +
        '<tr><td>Quitar la primera fila de N</td><td>0 renders de campo; N filas y 2N efectos en <code>/</code>, 4N en <code>/reactive</code></td><td>lineal por el renombre posicional de las filas que se corren; queda como línea base</td></tr>' +
        '<tr><td><code>pnpm benchmark</code></td><td>6 casos, el más lento <code>resolveRefs</code> con 20 <code>$ref</code>: 0,0095 ms</td><td>mitata, local, carga 5</td></tr>' +
        '</tbody></table></div>' +
        '<p>Pruebas agregadas, todas como fallo esperado: <code>tests/e2e/description-value-link.spec.ts</code> (SEC-01), <code>tests/unit/source-event.spec.ts</code> (BUG-01), <code>tests/unit/path.spec.ts</code> (BUG-02) y <code>tests/e2e/select-aria-invalid.spec.ts</code> (U-01). Cada una se corrió sin la marca para ver que falla por la razón que dice, y las e2e con la marca en los tres navegadores, 3 veces.</p>' +
        '<p>Quedó fuera o a medias: la revisión de React 19 y Jotai más allá de los presupuestos, la entrada de servidor y la hidratación, las agent tools frente a <code>docs/agents/tools.md</code>, y la verificación de cada afirmación de <code>docs/</code>. La guarda de <code>extract.ts</code> sin prueba está en HUE-01, de la auditoría de pruebas.</p>',
    },
    {
      id: 'test-audit-2026-11-19-matriz',
      title: 'Auditoría de pruebas: matriz y cobertura',
      date: '2026-11-19',
      summary:
        '<p>Segunda corrida de la auditoría de pruebas, sobre <code>main</code> en <code>5b26630</code>, para cerrar INV-01: la matriz de funcionalidad por nivel, el mapa de cobertura de las unitarias y una muestra de afirmaciones de <code>docs/</code> cruzadas con las pruebas. Se agregó <code>@vitest/coverage-v8</code> 5.1.0 como devDependency, con aprobación.</p>' +
        '<p><b>4 hallazgos nuevos: 3 críticos (huecos probados) y 1 para investigar.</b> Lo que ninguna prueba protege: las aserciones <code>min</code>, <code>max</code>, <code>minItems</code> y <code>maxItems</code> de <code>rules</code> y las formas arreglo y <code>any</code> de su <code>when</code> (HUE-02); lo que hace un campo cuando su origen remoto responde con un error (HUE-03); y el operador <code>contains</code> (HUE-04). Cada uno es una mutación que pasan las 1282 unitarias y las 762 e2e de Chromium. Dos afirmaciones de <code>docs/</code> sin prueba que no se pudieron mutar quedan en INV-02.</p>' +
        '<h4>Mapa de cobertura (unitarias)</h4>' +
        '<div class="table-wrap"><table><thead><tr><th>Zona</th><th>Líneas</th><th>Ramas</th><th>Nota</th></tr></thead><tbody>' +
        '<tr><td>Todo <code>luna-core/src</code> y <code>luna-react/src</code></td><td>61,6 %</td><td>63,3 %</td><td>la parte React se prueba en e2e, no en unitarias</td></tr>' +
        '<tr><td><code>luna-core/src</code> (33 archivos)</td><td>94,8 % (1861 de 1963)</td><td>89,3 % (1555 de 1741)</td><td></td></tr>' +
        '<tr><td><code>luna-react/src/client/lib</code> (13)</td><td>67,1 % (635 de 946)</td><td>67,1 % (561 de 836)</td><td><code>agent-host.ts</code> (236 líneas) y <code>model-context.ts</code> en 0 %</td></tr>' +
        '<tr><td><code>luna-react/src/client/hook</code> (20)</td><td>0 % (645 líneas)</td><td>0 %</td><td>solo e2e</td></tr>' +
        '<tr><td>componentes de <code>luna-react</code> y <code>server/</code></td><td>2 a 3 %</td><td>0 a 1 %</td><td>solo e2e</td></tr>' +
        '<tr><td><code>luna-react/src/config</code></td><td>100 %</td><td>100 %</td><td></td></tr>' +
        '</tbody></table></div>' +
        '<div class="table-wrap"><table><thead><tr><th>Archivo con cobertura baja o rama de error sin recorrer</th><th>Líneas</th><th>Ramas</th><th>Qué falta y qué se hizo</th></tr></thead><tbody>' +
        '<tr><td><code>luna-core/src/util/schema.ts</code></td><td>93,7 %</td><td>87,2 %</td><td><code>runAssert</code> <code>:1204-1210</code> (<code>minItems</code>, <code>maxItems</code>, <code>min</code>, <code>max</code>), <code>whenHolds</code> <code>:1185</code> y <code>:1194</code>, <code>sizeOf</code>: HUE-02</td></tr>' +
        '<tr><td><code>luna-core/src/fetcher.ts</code></td><td>97,1 %</td><td>90,6 %</td><td>el <code>throw response</code> de una respuesta no 2xx (<code>:41</code>): HUE-03</td></tr>' +
        '<tr><td><code>luna-core/src/util/operator.ts</code></td><td>80 %</td><td>80,6 %</td><td><code>contains</code> <code>:90-98</code> sin ejecutar: HUE-04; <code>truthy</code> con arreglo <code>:116</code></td></tr>' +
        '<tr><td><code>luna-core/src/util/list.ts</code></td><td>88,6 %</td><td>60 %</td><td><code>isMultiFieldList</code> <code>:70-73</code> y <code>getLabel</code> <code>:85</code>; las e2e de listas recorren ambos</td></tr>' +
        '<tr><td><code>luna-core/src/util/logger.ts</code></td><td>81,8 %</td><td>57,1 %</td><td>el filtro por nivel <code>:13-14</code>; no es crítico</td></tr>' +
        '<tr><td><code>luna-core/src/helper/input.ts</code></td><td>83,3 %</td><td>78,1 %</td><td>ramas de presentación (<code>:520-543</code>, <code>:608-613</code>); las e2e de campos las recorren</td></tr>' +
        '<tr><td><code>luna-core/src/util/attributes.ts</code>, <code>format.ts</code></td><td>81,3 y 93,1 %</td><td>84,6 y 83,5 %</td><td>ramas de formato y atributos opcionales; no son críticas</td></tr>' +
        '<tr><td><code>client/lib/compose-list-value.ts</code></td><td>55,6 %</td><td>53,8 %</td><td><code>readLeaf</code> nunca recibe una lista anidada montada. Control M8: la unitaria no la atrapa, pero sí 4 e2e (<code>list-nested-outer-clobber</code> y <code>agent-tools</code>). Cubierto arriba, no es hueco</td></tr>' +
        '<tr><td><code>client/lib/host-value-store.ts</code>, <code>source-store.ts</code></td><td>30 y 55,6 %</td><td>0 %</td><td>átomos que solo montan las e2e</td></tr>' +
        '<tr><td><code>client/lib/agent-tools.ts</code></td><td>93,2 %</td><td>87 %</td><td>ramas de error de herramientas; la e2e <code>agent-tools</code> recorre el camino feliz</td></tr>' +
        '</tbody></table></div>' +
        '<h4>Matriz de funcionalidad por nivel</h4>' +
        '<div class="table-wrap"><table><thead><tr><th>Funcionalidad</th><th>Unitarias (<code>tests/unit/</code>)</th><th>E2E (<code>tests/e2e/</code>)</th><th>Hueco</th></tr></thead><tbody>' +
        '<tr><td>input</td><td>is-input, schema, schema-number, helper/input, attributes</td><td>input, input-group, empty-value, transform, default-value</td><td></td></tr>' +
        '<tr><td>select</td><td>input-selectable, schema, translate-options</td><td>select, select-default-value-skip, select-double-selection-bug, select-aria-invalid, option-not-offered</td><td></td></tr>' +
        '<tr><td>chips</td><td>input-selectable, schema, helper/preview-options</td><td>chips, chips-single, chips-days, chips-days-single, chips-mapped, chips-double-selection-bug</td><td></td></tr>' +
        '<tr><td>radio</td><td>input-selectable, schema, declarative-validation</td><td>radio, options-written</td><td></td></tr>' +
        '<tr><td>checkbox</td><td>schema, helper/input</td><td>checkbox, failed-submit</td><td></td></tr>' +
        '<tr><td>date</td><td>display-date, to-native-date, get-date-format, get-month, get-year, get-week-days, operator-date-comparisons</td><td>date-picker, date-initial-value, date-submission-default, -dd-mm-yyyy, -mm-dd-yyyy</td><td></td></tr>' +
        '<tr><td>time</td><td>to-native-time, from-native-time, get-time-format</td><td>time-rendering, time-submission, time-initial-value</td><td></td></tr>' +
        '<tr><td>time zone</td><td>get-timezones, format</td><td>timezone, locale-selectors</td><td></td></tr>' +
        '<tr><td>listas: agregar</td><td>list, list-guard, store-helper</td><td>list, list-add-button, list-multifield, list-column</td><td></td></tr>' +
        '<tr><td>listas: quitar</td><td>store-helper, compose-list-value</td><td>list-remove-ghost-item, -nonlast-hydrated, -nonlast-typed, -required-clobber, list-collapsible-removal</td><td></td></tr>' +
        '<tr><td>listas: colapsar</td><td><b>ninguna</b></td><td>list-collapsible, -clickable, -preview, list-collapsed-*, collapsed-submit</td><td>solo e2e; es presentación, no hueco</td></tr>' +
        '<tr><td>listas: anidar</td><td>compose-list-value (sin lista anidada montada)</td><td>list-nested-change-propagation, -hydration, -keep-value, -outer-clobber, -state-event</td><td>cubierto en e2e (control M8)</td></tr>' +
        '<tr><td>listas: conservar valores</td><td>compose-list-value, with-declared-fields</td><td>list-collapsed-value-preservation, list-nested-keep-value, hidden-clear</td><td></td></tr>' +
        '<tr><td>visibilidad y <code>state</code></td><td>condition, state-event</td><td>visibility, recursive-visibility, state, state-chained-reveal, state-value-cleanup, list-visibility, hidden-clear</td><td></td></tr>' +
        '<tr><td>eventos de valor</td><td>value-event, proxy-event</td><td>event, value-event-autofill, list-value-event, list-value-event-typed, initial-value-events</td><td></td></tr>' +
        '<tr><td>operadores</td><td>operator-eq, -neq, -in, -nin, -gt, -gte, -lt, -lte, -empty, -date-comparisons, -map</td><td>a través de eventos y validación</td><td><b>HUE-04</b>: <code>contains</code> sin prueba</td></tr>' +
        '<tr><td>validación declarativa</td><td>declarative-validation, schema</td><td>declarative-validation</td><td><b>HUE-02</b>: <code>rules</code> con <code>min</code>, <code>max</code>, <code>minItems</code>, <code>maxItems</code> y <code>when</code> arreglo o <code>any</code></td></tr>' +
        '<tr><td>validación custom</td><td>schema, build-form-schema</td><td>custom-validation</td><td></td></tr>' +
        '<tr><td>valores iniciales</td><td>resolve-value, schema, value-event</td><td>initial-value, initial-value-list, -events, -chips-*, -nested-state-event, default-value</td><td></td></tr>' +
        '<tr><td>submit</td><td>build-form-schema, schema-absent-values</td><td>form-action, readonly-submit</td><td></td></tr>' +
        '<tr><td>submit fallido</td><td><b>ninguna</b></td><td>failed-submit, failed-submit-focus, collapsed-submit</td><td>solo e2e; es el flujo de React</td></tr>' +
        '<tr><td>origen remoto: camino feliz</td><td>fetcher, source, source-event, url</td><td>select (fetch source), event, options-written, translation-options</td><td></td></tr>' +
        '<tr><td>origen remoto: error de red o no 2xx</td><td><b>ninguna</b></td><td><b>ninguna</b></td><td><b>HUE-03</b></td></tr>' +
        '<tr><td>origen remoto: respuesta inválida</td><td>extract (<code>getArray</code> sin arreglo)</td><td><b>ninguna</b></td><td>parte de HUE-03</td></tr>' +
        '<tr><td>traducción</td><td>translate, translate-options</td><td>translation, translation-options, label-locale</td><td></td></tr>' +
        '<tr><td>entrada de servidor</td><td><b>ninguna</b></td><td>server-entry</td><td>solo e2e</td></tr>' +
        '<tr><td>agent tools</td><td>agent-tools, tool-schema</td><td>agent-tools, authoring-tools</td><td><code>agent-host.ts</code> solo e2e</td></tr>' +
        '</tbody></table></div>' +
        '<h4>Muestra de afirmaciones de <code>docs/</code></h4>' +
        '<div class="table-wrap"><table><thead><tr><th>Afirmación</th><th>Página</th><th>Prueba</th></tr></thead><tbody>' +
        '<tr><td>Las aserciones <code>minItems</code>, <code>maxItems</code>, <code>min</code> y <code>max</code> de <code>rules</code></td><td><code>validation/overview.md</code></td><td><b>ninguna</b> (HUE-02)</td></tr>' +
        '<tr><td>Un <code>when</code> arreglo es AND; <code>any</code> pide al menos una</td><td><code>validation/overview.md</code></td><td><b>ninguna</b> (HUE-02)</td></tr>' +
        '<tr><td>El operador <code>contains</code></td><td><code>validation/overview.md</code></td><td><b>ninguna</b> (HUE-04)</td></tr>' +
        '<tr><td>Una respuesta no 2xx se registra y el campo muestra una lista vacía</td><td><code>fields/data-source.md</code></td><td><b>ninguna</b> (HUE-03)</td></tr>' +
        '<tr><td>Una URL bloqueada por <code>remotePatterns</code> se registra; las relativas siempre pasan</td><td><code>fields/data-source.md</code></td><td>url, event (<code>:420</code>)</td></tr>' +
        '<tr><td>Una URL con <code>null</code> o <code>undefined</code> se rechaza antes del pedido</td><td><code>fields/data-source.md</code></td><td>fetcher</td></tr>' +
        '<tr><td>Una fila colapsada conserva sus valores, valida, se envía y se abre si falla</td><td><code>fields/list.md</code></td><td>collapsed-submit</td></tr>' +
        '<tr><td><code>keepValue</code> en una lista deja los valores de sus filas</td><td><code>fields/list.md</code></td><td>hidden-clear</td></tr>' +
        '<tr><td>Dos campos con el mismo origen comparten un pedido</td><td><code>fields/data-source.md</code></td><td><b>ninguna</b> (INV-02)</td></tr>' +
        '<tr><td>Un <code>select</code> deshabilitado con origen remoto muestra su valor objeto como única opción</td><td><code>fields/data-source.md</code></td><td><b>ninguna</b>; <code>select.spec.ts:127</code> solo cubre un origen arreglo (INV-02)</td></tr>' +
        '</tbody></table></div>' +
        '<h4>Mutaciones</h4>' +
        '<div class="table-wrap"><table><thead><tr><th>Mutación</th><th>Unitarias (1282)</th><th>E2E Chromium (762)</th><th>Hallazgo</th></tr></thead><tbody>' +
        '<tr><td>M1 a M6 en <code>schema.ts</code> (<code>runAssert</code> y <code>whenHolds</code>)</td><td>pasan, una por una</td><td rowspan="2">pasan las 762 con M1 a M7 juntas (2,8 min)</td><td>HUE-02</td></tr>' +
        '<tr><td>M7 <code>fetcher.ts:37</code> <code>if (request.ok)</code> → <code>if (true)</code></td><td>pasa</td><td>HUE-03</td></tr>' +
        '<tr><td>M8 <code>compose-list-value.ts:75</code> <code>if (nested)</code> → <code>if (nested &amp;&amp; false)</code> (control)</td><td>pasa</td><td>fallan 4</td><td>no es hueco</td></tr>' +
        '<tr><td>M9 <code>operator.ts:90</code> <code>contains</code> siempre <code>false</code></td><td>pasa</td><td>pasa (las 762, 3,1 min)</td><td>HUE-04</td></tr>' +
        '</tbody></table></div>' +
        '<p class="muted">Cobertura: <code>pnpm vitest run --coverage --coverage.include=packages/luna-core/src/** --coverage.include=packages/luna-react/src/**</code>, reportes <code>json-summary</code>, <code>json</code> y <code>text</code>, 1282 casos en 3,35 s. E2E: <code>next dev</code> propio en el puerto 3217, Chromium, 4 workers, <code>--retries=0</code>, carga 8 a 11 en 11 núcleos. Cada mutación de la librería se aplicó al código fuente, con <code>pnpm build</code>, verificación de que el bundle de <code>dist</code> la contenía y reinicio del servidor; se revirtió y se reconstruyó (<code>git status</code> limpio en <code>packages/</code>).</p>',
    },
  ],
  findings: [
    {
      code: 'HUE-01',
      title:
        'La guarda de miembros heredados en rutas con puntos se puede romper sin que falle ninguna prueba',
      sev: 'crit',
      sevNote: 'guarda de seguridad',
      cat: 'pruebas',
      st: 'corregido',
      stLabel: 'Corregido en #208',
      audit: 'test-audit-2026-11-19',
      sections: [
        { label: 'Área', html: '<p>Huecos.</p>' },
        {
          label: 'Dónde',
          html: '<p><code>packages/luna-core/src/util/extract.ts:79</code> (<code>resolveEntry</code>, cada paso de una ruta con puntos) y <code>:258</code> (<code>unflatten</code>, cada objeto intermedio). Sin prueba en <code>tests/unit/extract.spec.ts</code> ni en <code>tests/unit/resolve-value.spec.ts</code>.</p>',
        },
        {
          label: 'Qué pasa',
          html: '<p>Las pruebas de SEG-2 cubren un nombre que es en sí un miembro heredado (<code>__proto__</code>, <code>toString</code>) y el filtro <code>isUnsafePath</code>. Ninguna cubre un miembro heredado <b>en medio</b> de una ruta, que es lo que guardan los <code>hasOwn</code> de cada paso. Si alguien los cambia por <code>in</code>, <code>unflatten({ "toString.label": "a" })</code> devuelve <code>{}</code> y escribe <code>label</code> sobre <code>Object.prototype.toString</code>, una función que comparte toda la página, y <code>resolveEntry("address.toString", …)</code> encuentra un valor que nadie escribió.</p>',
        },
        {
          label: 'Evidencia',
          html: '<p>Con las dos mutaciones aplicadas, un script con <code>tsx</code> sobre el código fuente: original <code>{"toString":{"label":"a"},"valueOf":{"x":1}}</code> y <code>Object.prototype.toString.label</code> <code>undefined</code>; mutado <code>{}</code> y <code>"a"</code>. <code>resolveEntry</code> pasa de <code>{"found":false}</code> a <code>{"found":true}</code>. El bundle de <code>dist</code> cambia con la mutación (hash distinto), así que las e2e corrieron la versión rota.</p>',
        },
        {
          label: 'Mutaciones',
          html:
            '<div class="table-wrap"><table><thead><tr><th>Mutación</th><th>Unitarias (1257)</th><th>E2E Chromium (743)</th></tr></thead><tbody>' +
            '<tr><td>M1 <code>:57</code> <code>hasOwn(currentValue, name)</code> → <code>name in currentValue</code></td><td>falla (3 casos)</td><td>no se corrió</td></tr>' +
            '<tr><td>M2 <code>:79</code> <code>!hasOwn(result, key)</code> → <code>!(key in result)</code></td><td>pasa</td><td rowspan="2">pasan las 743 con M2 y M3 juntas</td></tr>' +
            '<tr><td>M3 <code>:258</code> <code>!hasOwn(current, part)</code> → <code>!(part in current)</code></td><td>pasa</td></tr>' +
            '</tbody></table></div>',
        },
        {
          label: 'Costo',
          html: '<p>Ninguno en tiempo: las pruebas que faltan son unitarias de milisegundos.</p>',
        },
        {
          label: 'Propuesta',
          html: '<p>Dos casos en <code>tests/unit/extract.spec.ts</code>: <code>unflatten</code> de <code>toString.label</code> y <code>valueOf.x</code> devuelve los objetos anidados y no toca <code>Object.prototype.toString</code>; <code>resolveEntry</code> de <code>address.toString</code> y <code>items.0.constructor</code> responde <code>found: false</code>.</p>',
        },
        {
          label: 'Corrección',
          audit: 'test-audit-2026-11-19',
          html:
            '<p>Dos casos nuevos en <code>tests/unit/extract.spec.ts</code>, sin tocar el código de la librería. <code>unflatten({ "toString.label": "a", "valueOf.x": 1 })</code> devuelve <code>{ toString: { label: "a" }, valueOf: { x: 1 } }</code> y deja <code>label</code> y <code>x</code> en <code>undefined</code> sobre <code>Object.prototype.toString</code> y <code>Object.prototype.valueOf</code>; un bloque <code>finally</code> los borra, para que una mutación que falla no contamine las pruebas siguientes. <code>resolveEntry</code> de <code>address.toString</code> y de <code>items.0.constructor</code> responde <code>{ found: false, value: undefined }</code>.</p>' +
            '<div class="table-wrap"><table><thead><tr><th>Mutación</th><th>Antes</th><th>Después</th></tr></thead><tbody>' +
            '<tr><td>M2 <code>resolveEntry</code>, <code>!hasOwn(result, key)</code> → <code>!(key in result)</code></td><td>pasa (0 de 1257)</td><td>falla 1: <i>should not walk into an inherited member in the middle of a path</i></td></tr>' +
            '<tr><td>M3 <code>unflatten</code>, <code>!hasOwn(current, part)</code> → <code>!(part in current)</code></td><td>pasa (0 de 1257)</td><td>falla 1: <i>should nest under a segment named like an inherited member</i>, que recibe <code>{}</code></td></tr>' +
            '</tbody></table></div>' +
            '<p class="muted">Cada mutación aplicada sola sobre el código fuente, corrida con <code>vitest</code> sobre la spec y revertida. Sin mutaciones pasan las 1332 unitarias, lint, typecheck de los paquetes, <code>knip</code> y <code>prettier --check</code>.</p>',
        },
        {
          label: 'Plan de corrección',
          html: '<p><b>Fase 1.</b> HUE-01. <b>Crear primero:</b> los dos casos, y ver que fallan con M2 y con M3. <b>Antes:</b> 0 de 1257 unitarias y 0 de 743 e2e atrapan M2 o M3. <b>Después:</b> cada mutación falla al menos un caso. <b>Protección esperada:</b> la guarda que impide escribir sobre miembros compartidos queda fijada.</p>',
        },
      ],
    },
    {
      code: 'FLK-01',
      title:
        'Un clic en Submit justo después de cargar puede enviar el formulario vacío, antes de que el editor lea la definición',
      sev: 'mejora',
      cat: 'pruebas',
      st: 'corregido',
      stLabel: 'Corregido en #209',
      audit: 'test-audit-2026-11-19',
      sections: [
        { label: 'Área', html: '<p>Inestables.</p>' },
        {
          label: 'Dónde',
          html: '<p>8 casos que hacen clic en Submit en cuanto termina <code>goto</code>: <code>option-not-offered.spec.ts</code> (líneas 107, 114, 135, 148 y 223), <code>date-picker.spec.ts</code> (472 y 513) y <code>form-action.spec.ts</code> (189). La causa está en el banco: <code>apps/react-luna-editor/lib/store.ts</code> lee la definición con <code>atomWithStorage</code>.</p>',
        },
        {
          label: 'Qué pasa',
          html: '<p>El servidor no conoce el <code>localStorage</code>, así que manda un formulario sin campos con su botón Submit. Al hidratar, <code>atomWithStorage</code> empieza con el mismo valor vacío y recién después de montar lee la definición inyectada. Un clic en ese intervalo envía <code>{}</code> con éxito, y la prueba espera hasta el timeout un mensaje de validación que no va a llegar. Los casos que primero esperan un campo de la definición (como <code>open()</code> en <code>readonly-submit.spec.ts</code>) no tienen el problema.</p>',
        },
        {
          label: 'Evidencia',
          html:
            '<ul><li><b>CI:</b> en 3 corridas del 19/11, 4 casos de WebKit pasaron al reintentar, y los 4 son de esta lista: <code>holds back a radio value it does not offer (required: true)</code> en 2 de 3 corridas, <code>holds back a value a list row does not offer</code>, <code>should validate and submit a field named after an object member</code> y <code>should hand a range to its change events as the pair it holds</code>, que recibió <code>Object {}</code>.</li>' +
            '<li><b>Local:</b> <code>option-not-offered</code> y <code>form-action</code> en WebKit con <code>--repeat-each=8 --retries=0</code>: 1 de 184 falla igual.</li>' +
            '<li><b>Causa:</b> una prueba temporal que navega con <code>waitUntil: "commit"</code> y hace clic en Submit falló 1 de 6 veces, y su snapshot muestra «Form submitted successfully» con <code>{}</code> y debajo el campo inyectado.</li></ul>',
        },
        {
          label: 'Costo',
          html: '<p>Cada intento fallido de un caso que espera el mensaje de validación agota el timeout de 15 s: 16, 48 y 2 s por corrida en las 3 medidas, y la mediana de <code>holds back a radio value it does not offer (required: true)</code> en WebKit es 15,8 s, frente a 1 s cuando pasa a la primera. En el peor caso cuesta un job en rojo.</p>',
        },
        {
          label: 'Propuesta',
          html: '<p>Una espera compartida en <code>tests/e2e/support/</code>, del tipo <code>open(page, definition, route)</code>, que inyecta, navega y espera un elemento que solo tiene la definición inyectada, como ya hace <code>readonly-submit.spec.ts</code>. Otra opción es que el editor marque cuándo terminó de leer la definición (por ejemplo, un <code>data-ready</code> en el formulario) y que la espera lea esa marca. Con eso, los 8 casos dejan de depender del orden de llegada.</p>',
        },
        {
          label: 'Evidencia en CI',
          audit: 'test-audit-2026-11-19',
          html: '<p>En la línea base (<code>next dev</code>, 8 corridas del 19/11) apareció en 6 corridas, siempre en WebKit: <code>option-not-offered</code>, <code>date-picker :: should hold back a host range that runs over a reserved day</code> y <code>form-action</code>. Con WebKit sobre <code>next start</code> (OPT-03), 0 en 12 corridas: producción hidrata más rápido y la ventana casi no se abre. Eso no corrige la carrera, que está en el banco de pruebas y en Chromium sigue sobre <code>next dev</code>.</p>',
        },
        {
          label: 'Corrección',
          audit: 'test-audit-2026-11-19',
          html:
            '<p>En el banco, no en las pruebas. <code>lib/store.ts</code> lee la definición con <code>getOnInit</code>, al crear el átomo y no en un efecto, y <code>useDefinition()</code> dice si ya pasó la hidratación. Las dos vistas, <code>/</code> y <code>/reactive</code>, montan el formulario y su Submit solo entonces, así que no existe un Submit sin la definición que envía y el clic de Playwright espera solo. Ninguna prueba tuvo que cambiar, y una prueba nueva no puede volver a abrir la carrera. Se descartó la espera compartida en <code>tests/e2e/support/</code>: protege solo a los casos que la usan, y la prueba de la carrera, que hace clic desde la página, sigue fallando con ella.</p>' +
            '<p>La prueba de la carrera es <code>tests/e2e/definition-ready.spec.ts</code>: un hook de devtools hace clic en Submit en un microtask después del primer commit que lo muestra hidratado, antes de que corran los efectos de ese commit.</p>' +
            '<div class="table-wrap"><table><thead><tr><th>Medición</th><th>Antes</th><th>Después</th></tr></thead><tbody>' +
            '<tr><td>Prueba de la carrera, <code>next dev</code>, <code>--repeat-each=10</code></td><td>falla 47 de 60: Chromium 19 de 20, Firefox 19 de 20, WebKit 9 de 20; recibe «Form submitted successfully» con <code>{}</code></td><td>pasa 60 de 60</td></tr>' +
            '<tr><td>Prueba de la carrera, <code>next start</code></td><td>pasa 30 de 30: en producción los efectos corren antes del microtask</td><td>pasa</td></tr>' +
            '<tr><td><code>option-not-offered</code>, <code>date-picker</code>, <code>form-action</code> y la prueba de la carrera, <code>--repeat-each=20 --retries=0</code></td><td>1 de 184 en WebKit con 8 repeticiones</td><td>Chromium sobre <code>next dev</code>: 900 de 900; los tres navegadores sobre <code>next start</code>: 2700 de 2700</td></tr>' +
            '</tbody></table></div>' +
            '<p class="muted">Local, 4 workers, servidor reiniciado después de cada build. Pasan la suite e2e completa (Chromium sobre <code>next dev</code> 775 de 775, Firefox y WebKit sobre <code>next start</code> 1548 de 1548), los 13 presupuestos de renders con las sondas, las 1332 unitarias, lint, typecheck, <code>knip</code> y <code>prettier --check</code>. Sin errores ni avisos de hidratación en consola en <code>/</code> y <code>/reactive</code>.</p>',
        },
        {
          label: 'Plan de corrección',
          html: '<p><b>Fase 2.</b> FLK-01. <b>Crear primero:</b> la prueba de la carrera, que retrasa la lectura de la definición y hace clic en Submit, y debe fallar sin la espera. <b>Antes:</b> 1 de 184 en local y 4 reintentos en 3 corridas de CI. <b>Después:</b> 0 fallos con <code>--repeat-each=20 --retries=0</code> en los tres navegadores. <b>Ahorro esperado:</b> hasta 48 s por corrida de CI, y ningún job rojo por esta causa.</p>',
        },
      ],
    },
    {
      code: 'GUA-01',
      title:
        'CI termina en verde con casos que pasaron al reintentar, y nadie se entera',
      sev: 'mejora',
      cat: 'pruebas',
      st: 'medido',
      audit: 'test-audit-2026-11-19',
      sections: [
        { label: 'Área', html: '<p>Guardas.</p>' },
        {
          label: 'Dónde',
          html: '<p><code>playwright.config.ts</code> (<code>retries: process.env.CI ? 2 : 0</code>) y el job <code>e2e-report</code> de <code>.github/workflows/build-and-test.yml</code>.</p>',
        },
        {
          label: 'Qué pasa',
          html: '<p>Con 2 reintentos, un caso que falla y después pasa deja el job en verde. El reporte HTML combinado lo marca como <code>flaky</code>, pero nadie lo abre si CI está verde, y se borra al día siguiente (<code>retention-days: 1</code>).</p>',
        },
        {
          label: 'Evidencia',
          html: '<p>Las 3 corridas de PR del 19/11 terminaron en verde con 1, 3 y 1 casos <code>flaky</code>, todos de FLK-01, que existía sin que nadie lo hubiera reportado.</p>',
        },
        {
          label: 'Costo',
          html: '<p>Poco en tiempo (1 a 7 s de reintentos exitosos por corrida, más el intento fallido que cuenta FLK-01); el costo es que la inestabilidad crece sin que se vea.</p>',
        },
        {
          label: 'Propuesta',
          html: '<p>Que <code>e2e-report</code> cuente los casos <code>flaky</code> del reporte combinado y los publique en el resumen del job (<code>$GITHUB_STEP_SUMMARY</code>), o activar <code>failOnFlakyTests</code> de Playwright cuando FLK-01 esté corregido.</p>',
        },
        {
          label: 'Evidencia en CI',
          audit: 'test-audit-2026-11-19',
          html: '<p>Medido el 19/11 sobre los reportes combinados (<code>merge-reports --reporter json</code>). Línea base, 8 corridas en verde: 20 casos <code>flaky</code> en 6 de ellas, todos de WebKit y todos de la familia de FLK-01; los intentos fallidos sumaron de 0 a 125 s por corrida. Con Firefox y WebKit sobre <code>next start</code> (OPT-03), 12 corridas: 0 casos <code>flaky</code>. La guarda sigue haciendo falta: ninguno de los 20 dejó rastro en el PR que corrió.</p>',
        },
        {
          label: 'Plan de corrección',
          html: '<p><b>Fase 6.</b> GUA-01, después de FLK-01 (corregido en #209). <b>Crear primero:</b> una corrida con un caso inestable a propósito, que tiene que aparecer en el resumen. <b>Antes:</b> 5 casos <code>flaky</code> en 3 corridas sin aviso. <b>Después:</b> cada uno aparece en el resumen del job. <b>Protección esperada:</b> una inestabilidad nueva se ve en el PR que la trae.</p>',
        },
      ],
    },
    {
      code: 'OPT-02',
      title:
        'Las e2e de CI corren con 1 worker; con 2 la misma suite tarda la mitad',
      sev: 'mejora',
      cat: 'pruebas',
      st: 'medido',
      stLabel: 'Sin aplicar: Playwright recomienda 1 worker en CI',
      sevNote: 'falta medir en CI',
      audit: 'test-audit-2026-11-19',
      sections: [
        { label: 'Área', html: '<p>Tiempo de la suite.</p>' },
        {
          label: 'Dónde',
          html: '<p><code>playwright.config.ts</code>: <code>workers: process.env.CI ? 1 : undefined</code>.</p>',
        },
        {
          label: 'Qué pasa',
          html: '<p>Cada job e2e corre sus casos uno detrás de otro, aunque la config ya pide <code>fullyParallel</code>. La corrida de pruebas es casi todo el job, y el job más largo (WebKit 2/2, 713 s de mediana) decide cuándo hay veredicto.</p>',
        },
        {
          label: 'Evidencia',
          html:
            '<div class="table-wrap"><table><thead><tr><th>Chromium, <code>next dev</code>, 743 casos</th><th>Tiempo</th><th>Fallos</th></tr></thead><tbody>' +
            '<tr><td>1 worker</td><td>645 y 522 s</td><td>0 y 0</td></tr>' +
            '<tr><td>2 workers</td><td>268 s</td><td>0</td></tr>' +
            '<tr><td>4 workers</td><td>156 s</td><td>0</td></tr>' +
            '</tbody></table></div><p class="muted">Local, 11 núcleos, <code>CI=1</code>, <code>--retries=0</code>, una corrida por configuración; la carga subió hasta 20 durante la primera de 1 worker por otras sesiones, y la segunda, con carga 3,8 a 6,3, tardó 522 s. Frente a esa, 2 workers son un 49 % menos. El runner de GitHub tiene 4 vCPU, así que el ahorro en CI hay que medirlo allá. Con 2 y 4 workers no apareció ningún fallo nuevo, ni de orden ni de tiempo.</p>',
        },
        {
          label: 'Costo',
          html: '<p>Hoy, 838 s de mediana hasta el veredicto. Si 2 workers rinden en CI la mitad de lo que rinden aquí (un 25 % menos en vez de un 49 %), el job más largo bajaría unos 3 minutos (cálculo, no medición).</p>',
        },
        {
          label: 'Propuesta',
          html: '<p>Probar <code>workers: 2</code> en CI en un PR, al menos 3 corridas, comparando cada job con estas medianas y mirando los <code>flaky</code>. Conviene corregir FLK-01 antes, porque más paralelismo agranda la ventana de esa carrera.</p>',
        },
        {
          label: 'Corrección',
          audit: 'test-audit-2026-11-19',
          html: '<p>No se aplica por ahora. La guía de CI de Playwright recomienda <code>workers: 1</code> en CI, para priorizar estabilidad y reproducibilidad, y paralelizar con shards. Con OPT-03 y OPT-01 el veredicto ya bajó de 822 a 584 s sin cambiar los workers. FLK-01, que más paralelismo habría agrandado, ya está corregido en #209, así que esa razón para esperar ya no aplica. Queda para medir si hace falta bajar más, empezando por Chromium, que hoy es el job más lento.</p>',
        },
        {
          label: 'Plan de corrección',
          html: '<p><b>Fase 3.</b> OPT-02, después de FLK-01 (corregido en #209). <b>Crear primero:</b> 3 corridas de CI con <code>workers: 2</code>. <b>Antes:</b> 838 s hasta el veredicto, WebKit 2/2 en 713 s. <b>Después:</b> los mismos jobs con 2 workers. <b>Ahorro esperado:</b> a medir; localmente, 49 % menos en Chromium.</p>',
        },
      ],
    },
    {
      code: 'OPT-03',
      title:
        'Las e2e de CI corren sobre next dev; sobre next start la misma suite pasa entera y tarda entre un 21 y un 30 % menos',
      sev: 'mejora',
      cat: 'pruebas',
      st: 'corregido',
      stLabel: 'Corregido en #200',
      sevNote: 'falta medir en CI',
      audit: 'test-audit-2026-11-19',
      sections: [
        { label: 'Área', html: '<p>Tiempo de la suite.</p>' },
        {
          label: 'Dónde',
          html: '<p>El paso <code>Start application server</code> del job <code>e2e-test</code>, que corre <code>pnpm serve</code> (<code>next dev</code>).</p>',
        },
        {
          label: 'Qué pasa',
          html: '<p><code>next dev</code> compila cada ruta al primer pedido y corre React en modo desarrollo, con StrictMode duplicando renders y efectos. Ninguna prueba de <code>@e2e</code> depende de eso: las 743 de Chromium pasan sobre <code>next start</code>. El job <code>render-budget</code> ya usa producción.</p>',
        },
        {
          label: 'Evidencia',
          html:
            '<div class="table-wrap"><table><thead><tr><th>Chromium, 743 casos</th><th><code>next dev</code></th><th><code>next start</code></th></tr></thead><tbody>' +
            '<tr><td>1 worker, primera corrida</td><td>645 s (carga hasta 20)</td><td>420 s</td></tr><tr><td>1 worker, repetida con menos carga</td><td>522 s</td><td>412 s</td></tr>' +
            '<tr><td>4 workers</td><td>156 s</td><td>109 s</td></tr>' +
            '</tbody></table></div><p class="muted">Local, <code>CI=1</code>, <code>--retries=0</code>, 0 fallos en las seis. La primera corrida de 1 worker sobre <code>next dev</code> coincidió con carga alta de otras sesiones; repetida con carga 3,8 a 6,3, la diferencia queda en 21 %. Con 4 workers, 30 %.</p>',
        },
        {
          label: 'Costo',
          html: '<p>El build de producción del editor ya está en la caché de turbo del job (el paso <code>Build project</code> tarda menos de 5 s), así que servir producción no agrega un build.</p>',
        },
        {
          label: 'Propuesta',
          html: '<p>Arrancar <code>pnpm start</code> en el job <code>e2e-test</code>. Lo que solo pasa en desarrollo (avisos de <code>logger</code>, StrictMode) ya no se probaría en e2e: cubrirlo con una prueba unitaria o con un proyecto aparte, si hace falta.</p>',
        },
        {
          label: 'Corrección',
          audit: 'test-audit-2026-11-19',
          html:
            '<p>Medido en GitHub (runner de 4 vCPU, contenedor de Playwright, 1 worker, 2 reintentos), del 19/11. Chromium se queda en <code>next dev</code> para que StrictMode siga corriendo en e2e; no estaba en el camino crítico. Firefox y WebKit pasan a <code>next start</code>, como recomienda la guía de Playwright de Next.js. El <code>.next</code> de producción ya viene de la caché de turbo, así que no se agrega un build.</p>' +
            '<div class="table-wrap"><table><thead><tr><th>Configuración en CI</th><th>Corridas</th><th>Veredicto, mediana</th><th>Job e2e más lento, mediana</th><th>Casos <code>flaky</code></th></tr></thead><tbody>' +
            '<tr><td>Línea base: <code>next dev</code>, 2 shards por navegador</td><td>8</td><td>822 s (710 a 1123)</td><td>WebKit 2/2, 719 s</td><td>20 en 6 corridas, todos WebKit</td></tr>' +
            '<tr><td>B: Firefox y WebKit sobre <code>next start</code>, 2 shards (<a href="https://github.com/jonattanva/luna-form/pull/196">#196</a>)</td><td>6</td><td>656 s (592 a 799)</td><td>WebKit 2/2, 556 s</td><td>0; 1 corrida en rojo por un localizador (ver abajo)</td></tr>' +
            '<tr><td>E: B más 3 shards en Firefox y WebKit (<a href="https://github.com/jonattanva/luna-form/pull/197">#197</a>)</td><td>6</td><td>584 s (573 a 602)</td><td>Chromium 2/2 sobre <code>next dev</code>, 503 s</td><td>0, sin fallos</td></tr>' +
            '</tbody></table></div>' +
            '<p>Suma de las duraciones de los casos, mediana: Firefox de 1039 a 803 s (-23 %) y WebKit de 1252 a 979 s (-22 %), en las 12 corridas de B y E. Chromium, que no cambió de servidor, de 770 a 748 s.</p>' +
            "<p><b>Fallo que apareció:</b> en la tercera corrida de B, <code>list-preview-object.spec.ts :: expanded item: keeps preview label but hides badge and tags</code> falló los 3 intentos en WebKit. <code>getByText('Admin')</code> encontraba el token <code>\"Admin\"</code> del editor Monaco, no el badge del formulario. Es un localizador flojo que <code>next start</code> deja ver más seguido. Se corrige con <code>{ exact: true }</code> en el commit <code>test(e2e): match the list preview badge and tags exactly, not the editor's JSON</code>: 120 de 120 en los tres navegadores con <code>--repeat-each=10 --retries=0</code> sobre producción, y con la mutación que deja el badge visible al expandir (<code>field-list-item.tsx:170</code>, sin <code>!isOpen</code>) la prueba falla. Las 6 corridas siguientes, 3 por variante, ya llevan la corrección.</p>" +
            '<p><b>Protección (regla 6):</b> la única rama de la librería que depende del modo es <code>isProduction()</code> de <code>luna-core/src/util/logger.ts</code>, y ninguna e2e lee esos avisos. Lo que solo pasa en desarrollo, StrictMode con renders y efectos dobles, sigue cubierto por Chromium en <code>next dev</code>.</p>',
        },
        {
          label: 'Plan de corrección',
          html: '<p><b>Fase 3.</b> OPT-03. <b>Crear primero:</b> la corrida completa de los tres navegadores sobre <code>next start</code> sin fallos. <b>Antes:</b> 838 s hasta el veredicto. <b>Después:</b> 3 corridas de CI con <code>next start</code>. <b>Ahorro esperado:</b> a medir; localmente, 21 % menos con 1 worker y 30 % con 4.</p>',
        },
      ],
    },
    {
      code: 'DUP-01',
      title:
        'date-submission-dd-mm-yyyy y mm-dd-yyyy atrapan lo mismo que date-submission-default y no prueban el formato que nombran',
      sev: 'mejora',
      cat: 'pruebas',
      st: 'corregido',
      stLabel: 'Corregido en #188',
      audit: 'test-audit-2026-11-19',
      sections: [
        {
          label: 'Área',
          html: '<p>Repetidas, y no prueban lo que prometen.</p>',
        },
        {
          label: 'Dónde',
          html: '<p><code>tests/e2e/date-submission-dd-mm-yyyy.spec.ts :: should submit value in yyyy-MM-dd format</code> y <code>tests/e2e/date-submission-mm-dd-yyyy.spec.ts :: should submit value in yyyy-MM-dd format</code>, frente a <code>tests/e2e/date-submission-default.spec.ts :: should submit value in yyyy-MM-dd format after user input</code>.</p>',
        },
        {
          label: 'Qué pasa',
          html: '<p>Los dos archivos son idénticos salvo por <code>advanced.format</code>. Escriben <code>2024-06-15</code>, texto ISO, que <code>readDay</code> lee por su rama ISO antes de mirar el formato. El formato nunca interviene: una mutación que lo ignora pasa en los dos.</p>',
        },
        {
          label: 'Mutaciones',
          html:
            '<div class="table-wrap"><table><thead><tr><th>Mutación (<code>packages/luna-core/src/util/date.ts</code>)</th><th>dd-mm</th><th>mm-dd</th><th>default, after user input</th><th>Otras que la atrapan</th></tr></thead><tbody>' +
            '<tr><td>E2 <code>:538</code> <code>getDateFormat</code> ignora <code>advanced.format</code></td><td>pasa</td><td>pasa</td><td>pasa</td><td>4 unitarias, 2 de <code>date-initial-value</code> y 2 de <code>date-picker</code></td></tr>' +
            '<tr><td>E3 <code>:435</code> sin la rama ISO de <code>readDay</code></td><td>pasa</td><td>pasa</td><td>pasa</td><td>ninguna de las 6 de <code>date-submission-*</code></td></tr>' +
            '<tr><td>E4 <code>:468</code> <code>toNativeDate</code> escribe <code>yyyy-dd-MM</code></td><td>falla</td><td>falla</td><td>falla</td><td>las otras 2 de <code>date-submission-default</code></td></tr>' +
            '</tbody></table></div><p class="muted">Chromium, <code>next dev</code>, librería reconstruida y servidor reiniciado por mutación.</p>',
        },
        {
          label: 'Costo',
          html: '<p>2 casos por navegador, unos 2 s cada uno en CI: alrededor de 12 s por corrida. El costo mayor es la falsa seguridad, porque los nombres dicen que los formatos <code>dd/MM/yyyy</code> y <code>MM/dd/yyyy</code> están probados al enviar.</p>',
        },
        {
          label: 'Propuesta',
          html: '<p>Convertirlos en lo que prometen: escribir el día en el formato del campo (<code>15/06/2024</code> y <code>06/15/2024</code>) y esperar <code>2024-06-15</code> en el envío, en un solo archivo con un loop por formato. Así atrapan E2, que hoy solo atrapan <code>date-picker</code> y <code>date-initial-value</code> por el lado de lo que se muestra.</p>',
        },
        {
          label: 'Corrección',
          audit: 'test-audit-2026-11-19',
          html:
            '<p>Commit <code>test(e2e): submit a day typed in the date field\'s own format</code> en la rama <code>claude/busy-swanson-fe8379</code>, desde <code>main</code> en <code>5b26630</code>, en el <a href="https://github.com/jonattanva/luna-form/pull/188">PR #188</a>. Los dos archivos se reemplazan por <code>tests/e2e/date-submission-format.spec.ts</code>, con un caso por formato que escribe <code>15/06/2024</code> en <code>dd/MM/yyyy</code> y <code>06/15/2024</code> en <code>MM/dd/yyyy</code>, espera a que el campo se vea (FLK-01) y espera <code>"birth_date": "2024-06-15"</code> en el envío.</p>' +
            '<p>El campo de fecha del editor le pasa al formulario el texto tal como se escribe. El formulario lo lee en el formato del campo y guarda el día como <code>yyyy-MM-dd</code>. Al perder el foco, el campo muestra ese día en su formato, y eso es lo que manda el <code>FormData</code> del envío. Por eso <code>2024-06-15</code> escrito en un campo <code>dd/MM/yyyy</code> se envía como <code>15/06/2024</code>, sin pasar por la rama ISO.</p>' +
            '<div class="table-wrap"><table><thead><tr><th>Mutación</th><th>Antes: dd-mm y mm-dd</th><th>Después: <code>date-submission-format</code>, 2 casos</th><th><code>date-submission-default</code>, 4 casos</th></tr></thead><tbody>' +
            '<tr><td>E2 <code>getDateFormat</code> ignora <code>advanced.format</code></td><td>pasan</td><td>fallan los 2</td><td>pasan los 4</td></tr>' +
            '<tr><td>E3 sin la rama ISO de <code>readDay</code></td><td>pasan (medido otra vez)</td><td>fallan los 2</td><td>pasan los 4</td></tr>' +
            '<tr><td>E4 <code>toNativeDate</code> escribe <code>yyyy-dd-MM</code></td><td>fallan</td><td>fallan los 2</td><td>fallan 3, pasa el que retiene un texto que no es fecha</td></tr>' +
            '</tbody></table></div>' +
            '<p>Las 3 mutaciones siguen fallando con la suite resultante. Que el caso nuevo atrape E3 depende de hacer clic en Submit desde el campo: con un <code>blur</code> explícito antes, el día escrito en el formato del campo también se envía bien con E3. No es lo que la prueba promete, así que E3 no cuenta como protección de este archivo.</p>' +
            '<p class="muted">Chromium, <code>next dev</code> en un puerto propio, librería reconstruida y servidor reiniciado por mutación, revertida después (<code>git status</code> limpio). En verde: <code>date-submission-format</code>, <code>date-submission-default</code>, <code>date-picker</code> y <code>date-initial-value</code> en Chromium, Firefox y WebKit (102 casos). Pasan build, lint, tipos y unitarias. <code>knip</code> falla por exportaciones sin usar de <code>luna-core</code> que este cambio no toca.</p>',
        },
        {
          label: 'Plan de corrección',
          html: '<p><b>Fase 4.</b> DUP-01. <b>Crear primero:</b> la tabla de mutaciones de arriba. <b>Antes:</b> 2 archivos que atrapan solo E4, igual que <code>date-submission-default</code>. <b>Después:</b> un archivo con un caso por formato que atrapa E2 y E4. <b>Protección esperada:</b> el envío de un día escrito en cada formato queda probado.</p>',
        },
      ],
    },
    {
      code: 'OPT-01',
      title:
        'El shard 2 de cada navegador tarda entre 80 y 110 s más que el shard 1',
      sev: 'optim',
      cat: 'pruebas',
      st: 'corregido',
      stLabel: 'Corregido en #200',
      audit: 'test-audit-2026-11-19',
      sections: [
        { label: 'Área', html: '<p>Tiempo de la suite.</p>' },
        {
          label: 'Dónde',
          html: '<p>La matriz <code>shard: [1, 2]</code> del job <code>e2e-test</code>.</p>',
        },
        {
          label: 'Qué pasa',
          html: '<p>Playwright reparte los casos entre shards por cantidad, no por duración. Los archivos más caros caen en la segunda mitad: <code>readonly-submit</code> (189 s sumando navegadores), <code>option-not-offered</code> (79 s) y <code>select-double-selection-bug</code> (52 s). El job más largo de la matriz es siempre un shard 2.</p>',
        },
        {
          label: 'Evidencia',
          html: '<div class="table-wrap"><table><thead><tr><th>Navegador</th><th>Shard 1/2</th><th>Shard 2/2</th><th>Diferencia</th></tr></thead><tbody><tr><td>Chromium</td><td>431 s</td><td>509 s</td><td>78 s</td></tr><tr><td>Firefox</td><td>577 s</td><td>677 s</td><td>100 s</td></tr><tr><td>WebKit</td><td>603 s</td><td>713 s</td><td>110 s</td></tr></tbody></table></div><p class="muted">Medianas de 8 corridas exitosas del 18 y 19/11.</p>',
        },
        {
          label: 'Costo',
          html: '<p>Con los dos shards de WebKit iguales, el job más largo bajaría unos 55 s (la mitad de la diferencia; cálculo sobre las medianas, no medición).</p>',
        },
        {
          label: 'Propuesta',
          html: '<p>Si OPT-02 y OPT-03 no alcanzan, darle a WebKit un tercer shard o repartir por duración. Medirlo después de OPT-02, porque con más workers la diferencia cambia.</p>',
        },
        {
          label: 'Corrección',
          audit: 'test-audit-2026-11-19',
          html:
            '<p>Medido junto con OPT-03 (variante E, <a href="https://github.com/jonattanva/luna-form/pull/197">#197</a>, 6 corridas): Firefox y WebKit en 3 shards sobre <code>next start</code>. Medianas: WebKit 430, 321 y 437 s; Firefox 350, 260 y 378 s. El veredicto baja a 584 s (573 a 602), frente a 656 s con 2 shards (B) y 822 s en la línea base, y el rango se cierra de 413 a 29 s.</p>' +
            '<p>El job más lento pasa a ser Chromium 2/2 sobre <code>next dev</code> (503 s de mediana, el último en 4 de 6 corridas). El shard 2/3 sigue tardando unos 110 s menos que los otros dos, porque Playwright reparte por cantidad de casos y no tiene opción para repartir por duración, así que equilibrarlo más no acorta el veredicto mientras Chromium sea el último. Son 8 jobs e2e en vez de 6, pero suman 3121 s de job frente a 3469 s en la línea base.</p>',
        },
        {
          label: 'Plan de corrección',
          html: '<p><b>Fase 3.</b> OPT-01, después de OPT-02. <b>Crear primero:</b> las duraciones por shard con la nueva configuración. <b>Antes:</b> 110 s de diferencia en WebKit. <b>Después:</b> menos de 30 s. <b>Ahorro esperado:</b> unos 55 s en el camino crítico.</p>',
        },
      ],
    },
    {
      code: 'INV-01',
      title:
        'Falta la matriz de funcionalidad por nivel y el mapa de cobertura de las unitarias',
      sev: 'optim',
      cat: 'pruebas',
      st: 'corregido',
      stLabel: 'Resuelto en test-audit-2026-11-19-matriz',
      audit: 'test-audit-2026-11-19',
      sections: [
        { label: 'Área', html: '<p>Huecos.</p>' },
        {
          label: 'Qué pasa',
          html: '<p>Esta corrida buscó huecos con mutaciones dirigidas (9 en unitarias, 4 en e2e) y no con la matriz completa. No hay proveedor de cobertura instalado (<code>@vitest/coverage-v8</code>), y el comando pide preguntar antes de instalarlo. 27 módulos de <code>luna-react/src/client/{lib,hook}</code> y 2 de <code>luna-core</code> no los importa ninguna unitaria (el mayor, <code>agent-host.ts</code>, 805 líneas), aunque las e2e sí los recorren.</p>',
        },
        {
          label: 'Evidencia',
          html: '<p>De las 9 mutaciones unitarias, 6 las atrapó la suite, 1 resultó equivalente (vaciar la lista de patrones remotos ya da <code>false</code> por <code>[].some</code>) y 2 sobrevivieron (HUE-01).</p>',
        },
        {
          label: 'Propuesta',
          html: '<p>En la próxima corrida: instalar el proveedor de cobertura si se aprueba, armar la matriz con la lista de flujos críticos del comando, y mutar los módulos que solo cubren las e2e.</p>',
        },
        {
          label: 'Corrección',
          audit: 'test-audit-2026-11-19-matriz',
          html: '<p>Se agregó <code>@vitest/coverage-v8</code> 5.1.0 como devDependency (aprobado) y se armaron la matriz de funcionalidad por nivel, el mapa de cobertura de las unitarias y una muestra de 10 afirmaciones de <code>docs/</code>; están en el resumen de <code>test-audit-2026-11-19-matriz</code>. De 9 mutaciones, 8 pasaron las 1282 unitarias; de esas, 7 pasaron también las 762 e2e de Chromium y quedaron como HUE-02, HUE-03 y HUE-04, y la de <code>compose-list-value.ts</code> la atrapan 4 e2e, así que lo anidado está cubierto arriba aunque no abajo. Dos afirmaciones de <code>docs/</code> sin prueba y sin mutación posible quedan en INV-02.</p>',
        },
      ],
    },
    {
      code: 'HUE-02',
      title:
        'Las aserciones min, max, minItems y maxItems de rules y las formas arreglo y any de when no tienen ninguna prueba',
      sev: 'crit',
      cat: 'pruebas',
      st: 'corregido',
      stLabel: 'Corregido en #202',
      audit: 'test-audit-2026-11-19-matriz',
      sections: [
        { label: 'Área', html: '<p>Huecos.</p>' },
        {
          label: 'Dónde',
          html: '<p><code>packages/luna-core/src/util/schema.ts:1199</code> (<code>runAssert</code>, casos <code>minItems</code>, <code>maxItems</code>, <code>min</code> y <code>max</code>, y <code>sizeOf</code> en <code>:1279</code>) y <code>:1180</code> (<code>whenHolds</code>, la forma arreglo en <code>:1185</code> y <code>any</code> en <code>:1194</code>). Las únicas reglas en las pruebas son <code>required</code>, <code>oneOf</code> y <code>pattern</code> (<code>tests/unit/declarative-validation.spec.ts</code>, <code>tests/e2e/declarative-validation.spec.ts</code>).</p>',
        },
        {
          label: 'Qué pasa',
          html: '<p><code>docs/validation/overview.md</code> documenta siete aserciones de <code>rules</code> y tres formas de <code>when</code>. Cuatro de las aserciones y dos de las formas no las ejecuta ninguna prueba: la cobertura marca sin recorrer las líneas <code>:1204</code> a <code>:1210</code> y <code>:1280</code> a <code>:1288</code>. Se puede invertir una comparación, aceptar todo o cambiar AND por OR y la suite sigue verde, así que un formulario que confía en <code>max</code> para limitar un valor podría enviar cualquier cosa.</p>',
        },
        {
          label: 'Evidencia',
          html: '<p>Cada mutación se corrió sola contra las unitarias (1282 casos, 1281 pasan y 1 fallo esperado, igual que sin mutar). Las seis juntas con M7 de HUE-03, con <code>pnpm build</code> y el bundle verificado (<code>any.every</code> aparece en <code>dist/client/esm</code> y <code>dist/schema</code>), pasan las 762 e2e de Chromium sobre <code>next dev</code> propio, 4 workers, <code>--retries=0</code>. Revertidas y reconstruidas.</p>',
        },
        {
          label: 'Mutaciones',
          html:
            '<div class="table-wrap"><table><thead><tr><th>Mutación</th><th>Unitarias (1282)</th><th>E2E Chromium (762)</th></tr></thead><tbody>' +
            '<tr><td>M1 <code>:1208</code> <code>min</code>: <code>sizeOf(value) &gt;= Number</code> → <code>&lt;=</code></td><td>pasa</td><td rowspan="6">pasan las 762 con M1 a M7 juntas</td></tr>' +
            '<tr><td>M2 <code>:1210</code> <code>max</code>: <code>&lt;=</code> → <code>&gt;=</code></td><td>pasa</td></tr>' +
            '<tr><td>M3 <code>:1204</code> <code>minItems</code>: toda la condición → <code>return true</code></td><td>pasa</td></tr>' +
            '<tr><td>M4 <code>:1206</code> <code>maxItems</code>: <code>&lt;=</code> → <code>&gt;=</code></td><td>pasa</td></tr>' +
            '<tr><td>M5 <code>:1194</code> <code>when.any.some</code> → <code>when.any.every</code></td><td>pasa</td></tr>' +
            '<tr><td>M6 <code>:1185</code> <code>when.every</code> (arreglo) → <code>when.some</code></td><td>pasa</td></tr>' +
            '</tbody></table></div>',
        },
        {
          label: 'Costo',
          html: '<p>Ninguno en tiempo: lo que falta son unitarias de milisegundos sobre <code>buildSchema</code>.</p>',
        },
        {
          label: 'Propuesta',
          html: '<p>Crear casos en <code>tests/unit/declarative-validation.spec.ts</code>: para cada aserción, un valor en el borde que pasa y uno que no (un número, un texto y un arreglo para <code>min</code> y <code>max</code>); para <code>when</code>, un arreglo con una condición falsa que no debe correr la aserción y un <code>any</code> con una sola condición verdadera que sí. Una e2e no hace falta: el cableado de <code>rules</code> ya lo cubre <code>tests/e2e/declarative-validation.spec.ts</code>.</p>',
        },
        {
          label: 'Plan de corrección',
          html: '<p><b>Fase 1.</b> HUE-02. <b>Crear primero:</b> los casos, y ver que cada uno de M1 a M6 hace fallar al menos uno. <b>Antes:</b> 0 de 1282 unitarias y 0 de 762 e2e atrapan M1 a M6. <b>Después:</b> cada mutación falla al menos un caso. <b>Protección esperada:</b> las siete aserciones y las tres formas de <code>when</code> que documenta <code>docs/</code> quedan fijadas.</p>',
        },
        {
          label: 'Corrección',
          audit: 'test-audit-2026-11-19-matriz',
          html:
            '<p>Commit <code>f73027d</code> en la rama <code>claude/fix-hue-02-rules-assertions</code>, desde <code>main</code> (<code>276089c</code>), en el <a href="https://github.com/jonattanva/luna-form/pull/202">PR #202</a>. Doce casos en <code>tests/unit/declarative-validation.spec.ts</code>, por <code>buildFormSchema</code>: <code>min</code> y <code>max</code> con un valor en el borde que pasa y uno pasado que se frena con el mensaje de la regla, sobre un número, un texto y un arreglo; <code>minItems</code> y <code>maxItems</code> igual sobre un arreglo; un <code>when</code> arreglo con una condición falsa que no corre la aserción y con todas verdaderas que sí; un <code>any</code> con una sola verdadera que la corre y con ninguna que no. El código coincide con <code>docs/</code>: no cambia nada fuera de la prueba. Cada mutación se aplicó sola contra ese archivo y se revirtió. Pasan las unitarias (1300 y 1 fallo esperado), <code>lint</code> y <code>prettier</code>; <code>tsc</code> de la raíz y <code>knip</code> ya fallaban igual en <code>main</code> por archivos que este cambio no toca.</p>' +
            '<div class="table-wrap"><table><thead><tr><th>Mutación</th><th>Antes</th><th>Después</th></tr></thead><tbody>' +
            '<tr><td>M1 <code>min</code>: <code>&gt;=</code> → <code>&lt;=</code></td><td>pasa</td><td>fallan 5: <code>min</code> con número, texto y arreglo, y los dos casos de <code>when</code> que corren la aserción</td></tr>' +
            '<tr><td>M2 <code>max</code>: <code>&lt;=</code> → <code>&gt;=</code></td><td>pasa</td><td>fallan 3: <code>max</code> con número, texto y arreglo</td></tr>' +
            '<tr><td>M3 <code>minItems</code>: <code>return true</code></td><td>pasa</td><td>falla 1: <code>minItems</code> bajo el borde</td></tr>' +
            '<tr><td>M4 <code>maxItems</code>: <code>&lt;=</code> → <code>&gt;=</code></td><td>pasa</td><td>falla 1: <code>maxItems</code> sobre el borde</td></tr>' +
            '<tr><td>M5 <code>when.any.some</code> → <code>every</code></td><td>pasa</td><td>falla 1: <code>any</code> con una sola condición verdadera</td></tr>' +
            '<tr><td>M6 <code>when.every</code> (arreglo) → <code>some</code></td><td>pasa</td><td>falla 1: arreglo con una condición falsa</td></tr>' +
            '</tbody></table></div>',
        },
      ],
    },
    {
      code: 'HUE-03',
      title:
        'Ninguna prueba cubre un origen remoto que responde con un error, falla en la red o no devuelve JSON',
      sev: 'crit',
      cat: 'pruebas',
      st: 'corregido',
      stLabel: 'Corregido en #204',
      audit: 'test-audit-2026-11-19-matriz',
      sections: [
        { label: 'Área', html: '<p>Huecos.</p>' },
        {
          label: 'Dónde',
          html: '<p><code>packages/luna-core/src/fetcher.ts:36-41</code> (el <code>throw response</code> de una respuesta no 2xx) y <code>packages/luna-react/src/client/hook/use-fetch.ts</code> (el <code>error</code> de SWR y el <code>getArray</code> que da <code>null</code>). <code>tests/unit/fetcher.spec.ts</code> solo prueba respuestas 200; en <code>tests/e2e/</code> el único <code>status: 404</code> (<code>event.spec.ts:65</code>) es una guarda contra fixtures que faltan, no una prueba.</p>',
        },
        {
          label: 'Qué pasa',
          html: '<p><code>docs/fields/data-source.md</code>, sección Failures, promete que una respuesta no 2xx se registra y el campo muestra una lista vacía, y que una respuesta que no es JSON falla igual. Ninguna prueba lo comprueba: si <code>fetcher</code> deja de distinguir el estado, el cuerpo del error se usa como opciones (con un error que es un arreglo, o que tiene un arreglo en el <code>namespace</code>, el campo ofrece y acepta esas entradas) y la suite sigue verde. Tampoco hay prueba de un fallo de red ni de un JSON sin arreglo en el <code>namespace</code>.</p>',
        },
        {
          label: 'Evidencia',
          html: '<p>M7 contra las unitarias: 1281 pasan y 1 fallo esperado, igual que sin mutar. Con M1 a M6 de HUE-02, <code>pnpm build</code> y servidor reiniciado: pasan las 762 e2e de Chromium (4 workers, <code>--retries=0</code>, 2,8 min). La cobertura marca sin recorrer <code>fetcher.ts:41</code>. Revertida y reconstruida.</p>',
        },
        {
          label: 'Mutaciones',
          html:
            '<div class="table-wrap"><table><thead><tr><th>Mutación</th><th>Unitarias (1282)</th><th>E2E Chromium (762)</th></tr></thead><tbody>' +
            '<tr><td>M7 <code>fetcher.ts:37</code> <code>if (request.ok)</code> → <code>if (true)</code></td><td>pasa</td><td>pasa</td></tr>' +
            '</tbody></table></div>',
        },
        {
          label: 'Costo',
          html: '<p>Una unitaria de milisegundos y una e2e de unos 2 s por navegador, unos 6 s por corrida de CI.</p>',
        },
        {
          label: 'Propuesta',
          html: '<p>En <code>tests/unit/fetcher.spec.ts</code>: una respuesta 500 con cuerpo JSON rechaza con ese cuerpo, y una que no es JSON rechaza. En <code>tests/e2e/</code>: un <code>select</code> con origen remoto cuyo <code>page.route</code> responde 500 con un arreglo como cuerpo, otro que aborta el pedido y otro con JSON sin arreglo en el <code>namespace</code>; en los tres el campo no ofrece opciones y el formulario sigue usable.</p>',
        },
        {
          label: 'Plan de corrección',
          html: '<p><b>Fase 1.</b> HUE-03. <b>Crear primero:</b> la unitaria del 500 y la e2e con el 500, y ver que ambas fallan con M7. <b>Antes:</b> 0 de 1282 unitarias y 0 de 762 e2e atrapan M7. <b>Después:</b> M7 falla en las dos. <b>Protección esperada:</b> el contrato de la sección Failures de <code>data-source.md</code> queda fijado en los tres casos (error HTTP, red y respuesta inválida).</p>',
        },
        {
          label: 'Corrección',
          audit: 'test-audit-2026-11-19-matriz',
          html:
            '<p>Commit <code>d82aacf</code> en la rama <code>claude/fix-hue-03-remote-failures</code>, desde <code>main</code> (<code>572eef1</code>), en el <a href="https://github.com/jonattanva/luna-form/pull/204">PR #204</a>. Dos casos en <code>tests/unit/fetcher.spec.ts</code>: un 500 con un arreglo JSON como cuerpo rechaza con ese cuerpo, y un 200 con cuerpo HTML rechaza con <code>SyntaxError</code>. Un bloque nuevo en <code>tests/e2e/select.spec.ts</code> (no hizo falta un archivo nuevo), con un <code>select</code> remoto junto a un texto: el <code>page.route</code> responde 500 con un arreglo de opciones, aborta el pedido, o responde un JSON con las opciones fuera del <code>namespace</code>. En los tres, una vez resuelto el pedido, el <code>select</code> abre sin opciones, se cierra, el texto se escribe y el envío manda <code>{ name: "Ada", fruit: "" }</code>. El código y <code>docs/</code> coinciden: no hubo que cambiar nada fuera de las pruebas. Las 3 e2e pasan en Chromium, Firefox y WebKit (unos 2 s cada una); las 1319 unitarias, lint y tipos de los archivos tocados, en verde.</p>' +
            '<div class="table-wrap"><table><thead><tr><th>Mutación</th><th>Antes</th><th>Después</th></tr></thead><tbody>' +
            '<tr><td>M7 <code>fetcher.ts:37</code> <code>if (request.ok)</code> → <code>if (true)</code></td><td>pasan las 1282 unitarias y las 762 e2e de Chromium</td><td>falla la unitaria del 500 (resuelve con el cuerpo en vez de rechazar) y, con <code>pnpm build</code> y servidor reiniciado, la e2e del 500 en Chromium (el <code>select</code> ofrece 2 opciones en vez de 0). Revertida, reconstruida y en verde otra vez</td></tr>' +
            '</tbody></table></div>',
        },
      ],
    },
    {
      code: 'HUE-04',
      title: 'El operador contains no lo ejecuta ninguna prueba',
      sev: 'crit',
      cat: 'pruebas',
      st: 'corregido',
      stLabel: 'Corregido en #201',
      audit: 'test-audit-2026-11-19-matriz',
      sections: [
        { label: 'Área', html: '<p>Huecos.</p>' },
        {
          label: 'Dónde',
          html: '<p><code>packages/luna-core/src/util/operator.ts:90-98</code> (<code>contains</code>). <code>tests/unit/operator-map.spec.ts</code> solo comprueba que la clave existe; hay un <code>operator-*.spec.ts</code> por cada operador de comparación salvo este, y ninguna definición de <code>tests/e2e/</code> lo usa.</p>',
        },
        {
          label: 'Qué pasa',
          html: '<p><code>contains</code> es uno de los operadores que <code>docs/validation/overview.md</code> declara compartidos por <code>custom</code>, <code>requiredWhen</code>, los <code>when</code> de <code>rules</code> y las condiciones de los eventos de cambio. Si deja de funcionar, una condición <code>contains</code> nunca se cumple: un campo que debía mostrarse o volverse requerido no lo hace, y la suite sigue verde.</p>',
        },
        {
          label: 'Evidencia',
          html: '<p>M9 contra las unitarias: 1281 pasan y 1 fallo esperado, igual que sin mutar. Con <code>pnpm build</code> (bundle verificado: <code>String(n).length&gt;=0?!1</code> en <code>dist/client/esm</code>) y servidor reiniciado, e2e de Chromium: pasan las 762 (4 workers, <code>--retries=0</code>, 3,1 min). Revertida y reconstruida.</p>',
        },
        {
          label: 'Mutaciones',
          html:
            '<div class="table-wrap"><table><thead><tr><th>Mutación</th><th>Unitarias (1282)</th><th>E2E Chromium (762)</th></tr></thead><tbody>' +
            '<tr><td>M9 <code>operator.ts:90</code> al entrar a <code>contains</code>: <code>if (String(value).length &gt;= 0) return false</code> (siempre <code>false</code>)</td><td>pasa</td><td>pasa (las 762, 3,1 min)</td></tr>' +
            '</tbody></table></div>',
        },
        {
          label: 'Costo',
          html: '<p>Ninguno en tiempo: una unitaria de milisegundos.</p>',
        },
        {
          label: 'Propuesta',
          html: '<p>Crear <code>tests/unit/operator-contains.spec.ts</code>, como los demás operadores: texto que contiene y que no, arreglo que contiene el valor (también con números contra texto, por el <code>map(String)</code>) y que no, y cualquier otro tipo da <code>false</code>.</p>',
        },
        {
          label: 'Plan de corrección',
          html: '<p><b>Fase 1.</b> HUE-04. <b>Crear primero:</b> el archivo, y ver que falla con M9. <b>Antes:</b> 0 de 1282 unitarias y 0 de 762 e2e atrapan M9. <b>Después:</b> M9 falla. <b>Protección esperada:</b> los doce operadores documentados quedan fijados.</p>',
        },
        {
          label: 'Prueba',
          audit: 'test-audit-2026-11-19-matriz',
          html: "<p>Nuevo <code>tests/unit/operator-contains.spec.ts</code>, con el estilo de los demás <code>operator-*.spec.ts</code>, 8 casos: texto que contiene el valor y que no (el valor se pasa a texto, <code>'order-123'</code> contiene <code>123</code>); arreglo que contiene el valor y que no, también números contra texto por el <code>map(String)</code>, y elementos que se comparan enteros, no por subcadena; número, <code>null</code>, <code>undefined</code>, objeto y booleano dan <code>false</code>. El comportamiento coincide con <code>docs/validation/overview.md</code> (<i>current (string/array) contains value</i>); no hubo diferencia entre código y documentación.</p><p>Para cerrar los doce operadores, dos specs más con 9 casos en total: <code>operator-exists.spec.ts</code> (presente, <code>0</code> y <code>false</code> cuentan como presentes, <code>null</code>, <code>undefined</code> y <code>''</code> como ausentes, un arreglo se lee por su largo, también un rango de dos días como dice <code>docs/fields/input.md</code>, y el valor se ignora) y <code>operator-truthy.spec.ts</code> (valores verdaderos y falsos, un arreglo se lee por su largo, también <code>[false]</code>, y el valor se ignora).</p>",
        },
        {
          label: 'Mutaciones',
          audit: 'test-audit-2026-11-19-matriz',
          html:
            '<div class="table-wrap"><table><thead><tr><th>Mutación</th><th>Antes</th><th>Después</th></tr></thead><tbody>' +
            '<tr><td>M9 <code>operator.ts:90</code>: <code>if (String(value).length &gt;= 0) return false</code> (siempre <code>false</code>)</td><td>pasan las 1282 unitarias y las 762 e2e de Chromium</td><td>fallan 4 de los 8 casos nuevos, todos los que esperan <code>true</code></td></tr>' +
            '<tr><td>Control: la misma línea con <code>return true</code> (siempre <code>true</code>)</td><td>no se midió</td><td>fallan 6 de los 8 casos nuevos</td></tr>' +
            '<tr><td>M10 <code>exists</code>, rama arreglo: <code>return true</code> (<code>[]</code> cuenta como presente)</td><td>la atrapa solo <code>operator-empty.spec.ts</code>, de forma indirecta</td><td>falla también el caso de arreglos de <code>operator-exists.spec.ts</code></td></tr>' +
            '<tr><td>M11 <code>truthy</code>, rama arreglo (<code>:116</code>): <code>return Boolean(current)</code> (<code>[]</code> cuenta como verdadero)</td><td>pasan las 1296 unitarias</td><td>falla el caso de arreglos de <code>operator-truthy.spec.ts</code></td></tr>' +
            '<tr><td>M12 <code>exists</code>, final: <code>return Boolean(current)</code> (<code>0</code> y <code>false</code> cuentan como ausentes)</td><td>la atrapa solo <code>operator-empty.spec.ts</code>, de forma indirecta</td><td>falla también el caso de escalares falsos de <code>operator-exists.spec.ts</code></td></tr>' +
            '</tbody></table></div>' +
            '<p>Cada mutación se aplicó al código fuente, se corrió <code>pnpm vitest run tests/unit/operator-contains.spec.ts</code> y se revirtió (<code>git status</code> limpio en <code>packages/</code>); sin mutar pasan los 8. Para M10 a M12, el antes es la suite sin los dos specs nuevos y el después, esos dos specs. Suite unitaria completa con los tres specs: 1305 pasan y 1 fallo esperado.</p>',
        },
        {
          label: 'Corrección',
          audit: 'test-audit-2026-11-19-matriz',
          html: '<p>M9 ya no pasa inadvertida: la atrapa la unitaria nueva. Los doce operadores documentados tienen su propio <code>operator-*.spec.ts</code>; <code>truthy</code> con arreglo (M11), que no atrapaba ninguna prueba, queda fijado.</p>',
        },
      ],
    },
    {
      code: 'INV-02',
      title:
        'Dos afirmaciones de data-source.md no tienen prueba y no se pudieron probar con una mutación',
      sev: 'optim',
      cat: 'pruebas',
      st: 'corregido',
      stLabel: 'Corregido en #192, con BUG-03',
      audit: 'test-audit-2026-11-19-matriz',
      sections: [
        { label: 'Área', html: '<p>Huecos.</p>' },
        {
          label: 'Dónde',
          html: '<p><code>packages/luna-react/docs/fields/data-source.md</code>: que dos campos con el mismo origen comparten un pedido y su caché, y que un <code>select</code> deshabilitado con origen remoto y valor objeto muestra ese objeto como única opción.</p>',
        },
        {
          label: 'Qué pasa',
          html: '<p>Ninguna prueba las nombra: <code>tests/e2e/select.spec.ts:127</code> cubre un <code>select</code> bloqueado con origen arreglo, no remoto, y nadie cuenta los pedidos de dos campos con el mismo origen. La primera depende de la clave de SWR, que no tiene un punto de mutación simple en el código propio; la segunda no se mutó en esta corrida.</p>',
        },
        {
          label: 'Propuesta',
          html: '<p>En la próxima corrida: localizar el código del <code>select</code> deshabilitado con valor objeto y mutarlo; para el pedido compartido, una e2e que cuente las peticiones con <code>page.route</code> y una mutación que cambie la clave de <code>useSWR</code> en <code>use-fetch.ts</code>.</p>',
        },
        {
          label: 'Prueba',
          audit: 'test-audit-2026-11-19-matriz',
          html: "<p>Dos casos nuevos en <code>tests/e2e/select.spec.ts</code>, sobre <code>/</code> con <code>inject</code> y el origen respondido por <code>page.route</code>:</p><ul><li><b>A</b>, <code>:211</code> <i>should share one request between two selects with the same source</i>: dos <code>select</code> con el mismo <code>source</code> relativo; abre cada uno, espera la opción y cuenta los pedidos de la ruta. La afirmación se cumple: 1 pedido.</li><li><b>B</b>, <code>:164</code> <i>should display the object value of a disabled select with a remote source</i>: <code>disabled</code>, <code>defaultValue</code> <code>{ value: 'banana', label: 'Banana' }</code> y un origen remoto. La afirmación <b>es falsa</b> en el cliente: el disparador queda vacío (0 pedidos, como dice la página, pero sin opción). Queda como <code>test.fail</code> con <code>// Audit BUG-03</code>.</li></ul>",
        },
        {
          label: 'Evidencia',
          audit: 'test-audit-2026-11-19-matriz',
          html: "<p>Antes de escribir la prueba se corrió cada afirmación en Chromium contra <code>main</code> en <code>afc8a06</code>: A pasa, B falla con <code>Received string: &quot;&quot;</code>. Para B, un script con <code>tsx</code> sobre el código fuente: <code>resolveSource(field, { value: 'banana', label: 'Banana' })</code>, lo que le pasa el cliente, da <code>undefined</code>; <code>resolveSource(field, { fruit: {...} })</code>, un registro, da <code>[{ value: 'banana', label: 'Banana' }]</code>. Con una corrección de sondeo (el cliente le pasa <code>{ [field.name]: value }</code>, revertida) B pasa, así que falla solo por BUG-03. Los dos casos, con B como fallo esperado: 162 de 162 en Chromium, Firefox y WebKit con <code>--repeat-each=3</code> y <code>--retries=0</code>, 4 workers, <code>next dev</code> propio en el puerto 3241.</p>",
        },
        {
          label: 'Mutaciones',
          audit: 'test-audit-2026-11-19-matriz',
          html: '<div class="table-wrap"><table><thead><tr><th>Mutación</th><th>Caso nuevo</th><th>Resto</th></tr></thead><tbody><tr><td>MA <code>use-fetch.ts:21</code>: la clave de <code>useSWR</code> pasa de <code>buildSource(...)</code> a ese origen con <code>headers: { \'X-Mutant\': useId() }</code>, una clave por campo</td><td>A falla: <code>Expected: 1</code>, <code>Received: 2</code></td><td>pasan las otras 764 e2e de Chromium; B falla igual, por BUG-03 (4,1 min, 4 workers, carga 7,7 a 24)</td></tr><tr><td>MB <code>build.ts:15</code> (<code>buildOptions</code>): <code>return [current]</code> → <code>return undefined</code>, sobre la corrección de sondeo</td><td>B falla</td><td>pasan las otras 34 de <code>select</code>, <code>option-not-offered</code> y <code>options-written</code>; fallan 2 unitarias (<code>build.spec.ts</code> y <code>helper/input.spec.ts</code>), que llaman a <code>buildOptions</code> con un registro</td></tr></tbody></table></div><p>Sin la corrección de sondeo, MB no la atrapa ninguna e2e: BUG-03 ya deja el <code>select</code> vacío. Cada mutación se aplicó al código fuente con <code>pnpm build</code>, verificación de que el bundle de <code>dist</code> la contenía y reinicio del servidor; se revirtió y se reconstruyó (<code>git status</code> limpio en <code>packages/</code>).</p>',
        },
        {
          label: 'Corrección',
          audit: 'test-audit-2026-11-19-matriz',
          html: '<p>Las dos afirmaciones tienen prueba: A la protege el caso nuevo, que MA demuestra; B, falsa, queda fijada como fallo esperado y pasa a BUG-03.</p>',
        },
      ],
    },
    {
      code: 'BUG-03',
      title:
        'Un select deshabilitado con origen remoto y valor objeto se ve vacío en el cliente, no con ese objeto como única opción',
      sev: 'mejora',
      sevNote: 'contradice la documentación',
      cat: 'contrato',
      st: 'corregido',
      stLabel: 'Corregido en #192',
      audit: 'test-audit-2026-11-19-matriz',
      sections: [
        {
          label: 'Dónde',
          html: '<p><code>packages/luna-react/src/client/hook/use-data-source.ts:13</code> llama a <code>resolveSource(field, value)</code> con el valor del propio campo; <code>buildOptions</code> (<code>packages/luna-core/src/util/build.ts:13</code>) lo lee como un registro, por el nombre del campo: <code>values?.[field.name]</code>. La entrada de servidor (<code>server/component/input.tsx:28</code>) le pasa un registro.</p>',
        },
        {
          label: 'Qué pasa',
          html: "<p><code>docs/fields/data-source.md</code> dice que un <code>select</code> deshabilitado con origen remoto y valor objeto muestra ese objeto como única opción, para que una selección guardada se lea en un formulario que no se edita. En el cliente, <code>{ value: 'banana', label: 'Banana' }['fruit']</code> es <code>undefined</code>: el campo no pide nada y no tiene opciones, y el disparador queda vacío.</p>",
        },
        {
          label: 'Prueba',
          html: '<p><code>tests/e2e/select.spec.ts:164</code> <i>should display the object value of a disabled select with a remote source</i>, como <code>test.fail</code> con <code>// Audit BUG-03</code>. Al corregirlo se quita el <code>.fail</code>.</p>',
        },
        {
          label: 'Evidencia',
          html: '<p>Ver INV-02: el caso falla en Chromium, Firefox y WebKit; con la corrección de sondeo (el cliente le pasa <code>{ [field.name]: value }</code>, revertida) pasa, y la mutación de <code>buildOptions</code> lo vuelve a romper. Las unitarias de <code>buildOptions</code> pasan porque le dan un registro, no lo que le da el cliente.</p>',
        },
        {
          label: 'Propuesta',
          html: '<p>Que el cliente le dé a <code>resolveSource</code> lo mismo que el servidor, o que <code>buildOptions</code> reciba el valor del campo y la entrada de servidor lo extraiga antes; una sola forma para los dos. Después, quitar el <code>.fail</code> y agregar una unitaria con lo que de verdad le llega.</p>',
        },
        {
          label: 'Corrección',
          html: "<p><code>buildOptions</code> y <code>resolveSource</code> reciben el valor del propio campo, que es lo que el cliente ya les daba; la entrada de servidor saca la entrada del campo de su registro antes de llamarlas (<code>server/component/input.tsx</code>), con la misma búsqueda por nombre que hacía <code>buildOptions</code>. Las dos unitarias que pasaban un registro ahora pasan el valor del campo. Se quitó el <code>.fail</code> de <code>select.spec.ts:164</code>: pasa en Chromium, Firefox y WebKit (120 de 120 con <code>select</code>, <code>server-entry</code>, <code>option-not-offered</code> y <code>options-written</code>), y las 766 e2e de Chromium pasan. La entrada de servidor la fija <code>tests/e2e/server-entry.spec.ts</code> <i>should show the object value of a disabled select with a remote source</i>: la página <code>/server</code> declara un <code>select</code> deshabilitado con origen remoto, y el host le pasa <code>{ label: 'Colombia', value: 'co' }</code>. Para eso el <code>Select</code> del editor (<code>components/ui/wrapper/select.tsx</code>) declara <code>'use client'</code>, como el combobox y los chips: sin eso no se podía pintar desde un Server Component. Mutación: el servidor le pasa a <code>resolveSource</code> el registro entero en vez de la entrada del campo (<code>server/component/input.tsx</code>); falla solo ese caso, y pasan los otros 23 de <code>server-entry</code> y <code>select</code>. Con la corrección: 144 de 144 en los tres navegadores con <code>--repeat-each=2</code>, y 767 de 767 e2e de Chromium.</p>",
        },
      ],
    },
    {
      code: 'SEC-01',
      title:
        'Un valor interpolado en una descripción se lee como enlace markdown y aparece como enlace dentro del formulario',
      sev: 'mejora',
      cat: 'seguridad',
      st: 'corregido',
      stLabel: 'Corregido en #205',
      audit: 'audit-2026-11-19',
      sections: [
        {
          label: 'Dónde',
          html: '<p><code>packages/luna-react/src/client/component/formatted-description.tsx:56</code>: <code>interpolateIfNeeded</code> resuelve <code>{value}</code> y el contexto, y después <code>formatMarkdown</code> (<code>packages/luna-react/src/lib/string.tsx:3</code>) busca <code>[texto](url)</code> en el resultado.</p>',
        },
        {
          label: 'Qué pasa',
          html: '<p>El orden hace que un valor sea markdown. Con la descripción <code>You entered: {value}</code>, escribir <code>[Verify your account](https://attacker.example/login)</code> pinta un <code>&lt;a href="https://attacker.example/login" target="_blank"&gt;</code> dentro del formulario. Lo mismo pasa con un <code>value</code> del host, un valor que escribe un evento o uno que llena un agente. La documentación dice que el título y la descripción toman enlaces markdown (<code>docs/structure/sections.md</code>), pero no que un valor también.</p>',
        },
        {
          label: 'Riesgo',
          html: '<p>No es XSS: React 19 cambia un <code>javascript:</code> por una URL que lanza un error (comprobado con un valor del host). Sí es inyección de enlaces: quien controla un valor que se muestra en una descripción (un host que reenvía datos de terceros, una respuesta remota, un agente) puede poner un enlace con el aspecto del formulario, que se abre en otra pestaña.</p>',
        },
        {
          label: 'Prueba',
          html: '<p><code>tests/e2e/description-value-link.spec.ts :: is shown as text, not as a link</code>, en Chromium, Firefox y WebKit.</p>',
        },
        {
          label: 'Corrección',
          audit: 'audit-2026-11-19',
          html:
            '<p>Las descripciones con marcadores se pintan con <code>formatTemplate</code> (<code>luna-core/src/util/string.ts</code>), el único lugar que junta interpolación, traducción y enlaces: lee los enlaces <code>[texto](url)</code> de la plantilla que escribió el autor y después resuelve cada marcador dentro del trozo donde está. Lo que da un marcador es siempre texto. La usan la descripción de campo y de columna (<code>description.tsx</code>) y el título y el mensaje de la ayuda plegable (<code>formatted-description.tsx</code>). Los títulos y descripciones de sección no se interpolan y no cambian.</p>' +
            '<div class="table-wrap"><table><thead><tr><th>Plantilla y valor</th><th>Antes</th><th>Después</th></tr></thead><tbody>' +
            '<tr><td><code>You entered: {value}</code>, <code>[Verify your account](https://attacker.example/login)</code></td><td>un <code>&lt;a href="https://attacker.example/login"&gt;</code></td><td>el texto tal cual, sin enlace</td></tr>' +
            '<tr><td><code>See [the guide](https://docs.example.com) for {value}</code>, el mismo valor</td><td>dos enlaces</td><td>solo <i>the guide</i> es enlace; el valor es texto</td></tr>' +
            '<tr><td><code>[{context.name}]({context.profileUrl})</code></td><td>un enlace con los valores</td><td>igual: un enlace del autor puede llevar marcadores en su texto o su URL</td></tr>' +
            '</tbody></table></div>' +
            '<p><b>Traducción.</b> Sigue después de la interpolación, como documenta <code>docs/interpolation/overview.md</code>. Si el diccionario tiene una entrada para el texto resuelto, esa entrada la escribió el host y sus enlaces se leen. Documentado en <code>docs/interpolation/overview.md</code> (<i>Only the template makes links</i>).</p>' +
            '<p>Pruebas: se quitó el <code>.fail</code> de <code>tests/e2e/description-value-link.spec.ts :: is shown as text, not as a link</code> y se agregó <i>leaves the links the author wrote working</i>; 6 de 6 en Chromium, Firefox y WebKit. 5 casos de <code>formatTemplate</code> en <code>tests/unit/format-markdown.spec.ts</code> (valor como texto, enlace del autor, marcadores en texto y URL del enlace, traducción, texto vacío). 339 de 339 e2e de descripciones, interpolación, traducción, secciones y servidor en los tres navegadores; unitarias, lint, typecheck y knip en verde.</p>',
        },
        {
          label: 'Plan de corrección',
          html: '<p><b>Fase 1.</b> SEC-01. <b>Crear primero:</b> la prueba de arriba. <b>Antes:</b> el valor escrito aparece como enlace en los tres navegadores. <b>Después:</b> se muestra como texto y los enlaces que escribió el autor siguen funcionando: leer el markdown de la plantilla antes de interpolar, o tratar lo que llega de un placeholder como texto. Documentarlo en <code>docs/interpolation/overview.md</code>. <b>Mejora esperada:</b> un valor no puede cambiar lo que el formulario enlaza.</p>',
        },
      ],
    },
    {
      code: 'BUG-01',
      title:
        'Un valor entra sin codificar en la URL de un origen remoto: R&D se envía como dept=R',
      sev: 'mejora',
      cat: 'errores',
      st: 'corregido',
      stLabel: 'Corregido en #203',
      sevNote: 'también de seguridad',
      audit: 'audit-2026-11-19',
      sections: [
        {
          label: 'Dónde',
          html: '<p><code>packages/luna-core/src/handle/source-event.ts:22</code>: <code>interpolate(source.url, selected, options)</code>.</p>',
        },
        {
          label: 'Qué pasa',
          html: '<p>Un evento <code>source</code> arma la URL de otro campo con el valor de la opción elegida tal cual. Medido con <code>interpolate</code>: <code>/api/cities?country={value}</code> con <code>pe&amp;admin=1</code> da <code>?country=pe&amp;admin=1</code>, con <code>a b/c?d#e</code> manda un fragmento que el navegador no envía, y <code>/api/countries/{value}/cities</code> con <code>../../admin</code> cambia la ruta. Una plantilla que empieza con <code>{value}</code> y un valor <code>//attacker.example</code> cambia el host, y sin <code>remotePatterns</code> cualquier host está permitido.</p>',
        },
        {
          label: 'Riesgo',
          html: '<p>Lo elegido suele salir de opciones escritas o de una respuesta remota, así que lo más probable es un pedido equivocado con datos legítimos (un departamento <code>R&amp;D</code>, una ciudad con espacio). Con una respuesta remota comprometida, el valor puede agregar parámetros, salir de la ruta o, al inicio de la plantilla, ir a otro host.</p>',
        },
        {
          label: 'Prueba',
          html: '<p><code>tests/unit/source-event.spec.ts :: handleSourceEvent values in a url &gt; should send a value with url syntax in it as one value</code>. Compara lo que lee el servidor (<code>searchParams</code>), no la codificación, porque las pruebas existentes esperan comas sin codificar (<code>amount=1,234,567</code>).</p>',
        },
        {
          label: 'Corrección',
          audit: 'audit-2026-11-19',
          html:
            '<p>La URL de un evento <code>source</code> se arma con <code>interpolateUrl</code> (<code>luna-core/src/util/string.ts</code>), el único lugar donde un valor entra en la URL: cada valor se codifica como componente con <code>encodeURIComponent</code>. El <code>body</code> no cambia; en un <code>GET</code> ya se codificaba al pasar a <code>searchParams</code>.</p>' +
            '<div class="table-wrap"><table><thead><tr><th>Plantilla y valor</th><th>Antes</th><th>Después</th></tr></thead><tbody>' +
            '<tr><td><code>/api/people?dept={value}</code>, <code>R&amp;D</code></td><td><code>dept=R</code> y un parámetro <code>D</code></td><td><code>dept=R%26D</code>; el servidor lee <code>R&amp;D</code></td></tr>' +
            '<tr><td><code>/api/cities?country={value}</code>, <code>pe&amp;admin=1#top</code></td><td>agrega <code>admin</code> y un fragmento que no se envía</td><td>un solo parámetro, <code>country</code></td></tr>' +
            '<tr><td><code>/api/countries/{value}/cities</code>, <code>../../admin</code></td><td><code>/admin/cities</code></td><td><code>/api/countries/..%2F..%2Fadmin/cities</code></td></tr>' +
            '<tr><td><code>{value}/cities</code>, <code>//attacker.example</code></td><td>host <code>attacker.example</code></td><td><code>%2F%2Fattacker.example/cities</code>, relativa al mismo host</td></tr>' +
            '<tr><td><code>/api/cities/{value}</code>, <code>San Juan</code></td><td>espacio crudo</td><td><code>San%20Juan</code></td></tr>' +
            '</tbody></table></div>' +
            '<p><b>Plantilla que es solo un marcador</b> (<code>{url}</code>, un endpoint tomado entero de la opción, como en <code>tests/e2e/event.spec.ts</code>): el valor es la URL y se usa tal cual. No hay URL escrita alrededor que proteger, y codificarla rompería ese uso documentado. Se revisa contra <code>remotePatterns</code> como cualquier URL; sin <code>remotePatterns</code> se permite cualquier host, y la documentación pide listar los hosts. Cualquier texto alrededor, incluso <code>{url}/</code>, vuelve a codificar. Documentado en <code>docs/fields/data-source.md</code> y enlazado desde <code>docs/events/change.md</code>.</p>' +
            '<p>Las dos pruebas que esperaban comas sin codificar (<code>amount=1,234,567</code>, <code>n=1.234,5</code>) ahora comparan lo que lee el servidor (<code>searchParams</code>): la coma viaja como <code>%2C</code>. Pruebas: 6 casos en <code>tests/unit/source-event.spec.ts :: handleSourceEvent values in a url</code>, sin <code>.fails</code>; 5 fallaban antes de la corrección y el de <code>{url}</code> pasaba. 1311 unitarias, lint y typecheck en verde; 115 e2e con orígenes remotos en Chromium y <code>event</code> y <code>option-not-offered</code> en Firefox y WebKit, sobre <code>pnpm serve</code>. <code>knip</code> y <code>prettier:check</code> fallan igual que en <code>main</code> (S-01), sin hallazgos nuevos.</p>',
        },
        {
          label: 'Plan de corrección',
          html: '<p><b>Fase 2.</b> BUG-01. <b>Crear primero:</b> la prueba de arriba, más un caso de ruta (<code>../</code>). <b>Antes:</b> <code>dept=R</code> y un parámetro <code>D</code> de más. <b>Después:</b> un valor en la consulta o en un segmento de la ruta se codifica como componente, y una plantilla que es solo <code>{value}</code> (un endpoint elegido de una lista) se decide aparte y se documenta en <code>docs/fields/data-source.md</code>. <b>Mejora esperada:</b> un valor no cambia la forma del pedido.</p>',
        },
      ],
    },
    {
      code: 'S-01',
      title:
        'knip y prettier:check fallan en main y CI no corre ninguno de los dos; knip además informa casi todo mal',
      sev: 'mejora',
      cat: 'código muerto',
      st: 'corregido',
      stLabel: 'Corregido en #206',
      audit: 'audit-2026-11-19',
      sections: [
        {
          label: 'Dónde',
          html: '<p><code>.github/workflows/build-and-test.yml</code> (el job <code>lint</code> corre <code>pnpm run lint</code> y <code>pnpm run typescript</code>, nada más), <code>knip.ts</code>, y <code>packages/luna-react/tsconfig.json</code>, que resuelve <code>@luna-form/core</code> a <code>../luna-core/dist/types/index.d.ts</code>.</p>',
        },
        {
          label: 'Qué pasa',
          html:
            '<p><code>AGENTS.md</code> pide que pasen todos los checks, pero en <code>main</code> fallan dos, sin que nadie se entere:</p><ul>' +
            '<li><code>pnpm prettier:check</code> marca <code>tests/e2e/date-submission-default.spec.ts</code>, así desde <code>165caa2</code> (3/10).</li>' +
            '<li><code>pnpm knip</code> responde distinto según el estado del árbol: 5 avisos si no existe <code>packages/luna-core/dist</code> y 30 después de <code>pnpm build</code>, porque <code>luna-react</code> resuelve <code>@luna-form/core</code> a los <code>.d.ts</code> generados y <code>knip</code> deja de ver qué usa de las fuentes de <code>luna-core</code>.</li></ul>' +
            '<p>De los 29 exports y tipos que informa con el build hecho, 27 son falsos: se les quitó el <code>export</code> de a uno, reconstruyendo <code>luna-core</code> y <code>luna-react</code> cada vez, y los 27 rompen el build (<code>INPUTS</code>, <code>getLabelId</code>, <code>interpolateIfNeeded</code>, <code>listOptions</code>…). <code>Source</code> y <code>Operator</code>, que informa en los dos estados, son API pública que <code>luna-react</code> reexporta. Lo real está en S-02.</p>',
        },
        {
          label: 'Prueba',
          html: '<p>Medición: <code>pnpm knip</code> con y sin <code>packages/luna-core/dist</code>, la tabla de exports quitados de a uno (build, <code>tsc</code> de los tres paquetes y unitarias), y <code>pnpm prettier:check</code>.</p>',
        },
        {
          label: 'Corrección',
          audit: 'audit-2026-11-19',
          html:
            '<p><b>Causa exacta:</b> <code>knip</code> resuelve con oxc, que lee el <code>paths</code> del tsconfig de <code>luna-react</code> antes que el <code>paths</code> de <code>knip.ts</code>; este solo se usa si el primero no resuelve. Por eso <code>paths</code> propios en <code>knip.ts</code> no alcanzan: con el build hecho, <code>@luna-form/core</code> sigue llegando a <code>dist/types/index.d.ts</code>. Lo que <code>knip</code> sí hace es mapear un archivo bajo <code>outDir</code> a su fuente bajo <code>rootDir</code>, y <code>luna-core</code> solo declaraba <code>declarationDir</code>.</p>' +
            '<ul><li><code>packages/luna-core/tsconfig.json</code>: <code>outDir: ./dist/types</code>, igual que <code>declarationDir</code>. Como solo se emiten declaraciones, no cambia ninguna salida: el <code>dist</code> de los dos paquetes, reconstruido con <code>--force</code>, es idéntico byte a byte. La resolución del build publicado no se toca.</li>' +
            '<li><code>Source</code> y <code>Operator</code> llevan <code>@public</code>, con el motivo en el comentario: son API pública que <code>luna-react</code> reexporta desde sus entradas, y <code>knip</code> no cuenta como uso una reexportación desde la entrada de otro workspace (<code>--trace-export</code> la marca con ✗).</li>' +
            '<li><code>tests/e2e/date-submission-default.spec.ts</code> formateado.</li>' +
            '<li>Job <code>lint</code>: <code>pnpm prettier:check</code> y <code>pnpm knip</code> antes de <code>lint</code> y <code>typescript</code>. Ninguno necesita build, y como <code>knip</code> da lo mismo en los dos estados, el orden no cambia su resultado. Localmente, 3,5 a 4 s y 1,1 s.</li>' +
            '<li>Un cambio solo de <code>audit/**</code> no corre CI (<code>paths-ignore</code>, #199), así que un <code>findings.js</code> sin formato recién se vería en el siguiente PR con código. <code>lint-staged</code> ahora formatea <code>audit/**/*.js</code>; los <code>.md</code> ya los formateaba.</li></ul>' +
            '<div class="table-wrap"><table><thead><tr><th>Check</th><th>Antes</th><th>Después</th></tr></thead><tbody>' +
            '<tr><td><code>pnpm knip</code> sin <code>luna-core/dist</code></td><td>2 avisos (<code>Source</code>, <code>Operator</code>)</td><td>0</td></tr>' +
            '<tr><td><code>pnpm knip</code> después de <code>pnpm build</code></td><td>27 avisos (17 exports, 10 tipos)</td><td>0</td></tr>' +
            '<tr><td><code>pnpm prettier:check</code></td><td>1 archivo</td><td>limpio</td></tr>' +
            '</tbody></table></div>' +
            '<p class="muted">El registro anotaba 5 y 30; S-02 (#177) ya había quitado los exports muertos reales. 1323 unitarias, lint y typecheck en verde.</p>',
        },
        {
          label: 'Plan de corrección',
          html: '<p><b>Fase 5.</b> S-01. <b>Crear primero:</b> <code>pnpm knip</code> en un árbol sin build y en uno con build, que hoy dan 5 y 30. <b>Antes:</b> dos checks rojos en <code>main</code> que CI no corre. <b>Después:</b> <code>knip</code> resuelve <code>@luna-form/core</code> a las fuentes (por ejemplo, con <code>paths</code> propios en su config) y da lo mismo en los dos estados; <code>date-submission-default.spec.ts</code> formateado; y los dos checks como pasos del job <code>lint</code>. <b>Mejora esperada:</b> un export muerto o un archivo sin formato se ve en el PR que lo trae.</p>',
        },
      ],
    },
    {
      code: 'BUG-02',
      title:
        'resolveTarget mete el nombre de la lista en una regex sin escaparlo: tags[]/label apunta a otro campo y a[ lanza',
      sev: 'mejora',
      cat: 'errores',
      st: 'corregido',
      stLabel: 'Corregido en #178',
      sevNote: 'nombres con caracteres de regex',
      audit: 'audit-2026-11-19',
      sections: [
        {
          label: 'Dónde',
          html: '<p><code>packages/luna-core/src/util/path.ts:8</code>: <code>new RegExp(`(^|.*\\.)(${parent}\\.\\d+\\.)`)</code>. Lo usan los eventos <code>state</code>, <code>value</code> y <code>source</code> en <code>use-input-core.ts:316</code>, <code>:484</code> y <code>:509</code>, y el esquema de las agent tools en <code>tool-schema.ts:761</code>.</p>',
        },
        {
          label: 'Qué pasa',
          html: '<p>Un destino de fila como <code>tags[]/label</code>, desde <code>tags[].0.flag</code>, resuelve a <code>label</code> del nivel de arriba en vez de <code>tags[].0.label</code>: el cambio cae en otro campo, o en ninguno. Lo mismo con <code>items(1)</code> o <code>a+</code>. Un nombre como <code>a[</code> es una regex inválida y <code>resolveTarget</code> lanza <code>SyntaxError</code>. <code>isTargetOf</code>, en el mismo archivo, compara segmentos como texto y no tiene el problema.</p>',
        },
        {
          label: 'Prueba',
          html: '<p><code>tests/unit/path.spec.ts :: should read a list name as written</code> y <code>:: should not throw on a list name that is no regex</code>.</p>',
        },
        {
          label: 'Plan de corrección',
          html: '<p><b>Fase 2.</b> BUG-02. <b>Crear primero:</b> las dos pruebas. <b>Antes:</b> <code>label</code> y <code>SyntaxError</code>. <b>Después:</b> <code>resolveTarget</code> busca el segmento por texto, como <code>isTargetOf</code>. <b>Mejora esperada:</b> un nombre de lista con corchetes, como los que usan muchos formularios HTML, funciona igual que cualquier otro.</p>',
        },
        {
          label: 'Corrección',
          audit: 'audit-2026-11-19',
          html: '<p>Commit <code>fdb6758</code> en la rama <code>claude/bug-02-resolve-target</code>, desde <code>main</code>, integrado en el <a href="https://github.com/jonattanva/luna-form/pull/178">PR #178</a> (<code>c4db2d4</code>). <code>resolveTarget</code> compara segmentos como texto y conserva qué fila elige: la primera si el nombre empieza con la lista, la última en el camino si no. <b>Antes:</b> <code>label</code> para <code>tags[]/label</code>, <code>orderXlines.2.qty</code> para <code>order.lines/qty</code> y <code>SyntaxError</code> para <code>a[</code>. <b>Después:</b> <code>tags[].0.label</code>, <code>qty</code> y <code>a[.0.b</code>. <code>tests/unit/path.spec.ts</code> fija también el comportamiento que no cambia. Pasan build, lint, tipos, 1278 unitarias y las e2e de eventos relativos a una fila en los tres navegadores (87 corridas), según la sesión que lo hizo.</p>',
        },
      ],
    },
    {
      code: 'U-01',
      title:
        'El select del editor no le pasa aria-invalid ni aria-errormessage al botón que toma el foco, y ninguna e2e puede verificarlo',
      sev: 'optim',
      cat: 'a11y',
      st: 'corregido',
      stLabel: 'Corregido en #190',
      sevNote: 'banco de pruebas',
      audit: 'audit-2026-11-19',
      sections: [
        {
          label: 'Dónde',
          html: '<p><code>apps/react-luna-editor/components/ui/wrapper/select.tsx:24</code>: <code>{...selectProps}</code> va a la raíz de Radix y <code>SelectTrigger</code> recibe solo <code>id</code>. Lo mismo en el combobox de zona horaria y en los chips (<code>wrapper/chips.tsx</code> toma solo los <code>aria-label*</code>).</p>',
        },
        {
          label: 'Qué pasa',
          html: '<p>La librería entrega <code>aria-invalid</code> y <code>aria-errormessage</code> a cada input (<code>buildAriaAttributes</code>), como dice <code>docs/fields/custom-inputs.md</code>. Después de un envío fallido con 12 tipos de campo requeridos, los tienen el texto, número, email, textarea, fecha, hora, radio, checkbox y switch, pero no el select, la zona horaria ni los chips. El editor es el banco de las e2e y el ejemplo que se copia, así que hoy ninguna prueba puede comprobar el estado de error de esos controles.</p>',
        },
        {
          label: 'Prueba',
          html: '<p><code>tests/e2e/select-aria-invalid.spec.ts :: says it is invalid and where its message is</code>, en los tres navegadores.</p>',
        },
        {
          label: 'Plan de corrección',
          html: '<p><b>Fase 5.</b> U-01. <b>Crear primero:</b> la prueba de arriba. <b>Antes:</b> el combobox sin los dos atributos. <b>Después:</b> los wrappers del editor pasan los atributos ARIA al elemento que toma el foco, y una prueba igual para la zona horaria y los chips. <b>Mejora esperada:</b> el estado de error de cada tipo de campo se puede probar.</p>',
        },
        {
          label: 'Corrección',
          audit: 'audit-2026-11-19',
          html: '<p>Un solo commit en la rama <code>claude/youthful-carson-896dd3</code>, desde <code>main</code> (<code>876f23e</code>). Una función del editor, <code>splitAria</code> en <code>apps/react-luna-editor/lib/utils.ts</code>, separa los atributos <code>aria-*</code> que entrega el formulario del resto de las props, y cada wrapper los pone en el elemento que toma el foco: el botón del select, el input del combobox de zona horaria y el grupo de los chips. El nombre sigue saliendo del label (<code>aria-labelledby</code>) o de <code>advanced.aria</code>, y las demás props siguen yendo a la raíz. La librería no cambia. <b>Antes:</b> con el mensaje de error visible, ninguno de los tres controles tenía <code>aria-invalid</code> ni <code>aria-errormessage</code>; la prueba del select pasaba solo como fallo esperado, y las de zona horaria y chips fallaban sin la marca. <b>Después:</b> los tres los tienen, y <code>tests/e2e/select-aria-invalid.spec.ts</code> los comprueba sin <code>.fail</code>. Pasan <code>pnpm build</code>, <code>lint</code>, <code>typescript</code> y las unitarias, 273 e2e de estos controles en Chromium, Firefox y WebKit, y las 36 de <code>agent-tools.spec.ts</code> en Chromium. <code>knip</code> y <code>prettier:check</code> ya fallaban en <code>main</code> por archivos que este cambio no toca.</p>',
        },
      ],
    },
    {
      code: 'U-02',
      title: 'Después de un envío fallido el foco se queda en Submit',
      sev: 'optim',
      cat: 'a11y',
      st: 'corregido',
      stLabel: 'Corregido en #180',
      audit: 'audit-2026-11-19',
      sections: [
        {
          label: 'Dónde',
          html: '<p>El envío de <code>packages/luna-react/src/client/hook/use-form-action.ts</code>.</p>',
        },
        {
          label: 'Qué pasa',
          html: '<p>Con 12 campos requeridos vacíos, después del clic el foco sigue en el botón Submit. El aviso «There were validation errors submitting the form.» está en el <code>Alert</code> del editor, con <code>role="alert"</code>, así que se anuncia, pero quien usa teclado tiene que buscar el primer campo con error. La documentación no promete nada sobre el foco, así que es una decisión a tomar, no un incumplimiento.</p>',
        },
        {
          label: 'Prueba',
          html: '<p>Medición: <code>document.activeElement</code> después del envío, en Chromium, sobre <code>next start</code>.</p>',
        },
        {
          label: 'Plan de corrección',
          html: '<p><b>Fase 5.</b> U-02. <b>Crear primero:</b> decidir si el formulario mueve el foco al primer campo inválido, y escribirlo en <code>docs/forms/submit.md</code>. <b>Antes:</b> el foco en Submit. <b>Después:</b> lo que diga la documentación, con su prueba. <b>Mejora esperada:</b> menos pasos para corregir un envío con teclado.</p>',
        },
        {
          label: 'Corrección',
          audit: 'audit-2026-11-19',
          html: '<p>Commit <code>2e0fc61</code> en la rama <code>claude/brave-boyd-aee2b6</code>, desde <code>main</code>, integrado en el <a href="https://github.com/jonattanva/luna-form/pull/180">PR #180</a> (<code>8df8ac5</code>). Cuando la validación frena un envío, el foco pasa al campo del primer error en el orden de la página, como hace el navegador con su propia validación. El campo se encuentra por el <code>id</code> que nombra su label y, si no, por el <code>aria-errormessage</code>; un control que no toma el foco (un grupo de botones) se lo da al primero de adentro; un campo en una sección o fila colapsada recibe el foco cuando se abre lo que lo contiene. Si el foco estaba fuera del formulario, no se mueve, y un error que devuelve la acción no mueve nada. <b>Antes:</b> el foco en Submit. <b>Después:</b> el foco en el primer campo con error. Documentado en <code>docs/forms/submit.md</code>, con la prueba <code>tests/e2e/failed-submit-focus.spec.ts</code>. Según la sesión que lo hizo, pasan todos los checks y las 135 e2e relacionadas en Chromium, Firefox y WebKit.</p>',
        },
      ],
    },
    {
      code: 'S-02',
      title:
        'Los tipos Apply y Submission se exportan sin que nadie los importe',
      sev: 'optim',
      cat: 'código muerto',
      st: 'corregido',
      stLabel: 'Corregido en #177',
      audit: 'audit-2026-11-19',
      sections: [
        {
          label: 'Dónde',
          html: '<p><code>packages/luna-react/src/client/hook/use-apply.ts:26</code> (<code>Apply</code>) y <code>packages/luna-react/src/client/lib/agent-host.ts:70</code> (<code>Submission</code>). <code>knip</code> informa además <code>@types/react-dom</code> como devDependency sin uso de <code>luna-react</code>, que no se verificó.</p>',
        },
        {
          label: 'Qué pasa',
          html: '<p>Sin el <code>export</code>, el build de los dos paquetes, <code>tsc</code> de <code>luna-core</code>, <code>luna-react</code> y el editor, y las 1257 unitarias pasan. Son los únicos 2 de los 29 que informa <code>knip</code> con los que pasa eso (ver S-01).</p>',
        },
        {
          label: 'Prueba',
          html: '<p>Medición: quitar el <code>export</code> de a uno y correr build, <code>tsc</code> y unitarias.</p>',
        },
        {
          label: 'Plan de corrección',
          html: '<p><b>Fase 5.</b> S-02, junto con S-01. <b>Antes:</b> 2 exports sin uso. <b>Después:</b> sin <code>export</code>, y <code>@types/react-dom</code> quitado si <code>luna-react</code> compila sin él.</p>',
        },
        {
          label: 'Corrección',
          audit: 'audit-2026-11-19',
          html: '<p>Commit <code>a3d5139</code> en la rama <code>claude/s-02-unused-exports</code>, desde <code>main</code> en <code>1df3fd4</code>, integrado en el <a href="https://github.com/jonattanva/luna-form/pull/177">PR #177</a> (<code>3496fc9</code>). <code>Apply</code> y <code>Submission</code> dejan de exportarse, y <code>@types/react-dom</code> sale de <code>luna-react</code> (el editor conserva el suyo). <b>Antes:</b> <code>knip</code> los informaba con y sin build. <b>Después:</b> no los informa en ninguno de los dos estados. El JavaScript construido es idéntico byte a byte (10 archivos, mismo md5 antes y después); cambian solo los <code>.d.ts</code>. Pasan build, <code>pnpm lint</code>, <code>pnpm typescript</code> y las 1268 unitarias, con una instalación limpia: una primera prueba falló al construir el editor (<code>tslib</code> sin resolver) porque <code>pnpm remove</code> dejó los enlaces a medias, y con <code>node_modules</code> nuevo pasa. Sin e2e: no cambia nada de lo que corre en el navegador.</p>',
        },
      ],
    },
  ],
}
