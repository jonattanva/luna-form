import { $REF, FIELDS, TYPE } from './constant'
import { extract } from './extract'
import { isObject, isString } from './is-type'
import type { Base, Definition, Filterable, Nullable } from '../type'

const REGEX_REF = /^#\/definition\//

export function prepare<T extends Filterable>(
  base: readonly T[] = [],
  definition?: Definition,
  isStep?: boolean
) {
  const resolved = resolveRefs(base, definition)
  const items = Array.isArray(resolved)
    ? resolved.filter(filter).sort((a, b) => getOrder(a) - getOrder(b))
    : []

  if (isStep) {
    return items.map((item, index) => ({
      ...item,
      step: index + 1,
    }))
  }

  return items
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

function filter<T extends Filterable>(base: T) {
  if (TYPE in base) {
    return true
  }

  if (Array.isArray(base[FIELDS])) {
    return base[FIELDS].length > 0
  }

  return true
}
