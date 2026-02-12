import { InputGroup } from '../../component/input-group'
import { fieldStateAtom } from '../lib/state-store'
import { renderIfExists } from '../../lib/render-If-exists'
import { reportInputErrorAtom } from '../lib/error-store'
import { useCallback, useRef, useTransition } from 'react'
import { useDataSource } from '../hook/use-data-source'
import { useInput } from '../hook/use-input'
import { useSetAtom, useStore } from 'jotai'
import { useTimeout } from '../hook/use-timeout'
import { useValue } from '../hook/use-value'
import { reportValueAtom, valueAtom } from '../lib/value-store'
import {
  getEntity,
  handleProxyEvent,
  handleSourceEvent,
  handleStateEvent,
  handleValueEvent,
  isClickable,
  isTextable,
  logger,
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
import type { Config } from '../../type'

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
    onValueChange?: (input: { name: string; value: unknown }) => void
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

  const onValueChangeRef = useRef<((value: unknown) => void) | null>(null)
  onValueChangeRef.current = (value: unknown) => {
    setValue(value)
    if (props.onValueChange) {
      props.onValueChange({ name: props.field.name, value })
    }
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

      logger.info('onChange fired', {
        fieldName: props.field.name,
        fieldType: props.field.type,
        inputValue,
        currentValue: valueRef.current,
        hasTextable,
        hasClickable,
      })

      if (!hasClickable && shouldSkipOnChange()) {
        logger.info('shouldSkipOnChange returned true', {
          fieldName: props.field.name,
          willSkip: !hasTextable || inputValue === valueRef.current,
          reason: !hasTextable
            ? 'not textable (checkbox/radio/select)'
            : 'value unchanged',
        })
        // For text inputs, only skip if the value hasn't changed (synthetic event)
        // This allows the user to modify/clear the initial value on first interaction
        if (!hasTextable || inputValue === valueRef.current) {
          logger.info('SKIPPING onChange', { fieldName: props.field.name })
          return
        }
      }

      logger.info('onChange processing', {
        fieldName: props.field.name,
        inputValue,
      })
      onValueChangeRef.current?.(inputValue)
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
      hasClickable,
      hasTextable,
      props.config.validation.change,
      props.field.event?.change,
      props.field.name,
      props.field.type,
      setFieldStates,
      setSource,
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
