import { deepEqual } from 'fast-equals'
import {
  getInitialList,
  isColumn,
  isValidValue,
  type List,
  type Nullable,
} from '@luna-form/core'
import { useAtom, useSetAtom, useStore } from 'jotai'
import {
  use,
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  ListPathContext,
  type TranslateListPath,
} from '../context/list-path-context'
import {
  reportMountedListAtom,
  reportPendingListRowsAtom,
} from '../lib/list-store'
import { resolveValue } from '../lib/resolve-value'
import { valueAtom } from '../lib/value-store'

// Every key a list owns in the flat value atom: its name, the row's stable id,
// the leaf's name. Built in four places in this file -- seeding, reading,
// removing and assigning -- which is three too many for a template literal to
// be retyped correctly each time.
function itemKey(listName: string, stableId: number, leafName: string): string {
  return `${listName}.${stableId}.${leafName}`
}

// Rows as the list would hold them: every leaf present, the ones the row left
// out `undefined`.
//
// That shape is the point. `computeListValue` reads a list back out with every
// leaf spelled in, so an incoming row carrying only some of them would compare
// unequal to an identical row already stored -- different for having been
// written rather than read.
function toListValue(
  rows: Array<Record<string, unknown>>,
  count: number,
  leafNames: readonly string[]
): Array<Record<string, unknown>> {
  const value: Array<Record<string, unknown>> = []

  for (let index = 0; index < count; index++) {
    const row = rows[index]
    const item: Record<string, unknown> = {}

    for (const name of leafNames) {
      item[name] = row?.[name]
    }

    value.push(item)
  }

  return value
}

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

  // Render-phase mirror of `items` (same pattern as onValueChangeRef below):
  // callbacks and path translation read the latest committed items without a
  // layout effect, and it stays fresh during the commit phase.
  itemsRef.current = items

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

  const isTranslatePath = useCallback((segment: string, position: number) => {
    const id = Number(segment)
    if (!Number.isNaN(id)) {
      return (
        Number.isInteger(id) && position >= 0 && String(position) !== segment
      )
    }
    return false
  }, [])

  // Translate consumer-facing paths from this list's stable id to the item's
  // current array position, then delegate the rest to the parent list (nested
  // lists compose: each level rewrites its own segment). The internal naming
  // (atom keys, DOM names) stays keyed by stable id — only the name emitted to
  // the consumer is positional, matching the positional value array.
  //
  // Identity is stable (deps don't include `items`; live data is read from
  // `itemsRef`), so the context value never changes and consuming it never
  // triggers re-renders.
  const parentTranslate = use(ListPathContext)
  const translatePath = useCallback<TranslateListPath>(
    (name) => {
      const prefix = `${field.name}.`
      if (name.startsWith(prefix)) {
        const rest = name.slice(prefix.length)
        const dot = rest.indexOf('.')
        const segment = dot === -1 ? rest : rest.slice(0, dot)

        const id = Number(segment)
        const position = itemsRef.current.indexOf(id)

        if (isTranslatePath(segment, position)) {
          name = `${prefix}${position}${dot === -1 ? '' : rest.slice(dot)}`
        }
      }
      return parentTranslate(name)
    },
    [field.name, isTranslatePath, parentTranslate]
  )

  // Hydrate the flat value atom up front, keyed by stable id, from the initial
  // value prop. Collapsed items live inside <Activity mode="hidden">, where the
  // leaf inputs' hydration effect is suspended, so without this their values are
  // only reachable positionally — which breaks once a non-last item is removed
  // and the parent re-passes a compacted array. Seeding by stable id makes
  // preview, inputs and serialization read from the atom regardless of how the
  // parent reindexes `value`.
  //
  // Extracted as an Effect Event so the mount-only effect below can keep an
  // empty dependency array honestly (no lint suppression needed): re-seeding
  // after a removal or after a user clears a field would resurrect stale values
  // from the snapshot, so it must run exactly once.
  const seedInitialValues = useEffectEvent(() => {
    const initial = initialValueRef.current
    if (!initial) {
      return
    }

    const next = { ...store.get(valueAtom) }
    let changed = false

    for (const id of items) {
      for (const name of leafNames) {
        const key = itemKey(field.name, id, name)
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
  })

  useEffect(() => {
    seedInitialValues()
  }, [])

  const computeListValue = useCallback(
    (
      currentItems: readonly number[],
      values: Record<string, unknown>
    ): Array<Record<string, unknown>> => {
      const initial = initialValueRef.current

      return currentItems.map((stableId) => {
        const item: Record<string, unknown> = {}
        for (const name of leafNames) {
          const key = itemKey(field.name, stableId, name)
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
        name: translatePath(field.name),
        value: computeListValue(currentItems, values),
      })
    },
    [computeListValue, field.name, translatePath]
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

      for (const name of leafNames) {
        delete nextValues[itemKey(field.name, stableId, name)]
      }

      setItems(nextItems)
      setValues(nextValues)
      emitChange(nextItems, nextValues)
    },
    [emitChange, field.name, leafNames, min, setValues, store]
  )

  // Says this list is on screen, so a `value` event aimed at it can be told
  // apart from one aimed at an ordinary field. See `list-store`.
  const reportMounted = useSetAtom(reportMountedListAtom(field.name))
  useEffect(() => {
    reportMounted(true)
    return () => reportMounted(undefined)
  }, [reportMounted])

  const [pendingRows, reportPendingRows] = useAtom(
    reportPendingListRowsAtom(field.name)
  )

  const applyRows = useEffectEvent((rows: Array<Record<string, unknown>>) => {
    // A list never shows fewer rows than `min`, so a shorter assignment leaves
    // the remainder standing and empty -- the same thing `getInitialCount`
    // does with a short `value` prop at mount. `max` is the ceiling `addItem`
    // already respects.
    const count = Math.min(Math.max(rows.length, min), max)
    const currentValues = store.get(valueAtom)

    // Assigning what is already there is not a change. Every other write path
    // in the library says so before it writes -- `createRecordAtomFamily`,
    // `useValue.applyValue`, the `apply` that hands the rows over -- and a
    // list is the most expensive one to get wrong: without this it rebuilds
    // every row and tells the consumer, which downstream can mean persisting
    // a whole document again for nothing.
    if (
      deepEqual(
        computeListValue(itemsRef.current, currentValues),
        toListValue(rows, count, leafNames)
      )
    ) {
      return
    }

    // Positional reuse, so a row that survives the assignment keeps its
    // identity: React sees the same key, the inputs are not remounted, and a
    // caret sitting in one of them stays where it was. Handing out fresh ids
    // for all of them would be simpler and would make an append flash the
    // whole list.
    const nextItems: number[] = []
    for (let index = 0; index < count; index++) {
      nextItems.push(itemsRef.current[index] ?? nextId.current++)
    }

    const nextValues = { ...currentValues }

    // Assigning means the rows that were here are gone, and so are their
    // values. Left behind, a value keyed by a stable id that comes round again
    // would surface inside a row that never had it.
    for (const stableId of itemsRef.current) {
      for (const name of leafNames) {
        delete nextValues[itemKey(field.name, stableId, name)]
      }
    }

    nextItems.forEach((stableId, index) => {
      const row = rows[index]
      if (!row) {
        return
      }

      for (const name of leafNames) {
        const value = row[name]
        if (value !== undefined) {
          nextValues[itemKey(field.name, stableId, name)] = value
        }
      }
    })

    setValues(nextValues)
    setItems(nextItems)
    emitChange(nextItems, nextValues)
  })

  useEffect(() => {
    if (!pendingRows) {
      return
    }

    applyRows(pendingRows)
    reportPendingRows(undefined)
  }, [pendingRows, reportPendingRows])

  const canAdd = items.length < max
  const canRemove = items.length > min

  return [
    items,
    addItem,
    handleRemove,
    canAdd,
    canRemove,
    max,
    translatePath,
  ] as const
}
