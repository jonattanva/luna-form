import type { DataSource, Value } from '../type'

export function isObject<T>(value: unknown): value is Record<string, T> {
  return (
    value !== null &&
    Object.prototype.toString.call(value) === '[object Object]'
  )
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
