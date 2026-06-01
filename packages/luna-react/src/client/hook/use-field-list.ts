import {
  getInitialList,
  isColumn,
  isValidValue,
  type List,
  type Nullable,
} from '@luna-form/core'
import { useSetAtom, useStore } from 'jotai'
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { resolveValue } from '../lib/resolve-value'
import { valueAtom } from '../lib/value-store'

export function useFieldList(
  field: List,
  value?: Nullable<Record<string, unknown>>,
  onValueChange?: (input: { name: string; value: unknown }) => void
) {
  const min = field.advanced?.length?.min ?? 1
  const max = field.advanced?.length?.max ?? Infinity

  const [items, setItems] = useState<number[]>(() =>
    getInitialList(field, value)
  )

  const itemsRef = useRef(items)
  const nextId = useRef(items.length)

  useLayoutEffect(() => {
    itemsRef.current = items
  })

  const store = useStore()
  const setValues = useSetAtom(valueAtom)

  // Same ref pattern as use-input-core.ts:111-125 — keeps addItem/handleRemove
  // stable in useCallback while always reading the latest consumer callback.
  const onValueChangeRef = useRef(onValueChange)
  onValueChangeRef.current = onValueChange

  // Snapshot of the value prop captured once at mount. The parent compacts the
  // emitted array on every change, so the live prop can no longer be indexed by
  // stable id after a non-last removal. This original snapshot keeps the
  // `stable id -> initial value` mapping resolvable for seeding and as a
  // serialization fallback.
  const initialValueRef = useRef(value)

  // Flat list of leaf field names (skipping columns), computed once per field.
  const leafNames = useMemo(() => {
    const names: string[] = []
    for (const row of field.fields) {
      if (isColumn(row)) {
        for (const columnField of row.fields) {
          names.push(columnField.name)
        }
      } else {
        names.push(row.name)
      }
    }
    return names
  }, [field.fields])

  // Hydrate the flat value atom up front, keyed by stable id, from the initial
  // value prop. Collapsed items live inside <Activity mode="hidden">, where the
  // leaf inputs' hydration effect is suspended, so without this their values are
  // only reachable positionally — which breaks once a non-last item is removed
  // and the parent re-passes a compacted array. Seeding by stable id makes
  // preview, inputs and serialization read from the atom regardless of how the
  // parent reindexes `value`. Mount-only: re-running after a removal would
  // resurrect the deleted item's values from the snapshot.
  useLayoutEffect(() => {
    const initial = initialValueRef.current
    if (!initial) {
      return
    }

    const prefix = `${field.name}.`
    const next = { ...store.get(valueAtom) }
    let changed = false

    for (const id of items) {
      for (const name of leafNames) {
        const key = `${prefix}${id}.${name}`
        if (key in next) {
          continue
        }
        const resolved = resolveValue(key, initial)
        if (isValidValue(resolved)) {
          next[key] = resolved
          changed = true
        }
      }
    }

    if (changed) {
      setValues(next)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const computeListValue = useCallback(
    (
      currentItems: readonly number[],
      values: Record<string, unknown>
    ): Array<Record<string, unknown>> => {
      const prefix = `${field.name}.`
      const initial = initialValueRef.current
      return currentItems.map((stableId) => {
        const item: Record<string, unknown> = {}
        for (const name of leafNames) {
          const key = `${prefix}${stableId}.${name}`
          const fromStore = values[key]
          // Edited and seeded values live in the atom keyed by stable id.
          // Anything missing falls back to the initial snapshot by the same
          // stable-id path — never the live (compacted) value prop.
          item[name] =
            fromStore !== undefined
              ? fromStore
              : initial
                ? resolveValue(key, initial)
                : undefined
        }
        return item
      })
    },
    [field.name, leafNames]
  )

  const emitChange = useCallback(
    (currentItems: readonly number[], values: Record<string, unknown>) => {
      onValueChangeRef.current?.({
        name: field.name,
        value: computeListValue(currentItems, values),
      })
    },
    [computeListValue, field.name]
  )

  const addItem = useCallback(() => {
    if (itemsRef.current.length >= max) {
      return
    }

    const id = nextId.current++
    const nextItems = [...itemsRef.current, id]

    setItems(nextItems)
    emitChange(nextItems, store.get(valueAtom))
  }, [emitChange, max, store])

  const handleRemove = useCallback(
    (index: number) => {
      if (itemsRef.current.length <= min) {
        return
      }

      const stableId = itemsRef.current[index]
      const nextItems = itemsRef.current.filter((_, i) => i !== index)

      const currentValues = store.get(valueAtom)
      const nextValues = { ...currentValues }
      const prefix = `${field.name}.`

      for (const name of leafNames) {
        delete nextValues[`${prefix}${stableId}.${name}`]
      }

      setItems(nextItems)
      setValues(nextValues)
      emitChange(nextItems, nextValues)
    },
    [emitChange, field.name, leafNames, min, setValues, store]
  )

  const canAdd = items.length < max
  const canRemove = items.length > min

  return [items, addItem, handleRemove, canAdd, canRemove, max] as const
}
