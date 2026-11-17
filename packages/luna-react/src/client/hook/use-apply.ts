import { useCallback, useEffect, useRef } from 'react'
import { useLatest } from './use-latest'
import type { InputChangeEvent } from '../component/input-strategies'
import type { Value } from '@luna-form/core'

/**
 * How a value written from outside a field goes through it.
 *
 * `immediate` runs the field's change events on the next task instead of after
 * the 300 ms a typed field waits for the typing to stop. `validate` decides
 * whether the field validates the value now; by default it does what the form's
 * `validation.change` says, as a person's change does.
 */
export type ApplyOptions = Readonly<{
  immediate?: boolean
  validate?: boolean
}>

/**
 * Writes a value into a field the way a person's change does, in the shape the
 * field's control sends it. `true` when the field holds the value afterwards;
 * `false` when it did not take it: it is locked, it refuses the value (a select
 * left empty), or nothing named so is mounted.
 */
export type Apply = (value: Value, options?: ApplyOptions) => boolean

/**
 * The fields' change, by name, for writing them from outside: what each field
 * registers, and what writes one. Apart from the schema registry, because a
 * field registers it from the component that owns its change, not from the
 * hook that builds its schema.
 */
export function useApplyRegistry() {
  const appliers = useRef(new Map<string, Apply>())

  // A field's cleanup takes out only the writer it put in, so a remount under
  // the same name that registered first keeps its own.
  const onRegisterApply = useCallback((name: string, apply: Apply) => {
    appliers.current.set(name, apply)
    return () => {
      if (appliers.current.get(name) === apply) {
        appliers.current.delete(name)
      }
    }
  }, [])

  const apply = useCallback(
    (name: string, value: Value, options?: ApplyOptions) =>
      appliers.current.get(name)?.(value, options) ?? false,
    []
  )

  return [onRegisterApply, apply] as const
}

/**
 * Registers a field's change under its name for as long as the field is
 * mounted. Read through a ref, so a change of what the field is locked by or
 * validates with is not a new registration.
 *
 * The options always reach `change`, as `{}` when the caller passed none: that
 * is how `change` tells a value written from outside from the control's own.
 */
export function useRegisterApply(
  name: string | undefined,
  change: (event: InputChangeEvent, apply?: ApplyOptions) => boolean,
  onRegisterApply: (name: string, apply: Apply) => () => void
) {
  const changeRef = useLatest(change)

  useEffect(() => {
    if (!name) {
      return
    }

    return onRegisterApply(name, (value, options) =>
      changeRef.current({ target: { value } }, options ?? {})
    )
  }, [changeRef, name, onRegisterApply])
}
