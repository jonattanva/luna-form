import { $REF, FIELDS, TYPE } from './constant'
import { extract } from './extract'
import { isObject, isString } from './is-type'
import type { Base, Definition, Filterable, Nullable } from '../type'

// Two roots, one syntax. `#/definition/` is JSON the form reuses -- a source, a
// field, a list of options -- and `#/context/` is what the host knows when it
// renders: today, the nights already booked, the user's time zone. They stay
// apart so a reader of the form can tell one from the other, and so a form
// that ships its own definition never has the host's values merged into it.
const REGEX_REF = /^#\/(definition|context)\//

type Roots = Readonly<{
  context?: Record<string, unknown>
  definition?: Definition
}>

// Stands in for a root nobody passed, so the cache below can key on it.
const NONE = {}

// One walk of a tree: what it resolves against, what it has resolved, and
// whether it met a `$ref` into `#/context/`, resolved or not -- only then does
// what it produced depend on the context it was given.
type Walk = {
  cache: Map<object, unknown>
  readsContext: boolean
  roots: Roots
  visited: WeakSet<object>
}

function createWalk(roots: Roots): Walk {
  return {
    cache: new Map(),
    readsContext: false,
    roots,
    visited: new WeakSet(),
  }
}

type Prepared = {
  // The answer for a tree that reads no `#/context/`, whatever context comes.
  free?: unknown
  byContext: WeakMap<object, unknown>
}

// What sections resolved to against a definition -- and against a context, when
// they read one -- the last time they were asked. Every key is held weakly, so
// an entry goes when whoever passed it does, and there is nothing to release.
//
// A form resolves its `$ref`s while rendering, which is where the cost was: a
// walk that rebuilds the tree hands every field a new object, and a new object
// is a field that cannot match its memo, a schema that has to be built again,
// and a list that runs its hand-off as if it were unmounting -- on every
// keystroke a controlled host answers. Asked twice with the same objects, this
// answers with the same array. And a tree that never reads `#/context/` is
// answered by its definition alone, so a host that hands over a new `context`
// on every render -- `context={{ user }}`, the way interpolation is fed -- costs
// it nothing.
const prepared = new WeakMap<object, WeakMap<object, Prepared>>()

export function prepare<T extends Filterable>(
  base: readonly T[] = [],
  definition?: Definition,
  context?: Record<string, unknown>
) {
  const roots = toRoots(definition, context)
  if (!roots) {
    return sortAndFilter<T>(base)
  }

  let byDefinition = prepared.get(base)
  if (!byDefinition) {
    byDefinition = new WeakMap()
    prepared.set(base, byDefinition)
  }

  const definitionKey = roots.definition ?? NONE
  let entry = byDefinition.get(definitionKey)
  if (!entry) {
    entry = { byContext: new WeakMap() }
    byDefinition.set(definitionKey, entry)
  }

  if (entry.free !== undefined) {
    return entry.free as T[]
  }

  const contextKey = roots.context ?? NONE
  const known = entry.byContext.get(contextKey)
  if (known !== undefined) {
    return known as T[]
  }

  const walk = createWalk(roots)
  const resolved = sortAndFilter<T>(resolveWith(base, walk))
  if (walk.readsContext) {
    entry.byContext.set(contextKey, resolved)
  } else {
    entry.free = resolved
  }

  return resolved
}

function sortAndFilter<T extends Filterable>(resolved: unknown): T[] {
  return Array.isArray(resolved)
    ? (resolved as T[]).filter(filter).sort((a, b) => getOrder(a) - getOrder(b))
    : []
}

export function resolveRefs(
  base: unknown,
  definition?: Definition,
  context?: Record<string, unknown>
): unknown {
  const roots = toRoots(definition, context)
  return roots ? resolveWith(base, createWalk(roots)) : base
}

function resolveWith(base: unknown, walk: Walk): unknown {
  if (!base || typeof base !== 'object') {
    return base
  }

  if (walk.cache.has(base)) {
    return walk.cache.get(base)
  }

  if (walk.visited.has(base)) {
    return base
  }

  walk.visited.add(base)

  if (Array.isArray(base)) {
    let changed = false
    const items = base.map((item) => {
      const next = resolveWith(item, walk)
      changed ||= next !== item
      return next
    })

    walk.visited.delete(base)
    walk.cache.set(base, changed ? items : base)

    return walk.cache.get(base)
  }

  if ($REF in base && isString(base[$REF])) {
    const resolved = resolvePath(base[$REF], walk)

    // A path that holds nothing resolves nothing: a key that is missing, and
    // one a host left `undefined` or `null`, which a JavaScript `context` can
    // hold and JSON cannot. The reference stands, so whatever reads it can
    // tell it from a value.
    if (resolved != null) {
      return resolveWith(resolved, walk)
    }
    return base
  }

  const result: Record<string, unknown> = {}
  let changed = false
  for (const [key, value] of Object.entries(base)) {
    result[key] = resolveWith(value, walk)
    changed ||= result[key] !== value
  }

  walk.visited.delete(base)

  // A node with nothing resolved under it is the node it already was. Handing
  // back a copy instead is what made every field new on every render, `$ref`
  // or no `$ref` anywhere near it.
  walk.cache.set(base, changed ? result : base)

  return walk.cache.get(base)
}

// What a `$ref` points at, or `null` when its root was not given or does not
// hold the path; a path that is there and holds `undefined` gives `undefined`.
// A path with no root reads the definition, as every `$ref` did before
// `#/context/` existed.
function resolvePath(ref: string, walk: Walk): unknown {
  const match = REGEX_REF.exec(ref)
  if (!match) {
    return walk.roots.definition ? extract(walk.roots.definition, ref) : null
  }

  if (match[1] === 'context') {
    walk.readsContext = true
  }

  const root =
    match[1] === 'context' ? walk.roots.context : walk.roots.definition
  return root ? extract(root, ref.slice(match[0].length)) : null
}

export function entries<T>(values?: Nullable<Record<string, T>>) {
  return Object.entries(values ?? {}) as [key: string, value: T][]
}

function getOrder(item: Base) {
  return item.order ?? Number.MAX_VALUE
}

// An empty or missing root resolves nothing, so `definition={{}}` is the same
// as no definition, and the same goes for `context`.
function toRoots(
  definition?: Nullable<Definition>,
  context?: Nullable<Record<string, unknown>>
): Roots | null {
  const roots: Roots = {
    context: isRoot(context) ? context : undefined,
    definition: isRoot(definition) ? definition : undefined,
  }
  return roots.context || roots.definition ? roots : null
}

function isRoot(
  value?: Nullable<Record<string, unknown>>
): value is Record<string, unknown> {
  return isObject(value) && Object.keys(value).length > 0
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
