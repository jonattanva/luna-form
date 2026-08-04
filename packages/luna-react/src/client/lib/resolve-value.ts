import { isObject } from '@luna-form/core'

// What a lookup found. `found` answers whether the path exists at all, which is
// a different question from what sits there: a caller is free to hold an empty
// value at a path it means to be empty, and telling that apart from a path
// nobody mentioned is the reason this shape exists.
export type Entry = {
  found: boolean
  value: unknown
}

const MISSING: Entry = { found: false, value: undefined }

// Resolve a dotted path against a value tree, traversing both objects and
// arrays (using numeric segments as array indices). Reports `found: false` when
// any segment cannot be reached.
export function resolveEntry(
  name: string,
  currentValue: Record<string, unknown> | unknown[]
): Entry {
  if (!Array.isArray(currentValue) && name in currentValue) {
    return { found: true, value: currentValue[name] }
  }

  if (!name.includes('.')) {
    return MISSING
  }

  const keys = name.split('.')
  let result: unknown = currentValue

  for (const key of keys) {
    if (result === null || result === undefined) {
      return MISSING
    }

    if (Array.isArray(result)) {
      const index = Number(key)
      if (!Number.isInteger(index) || !(index in result)) {
        return MISSING
      }
      result = result[index]
    } else if (isObject(result)) {
      if (!(key in result)) {
        return MISSING
      }
      result = result[key]
    } else {
      return MISSING
    }
  }

  return { found: true, value: result }
}

// Resolve a dotted path against a value tree, traversing both objects and
// arrays (using numeric segments as array indices). Returns `undefined` when
// any segment cannot be reached.
export function resolveValue(
  name: string,
  currentValue: Record<string, unknown> | unknown[]
): unknown {
  return resolveEntry(name, currentValue).value
}
