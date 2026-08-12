import { applyFormatFilter } from './format'
import { extract } from './extract'
import { isObject, isString, isValue } from './is-type'

/**
 * Every quantifier in this file is bounded, and none of the bounds is a
 * guess about how long real input gets.
 *
 * They replaced plain `+` in two hardening passes -- `bf15cf9` for the
 * placeholders, `abcc4800` for the markdown link -- to cap backtracking on
 * hostile input. A definition is authored, but the *values* it interpolates
 * are not: they arrive from a form the user typed into and from remote data
 * sources. An unbounded `+` next to a literal that may never appear is what
 * turns a long string into wasted CPU.
 *
 * So the ceilings are a safety limit, not a specification. Raising one is
 * fine; turning it back into `+` or `*` undoes the fix. A placeholder longer
 * than the bound simply does not match, and the text is left alone -- the
 * same outcome as a placeholder nobody can resolve.
 */

// `[text](url)`, the only markdown `formatMarkdown` understands.
//
// Global, and read with `exec` in a loop, so it carries `lastIndex` between
// calls: the loop has to run until `exec` returns null for the state to reset.
// It does today. A `break` or an early `return` inside it would leave the next
// caller starting from the middle of its own text.
const REGEX_MARKDOWN_LINK = /\[([^\]]{1,500})\]\(([^)]{1,2000})\)/g

// One placeholder: `{`, then anything that is not a closing brace, then `}`.
// The expression inside is not parsed here -- the dot path and the pipe
// filters are split out by `replacePlaceholders`.
//
// Two objects for one pattern because of the `g` flag, which is state:
// `lastIndex` advances on every match, so a shared instance would make
// `.test()` answer differently on the same string depending on what ran
// before it.
const REGEX_PLACEHOLDER = /{([^}]{1,200})}/
const REGEX_PLACEHOLDER_ALL = /{([^}]{1,200})}/g

// A template that is nothing but one placeholder: `{value}`, not `a {value}`.
// Anchored at both ends, which is what "nothing but" means here.
//
// Filters are excluded from the class on purpose -- `{value | currency:USD}`
// formats into text, so it can only ever be a string and belongs on the string
// path. That is the one difference from REGEX_PLACEHOLDER above.
const REGEX_WHOLE_PLACEHOLDER = /^{([^}|]{1,200})}$/

export type InterpolateOptions = {
  locale?: string
}

/**
 * Replaces placeholders in the format {key} with values from the provided object.
 * Supports nested objects using dot notation (e.g., {user.id}) and pipe filters
 * (e.g., {price | currency:USD}).
 *
 * Gives back what it was given: a string stays a string, an object of templates
 * stays an object of the same shape. Callers that want the *value* behind a
 * placeholder rather than the text of it want {@link interpolateValue}.
 */
export function interpolate<T>(
  template: T,
  values: Record<string, unknown> = {},
  options: InterpolateOptions = {}
): T {
  if (isString(template)) {
    return replacePlaceholders(template, values, options) as T
  }

  if (Array.isArray(template)) {
    return template.map((item) => {
      return interpolate(item, values, options)
    }) as T
  }

  if (isObject(template)) {
    const results: Record<string, unknown> = {}
    for (const key in template) {
      results[key] = interpolate(template[key], values, options)
    }
    return results as T
  }

  return template
}

/**
 * Interpolates a template that stands for a *value* rather than for text.
 *
 * Identical to {@link interpolate} but for one case: a template that is nothing
 * but a placeholder -- `{value}`, not `a {value}` and not
 * `{value | currency:USD}` -- gives back the object or array behind it as it
 * is, instead of the text of it.
 *
 * That case has no text to produce, and `interpolate` leaves the placeholder
 * standing, so `{ "rows": "{value}" }` writes the literal `"{value}"`. Which is
 * what makes a target declared as `Array<Record<string, unknown>>` unreachable
 * from a definition.
 *
 * Kept apart from `interpolate` rather than folded into it because
 * `interpolate` promises to give back what it was given, and three of its four
 * callers depend on that -- a url, a request body, a preview label. Only a
 * `value` event asks for data, and the consumer it hands the result to already
 * takes `unknown`.
 *
 * Only the template as a whole is considered: a placeholder *inside* something
 * longer is still text, wherever it appears.
 */
export function interpolateValue(
  template: unknown,
  values: Record<string, unknown> = {},
  options: InterpolateOptions = {}
): unknown {
  if (isString(template)) {
    const structure = resolveStructure(template, values)
    if (structure !== undefined) {
      return structure
    }
  }

  return interpolate(template, values, options)
}

export function interpolateIfNeeded<T>(
  template: T,
  values: Record<string, unknown> = {},
  options: InterpolateOptions = {}
): T {
  return isInterpolated(template)
    ? interpolate(template, values, options)
    : template
}

export function isInterpolated(template: unknown): boolean {
  if (isString(template)) {
    return REGEX_PLACEHOLDER.test(template)
  }

  if (Array.isArray(template)) {
    return template.some((item) => isInterpolated(item))
  }

  if (isObject(template)) {
    return Object.values(template).some((value) => isInterpolated(value))
  }

  return false
}

// The value a placeholder expression points at. Dotted expressions walk the
// object; plain ones are a lookup. Shared so the two readers of a placeholder
// below cannot disagree about what one resolves to.
function resolveExpression(
  values: Record<string, unknown>,
  keyExpr: string
): unknown {
  return keyExpr.includes('.') ? extract(values, keyExpr) : values[keyExpr]
}

/**
 * The object or array behind a template that is a single placeholder.
 *
 * `undefined` for everything else -- text around the placeholder, a filter, a
 * scalar, a placeholder that resolves to nothing -- so the caller falls through
 * to `replacePlaceholders` and every existing case keeps the behavior it had.
 */
function resolveStructure(
  template: string,
  values: Record<string, unknown>
): Record<string, unknown> | unknown[] | undefined {
  const match = REGEX_WHOLE_PLACEHOLDER.exec(template)
  if (!match) {
    return
  }

  // Trimmed to agree with `replacePlaceholders`, which trims each segment, so
  // `{ value }` reads the same on both paths.
  const keyExpr = match[1].trim()
  if (!keyExpr) {
    return
  }

  const resolved = resolveExpression(values, keyExpr)
  if (isObject<unknown>(resolved) || Array.isArray(resolved)) {
    return resolved
  }
}

function replacePlaceholders(
  template: string,
  values: Record<string, unknown> = {},
  options: InterpolateOptions = {}
): string {
  return template.replace(REGEX_PLACEHOLDER_ALL, (match, expression) => {
    const segments = String(expression)
      .split('|')
      .map((s) => s.trim())

    const [keyExpr, ...filters] = segments
    if (!keyExpr) {
      return match
    }

    const initial = resolveExpression(values, keyExpr)

    if (filters.length === 0) {
      return isValue(initial) ? String(initial) : match
    }

    if (initial === undefined || initial === null) {
      return match
    }

    let current: unknown = initial
    for (const filter of filters) {
      const result = applyFormatFilter(current, filter, {
        locale: options.locale,
      })
      if (result === undefined) {
        return match
      }
      current = result
    }

    return String(current)
  })
}

export function formatMarkdown<K>(
  text?: string,
  callback?: (index: number, url: string, text?: string) => K
): (string | K)[] | string | null {
  if (!isString(text)) {
    return null
  }

  if (!text || text.trim().length === 0) {
    return null
  }

  let match
  let lastIndex = 0
  let hasMatch = false

  const parts: (string | K)[] = []

  while ((match = REGEX_MARKDOWN_LINK.exec(text)) !== null) {
    const [fullMatch, linkText, url] = match
    const index = match.index
    hasMatch = true

    if (index > lastIndex) {
      parts.push(text.substring(lastIndex, index))
    }

    const value = callback ? callback(index, url, linkText) : fullMatch
    parts.push(value)

    lastIndex = index + fullMatch.length
  }

  if (!hasMatch) {
    return text
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  return parts
}
