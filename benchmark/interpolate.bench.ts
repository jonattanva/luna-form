import { measure, report, type BenchmarkResult } from './measure'
import {
  interpolate,
  interpolateValue,
} from '../packages/luna-core/src/util/string'

/**
 * What `interpolateValue` costs over `interpolate`.
 *
 * The two are paired on purpose: `interpolateValue` is what a `value` change
 * event runs, and it differs from `interpolate` only in recognising a template
 * that is nothing but one placeholder. The question this answers is what that
 * recognition costs on the templates it does *not* apply to, which are most of
 * them.
 *
 *   pnpm benchmark:interpolate
 *
 * Read the pairs, not the absolute numbers -- those move with the machine.
 */

const URL_VALUES = { id: 123, category: 'books' }
const SCALAR = { value: 'alpha' }
const ROWS = {
  value: [
    { key: 'alpha', amount: '1' },
    { key: 'beta', amount: '2' },
  ],
}

const results: BenchmarkResult[] = [
  // Anchored at both ends, so a template with anything around the placeholder
  // is rejected on the first character and pays nothing.
  measure('interpolate: url with placeholders', () => {
    interpolate('/api/items/{category}/{id}', URL_VALUES)
  }),

  measure('interpolateValue: url with placeholders', () => {
    interpolateValue('/api/items/{category}/{id}', URL_VALUES)
  }),

  // The case that pays: the whole template matches, the expression resolves,
  // and a scalar comes back -- so it falls through and `replacePlaceholders`
  // resolves it a second time. This is the most common shape a `value` event
  // carries.
  measure('interpolate: whole placeholder over a scalar', () => {
    interpolate('{value}', SCALAR)
  }),

  measure('interpolateValue: whole placeholder over a scalar', () => {
    interpolateValue('{value}', SCALAR)
  }),

  // The case that pays off: the structure is handed back as it is, and
  // `replacePlaceholders` never runs. `interpolate` here is the old behavior,
  // which returned the literal `"{value}"`.
  measure('interpolate: whole placeholder over rows', () => {
    interpolate('{value}', ROWS)
  }),

  measure('interpolateValue: whole placeholder over rows', () => {
    interpolateValue('{value}', ROWS)
  }),
]

report(results)
