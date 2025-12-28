import { $REF } from './constant'
import { extract } from './extract'
import { isObject, isString } from './is-type'
import type { Base, Definition, Nullable } from '../type'

const REGEX_REF = /^#\/definition\//

export function prepare<T extends Base>(
  base: readonly T[] = [],
  definition?: Definition
) {
  const resolved = resolveRefs(base, definition)

  return Array.isArray(resolved)
    ? resolved
        .filter((field) => field.hidden !== true)
        .sort((a, b) => getOrder(a) - getOrder(b))
    : []
}

export function resolveRefs(obj: unknown, definition?: Definition): unknown {
  if (!definition || !obj || !isObject(obj)) {
    if (Array.isArray(obj)) {
      return obj.map((item) => resolveRefs(item, definition))
    }
    return obj
  }

  if ($REF in obj && isString(obj[$REF])) {
    const path = obj[$REF].replace(REGEX_REF, '')
    const resolved = extract(definition, path)
    return resolved !== null ? resolved : obj
  }

  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    result[key] = resolveRefs(value, definition)
  }
  return result
}

function getOrder(item: Base) {
  return item.order ?? Number.MAX_VALUE
}

export function entries<T>(values?: Nullable<Record<string, T>>) {
  return Object.entries(values ?? {}) as [key: string, value: T][]
}
