import { Description } from '../../component/description'
import { FieldError } from '../../component/field-error'
import { reportInputErrorAtom } from '../lib/error-store'
import { startTransition } from 'react'
import { useAtom } from 'jotai'
import { useDataSource } from '../hook/useDataSource'
import { useInput } from '../hook/useInput'
import {
  getEntity,
  getInputValue,
  getOptions,
  getPreselectedValue,
  handleSourceEvent,
  mergeOptionsProps,
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
    withinColumn?: boolean
  }>
) {
  const currentValue = getInputValue(props.field, props.value)

  const [errors, setErrors] = useAtom(reportInputErrorAtom(props.field.name))
  const [schema] = useInput(props.field, props.onMount, props.onUnmount)

  const [data, setSource] = useDataSource(
    props.field,
    props.config,
    props.value
  )

  const options = getOptions(props.field, data)

  const commonPropsWithOptions = mergeOptionsProps(
    props.field,
    props.commonProps,
    options
  )

  const defaultValue = getPreselectedValue(
    props.field,
    commonPropsWithOptions,
    currentValue
  )

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    if (props.config.validation.change) {
      validated(value)
    }

    const changeEvents = props.field.event?.change
    if (changeEvents) {
      const selected = getEntity(value, data, props.field.advanced?.entity)
      startTransition(() => {
        handleSourceEvent(selected, changeEvents, (target, source) => {
          setSource(target, source)
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

  const Component = props.config.inputs[props.field.type]
  if (!Component) {
    return null
  }

  return (
    <>
      <Component
        {...commonPropsWithOptions}
        {...props.ariaAttributes}
        {...props.dataAttributes}
        defaultValue={defaultValue}
        onBlur={onBlur}
        onChange={onChange}
      />
      {props.field.description && (
        <Description>{props.field.description}</Description>
      )}
      {!props.withinColumn && (
        <FieldError name={props.field.name} errors={errors} />
      )}
    </>
  )
}
