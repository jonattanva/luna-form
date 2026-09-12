import { deepEqual } from 'fast-equals'
import {
  applyTransform,
  isInput,
  isValidValue,
  type Field,
} from '@luna-form/core'
import { ListPathContext } from '../context/list-path-context'
import { MISSING, hostEntryAtom } from '../lib/host-value-store'
import { reportValueAtom } from '../lib/value-store'
import { useAtom, useAtomValue } from 'jotai'
import { use, useCallback, useEffect, useRef, useEffectEvent } from 'react'

export function useValue(field: Field) {
  const { name } = field

  const skipNextOnChangeRef = useRef(false)
  const [value, setValue] = useAtom(reportValueAtom(name))

  // Translate the leaf's stable-id name to its current array position before
  // resolving against the value the host holds. The atom is keyed by stable id
  // (field.<id>.<leaf>), but what the host carries is a positional array; after
  // a non-tail removal the two diverge, so a stable-id lookup against the
  // compacted record misses and (for fields with a defaultValue) clobbers the
  // seeded value. Mirror of the positional emit translation in use-input-core.
  // Identity outside a list (context default), so non-list fields are
  // unaffected and consuming it never triggers re-renders (the context value is
  // stable).
  const translateListPath = use(ListPathContext)

  // This field's entry, and nothing else.
  //
  // The whole record used to arrive as a prop, which made this hook's effect a
  // function of every field's value: one keystroke anywhere re-ran it for every
  // field on the form. Subscribing to the one entry is what makes it a function
  // of this field's own value instead.
  //
  // Translated here on purpose. The name that reaches the record has to be the
  // positional one, and the translation is a React context -- which is why an
  // atom cannot do this on its own, and why answering the same question inside
  // a `memo` comparator got it wrong twice.
  const entry = useAtomValue(hostEntryAtom(translateListPath(name)))

  const applyValue = useEffectEvent((rawValue: unknown, silent = false) => {
    const transformedValue = isInput(field)
      ? applyTransform(rawValue, field.advanced?.transform)
      : rawValue

    if (!silent && !deepEqual(value, transformedValue)) {
      skipNextOnChangeRef.current = true
    }

    setValue(transformedValue)
  })

  const onEntryChange = useEffectEvent((current: unknown) => {
    // `MISSING` is the host not naming this field at all, which covers both of
    // the cases the record used to separate: no record at all, and a record
    // that never mentions this field. They took different branches before and
    // arrived at the same place -- the silent `defaultValue` below -- so
    // collapsing them changes the route and not the destination.
    const found = current !== MISSING
    const newValue = found ? current : undefined

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
    onEntryChange(entry)
  }, [entry, field.defaultValue])

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
