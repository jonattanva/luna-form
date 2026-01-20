import { InputGroup } from '../../component/input-group'
import { renderIfExists } from '../../lib/render-If-exists'
import { reportInputErrorAtom } from '../lib/error-store'
import { reportValueAtom, valueAtom } from '../lib/value-store'
import { useCallback, useTransition } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { useDataSource } from '../hook/use-data-source'
import { useInput } from '../hook/use-input'
import { useTimeout } from '../hook/use-timeout'
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
  const [value, setValue] = useAtom(reportValueAtom(props.field.name))

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

  const [setTimeoutRef] = useTimeout()
  const [, startTransition] = useTransition()
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
      const value = event.target.value
      setValue(value)

      if (props.config.validation.change) {
        validated(value)
      }

      const changeEvents = props.field.event?.change
      if (changeEvents) {
        handleTriggerEvent(value, (selected) => {
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
      props.field,
      props.config.validation.change,
      handleTriggerEvent,
      setSource,
      setValues,
      setValue,
      validated,
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
