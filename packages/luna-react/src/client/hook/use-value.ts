import {
  isValidValue,
  logger,
  type Field,
  type Nullable,
} from '@luna-form/core'
import { reportValueAtom } from '../lib/value-store'
import { useAtom } from 'jotai'
import { useCallback, useEffect, useRef } from 'react'

export function useValue(
  field: Field,
  currentValue?: Nullable<Record<string, unknown>>
) {
  const { name } = field

  const skipNextOnChangeRef = useRef(false)
  const [value, setValue] = useAtom(reportValueAtom(name))

  useEffect(() => {
    if (!currentValue || !(name in currentValue)) {
      return
    }

    const newValue = currentValue[name]
    if (isValidValue(newValue)) {
      logger.info('useValue: setting skipNextOnChange to true', {
        fieldName: name,
        newValue,
      })
      skipNextOnChangeRef.current = true
      setValue(newValue)
    }
  }, [name, currentValue, setValue])

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
