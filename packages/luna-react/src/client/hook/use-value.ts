import { deepEqual } from 'fast-equals'
import {
  applyTransform,
  isInput,
  isValidValue,
  type Field,
  type Nullable,
} from '@luna-form/core'
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

  const applyValue = useEffectEvent((rawValue: unknown, silent = false) => {
    const transformedValue = isInput(field)
      ? applyTransform(rawValue, field.advanced?.transform)
      : rawValue

    if (!silent && !deepEqual(value, transformedValue)) {
      skipNextOnChangeRef.current = true
    }

    setValue(transformedValue)
  })

  const onCurrentValueChange = useEffectEvent(
    (currentValue: Record<string, unknown>) => {
      const newValue = resolveValue(name, currentValue)

      if (isValidValue(newValue)) {
        applyValue(newValue)
      } else if (isValidValue(field.defaultValue)) {
        applyValue(field.defaultValue, true)
      }
    }
  )

  useEffect(() => {
    if (currentValue) {
      onCurrentValueChange(currentValue)
      return
    }

    if (isValidValue(field.defaultValue)) {
      applyValue(field.defaultValue, true)
    }
  }, [currentValue, field.defaultValue])

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
