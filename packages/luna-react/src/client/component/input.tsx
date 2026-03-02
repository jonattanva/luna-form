import { InputGroup } from '../../component/input-group'
import { fieldStateAtom } from '../lib/state-store'
import { omitKey } from '../lib/store-helper'
import { renderIfExists } from '../../lib/render-If-exists'
import { reportInputErrorAtom } from '../lib/error-store'
import { reportValueAtom, valueAtom } from '../lib/value-store'
import { useCallback, useEffect, useRef, useTransition } from 'react'
import { useDataSource } from '../hook/use-data-source'
import { useInput } from '../hook/use-input'
import { useSetAtom, useStore } from 'jotai'
import { useTimeout } from '../hook/use-timeout'
import { useValue } from '../hook/use-value'
import {
  getEntity,
  handleProxyEvent,
  handleSourceEvent,
  handleStateEvent,
  handleValueEvent,
  isClickable,
  isOptions,
  isTextable,
  isValidValue,
  prepareInputProps,
  prepareInputValue,
  translate,
  validateCustom,
  type AriaAttributes,
  type CommonProps,
  type DataAttributes,
  type Field,
  type Nullable,
  type Orientation,
  type Schema,
} from '@luna-form/core'
import type { Config, InputChange } from '../../type'

export function Input(
  props: Readonly<{
    ariaAttributes?: AriaAttributes
    commonProps: CommonProps
    config: Config
    context?: Record<string, unknown>
    dataAttributes?: DataAttributes
    field: Field
    onMount: (name: string, schema: Schema, field: Field) => void
    onUnmount: (name: string) => void
    onValueChange?: (input: InputChange) => void
    orientation?: Orientation
    translations?: Record<string, string>
    value?: Nullable<Record<string, unknown>>
  }>
) {
  const entity = props.field.advanced?.entity

  const store = useStore()
  const setTimeoutRef = useTimeout()
  const [, startTransition] = useTransition()

  const { setValue, shouldSkipOnChange, value } = useValue(
    props.field,
    props.value
  )

  const initialEventsProcessedRef = useRef(false)

  const valueRef = useRef(value)
  valueRef.current = value

  const translationsRef = useRef(props.translations)
  translationsRef.current = props.translations

  const hasTextable = isTextable(props.field)
  const hasClickable = isClickable(props.field)

  const setValues = useSetAtom(valueAtom)
  const setFieldStates = useSetAtom(fieldStateAtom)

  const setErrors = useSetAtom(reportInputErrorAtom(props.field.name))

  const [data, setSource] = useDataSource(props.field, props.config, value)
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

  const { commonPropsWithOptions, defaultValue } = prepareInputProps(
    props.field,
    commonProps,
    data,
    value
  )

  // Ref pattern is intentional here. useEffectEvent cannot be used because
  // this callback is invoked from onChange (an event handler), not from a
  // useEffect. The ref allows onChange to always read the latest props without
  // adding them as useCallback dependencies, avoiding unnecessary re-renders.
  const onValueChangeRef = useRef<((value: unknown) => void) | null>(null)
  onValueChangeRef.current = (value: unknown) => {
    setValue(value)
    if (props.onValueChange) {
      const attributes = props.dataAttributes ?? {}
      props.onValueChange({
        data: Object.keys(attributes).length > 0 ? attributes : undefined,
        name: props.field.name,
        type: props.field.type,
        value,
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
        handleSourceEvent(selected, sources, (target, source) =>
          setSource(target, source)
        )

        handleStateEvent(selected, states, (targets, state) => {
          setFieldStates((prev) => {
            if (state) {
              return targets.reduce(
                (acc, target) => ({
                  ...acc,
                  [target]: state,
                }),
                prev
              )
            }

            return targets.reduce((acc, target) => omitKey(acc, target), prev)
          })
        })

        handleValueEvent(selected, values, (target, value) => {
          setValues((prev) => ({
            ...prev,
            [target]: value,
          }))
        })
      })
    })
  }

  const inputProps = prepareInputValue(props.field, defaultValue)

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

  const handleTriggerEvent = useCallback(
    (value: string, callback: <T>(value?: T) => void) => {
      if (hasTextable) {
        setTimeoutRef(() => {
          callback({ value })
        }, 300)
        return
      }

      callback(getEntity(value, data, entity))
    },
    [data, entity, hasTextable, setTimeoutRef]
  )

  useEffect(() => {
    if (initialEventsProcessedRef.current || !props.value) {
      return
    }

    if (!props.field.event?.change) {
      initialEventsProcessedRef.current = true
      return
    }

    const isReady =
      (!isOptions(props.field) || (!!data && data.length > 0)) &&
      isValidValue(defaultValue)

    if (!isReady) {
      return
    }

    initialEventsProcessedRef.current = true

    const stringValue = String(defaultValue)
    const selected = hasTextable
      ? { value: stringValue }
      : getEntity(stringValue, data, entity)

    applyChangeEventsRef.current?.(selected)
  }, [data, defaultValue, entity, hasTextable, props.field, props.value])

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value

      if (!hasClickable && shouldSkipOnChange()) {
        // For text inputs, only skip if the value hasn't changed (synthetic event)
        // This allows the user to modify/clear the initial value on first interaction
        if (!hasTextable || inputValue === valueRef.current) {
          return
        }
      }

      onValueChangeRef.current?.(inputValue)
      if (props.config.validation.change) {
        validated(inputValue)
      }

      if (props.field.event?.change) {
        handleTriggerEvent(inputValue, (selected) => {
          applyChangeEventsRef.current?.(selected)
        })
      }
    },
    [
      handleTriggerEvent,
      hasClickable,
      props.config.validation.change,
      props.field.event?.change,
      shouldSkipOnChange,
      validated,
    ]
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

  return renderIfExists(props.config.inputs[props.field.type], (Component) => (
    <InputGroup
      config={props.config}
      context={props.context}
      field={props.field}
      orientation={props.orientation}
      translations={props.translations}
    >
      <Component
        {...commonPropsWithOptions}
        {...props.ariaAttributes}
        {...props.dataAttributes}
        {...inputProps}
        onBlur={onBlur}
        onChange={onChange}
      />
    </InputGroup>
  ))
}
