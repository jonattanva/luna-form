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
  ],
  findings: [
    {
      code: 'HUE-01',
      title:
        'La guarda de miembros heredados en rutas con puntos se puede romper sin que falle ninguna prueba',
      sev: 'crit',
      sevNote: 'guarda de seguridad',
      cat: 'pruebas',
      st: 'probado',
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
      st: 'probado',
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
          label: 'Plan de corrección',
          html: '<p><b>Fase 6.</b> GUA-01, después de FLK-01. <b>Crear primero:</b> una corrida con un caso inestable a propósito, que tiene que aparecer en el resumen. <b>Antes:</b> 5 casos <code>flaky</code> en 3 corridas sin aviso. <b>Después:</b> cada uno aparece en el resumen del job. <b>Protección esperada:</b> una inestabilidad nueva se ve en el PR que la trae.</p>',
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
          label: 'Plan de corrección',
          html: '<p><b>Fase 3.</b> OPT-02, después de FLK-01. <b>Crear primero:</b> 3 corridas de CI con <code>workers: 2</code>. <b>Antes:</b> 838 s hasta el veredicto, WebKit 2/2 en 713 s. <b>Después:</b> los mismos jobs con 2 workers. <b>Ahorro esperado:</b> a medir; localmente, 49 % menos en Chromium.</p>',
        },
      ],
    },
    {
      code: 'OPT-03',
      title:
        'Las e2e de CI corren sobre next dev; sobre next start la misma suite pasa entera y tarda entre un 21 y un 30 % menos',
      sev: 'mejora',
      cat: 'pruebas',
      st: 'medido',
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
      st: 'probado',
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
      st: 'medido',
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
      st: 'investigar',
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
      ],
    },
  ],
}
