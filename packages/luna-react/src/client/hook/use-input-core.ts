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

  function getTransform(target: string) {
    const [, fields] = props.getSchema()
    const current = fields.find((field) => {
      return field.name === target
    })

    if (current && isInput(current)) {
      const transform = current.advanced?.transform
      if (transform) {
        return transform
      }
    }
  }

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
                (acc, target) => ({
                  ...acc,
                  [target]: state,
                }),
                previous
              )
            }

            return newTargets.reduce((acc, target) => {
              return omitKey(acc, target)
            }, previous)
          })

          if (state?.hidden === true) {
            setValues((previous) => {
              let changed = false
              const next = { ...previous }
              for (const key of Object.keys(previous)) {
                if (
                  newTargets.some((target) => {
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

        handleValueEvent(selected, values, (target, resolve) => {
          const newTarget = resolveTarget(target, props.field.name)
          setValues((previous) => {
            const current = previous[newTarget]
            const next = resolve(current)

            const transform = getTransform(newTarget)
            const newValue = !transform ? next : applyTransform(next, transform)

            if (newValue === current) {
              return previous
            }

            return { ...previous, [newTarget]: newValue }
          })
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
