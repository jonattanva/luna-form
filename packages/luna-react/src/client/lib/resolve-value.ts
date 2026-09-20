import { resolveEntry } from '@luna-form/core'

// The value at a dotted path, for a caller that has no use for the difference
// between a path holding nothing and a path nobody mentioned. The walk itself,
// and that difference, are `resolveEntry` in core -- there were two walks, one
// per package, and they did not agree.
export function resolveValue(
  name: string,
  currentValue: Record<string, unknown> | unknown[]
): unknown {
  return resolveEntry(name, currentValue).value
}
