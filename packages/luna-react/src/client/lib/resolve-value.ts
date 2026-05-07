// Resolve a dotted path against a value tree, traversing both objects and
// arrays (using numeric segments as array indices). Returns `undefined` when
// any segment cannot be reached.
export function resolveValue(
  name: string,
  currentValue: Record<string, unknown> | unknown[]
): unknown {
  if (!Array.isArray(currentValue) && name in currentValue) {
    return currentValue[name]
  }

  if (!name.includes('.')) {
    return undefined
  }

  const keys = name.split('.')
  let result: unknown = currentValue

  for (const key of keys) {
    if (result === null || result === undefined) {
      return undefined
    }

    if (Array.isArray(result)) {
      const index = Number(key)
      result = Number.isInteger(index) ? result[index] : undefined
    } else if (typeof result === 'object') {
      result = (result as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }

  return result
}
