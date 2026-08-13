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
import { composeListValue, itemKey } from '../lib/compose-list-value'
import {
  ListPathContext,
  type TranslateListPath,
} from '../context/list-path-context'
import {
  mountedListsAtom,
  reportMountedListAtom,
  reportPendingListRowsAtom,
} from '../lib/list-store'
import { resolveValue } from '../lib/resolve-value'
import { valueAtom } from '../lib/value-store'

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
      // Where a leaf's value comes from, and why it is looked for in that
      // order, is `composeListValue` — a list holding a list is the case that
      // makes the order matter, and it can only be answered from the registry,
      // which is why the reading lives outside this hook.
      return composeListValue(
        field.name,
        { items: currentItems, leafNames },
        {
          mounted: store.get(mountedListsAtom),
          values,
          initial: initialValueRef.current,
        }
      )
    },
    [field.name, leafNames, store]
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

  // Says this list is on screen and what it is holding, so a `value` event
  // aimed at it can be told apart from one aimed at an ordinary field, and so
  // a list above it can read this one back out. See `list-store`.
  //
  // Re-run on every change to `items` and not only on mount: the rows are the
  // half of this that goes stale, and a parent asking after an inner add would
  // otherwise be told about the rows the inner list had when it mounted.
  //
  // Withdrawing it is a second effect rather than this one's cleanup, so that
  // a row added or removed here is one write to the registry instead of a
  // withdrawal and a re-registration.
  const reportMounted = useSetAtom(reportMountedListAtom(field.name))
  useEffect(() => {
    reportMounted({ items, leafNames })
  }, [items, leafNames, reportMounted])

  // On the way out, leave what this list holds under its own name -- where a
  // list above it already looks -- and only then stop answering.
  //
  // Being on screen and being able to answer are not the same thing. A
  // collapsed row lives in <Activity mode="hidden">, which keeps its state but
  // tears its effects down, so this list stops answering while the values it
  // owns are still the live ones. Without the hand-off the list above falls
  // back to the value the form was mounted with and re-emits that over
  // everything typed since: the same loss this registry exists to prevent, one
  // collapse later.
  //
  // Children unmount before their parent, so a list two deep has already
  // handed its own value over by the time the list above reads it here.
  useEffect(
    () => () => {
      const values = store.get(valueAtom)

      setValues({
        ...values,
        [field.name]: computeListValue(itemsRef.current, values),
      })

      reportMounted(undefined)
    },
    [computeListValue, field.name, reportMounted, setValues, store]
  )

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
