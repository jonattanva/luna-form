import { isObject, isValue } from './is-type'
import { INPUT, LABEL, TYPE_TEXT, VALUE } from './constant'
import type { Nullable, Option, Value } from '../type'

const REGEX_TYPE = /[^/]+$/
const REGEX_NUMERIC = /^\d+$/

export function getEntity<T>(
  selected: string,
  collection: Nullable<T[]> = [],
  entity = VALUE
) {
  if (Array.isArray(collection)) {
    return (
      collection.find((item) => {
        const current = getCurrentValue(item, entity)
        if (current !== undefined && `${current}` === selected) {
          return item
        }
      }) ?? { value: selected }
    )
  }
}

export function getCurrentValue<T>(
  value: T,
  entity = VALUE
): Value | undefined {
  if (value !== null && value !== undefined) {
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
  if (!namespace || !isObject(value)) {
    return null
  }

  const keys = namespace.split('.').filter((key) => key !== '')
  if (keys.length === 0) {
    return null
  }

  let result: Record<string, T> | T = value
  for (const key of keys) {
    if (isObject(result) && key in result) {
      const obj = result as Record<string, T>
      result = obj[key]
    } else {
      return null
    }
  }

  return result as T
}

export function toOptions<T>(
  data: T[],
  options: Option = { label: LABEL, value: VALUE }
) {
  return data.map((item) => {
    if (isObject(item)) {
      const label = extract(item, options.label)
      const value = extract(item, options.value)

      if (isValue(label) && isValue(value)) {
        return {
          label: `${label}`,
          value: `${value}`,
        }
      }
    }

    return item
  })
}

export function getType(value: string = TYPE_TEXT): string {
  if (value) {
    const result = value.match(REGEX_TYPE)
    if (result) {
      const [type] = result
      if (type !== INPUT) {
        return type.trim().toLowerCase()
      }
    }
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

  for (const key in data) {
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
      if (!(part in current)) {
        current[part] = isNextIndex ? [] : {}
      }

      current = current[part] as Record<string, unknown>
    }

    const last = parts[parts.length - 1]
    current[last] = data[key]
  }

  return result
}
