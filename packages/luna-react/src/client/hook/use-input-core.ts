import { fieldStateAtom } from '../lib/state-store'
import { ListPathContext } from '../context/list-path-context'
import { omitKey } from '../lib/store-helper'
import { reportInputErrorAtom } from '../lib/error-store'
import { mountedListsAtom, pendingListRowsAtom } from '../lib/list-store'
import {
  appliedAutoFillAtom,
  pendingAutoFillAtom,
  reportValueAtom,
  valueAtom,
} from '../lib/value-store'
import { use, useCallback, useRef, useTransition } from 'react'
import { useInput } from './use-input'
import { useSetAtom, useStore } from 'jotai'
import { useTimeout } from './use-timeout'
import {
  applyTransform,
  handleProxyEvent,
  handleSourceEvent,
  handleStateEvent,
  handleValueEvent,
  isClickable,
  isEmpty,
  isInput,
  isRows,
  resolveTarget,
  translate,
  type AriaAttributes,
  type CommonProps,
  type DataAttributes,
  type DataSource,
  type Field,
  type Nullable,
  type Schema,
  type Schemas,
  validateCustom,
} from '@luna-form/core'
import type { Config, InputChange } from '../../type'

export type InputCoreProps = Readonly<{
  ariaAttributes?: AriaAttributes
  commonProps: CommonProps
  config: Config
  context?: Record<string, unknown>
  dataAttributes?: DataAttributes
  field: Field
  getSchema: () => readonly [Schemas, Field[]]
  horizontal?: boolean
  onMount: (name: string, schema: Schema, field: Field) => void
  onUnmount: (name: string, options?: { keepValue?: boolean }) => void
  onValueChange?: (input: InputChange) => void
  translations?: Record<string, string>
  value?: Nullable<Record<string, unknown>>
}>

// Whether the user's caret is in this field right now.
//
// Read off the document instead of tracked in state because the field that
// receives an auto-fill is rendered by a different component than the source
// that sends it, and `name` is the one identifier both sides agree on: it is
// the atom key, and `buildCommon` puts the same string on the element.
//
// No guard for a missing `document`: both callers reach this from an event
// handler or an effect, neither of which runs while rendering on the server.
function isFieldFocused(name: string) {
  return document.activeElement?.getAttribute('name') === name
}

export function useInputCore(
  props: InputCoreProps,
  deps: Readonly<{
    setSource: (target: string, source?: DataSource) => void
    setValue: (value: unknown) => void
    shouldSkipOnChange: () => boolean
    value: unknown
  }>
) {
  const store = useStore()
  const entity = props.field.advanced?.entity

  const setTimeoutRef = useTimeout()
  const [, startTransition] = useTransition()

  // Translates consumer-facing names from the list's stable id to the item's
  // current position (identity outside lists). Consumed unconditionally: the
  // context value has a stable identity, so this never triggers re-renders.
  const translateListPath = use(ListPathContext)

  const { setValue, shouldSkipOnChange, value, setSource } = deps

  const valueRef = useRef(value)
  valueRef.current = value

  const translationsRef = useRef(props.translations)
  translationsRef.current = props.translations

  const hasClickable = isClickable(props.field)

  const setValues = useSetAtom(valueAtom)
  const setFieldStates = useSetAtom(fieldStateAtom)
  const setErrors = useSetAtom(reportInputErrorAtom(props.field.name))
  const setAppliedAutoFill = useSetAtom(appliedAutoFillAtom)
  const setPendingAutoFill = useSetAtom(pendingAutoFillAtom)
  const setPendingListRows = useSetAtom(pendingListRowsAtom)

  const schema = useInput(
    props.field,
    props.onMount,
    props.onUnmount,
    props.translations
  )

  const placeholder = translate(
    props.commonProps.placeholder,
    props.translations
  )

  const commonProps = {
    ...props.commonProps,
    placeholder,
  }

  function getField(target: string) {
    const [, fields] = props.getSchema()
    return fields.find((field) => field.name === target)
  }

  function getTransform(target: string) {
    const current = getField(target)
    if (current && isInput(current)) {
      const transform = current.advanced?.transform
      if (transform) {
        return transform
      }
    }
  }

  // Writes an auto-filled value to a target and records it as ours, so a later
  // pass can still tell it apart from something the user typed.
  function applyAutoFill(target: string, value: unknown) {
    setValues((previous) => ({
      ...previous,
      [target]: value,
    }))

    setAppliedAutoFill((previous) => ({
      ...previous,
      [target]: value,
    }))

    // Mirror the auto-fill up to the consumer. Without this, the parent
    // never learns about the target's new value, so on reload (or any
    // re-render that drops the internal atom in favor of the value
    // prop) the auto-filled data is lost (Bug B).
    if (props.onValueChange) {
      const targetField = getField(target)
      if (targetField) {
        props.onValueChange({
          name: translateListPath(target),
          type: targetField.type,
          value,
        })
      }
    }
  }

  // Ref pattern is intentional here. useEffectEvent cannot be used because
  // this callback is invoked from onChange (an event handler), not from a
  // useEffect. The ref allows onChange to always read the latest props without
  // adding them as useCallback dependencies, avoiding unnecessary re-renders.
  const onValueChangeRef = useRef<((value: unknown) => void) | null>(null)
  onValueChangeRef.current = (value: unknown) => {
    // A transient field acts and keeps nothing: neither its own stored value
    // nor a word to the consumer. Its change events still go out -- they are
    // the only reason it exists -- so this returns before the two writes and
    // leaves `dispatchChange` in `input-base` alone.
    //
    // Leaving the stored value out is what lets it be pressed twice: the
    // `deepEqual(inputValue, valueRef.current)` guard in `shouldSkipChange`
    // compares against a value that is never written, so the second identical
    // press is not read as a no-op.
    if (props.field.advanced?.transient) {
      return
    }

    const newValue = isInput(props.field)
      ? applyTransform(value, props.field.advanced?.transform)
      : value

    setValue(newValue)
    if (props.onValueChange) {
      props.onValueChange({
        name: translateListPath(props.field.name),
        type: props.field.type,
        value: newValue,
      })
    }
  }

  // Same ref pattern: shared event processing invoked from both onChange and
  // the initialization useEffect below.
  const applyChangeEventsRef = useRef<((selected: unknown) => void) | null>(
    null
  )
  applyChangeEventsRef.current = (selected: unknown) => {
    const events = props.field.event?.change
    if (!events) {
      return
    }

    handleProxyEvent(events, ({ sources, states, values }) => {
      startTransition(() => {
        handleSourceEvent(selected, sources, (target, source) => {
          setSource(resolveTarget(target, props.field.name), source)
        })

        handleStateEvent(selected, states, (targets, state) => {
          const newTargets = targets.map((target) =>
            resolveTarget(target, props.field.name)
          )

          setFieldStates((previous) => {
            if (state) {
              return newTargets.reduce(
                (previous, target) => ({
                  ...previous,
                  [target]: state,
                }),
                previous
              )
            }

            return newTargets.reduce((previous, target) => {
              return omitKey(previous, target)
            }, previous)
          })

          const targetsToClear =
            state?.hidden === true
              ? newTargets
              : state === undefined
                ? newTargets.filter(
                    (target) => getField(target)?.hidden === true
                  )
                : []

          if (targetsToClear.length > 0) {
            setValues((previous) => {
              let changed = false
              const next = { ...previous }
              for (const key of Object.keys(previous)) {
                if (
                  targetsToClear.some((target) => {
                    return key === target || key.startsWith(`${target}.`)
                  })
                ) {
                  delete next[key]
                  changed = true
                }
              }
              return changed ? next : previous
            })
          }
        })
      })

      // Outside the transition on purpose. Everything above rearranges the
      // form -- fields appearing, options being refetched -- and is better
      // interrupted than rushed. This one writes into a field the user may be
      // reaching for, and the focus test below is a decision about *now*, so it
      // has to be painted now: as a transition React commits it whenever it
      // likes -- 200ms later on a crowded form -- and by then the caret can be
      // in the target. Writing a controlled input's value while it has focus
      // collapses the selection to the end of the new text, so what is typed
      // next lands behind it (`customeremail` + `customer_email`).
      //
      // Same work either way, once per debounced batch: what changes is the
      // lane. It also splits the batch in two commits, so an event that both
      // fills a field and hides it now paints the value first.
      handleValueEvent(selected, values, (target, candidate, options) => {
        const newTarget = resolveTarget(target, props.field.name)

        // A list is written by handing its rows over, not by setting a value.
        // It holds nothing under its own name -- its values are flat keys of
        // the form `list.<id>.<leaf>` -- and how many rows it has is state
        // inside the component that renders it, which is the only thing that
        // can grow or shrink it. See `list-store`.
        //
        // Everything below is about a single value and does not carry over: a
        // list has no `transform`, cannot hold the caret, and gives
        // `onlyIfTargetEmpty` nothing to call empty. So this returns either
        // way -- a candidate that is not a list's worth of rows is a
        // definition pointing a list at the wrong shape, and there is no
        // sensible second place to put it.
        if (store.get(mountedListsAtom)[newTarget]) {
          if (isRows(candidate)) {
            setPendingListRows((previous) => ({
              ...previous,
              [newTarget]: candidate,
            }))
          }
          return
        }

        const transform = getTransform(newTarget)
        const transformed = transform
          ? applyTransform(candidate, transform)
          : candidate

        const previousValues = store.get(valueAtom) as Record<string, unknown>
        const current = previousValues[newTarget]

        // Only honor `onlyIfTargetEmpty` when the user has actually changed
        // the target since our last auto-fill. If `current` still equals the
        // value we wrote, the field is still in "auto-fill" mode and we
        // should keep mirroring the source — otherwise targets with
        // transforms freeze after the first character (Bug A).
        if (options.onlyIfTargetEmpty && !isEmpty(current)) {
          const applied = store.get(appliedAutoFillAtom)[newTarget]
          if (!Object.is(applied, current)) {
            return
          }
        }

        if (transformed === current) {
          return
        }

        // Held back rather than written, because the user is inside the
        // target: setting a controlled input's value while it has focus
        // collapses the selection to the end of the new text, so everything
        // typed next lands behind it -- `customeremail` + `customer_email`.
        // `onBlur` releases this the moment they leave the field, so the
        // auto-fill is postponed, never dropped (Bug C).
        if (isFieldFocused(newTarget)) {
          setPendingAutoFill({ target: newTarget, value: transformed })
          return
        }

        applyAutoFill(newTarget, transformed)
      })
    })
  }

  const validated = useCallback(
    (value: string) => {
      const results = schema.safeParse(value)
      const errors = results.error?.issues.map((issue) => issue.message) ?? []

      const custom = props.field.validation?.custom
      const customErrors = custom
        ? validateCustom(
            value,
            custom,
            (name) => store.get(reportValueAtom(name)),
            translationsRef.current
          )
        : []

      setErrors([...errors, ...customErrors])
    },
    [props.field.validation?.custom, schema, setErrors, store]
  )

  // Same ref pattern: read from `onBlur`, which is memoized and must not take
  // a dependency that changes on every render.
  const releasePendingAutoFillRef = useRef<(() => void) | null>(null)
  releasePendingAutoFillRef.current = () => {
    const pending = store.get(pendingAutoFillAtom)

    if (pending?.target !== props.field.name) {
      return
    }

    setPendingAutoFill(null)

    // Only if the field is still untouched. Whatever the user typed while the
    // auto-fill was parked is theirs, and outranks it.
    if (isEmpty(store.get(valueAtom)[pending.target])) {
      applyAutoFill(pending.target, pending.value)
    }
  }

  const onBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      if (!hasClickable) {
        const value = event.target.value
        if (props.config.validation.blur) {
          validated(value)
        }
      }

      releasePendingAutoFillRef.current?.()
    },
    [hasClickable, props.config.validation.blur, validated]
  )

  return {
    applyChangeEventsRef,
    commonProps,
    entity,
    hasClickable,
    onBlur,
    onValueChangeRef,
    setTimeoutRef,
    shouldSkipOnChange,
    validated,
    valueRef,
  } as const
}
