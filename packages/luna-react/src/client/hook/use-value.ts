import { deepEqual } from 'fast-equals'
import {
  applyTransform,
  isInput,
  isValidValue,
  type Field,
} from '@luna-form/core'
import { reportValueAtom } from '../lib/value-store'
import { useAtom } from 'jotai'
import { useCallback, useEffect, useRef, useEffectEvent } from 'react'
import { useHostEntry } from './use-host-entry'

export function useValue(field: Field) {
  const { name } = field

  const skipNextOnChangeRef = useRef(false)
  const [value, setValue] = useAtom(reportValueAtom(name))

  // This field's entry, and nothing else.
  //
  // The whole record used to arrive as a prop, which made this hook's effect a
  // function of every field's value: one keystroke anywhere re-ran it for every
  // field on the form. Subscribing to the one entry is what makes it a function
  // of this field's own value instead. The reactive reader is the right one
  // here: this hook re-applies whenever the entry moves, so it does not care
  // that a store arrives a commit after a prop would have. See `useHostEntry`.
  const { found, value: hostValue } = useHostEntry(name)

  const applyValue = useEffectEvent((rawValue: unknown, silent = false) => {
    const transformedValue = isInput(field)
      ? applyTransform(rawValue, field.advanced?.transform)
      : rawValue

    if (!silent && !deepEqual(value, transformedValue)) {
      skipNextOnChangeRef.current = true
    }

    setValue(transformedValue)
  })

  const onEntryChange = useEffectEvent((found: boolean, newValue: unknown) => {
    if (isValidValue(newValue)) {
      applyValue(newValue)
      return
    }

    if (isValidValue(field.defaultValue)) {
      applyValue(field.defaultValue, true)
      return
    }

    // The host names this field and holds nothing in it, which is a statement
    // and not a gap: the field is meant to be empty. Only reachable once the
    // two branches above have declined, so a caller passing a partial object
    // still leaves untouched fields -- and any `defaultValue` -- exactly where
    // they were.
    //
    // Without this a field could be filled from the outside but never cleared
    // from the outside, because neither `undefined`, `null` nor `''` is a value
    // worth re-feeding by the measure above. `withDeclaredFields` is how a
    // caller says it on purpose.
    if (found) {
      applyValue(newValue)
    }
  })

  useEffect(() => {
    onEntryChange(found, hostValue)
  }, [found, hostValue, field.defaultValue])

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
