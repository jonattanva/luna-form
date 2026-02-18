import { getInitialList, type List, type Nullable } from '@luna-form/core'
import { useCallback, useRef, useState } from 'react'

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

  const addItem = useCallback(() => {
    setItems((previous) => {
      if (previous.length >= max) return previous
      const id = nextId.current++
      return [...previous, id]
    })
  }, [max])

  const removeItem = useCallback(
    (index: number) => {
      setItems((previous) => {
        if (previous.length <= min) return previous
        return previous.filter((_, i) => i !== index)
      })
    },
    [min]
  )

  const canAdd = items.length < max
  const canRemove = items.length > min

  return [items, addItem, removeItem, canAdd, canRemove, max] as const
}
