import { fieldStateAtom } from '../lib/state-store'
import { omitKey } from '../lib/store-helper'
import { reportInputErrorAtom } from '../lib/error-store'
import { reportValueAtom, valueAtom } from '../lib/value-store'
import { useCallback, useRef, useTransition } from 'react'
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

  const { setValue, shouldSkipOnChange, value, setSource } = deps

  const valueRef = useRef(value)
  valueRef.current = value

  const translationsRef = useRef(props.translations)
  translationsRef.current = props.translations

  const hasClickable = isClickable(props.field)

  const setValues = useSetAtom(valueAtom)
  const setFieldStates = useSetAtom(fieldStateAtom)
  const setErrors = useSetAtom(reportInputErrorAtom(props.field.name))

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

  // Tracks the last value the auto-fill (handleValueEvent) wrote to each
  // target. Used to distinguish "target still owned by the auto-fill" from
  // "user has manually edited the target" when deciding whether to honor
  // `onlyIfTargetEmpty`. A pure `isEmpty(current)` check is insufficient:
  // a target with a transform is non-empty after the very first source
  // keystroke, which would freeze the auto-fill on subsequent keystrokes.
  const lastAutoFilledTargetsRef = useRef<Map<string, unknown>>(new Map())

  // Ref pattern is intentional here. useEffectEvent cannot be used because
  // this callback is invoked from onChange (an event handler), not from a
  // useEffect. The ref allows onChange to always read the latest props without
  // adding them as useCallback dependencies, avoiding unnecessary re-renders.
  const onValueChangeRef = useRef<((value: unknown) => void) | null>(null)
  onValueChangeRef.current = (value: unknown) => {
    const newValue = isInput(props.field)
      ? applyTransform(value, props.field.advanced?.transform)
      : value

    setValue(newValue)
    if (props.onValueChange) {
      props.onValueChange({
        name: props.field.name,
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

        handleValueEvent(selected, values, (target, candidate, options) => {
          const newTarget = resolveTarget(target, props.field.name)
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
            const lastAutoFilled =
              lastAutoFilledTargetsRef.current.get(newTarget)
            if (!Object.is(lastAutoFilled, current)) {
              return
            }
          }

          if (transformed === current) {
            return
          }

          setValues((previous) => ({
            ...previous,
            [newTarget]: transformed,
          }))
          lastAutoFilledTargetsRef.current.set(newTarget, transformed)

          // Mirror the auto-fill up to the consumer. Without this, the parent
          // never learns about the target's new value, so on reload (or any
          // re-render that drops the internal atom in favor of the value
          // prop) the auto-filled data is lost (Bug B).
          if (props.onValueChange) {
            const targetField = getField(newTarget)
            if (targetField) {
              props.onValueChange({
                name: newTarget,
                type: targetField.type,
                value: transformed,
              })
            }
          }
        })
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

  const onBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      if (!hasClickable) {
        const value = event.target.value
        if (props.config.validation.blur) {
          validated(value)
        }
      }
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
