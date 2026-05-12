import { isObject } from '@luna-form/core'
import { resolveValue } from '../lib/resolve-value'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { valueAtom } from '../lib/value-store'

/**
 * Returns the live value of a list item or field path, merging the current
 * Jotai form state on top of the initial value tree. Used by previews to
 * evaluate `when` conditions reactively against user edits.
 */
export function useLiveItemValue(
  name: string,
  initialValue?: Record<string, unknown> | unknown[] | null
): unknown {
  const record = useAtomValue(valueAtom) as Record<string, unknown>
  return useMemo(() => {
    const prefix = `${name}.`
    const live: Record<string, unknown> = {}
    let hasLive = false
    for (const key in record) {
      if (key.startsWith(prefix)) {
        live[key.slice(prefix.length)] = record[key]
        hasLive = true
      }
    }
    const initial = initialValue ? resolveValue(name, initialValue) : undefined
    if (hasLive) {
      return isObject(initial)
        ? { ...(initial as Record<string, unknown>), ...live }
        : live
    }
    return initial
  }, [record, name, initialValue])
}
