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
  audits: [],
  findings: [],
}
