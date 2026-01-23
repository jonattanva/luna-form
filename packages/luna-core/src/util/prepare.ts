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
    ? resolved.sort((a, b) => getOrder(a) - getOrder(b))
    : []
}

export function resolveRefs(
  base: unknown,
  definition?: Definition,
  cache = new Map<object, unknown>(),
  visited = new WeakSet<object>()
): unknown {
  if (!isDefinition(definition) || !base || typeof base !== 'object') {
    return base
  }

  if (cache.has(base)) {
    return cache.get(base)
  }

  if (visited.has(base)) {
    return base
  }

  visited.add(base)
  if (Array.isArray(base)) {
    return base.map((item) => resolveRefs(item, definition, cache, visited))
  }

  if ($REF in base && isString(base[$REF])) {
    const path = base[$REF].replace(REGEX_REF, '')
    const resolved = extract(definition, path)

    if (resolved !== null) {
      return resolveRefs(resolved, definition, cache, visited)
    }
    return base
  }

  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(base)) {
    result[key] = resolveRefs(value, definition, cache, visited)
  }

  visited.delete(base)
  cache.set(base, result)

  return result
}

export function entries<T>(values?: Nullable<Record<string, T>>) {
  return Object.entries(values ?? {}) as [key: string, value: T][]
}

function getOrder(item: Base) {
  return item.order ?? Number.MAX_VALUE
}

function isDefinition(
  definition?: Nullable<Definition>
): definition is Definition {
  return (
    definition !== undefined &&
    isObject(definition) &&
    Object.keys(definition).length > 0
  )
}
