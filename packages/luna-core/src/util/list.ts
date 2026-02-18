import { extract } from './extract'
import type { List, Nullable } from '../type'

export function getInitialCount(
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

export function getInitialList(
  list: List,
  value?: Nullable<Record<string, unknown>>
) {
  const count = getInitialCount(list, value)
  return Array.from({ length: count }, (_, index) => index)
}
