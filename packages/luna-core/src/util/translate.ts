export function translate(
  key?: string,
  dictionary?: Record<string, string>
): string {
  if (!key) {
    return ''
  }

  if (!dictionary) {
    return key
  }

  return dictionary[key] ?? key
}
