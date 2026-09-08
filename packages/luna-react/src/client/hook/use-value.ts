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
import { resolveEntry } from '../lib/resolve-value'
import { useAtom } from 'jotai'
import {
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
  useEffectEvent,
} from 'react'

/**
 * What the store holds for a field, given what it was handed.
 *
 * Shared by the seeding below and by {@link useValue}'s first render so the two
 * cannot disagree: a field carrying a `transform` would otherwise be painted
 * with the raw value and rewritten with the transformed one a commit later,
 * trading one flash for another.
 */
function toStoredValue(field: Field, rawValue: unknown) {
  return isInput(field)
    ? applyTransform(rawValue, field.advanced?.transform)
    : rawValue
}

/**
 * Which value a field takes from what it was handed, and on whose authority.
 *
 * The precedence is the same wherever it is asked -- the seeding effect and the
 * first render both read it here -- and that is the point of it being one
 * function. It was written twice before, once in each place, and the two copies
 * are exactly how a `defaultValue` came to be transformed on one path and
 * handed over raw on the other.
 *
 * `source` is what the callers need to tell the cases apart without knowing the
 * rule: only a `defaultValue` is seeded silently, because it is the form's own
 * declaration rather than something the consumer said, and reporting it back as
 * a change would put words in the consumer's mouth.
 *
 * - `value`: the object named this field and held something in it.
 * - `default`: it did not, and the field declares a `defaultValue`.
 * - `empty`: it named the field and held nothing, which is a statement and not
 *   a gap -- the field is meant to be empty. Only reachable once the two above
 *   have declined, so a caller passing a partial object still leaves untouched
 *   fields, and any `defaultValue`, exactly where they were. Without it a field
 *   could be filled from the outside but never cleared from the outside, since
 *   neither `undefined`, `null` nor `''` is a value worth re-feeding by the
 *   measure above. `withDeclaredFields` is how a caller says it on purpose.
 * - `none`: nothing names it and it declares nothing. There is no value here to
 *   speak of, and the callers leave the field alone.
 */
function selectValue(
  field: Field,
  currentValue: Nullable<Record<string, unknown>> | undefined,
  translatedName: string
) {
  const { found, value } = currentValue
    ? resolveEntry(translatedName, currentValue)
    : { found: false, value: undefined }

  if (isValidValue(value)) {
    return { source: 'value', value } as const
  }

  if (isValidValue(field.defaultValue)) {
    return { source: 'default', value: field.defaultValue } as const
  }

  if (found) {
    return { source: 'empty', value } as const
  }

  return { source: 'none', value: undefined } as const
}

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

  // Whether the effect below has seeded this field yet. Written from the
  // effect and only read while rendering, where it flips false to true exactly
  // once -- and by then the store already holds what the fallback was standing
  // in for, so no render ever disagrees with the one before it.
  const seededRef = useRef(false)

  // What the field holds until that first seeding commits.
  //
  // The store is seeded from an effect, so an input is otherwise painted --
  // mounted, focusable and empty -- one commit before it is given the value it
  // was fed. `getInputValue` already closes exactly this gap for a
  // `defaultValue`, by falling back to it while the store is empty; a value
  // that arrived through the `value` prop had no such fallback, which is why it
  // was the only one of the two that flashed.
  //
  // That flash is not cosmetic. A field that is empty and interactive is a
  // field the user can reach first: what they type is overwritten by the
  // seeding commit, and emptying it does nothing at all -- the input is already
  // empty, so the browser reports no change and the form tells its consumer
  // nothing.
  //
  // Read once at mount, and gated on `seededRef` so it applies strictly
  // before that first seeding and never after. Once the store owns the field an
  // absent entry is not a gap to fill but a value that was deliberately taken
  // away -- a hidden target cleared, a form reset -- and putting it back is the
  // bug this must not become.
  const [initialValue] = useState(() => {
    const selected = selectValue(field, currentValue, translateListPath(name))

    // Only the two that carry something. `empty` and `none` both leave the
    // field showing nothing, which is already what no stand-in at all does.
    if (selected.source !== 'value' && selected.source !== 'default') {
      return undefined
    }

    // `?? undefined` mirrors what the atom's own reader does to everything it
    // hands back, so the stand-in and the store have the same type and no
    // caller can tell which of the two it was given.
    return toStoredValue(field, selected.value) ?? undefined
  })

  const applyValue = useEffectEvent((rawValue: unknown, silent = false) => {
    const transformedValue = toStoredValue(field, rawValue)

    if (!silent && !deepEqual(value, transformedValue)) {
      skipNextOnChangeRef.current = true
    }

    setValue(transformedValue)
  })

  const seed = useEffectEvent(() => {
    const selected = selectValue(field, currentValue, translateListPath(name))

    if (selected.source === 'none') {
      return
    }

    applyValue(selected.value, selected.source === 'default')
  })

  useEffect(() => {
    seededRef.current = true
    seed()
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
    // `??` rather than a plain swap: a `value` change event can auto-fill this
    // field before it mounts, and what the store already holds outranks the
    // prop it was fed.
    value: seededRef.current ? value : (value ?? initialValue),
  } as const
}
