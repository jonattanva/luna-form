import { isObject } from '@luna-form/core'
import { resolveValue } from '../lib/resolve-value'
import { selectAtom } from 'jotai/utils'
import { shallowEqual } from 'fast-equals'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { valueAtom } from '../lib/value-store'

// The keys one row owns, lifted out of the flat record the whole form shares
// and handed back without the row's own prefix.
function pickRow(name: string) {
  const prefix = `${name}.`
  return (record: Record<string, unknown>) => {
    const row: Record<string, unknown> = {}
    for (const key in record) {
      if (key.startsWith(prefix)) {
        row[key.slice(prefix.length)] = record[key]
      }
    }
    return row
  }
}

/**
 * What a row holds right now: the form's own state over the initial value tree,
 * for a `when` that has to follow what the user types.
 *
 * Subscribed to the row's keys and not to the record. Every field in the form
 * writes into that one record, so a row that read it woke up on every keystroke
 * anywhere and walked every key in the form to find its own. The selection is
 * compared shallowly, so a keystroke outside the row recomputes the pick, finds
 * the same keys, and renders nothing.
 *
 * Only a condition needs this, and only a condition asks for it: the components
 * that own one render the child that calls this hook, so a row with no
 * condition to answer never subscribes at all.
 *
 * The atom is made with the component that reads it and goes with it: jotai
 * caches a selection under the selector function, `pickRow` makes a new one per
 * row, and both are held weakly, so nothing is kept by name for the life of the
 * page.
 */
export function useLiveItemValue(
  name: string,
  initialValue?: Record<string, unknown> | unknown[] | null
): unknown {
  const rowAtom = useMemo(
    () => selectAtom(valueAtom, pickRow(name), shallowEqual),
    [name]
  )
  const live = useAtomValue(rowAtom)

  return useMemo(() => {
    const initial = initialValue ? resolveValue(name, initialValue) : undefined

    if (Object.keys(live).length === 0) {
      return initial
    }

    return isObject(initial)
      ? { ...(initial as Record<string, unknown>), ...live }
      : live
  }, [live, name, initialValue])
}
