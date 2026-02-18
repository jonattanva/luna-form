import { extract } from './extract'
import type { List, Nullable } from '../type'

export function getInitialCount(
  list: List,
  value?: Nullable<Record<string, unknown>>
): number {
  const min = list.advanced?.length?.min ?? 0

  if (value) {
    const data = extract(value, list.name)
    if (Array.isArray(data)) {
      return Math.max(data.length, min)
    }
  }
  return Math.max(min, 0)
}
