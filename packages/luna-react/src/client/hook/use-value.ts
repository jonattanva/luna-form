import { deepEqual } from 'fast-equals'
import {
  applyTransform,
  holdValue,
  isInput,
  isValidValue,
  type Field,
  type Nullable,
} from '@luna-form/core'
import { useEntryAtom } from './use-entry-atom'
import { valueAtom } from '../lib/value-store'
import { useAtom } from 'jotai'
import { useCallback, useEffect, useRef, useEffectEvent } from 'react'
import { useHostEntry } from './use-host-entry'

export function useValue(field: Field) {
  const { name } = field

  const skipNextOnChangeRef = useRef(false)

  // What the host last put in this field that the field did not already hold,
  // waiting for `takeHostChange`. Boxed, so a change to nothing is still one.
  const hostChangeRef = useRef<Nullable<{ value: unknown }>>(null)
  const [value, setValue] = useAtom(useEntryAtom(valueAtom, name))

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
    // The host's value and a `defaultValue` come in by the same door as
    // everything else a field holds: a date as `yyyy-MM-dd`. See `holdValue`.
    const held = holdValue(field, rawValue)
    const transformedValue = isInput(field)
      ? applyTransform(held, field.advanced?.transform)
      : held

    if (!deepEqual(value, transformedValue)) {
      if (!silent) {
        skipNextOnChangeRef.current = true
      }

      // Not the echo of a change the field made: that one reaches the store
      // first, so by the time the host hands it back the two agree. This is
      // the host changing its mind -- an undo, a record swapped underneath,
      // a reset -- and what the field's `state` rules decided rested on the
      // value it held before.
      hostChangeRef.current = { value: held }
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

  // Read once, from the effect after this hook's own: the field re-runs its
  // `state` rules on what the host put back. See `input-base`.
  const takeHostChange = useCallback(() => {
    const change = hostChangeRef.current
    hostChangeRef.current = null
    return change
  }, [])

  return {
    setValue,
    shouldSkipOnChange,
    takeHostChange,
    value,
  } as const
}
