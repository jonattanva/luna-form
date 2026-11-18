import { useCallback, useEffect, useRef } from 'react'
import { useLatest } from './use-latest'
import type { InputChangeEvent } from '../component/input-strategies'
import type { Option, Value } from '@luna-form/core'

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
 * field's control sends it. The form's tools are what write through it, so the
 * consumer hears the change as an agent's. `true` when the field holds the
 * value afterwards; `false` when it did not take it: it is locked, it refuses
 * the value (a select left empty), or nothing named so is mounted.
 */
export type Apply = (value: Value, options?: ApplyOptions) => boolean

/**
 * A mounted field, as something outside it reaches it: written through its own
 * change, asked whether it is locked, whether a request for its options has
 * not answered yet and which options it offers now, and validated. `validate`
 * answers the field's errors, and shows them when the form shows a person's
 * as they write or leave a field.
 */
export type FieldHandle = Readonly<{
  apply: Apply
  isFetching: () => boolean
  isLocked: () => boolean
  options: () => readonly Option[] | undefined
  validate: () => readonly string[]
}>

/**
 * The mounted fields' handles, by name: what each field registers, and what
 * reads them. Apart from the schema registry, because a field registers it from
 * the component that owns its change, not from the hook that builds its schema.
 */
export function useApplyRegistry() {
  const handles = useRef(new Map<string, FieldHandle>())

  // A field's cleanup takes out only the handle it put in, so a remount under
  // the same name that registered first keeps its own.
  const onRegisterApply = useCallback((name: string, handle: FieldHandle) => {
    handles.current.set(name, handle)
    return () => {
      if (handles.current.get(name) === handle) {
        handles.current.delete(name)
      }
    }
  }, [])

  const getHandles = useCallback(
    (): ReadonlyMap<string, FieldHandle> => handles.current,
    []
  )

  return [onRegisterApply, getHandles] as const
}

/** What a field hands `useRegisterApply`, read afresh on every call. */
export type FieldParts = Readonly<{
  change: (event: InputChangeEvent, apply?: ApplyOptions) => boolean
  fetching: boolean
  locked: boolean
  options: () => readonly Option[] | undefined
  validate: () => readonly string[]
}>

/**
 * Registers a field's handle under its name for as long as the field is
 * mounted. Read through a ref, so a change of what the field is locked by or
 * validates with is not a new registration.
 *
 * The options always reach `change`, as `{}` when the caller passed none: that
 * is how `change` tells a value written from outside from the control's own.
 */
export function useRegisterApply(
  name: string | undefined,
  parts: FieldParts,
  onRegisterApply: (name: string, handle: FieldHandle) => () => void
) {
  const partsRef = useLatest(parts)

  useEffect(() => {
    if (!name) {
      return
    }

    return onRegisterApply(name, {
      apply: (value, options) =>
        partsRef.current.change({ target: { value } }, options ?? {}),
      isFetching: () => partsRef.current.fetching,
      isLocked: () => partsRef.current.locked,
      options: () => partsRef.current.options(),
      validate: () => partsRef.current.validate(),
    })
  }, [name, onRegisterApply, partsRef])
}
