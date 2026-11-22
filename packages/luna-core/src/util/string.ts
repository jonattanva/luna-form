import { applyFormatFilter, readNow } from './format'
import { extract } from './extract'
import { isObject, isString, isValue } from './is-type'
import { translate } from './translate'

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

// The same "nothing but one placeholder" for a url, where a filter is allowed:
// what decides is that the template writes no part of the url itself.
const REGEX_WHOLE_URL_PLACEHOLDER = /^{[^}]{1,200}}$/

// How the URL standard reads a path segment: `.` and `..`, with `%2E` for a
// dot in either case, step within or above the path; a tab or a newline is
// removed wherever it is, and what is at or below a space is removed from both
// ends of the url. `\\` ends a segment like `/` in an http url.
const REGEX_DOT_SEGMENT = /^(?:\.|%2e){1,2}$/i
const REGEX_URL_TAB_OR_NEWLINE = /[\t\n\r]/g
const REGEX_URL_EDGE = /^[\u0000-\u0020]+|[\u0000-\u0020]+$/g
const URL_PATH_END = ['/', '\\', '?', '#']

export type InterpolateOptions = {
  locale?: string
  // The instant a relative date is measured from: `context.now`.
  now?: string
}

/**
 * What text the form renders is formatted with: the form's language, its
 * `lang`, and the instant the host gave in `context`. A label and a
 * description format the same value the same way because they ask here.
 */
export function renderOptions(
  lang?: string,
  context?: Record<string, unknown>
): InterpolateOptions {
  return { locale: lang, now: readNow(context) }
}

/**
 * Cuts a template at one placeholder: what comes before the first `{key}` and
 * what comes after it, or undefined when the template does not name it. For
 * text that has to be pieced together around something a string cannot hold,
 * such as a node the page renders and keeps up to date.
 */
export function splitTemplate(
  template: string,
  key: string
): [string, string] | undefined {
  const placeholder = `{${key}}`
  const at = template.indexOf(placeholder)
  if (at === -1) {
    return undefined
  }

  return [template.slice(0, at), template.slice(at + placeholder.length)]
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
 * `interpolate` promises to give back what it was given, and its other callers
 * depend on that -- a request body, a preview label. Only a
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

/**
 * Interpolates the url of a source, where a value is data and the template is
 * the shape of the request.
 *
 * Each value is encoded as a URI component, so it stays the one query value or
 * the one path segment its placeholder stands in: `R&D` is sent as `R%26D`, not
 * as `R` and a stray `D` parameter, `../admin` does not climb the path, and
 * `//host` at the start of a template does not change the host.
 *
 * A template that is nothing but one placeholder -- `{url}`, an endpoint taken
 * whole from the selected option -- has no authored url around the value to
 * protect, so the value is the url and is used as it is. It is checked against
 * `remotePatterns` like any other url before it is fetched.
 *
 * A placeholder that does not resolve is left standing, unencoded, so the
 * request is still held until it does.
 *
 * Encoding cannot keep a value of `.` or `..` in its segment: the URL reads
 * those, and `%2E` and `%2E%2E` just the same, as a step within or above the
 * path, so `/api/countries/{value}/cities` with `..` would ask for
 * `/api/cities`. A segment of the path that a value helps write and that comes
 * out as one gives back the template, every placeholder standing, which holds
 * the request the way an unresolved one does.
 */
export function interpolateUrl(
  template: string,
  values: Record<string, unknown> = {},
  options: InterpolateOptions = {}
): string {
  if (REGEX_WHOLE_URL_PLACEHOLDER.test(template.trim())) {
    return replacePlaceholders(template, values, options)
  }

  // The URL parser drops what is at or below a space from both ends of a url,
  // so a template's edges are not part of any segment. A value cannot be
  // there: those characters are encoded.
  const trimmed = template.replace(REGEX_URL_EDGE, '')

  let url = ''
  // The path segment being written, and whether a value wrote any of it. The
  // query and the fragment are not walked: a dot there is only a character.
  let segment = ''
  let fromValue = false
  let inPath = true
  let leavesSegment = false

  const closeSegment = () => {
    if (fromValue && isDotSegment(segment)) {
      leavesSegment = true
    }
    segment = ''
    fromValue = false
  }

  // Only the template can end a segment: an encoded value holds no `/`, `\`,
  // `?` or `#`.
  const writeTemplate = (text: string) => {
    url += text
    for (const char of text) {
      if (!inPath) {
        return
      }
      if (URL_PATH_END.includes(char)) {
        closeSegment()
        inPath = char === '/' || char === '\\'
      } else {
        segment += char
      }
    }
  }

  let lastIndex = 0
  for (const match of trimmed.matchAll(REGEX_PLACEHOLDER_ALL)) {
    writeTemplate(trimmed.slice(lastIndex, match.index))
    lastIndex = match.index + match[0].length

    const resolved = resolvePlaceholder(match[1], values, options)
    if (resolved === undefined) {
      writeTemplate(match[0])
      continue
    }

    const encoded = encodeURIComponent(resolved)
    url += encoded
    if (inPath) {
      segment += encoded
      fromValue = true
    }
  }
  writeTemplate(trimmed.slice(lastIndex))
  closeSegment()

  return leavesSegment ? template : url
}

// A segment the url reads as `.` or `..`.
function isDotSegment(segment: string): boolean {
  return REGEX_DOT_SEGMENT.test(segment.replace(REGEX_URL_TAB_OR_NEWLINE, ''))
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
    return resolvePlaceholder(expression, values, options) ?? match
  })
}

// The text one placeholder resolves to -- its value, through its filters --
// or undefined when it does not resolve and has to be left standing.
function resolvePlaceholder(
  expression: string,
  values: Record<string, unknown>,
  options: InterpolateOptions
): string | undefined {
  const [keyExpr, ...filters] = expression.split('|').map((s) => s.trim())
  if (!keyExpr) {
    return
  }

  const initial = resolveExpression(values, keyExpr)

  if (filters.length === 0) {
    return isValue(initial) ? String(initial) : undefined
  }

  if (initial === undefined || initial === null) {
    return
  }

  let current: unknown = initial
  for (const filter of filters) {
    const result = applyFormatFilter(current, filter, {
      locale: options.locale,
      now: options.now,
    })
    if (result === undefined) {
      return
    }
    current = result
  }

  return String(current)
}

type LinkCallback<K> = (index: number, url: string, text?: string) => K

type Formatted<K> = (string | K)[] | string | null

export function formatMarkdown<K>(
  text?: string,
  callback?: LinkCallback<K>
): Formatted<K> {
  return readLinks(text, callback)
}

/** What a template is resolved with before it is rendered as text. */
export type TemplateScope = {
  // The dictionary the resolved text is looked up in.
  dictionary?: Record<string, string>
  options?: InterpolateOptions
  // What its placeholders read: `context`, `env` and, in a description, `value`.
  values?: Record<string, unknown>
}

/**
 * Renders an authored template -- placeholders, translation, markdown links --
 * so that only the author's text can make a link.
 *
 * The links are read from the template *before* any placeholder in it is
 * resolved, and each placeholder is then resolved inside the piece it sits in:
 * plain text, a link's text or a link's url. What a placeholder resolves to is
 * a value, from a person typing, the host or a change event, and is never read
 * as markdown: `[a](b)` typed into a field stays those characters on screen.
 *
 * A link the author wrote may still carry a placeholder in its text or its url
 * -- `[{context.name}]({context.profileUrl})` -- since writing the link is the
 * author's decision; the value fills it in and cannot open a second one.
 *
 * Translation still runs on the resolved text, as it always has. A dictionary
 * that answers for it returns an authored string, and that string's links are
 * read as written.
 */
export function formatTemplate<K>(
  template: string | undefined,
  scope: TemplateScope,
  callback?: LinkCallback<K>
): Formatted<K> {
  const resolve = (text: string): string => {
    return interpolateIfNeeded(text, scope.values, scope.options)
  }

  const resolved = resolve(template ?? '')
  const translated = translate(resolved, scope.dictionary)
  if (translated !== resolved) {
    return readLinks(translated, callback)
  }

  return readLinks(template, callback, resolve)
}

// Splits `text` at its `[text](url)` links. `resolve` turns each piece the
// links leave -- the text between them, and a link's own text and url -- into
// what is shown, after the split: nothing it returns can become a link.
function readLinks<K>(
  text: string | undefined,
  callback?: LinkCallback<K>,
  resolve: (text: string) => string = (piece) => piece
): Formatted<K> {
  if (!isString(text)) {
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
      parts.push(resolve(text.substring(lastIndex, index)))
    }

    const value = callback
      ? callback(index, resolve(url), resolve(linkText))
      : resolve(fullMatch)
    parts.push(value)

    lastIndex = index + fullMatch.length
  }

  if (!hasMatch) {
    const resolved = resolve(text)
    return resolved.trim().length === 0 ? null : resolved
  }

  if (lastIndex < text.length) {
    parts.push(resolve(text.substring(lastIndex)))
  }

  return parts
}
