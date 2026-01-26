import { InputGroup } from '../../component/input-group'
import { fieldStateAtom } from '../lib/state-store'
import { renderIfExists } from '../../lib/render-If-exists'
import { reportInputErrorAtom } from '../lib/error-store'
import { useCallback, useRef, useTransition } from 'react'
import { useDataSource } from '../hook/use-data-source'
import { useInput } from '../hook/use-input'
import { useSetAtom } from 'jotai'
import { useTimeout } from '../hook/use-timeout'
import { useValue } from '../hook/use-value'
import { valueAtom } from '../lib/value-store'
import {
  getEntity,
  handleProxyEvent,
  handleSourceEvent,
  handleStateEvent,
  handleValueEvent,
  isClickable,
  isTextable,
  prepareInputProps,
  prepareInputValue,
  type AriaAttributes,
  type CommonProps,
  type DataAttributes,
  type Field,
  type Nullable,
  type Orientation,
  type Schema,
} from '@luna-form/core'
import type { Config } from '../../type'

export function Input(
  props: Readonly<{
    ariaAttributes?: AriaAttributes
    commonProps: CommonProps
    config: Config
    context?: Record<string, unknown>
    dataAttributes?: DataAttributes
    field: Field
    onMount: (name: string, schema: Schema) => void
    onUnmount: (name: string) => void
    orientation?: Orientation
    value?: Nullable<Record<string, unknown>>
  }>
) {
  const entity = props.field.advanced?.entity

  const setTimeoutRef = useTimeout()
  const [, startTransition] = useTransition()

  const { setValue, shouldSkipOnChange, value } = useValue(
    props.field,
    props.value
  )

  const hasTextable = isTextable(props.field)
  const hasClickable = isClickable(props.field)

  const setValues = useSetAtom(valueAtom)
  const setFieldStates = useSetAtom(fieldStateAtom)

  const setErrors = useSetAtom(reportInputErrorAtom(props.field.name))

  const schema = useInput(props.field, props.onMount, props.onUnmount)
  const [data, setSource] = useDataSource(props.field, props.config, value)

  const { commonPropsWithOptions, defaultValue } = prepareInputProps(
    props.field,
    props.commonProps,
    data,
    value
  )

  // Keep a ref of the current value to access inside event handlers
  const valueRef = useRef(value)
  valueRef.current = value

  const inputProps = prepareInputValue(props.field, defaultValue)

  const validated = useCallback(
    (value: string) => {
      const results = schema.safeParse(value)
      const errors = results.error?.issues.map((issue) => issue.message) ?? []
      setErrors(errors)
    },
    [setErrors, schema]
  )

  const handleTriggerEvent = useCallback(
    (value: string, callback: <T>(value?: T) => void) => {
      if (hasTextable) {
        setTimeoutRef(() => {
          callback({ value })
        }, 500)
        return
      }

      const currentValue = getEntity(value, data, entity)
      callback(currentValue)
    },
    [data, entity, hasTextable, setTimeoutRef]
  )

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value

      if (shouldSkipOnChange()) {
        // For text inputs, only skip if the value hasn't changed (synthetic event)
        // This allows the user to modify/clear the initial value on first interaction
        // For non-text inputs (select, radio), always skip as they don't have this issue
        if (!hasTextable || inputValue === valueRef.current) {
          return
        }
      }

      setValue(inputValue)
      if (props.config.validation.change) {
        validated(inputValue)
      }

      const events = props.field.event?.change
      if (events) {
        handleTriggerEvent(inputValue, (selected) => {
          handleProxyEvent(events, ({ sources, states, values }) => {
            startTransition(() => {
              handleSourceEvent(selected, sources, (target, source) =>
                setSource(target, source)
              )

              handleStateEvent(selected, states, (target, state) => {
                setFieldStates((prev) => {
                  if (state) {
                    return { ...prev, [target]: state }
                  }
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { [target]: _removed, ...rest } = prev
                  return rest
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
        })
      }
    },
    [
      handleTriggerEvent,
      hasTextable,
      props.config.validation.change,
      props.field.event?.change,
      setFieldStates,
      setSource,
      setValue,
      setValues,
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
