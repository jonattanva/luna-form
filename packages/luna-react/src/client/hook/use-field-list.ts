import {
  getInitialList,
  isColumn,
  type List,
  type Nullable,
} from '@luna-form/core'
import { useSetAtom } from 'jotai'
import { useCallback, useRef, useState } from 'react'
import { valueAtom } from '../lib/value-store'

export function useFieldList(
  field: List,
  value?: Nullable<Record<string, unknown>>
) {
  const min = field.advanced?.length?.min ?? 1
  const max = field.advanced?.length?.max ?? Infinity

  const [items, setItems] = useState<number[]>(() =>
    getInitialList(field, value)
  )

  const nextId = useRef(items.length)
  const itemsRef = useRef(items)
  itemsRef.current = items

  const setValues = useSetAtom(valueAtom)

  const addItem = useCallback(() => {
    setItems((previous) => {
      if (previous.length >= max) {
        return previous
      }

      const id = nextId.current++
      return [...previous, id]
    })
  }, [max])

  const handleRemove = useCallback(
    (index: number) => {
      if (items.length <= min) {
        return
      }

      const stableId = items[index]

      setItems((previous) => {
        if (previous.length <= min) {
          return previous
        }
        return previous.filter((_, i) => i !== index)
      })

      setValues((current) => {
        const next = { ...current }
        const prefix = `${field.name}.`

        const leafNames: string[] = []
        for (const row of field.fields) {
          if (isColumn(row)) {
            for (const columnField of row.fields) {
              leafNames.push(columnField.name)
            }
          } else {
            leafNames.push(row.name)
          }
        }

        for (const name of leafNames) {
          delete next[`${prefix}${stableId}.${name}`]
        }

        return next
      })
    },
    [field.name, field.fields, items, min, setValues]
  )

  const canAdd = items.length < max
  const canRemove = items.length > min

  return [items, addItem, handleRemove, canAdd, canRemove, max] as const
}
