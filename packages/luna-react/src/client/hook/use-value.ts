import { isValidValue, type Field, type Nullable } from '@luna-form/core'
import { reportValueAtom } from '../lib/value-store'
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
        skipNextOnChangeRef.current = true
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

function resolveValue(
  name: string,
  currentValue: Record<string, unknown>
): unknown {
  if (name in currentValue) {
    return currentValue[name]
  }

  if (!name.includes('.')) {
    return undefined
  }

  const keys = name.split('.')
  let result: unknown = currentValue

  for (const key of keys) {
    if (result === null || result === undefined) {
      return undefined
    }

    if (Array.isArray(result)) {
      const index = Number(key)
      result = Number.isInteger(index) ? result[index] : undefined
    } else if (typeof result === 'object') {
      result = (result as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }

  return result
}
