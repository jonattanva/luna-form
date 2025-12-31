import { extract } from './extract'
import { isObject, isString, isValue } from './is-type'

const REGEX_MARKDOWN_LINK = /\[([^\]]+)\]\(([^)]+)\)/g

/**
 * Replaces placeholders in the format {key} with values from the provided object.
 * Supports nested objects using dot notation (e.g., {user.id}).
 */
export function interpolate<T>(
  template: T,
  values: Record<string, unknown> = {}
): T {
  if (isString(template)) {
    return replacePlaceholders(template, values) as T
  }

  if (Array.isArray(template)) {
    return template.map((item) => {
      return interpolate(item, values)
    }) as T
  }

  if (isObject(template)) {
    const results: Record<string, unknown> = {}
    for (const key in template) {
      results[key] = interpolate(template[key], values)
    }
    return results as T
  }

  return template
}

export function isInterpolated(template: unknown): boolean {
  if (isString(template)) {
    return /{([^}]+)}/.test(template)
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
  values: Record<string, unknown> = {}
): string {
  return template.replace(/{([^}]+)}/g, (match, key) => {
    const value = key.includes('.') ? extract(values, key) : values[key]
    if (isValue(value)) {
      return String(value)
    }
    return match
  })
}

export function formatMarkdown<K>(
  text?: string,
  callback?: (index: number, url: string, text?: string) => K
): (string | K)[] | string | null {
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
