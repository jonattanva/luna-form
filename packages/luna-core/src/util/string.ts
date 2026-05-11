import { applyFormatFilter } from './format'
import { extract } from './extract'
import { isObject, isString, isValue } from './is-type'

const REGEX_MARKDOWN_LINK = /\[([^\]]{1,500})\]\(([^)]{1,2000})\)/g

export type InterpolateOptions = {
  locale?: string
}

/**
 * Replaces placeholders in the format {key} with values from the provided object.
 * Supports nested objects using dot notation (e.g., {user.id}) and pipe filters
 * (e.g., {price | currency:USD}).
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
    return /{([^}]{1,200})}/.test(template)
  }

  if (Array.isArray(template)) {
    return template.some((item) => isInterpolated(item))
  }

  if (isObject(template)) {
    return Object.values(template).some((value) => isInterpolated(value))
  }

  return false
}

function replacePlaceholders(
  template: string,
  values: Record<string, unknown> = {},
  options: InterpolateOptions = {}
): string {
  return template.replace(/{([^}]{1,200})}/g, (match, expression) => {
    const segments = String(expression)
      .split('|')
      .map((s) => s.trim())

    const [keyExpr, ...filters] = segments
    if (!keyExpr) {
      return match
    }

    const initial = keyExpr.includes('.')
      ? extract(values, keyExpr)
      : values[keyExpr]

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
