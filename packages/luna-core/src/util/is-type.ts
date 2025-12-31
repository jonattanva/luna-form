import type { DataSource, Value } from '../type'

export function isObject<T>(value: unknown): value is Record<string, T> {
  return (
    value !== null &&
    Object.prototype.toString.call(value) === '[object Object]'
  )
}

export function isValue(value: unknown): value is Value {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  )
}

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isDataSource(value: unknown): value is DataSource {
  return isObject(value) && 'url' in value
}
