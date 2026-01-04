import { InputGroup } from '../../component/input-group'
import { renderIfExists } from '../../lib/render-If-exists'
import { reportInputErrorAtom } from '../lib/error-store'
import { startTransition } from 'react'
import { useDataSource } from '../hook/use-data-source'
import { useInput } from '../hook/use-input'
import { useSetAtom } from 'jotai'
import { useTimeout } from '../hook/use-timeout'
import {
  getEntity,
  handleSourceEvent,
  isSelect,
  prepareInputProps,
  type AriaAttributes,
  type CommonProps,
  type DataAttributes,
  type Field,
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
    value?: Record<string, unknown>
  }>
) {
  const setErrors = useSetAtom(reportInputErrorAtom(props.field.name))
  const [schema] = useInput(props.field, props.onMount, props.onUnmount)

  const [data, setSource] = useDataSource(
    props.field,
    props.config,
    props.value
  )

  const { commonPropsWithOptions, defaultValue } = prepareInputProps(
    props.field,
    props.commonProps,
    data,
    props.value
  )

  const [setTimeoutRef] = useTimeout()

  function handleTriggerEvent(value: string, callback: <T>(value?: T) => void) {
    if (isSelect(props.field)) {
      callback(getEntity(value, data, props.field.advanced?.entity))
      return
    }

    setTimeoutRef(() => {
      callback({ value })
    }, 500)
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    if (props.config.validation.change) {
      validated(value)
    }

    const changeEvents = props.field.event?.change
    if (changeEvents) {
      handleTriggerEvent(value, (selected) => {
        startTransition(() => {
          handleSourceEvent(selected, changeEvents, (target, source) => {
            setSource(target, source)
          })
        })
      })
    }
  }

  function onBlur(event: React.FocusEvent<HTMLInputElement>) {
    const value = event.target.value
    if (props.config.validation.blur) {
      validated(value)
    }
  }

  function validated(value: string) {
    const results = schema.safeParse(value)
    const errors = results.error?.issues.map((issue) => issue.message) ?? []
    setErrors(errors)
  }

  return renderIfExists(props.config.inputs[props.field.type], (Component) => (
    <InputGroup field={props.field}>
      <Component
        {...commonPropsWithOptions}
        {...props.ariaAttributes}
        {...props.dataAttributes}
        defaultValue={defaultValue}
        onBlur={onBlur}
        onChange={onChange}
      />
    </InputGroup>
  ))
}
