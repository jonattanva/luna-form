import { COLUMN } from './constant'
import { extract } from './extract'
import type { List, Nullable } from '../type'

function getInitialCount(
  list: List,
  value?: Nullable<Record<string, unknown>>
): number {
  const min = list.advanced?.length?.min ?? 1

  if (value) {
    const data = extract(value, list.name)
    if (Array.isArray(data)) {
      return Math.max(data.length, min)
    }
  }
  return Math.max(min, 0)
}

export function isMultiFieldList(list: List): boolean {
  if (!Array.isArray(list.fields) || list.fields.length === 0) {
    return false
  }
  return list.fields.length > 1 || list.fields[0].type === COLUMN
}

export function getInitialList(
  list: List,
  value?: Nullable<Record<string, unknown>>
) {
  const count = getInitialCount(list, value)
  return Array.from({ length: count }, (_, index) => index)
}

export function getLabel(list: List): string {
  return list.label ?? list.name
}
