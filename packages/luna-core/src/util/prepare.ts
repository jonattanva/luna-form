import { $REF, FIELDS, TYPE } from './constant'
import { extract } from './extract'
import { isObject, isString } from './is-type'
import type { Base, Definition, Filterable, Nullable } from '../type'

const REGEX_REF = /^#\/definition\//

// What a pair of sections and definition resolved to the last time it was
// asked. Both keys are held weakly, so an entry goes when whoever passed it
// does, and there is nothing to release.
//
// A form resolves its `$ref`s while rendering, which is where the cost was: a
// walk that rebuilds the tree hands every field a new object, and a new object
// is a field that cannot match its memo, a schema that has to be built again,
// and a list that runs its hand-off as if it were unmounting -- on every
// keystroke a controlled host answers. Asked twice with the same two objects,
// this now answers with the same array.
const prepared = new WeakMap<object, WeakMap<object, unknown>>()

export function prepare<T extends Filterable>(
  base: readonly T[] = [],
  definition?: Definition
) {
  if (!isDefinition(definition)) {
    return sortAndFilter<T>(base)
  }

  let byDefinition = prepared.get(base)
  if (!byDefinition) {
    byDefinition = new WeakMap()
    prepared.set(base, byDefinition)
  }

  if (!byDefinition.has(definition)) {
    byDefinition.set(
      definition,
      sortAndFilter<T>(resolveRefs(base, definition))
    )
  }

  return byDefinition.get(definition) as T[]
}

function sortAndFilter<T extends Filterable>(resolved: unknown): T[] {
  return Array.isArray(resolved)
    ? (resolved as T[]).filter(filter).sort((a, b) => getOrder(a) - getOrder(b))
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
    let changed = false
    const items = base.map((item) => {
      const next = resolveRefs(item, definition, cache, visited)
      changed ||= next !== item
      return next
    })

    visited.delete(base)
    cache.set(base, changed ? items : base)

    return cache.get(base)
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
  let changed = false
  for (const [key, value] of Object.entries(base)) {
    result[key] = resolveRefs(value, definition, cache, visited)
    changed ||= result[key] !== value
  }

  visited.delete(base)

  // A node with nothing resolved under it is the node it already was. Handing
  // back a copy instead is what made every field new on every render, `$ref`
  // or no `$ref` anywhere near it.
  cache.set(base, changed ? result : base)

  return cache.get(base)
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
