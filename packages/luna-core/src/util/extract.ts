import { isMultiple, isObject, isValue } from './is-type'
import { DESCRIPTION, INPUT, LABEL, TYPE_TEXT, VALUE } from './constant'
import { logger } from './logger'
import type { Nullable, Option, Value } from '../type'

const REGEX_NUMERIC = /^\d+$/

// A dotted name addresses the data's own properties, and these three segments
// never do: they reach the prototype every object shares. Writing one leaves a
// key there for every object on the page; reading one hands an internal back as
// if it were a value. Field names come from the definition, so a form one
// person writes and another fills in is enough to carry it.
const UNSAFE_SEGMENTS = new Set(['__proto__', 'constructor', 'prototype'])

function isUnsafePath(name: string): boolean {
  return name.split('.').some((segment) => UNSAFE_SEGMENTS.has(segment))
}

// `in` is true for whatever an object inherits -- `toString`, `constructor`,
// and anything a polluted prototype carries -- and an inherited member is not
// data. Every walk over a dotted name asks this instead.
export function hasOwn(value: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(value, key)
}

// What a lookup found. `found` answers whether the path exists at all, which is
// a different question from what sits there: a caller is free to hold an empty
// value at a path it means to be empty, and telling that apart from a path
// nobody mentioned is the reason this shape exists.
export type Entry = {
  found: boolean
  value: unknown
}

const MISSING: Entry = { found: false, value: undefined }

/**
 * The one walk of a dotted path, for every reader of one.
 *
 * A flat key that is literally the path wins, because that is how the form
 * keeps a list's leaves -- `items.0.name` is a key, not a route -- and a
 * definition is free to name a field the same way. Then objects by key and
 * arrays by numeric index.
 *
 * There were two of these, one per package, and they disagreed about that first
 * step: a list named `config.items` was found by the reader in luna-react and
 * not by the one here, so whether a form hydrated depended on which one the
 * caller happened to use. `extract` and `resolveValue` are both this now.
 *
 * Every step asks `hasOwn`, so an inherited member is not a value and a name
 * that reaches a prototype resolves to nothing. See SEG-2.
 */
export function resolveEntry(
  name: string,
  currentValue: Record<string, unknown> | unknown[]
): Entry {
  if (!Array.isArray(currentValue) && hasOwn(currentValue, name)) {
    return { found: true, value: currentValue[name] }
  }

  if (!name.includes('.')) {
    return MISSING
  }

  let result: unknown = currentValue

  for (const key of name.split('.')) {
    if (result === null || result === undefined) {
      return MISSING
    }

    if (Array.isArray(result)) {
      const index = Number(key)
      if (!Number.isInteger(index) || !hasOwn(result, key)) {
        return MISSING
      }
      result = result[index]
    } else if (isObject(result)) {
      if (!hasOwn(result, key)) {
        return MISSING
      }
      result = result[key]
    } else {
      return MISSING
    }
  }

  return { found: true, value: result }
}

export function getEntity<T>(
  selected: Value,
  collection: Nullable<T[]> = [],
  entity = VALUE
) {
  // A `chips` field holds an array whatever `multiple` says, and no single
  // entry of the collection answers to it. Hand it over as it is, because the
  // array is what `when` is written to read: `evaluateCondition` matches a
  // string `when` against a lone selection and ORs an array one over every
  // selection. Joining it into text instead ("email,sms") answers to no option
  // and matches no condition -- silently, and only once more than one thing is
  // selected.
  if (isMultiple(selected)) {
    return { value: selected }
  }

  if (Array.isArray(collection)) {
    return (
      collection.find((item) => {
        const current = getCurrentValue(item, entity)
        if (current !== undefined && `${current}` === `${selected}`) {
          return item
        }
      }) ?? { value: selected }
    )
  }

  // Fallback to returning the selected value if no collection is provided or if it's not an array
  return { value: selected }
}

export function getCurrentValue<T>(
  value: T,
  entity = VALUE
): Value | undefined {
  if (value != null) {
    if (isMultiple(value)) {
      return value
    }

    if (isValue(value)) {
      return value
    }

    if (isObject(value)) {
      const result = getValue(value, entity)
      if (isValue(result)) {
        return result
      }
    }
  }
}

export function getValue<T>(
  value: Record<string, T>,
  namespace?: string
): T | undefined {
  const result = extract(value, namespace)
  if (isValue(result)) {
    return result
  }
}

export function getArray<T>(
  value: Record<string, T> | T[],
  namespace?: string
): Nullable<T[]> {
  if (Array.isArray(value)) {
    return value
  }

  const result = extract(value, namespace)
  if (Array.isArray(result)) {
    return result
  }

  return null
}

export function extract<T>(
  value: Record<string, T>,
  namespace?: string
): T | null {
  if (!namespace || !value || typeof value !== 'object') {
    return null
  }

  const entry = resolveEntry(namespace, value as Record<string, unknown>)
  return entry.found ? (entry.value as T) : null
}

export function toOptions<T>(
  data: T[],
  options: Option = {
    description: DESCRIPTION,
    label: LABEL,
    value: VALUE,
  }
) {
  return data.map((item) => {
    if (isObject(item)) {
      const label = extract(item, options.label)
      const value = extract(item, options.value)

      if (isValue(label) && isValue(value)) {
        const description = extract(item, options.description)
        return {
          label: `${label}`,
          value: `${value}`,
          ...(isValue(description) && { description: `${description}` }),
        }
      }
    }

    return item
  })
}

export function getType(value: string = TYPE_TEXT): string {
  const lastSlash = value.lastIndexOf('/')
  const type = lastSlash === -1 ? value : value.slice(lastSlash + 1)
  if (type && type !== INPUT) {
    return type.trim().toLowerCase()
  }
  return TYPE_TEXT
}

export function getFormData(formData: FormData) {
  const data: Record<string, unknown> = {}
  for (const key of formData.keys()) {
    const values = formData.getAll(key)
    data[key] = values.length > 1 ? values : values[0]
  }
  return data
}

export function unflatten(
  data: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const key of Object.keys(data)) {
    // Dropped whole rather than sanitized: a name like `__proto__.isAdmin` is
    // not a path into the payload, and rewriting it would invent a key the
    // definition never declared. A single segment is dropped for the same
    // reason -- `result.__proto__ = value` walks into the prototype through
    // the setter, key or no key. The warning is for whoever wrote the name,
    // because that field is not going to travel.
    if (isUnsafePath(key)) {
      logger.warn(
        `A field name reaches a prototype and is not submitted: ${key}`
      )
      continue
    }

    const parts = key.split('.')
    if (parts.length === 1) {
      result[key] = data[key]
      continue
    }

    let current: Record<string, unknown> = result
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]
      const next = parts[i + 1]

      const isNextIndex = REGEX_NUMERIC.test(next)
      if (!hasOwn(current, part)) {
        current[part] = isNextIndex ? [] : {}
      }

      current = current[part] as Record<string, unknown>
    }

    const last = parts[parts.length - 1]
    current[last] = data[key]
  }

  compactArrays(result)
  return result
}

function compactArrays(obj: Record<string, unknown>): void {
  for (const key of Object.keys(obj)) {
    const value = obj[key]
    if (Array.isArray(value)) {
      const compacted = value.filter((item) => item !== undefined)
      for (const item of compacted) {
        if (isObject(item)) {
          compactArrays(item)
        }
      }
      obj[key] = compacted
    } else if (isObject(value)) {
      compactArrays(value)
    }
  }
}
