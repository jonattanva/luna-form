import type { DataSource, Value } from '../type'

export function isObject<T>(value: unknown): value is Record<string, T> {
  return (
    value !== null &&
    Object.prototype.toString.call(value) === '[object Object]'
  )
}

// A list's worth of rows -- the shape `ValueEvent.value` has always declared
// it accepts alongside a scalar. Checked rather than assumed because the target
// being a list does not oblige the definition to have aimed the right thing at
// it, and because a row's own leaf can be a list, which makes the same question
// come up again one level down.
export function isRows(
  candidate: unknown
): candidate is Array<Record<string, unknown>> {
  return Array.isArray(candidate) && candidate.every(isObject)
}

export function isEmpty(value: unknown): boolean {
  return value === null || value === undefined || value === ''
}

export function isValue(value: unknown): value is Value {
  return isString(value) || typeof value === 'number' || isBoolean(value)
}

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isDataSource(value: unknown): value is DataSource {
  return isObject(value) && 'url' in value
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}
