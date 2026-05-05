import { deepEqual } from 'fast-equals'
import { isValidValue, type Field, type Nullable } from '@luna-form/core'
import { reportValueAtom } from '../lib/value-store'
import { resolveValue } from '../lib/resolve-value'
import { useAtom } from 'jotai'
import { useCallback, useEffect, useRef, useEffectEvent } from 'react'

export function useValue(
  field: Field,
  currentValue?: Nullable<Record<string, unknown>>
) {
  const { name } = field

  const skipNextOnChangeRef = useRef(false)
  const [value, setValue] = useAtom(reportValueAtom(name))

  const onCurrentValueChange = useEffectEvent(
    (currentValue: Record<string, unknown>) => {
      const newValue = resolveValue(name, currentValue)
      if (isValidValue(newValue)) {
        if (!deepEqual(value, newValue)) {
          skipNextOnChangeRef.current = true
        }
        setValue(newValue)
      }
    }
  )

  useEffect(() => {
    if (!currentValue) {
      return
    }

    onCurrentValueChange(currentValue)
  }, [currentValue])

  const shouldSkipOnChange = useCallback(() => {
    if (skipNextOnChangeRef.current) {
      skipNextOnChangeRef.current = false
      return true
    }
    return false
  }, [])

  return {
    setValue,
    shouldSkipOnChange,
    value,
  } as const
}
