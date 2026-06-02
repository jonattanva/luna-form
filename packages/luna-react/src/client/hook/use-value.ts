import { deepEqual } from 'fast-equals'
import {
  applyTransform,
  isInput,
  isValidValue,
  type Field,
  type Nullable,
} from '@luna-form/core'
import { ListPathContext } from '../context/list-path-context'
import { reportValueAtom } from '../lib/value-store'
import { resolveValue } from '../lib/resolve-value'
import { useAtom } from 'jotai'
import { use, useCallback, useEffect, useRef, useEffectEvent } from 'react'

export function useValue(
  field: Field,
  currentValue?: Nullable<Record<string, unknown>>
) {
  const { name } = field

  const skipNextOnChangeRef = useRef(false)
  const [value, setValue] = useAtom(reportValueAtom(name))

  // Translate the leaf's stable-id name to its current array position before
  // resolving against the value prop. The atom is keyed by stable id
  // (field.<id>.<leaf>), but the value prop / list emit is a positional array;
  // after a non-tail removal the two diverge, so a stable-id lookup against the
  // compacted prop misses and (for fields with a defaultValue) clobbers the
  // seeded value. Mirror of the positional emit translation in use-input-core.
  // Identity outside a list (context default), so non-list fields are unaffected
  // and consuming it never triggers re-renders (the context value is stable).
  const translateListPath = use(ListPathContext)

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
      const newValue = resolveValue(translateListPath(name), currentValue)

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
