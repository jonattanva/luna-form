import {
  getInitialList,
  isColumn,
  type List,
  type Nullable,
} from '@luna-form/core'
import { useSetAtom, useStore } from 'jotai'
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
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

  const computeListValue = useCallback(
    (
      currentItems: readonly number[],
      values: Record<string, unknown>
    ): Array<Record<string, unknown>> => {
      const prefix = `${field.name}.`
      return currentItems.map((stableId) => {
        const item: Record<string, unknown> = {}
        for (const name of leafNames) {
          item[name] = values[`${prefix}${stableId}.${name}`]
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
    emitChange(nextItems, store.get(valueAtom) as Record<string, unknown>)
  }, [emitChange, max, store])

  const handleRemove = useCallback(
    (index: number) => {
      if (itemsRef.current.length <= min) {
        return
      }

      const stableId = itemsRef.current[index]
      const nextItems = itemsRef.current.filter((_, i) => i !== index)

      const currentValues = store.get(valueAtom) as Record<string, unknown>
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
