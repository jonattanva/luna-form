import { isValidValue, type Field, type Nullable } from '@luna-form/core'
import { reportValueAtom } from '../lib/value-store'
import { useAtom } from 'jotai'
import { useEffect, useRef } from 'react'

export function useValue(
  field: Field,
  currentValue?: Nullable<Record<string, unknown>>
) {
  const skipNextOnChangeRef = useRef(false)
  const [value, setValue] = useAtom(reportValueAtom(field.name))

  useEffect(() => {
    if (!currentValue || !(field.name in currentValue)) {
      return
    }

    const newValue = currentValue[field.name]
    if (isValidValue(newValue)) {
      skipNextOnChangeRef.current = true
      setValue(newValue)
    }
  }, [field.name, currentValue, setValue])

  return { value, setValue, skipNextOnChangeRef } as const
}
