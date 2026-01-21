import { InputGroup } from '../../component/input-group'
import { renderIfExists } from '../../lib/render-If-exists'
import { reportInputErrorAtom } from '../lib/error-store'
import { useCallback, useTransition } from 'react'
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
  type Schema,
} from '@luna-form/core'
import type { Config } from '../../type'

export function Input(
  props: Readonly<{
    ariaAttributes?: AriaAttributes
    commonProps: CommonProps
    config: Config
    dataAttributes?: DataAttributes
    field: Field
    onMount: (name: string, schema: Schema) => void
    onUnmount: (name: string) => void
    value?: Nullable<Record<string, unknown>>
  }>
) {
  const [setTimeoutRef] = useTimeout()
  const [, startTransition] = useTransition()

  const { skipNextOnChangeRef, value, setValue } = useValue(
    props.field,
    props.value
  )

  const setValues = useSetAtom(valueAtom)
  const setErrors = useSetAtom(reportInputErrorAtom(props.field.name))

  const [schema] = useInput(props.field, props.onMount, props.onUnmount)
  const [data, setSource] = useDataSource(props.field, props.config, value)

  const { commonPropsWithOptions, defaultValue } = prepareInputProps(
    props.field,
    props.commonProps,
    data,
    value
  )

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
      if (isTextable(props.field)) {
        setTimeoutRef(() => {
          callback({ value })
        }, 500)
        return
      }

      const currentValue = getEntity(value, data, props.field.advanced?.entity)
      callback(currentValue)
    },
    [setTimeoutRef, props.field, data]
  )

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value

      if (skipNextOnChangeRef.current) {
        skipNextOnChangeRef.current = false
        // For text inputs, only skip if the value hasn't changed (synthetic event)
        // This allows the user to modify/clear the initial value on first interaction
        // For non-text inputs (select, radio), always skip as they don't have this issue
        if (!isTextable(props.field) || inputValue === value) {
          return
        }
      }

      setValue(inputValue)

      if (props.config.validation.change) {
        validated(inputValue)
      }

      const changeEvents = props.field.event?.change
      if (changeEvents) {
        handleTriggerEvent(inputValue, (selected) => {
          handleProxyEvent(changeEvents, ({ sources, values }) => {
            startTransition(() => {
              handleSourceEvent(selected, sources, (target, source) =>
                setSource(target, source)
              )

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
      props.config.validation.change,
      props.field,
      setSource,
      setValue,
      setValues,
      skipNextOnChangeRef,
      validated,
      value,
    ]
  )

  const onBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      if (isClickable(props.field)) {
        return
      }

      const value = event.target.value
      if (props.config.validation.blur) {
        validated(value)
      }
    },
    [props.field, props.config.validation.blur, validated]
  )

  return renderIfExists(props.config.inputs[props.field.type], (Component) => (
    <InputGroup field={props.field}>
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
