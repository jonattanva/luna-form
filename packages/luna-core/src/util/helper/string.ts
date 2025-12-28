import { extract } from '../extract'
import { isValue } from '../is-type'

/**
 * Replaces placeholders in the format {key} with values from the provided object.
 * Supports nested objects using dot notation (e.g., {user.id}).
 */
export function interpolate(
  template: string,
  values: Record<string, unknown> = {}
): string {
  return template.replace(/{([^}]+)}/g, (match, key) => {
    const value = key.includes('.') ? extract(values, key) : values[key]
    if (isValue(value)) {
      const str = String(value)

      // If the value looks like a full URL, we don't encode it
      if (str.includes('://')) {
        return str
      }
      return encodeURIComponent(str)
    }
    return match
  })
}

export function isInterpolated(template: string): boolean {
  return /{([^}]+)}/.test(template)
}
