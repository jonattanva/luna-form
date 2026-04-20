import { InputGroup } from '../../component/input-group'
import { renderIfExists } from '../../lib/render-If-exists'
import { useCallback, useEffect, useRef } from 'react'
import { useInputCore, type InputCoreProps } from '../hook/use-input-core'
import { useValue } from '../hook/use-value'
import {
  isValidValue,
  prepareInputProps,
  prepareInputValue,
} from '@luna-form/core'
import type { InputStrategies } from './input-strategies'

export function InputBase(
  props: InputCoreProps & {
    strategies: InputStrategies
  }
) {
  const {
    useSource,
    useExtraProps,
    getValue,
    shouldSkipChange,
    dispatchChange,
    buildInitialSelected,
    isInitialReady,
  } = props.strategies

  const { setValue, shouldSkipOnChange, value } = useValue(
    props.field,
    props.value
  )
  const { data, setSource } = useSource(props.field, props.config, value)

  const {
    applyChangeEventsRef,
    commonProps,
    entity,
    hasClickable,
    onBlur,
    onValueChangeRef,
    setTimeoutRef,
    validated,
    valueRef,
  } = useInputCore(props, { setValue, shouldSkipOnChange, value, setSource })

  const extraProps = useExtraProps?.(props.field)

  const initialEventsProcessedRef = useRef(false)

  const { commonPropsWithOptions, defaultValue } = prepareInputProps(
    props.field,
    commonProps,
    data,
    value
  )

  const inputProps = prepareInputValue(props.field, defaultValue)

  useEffect(() => {
    if (initialEventsProcessedRef.current || !props.value) {
      return
    }

    if (!props.field.event?.change) {
      initialEventsProcessedRef.current = true
      return
    }

    if (!isValidValue(defaultValue)) {
      return
    }

    if (!isInitialReady(props.field, defaultValue, data)) {
      return
    }

    initialEventsProcessedRef.current = true

    const selected = buildInitialSelected(defaultValue, data, entity)
    applyChangeEventsRef.current?.(selected)
  }, [
    applyChangeEventsRef,
    buildInitialSelected,
    data,
    defaultValue,
    entity,
    isInitialReady,
    props.field,
    props.value,
  ])

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = getValue(event, props.field)

      if (
        shouldSkipChange({
          shouldSkipOnChange,
          hasClickable,
          inputValue,
          valueRef,
        })
      ) {
        return
      }

      onValueChangeRef.current?.(inputValue)
      if (props.config.validation.change) {
        validated(inputValue)
      }

      if (props.field.event?.change) {
        dispatchChange({
          applyChangeEventsRef,
          data,
          entity,
          inputValue,
          setTimeoutRef,
        })
      }
    },
    [
      applyChangeEventsRef,
      data,
      dispatchChange,
      entity,
      getValue,
      hasClickable,
      onValueChangeRef,
      props.config.validation.change,
      props.field,
      setTimeoutRef,
      shouldSkipChange,
      shouldSkipOnChange,
      validated,
      valueRef,
    ]
  )

  return renderIfExists(props.config.inputs[props.field.type], (Component) => (
    <InputGroup
      config={props.config}
      context={props.context}
      field={props.field}
      horizontal={props.horizontal}
      translations={props.translations}
    >
      <Component
        {...commonPropsWithOptions}
        {...props.ariaAttributes}
        {...props.dataAttributes}
        {...extraProps}
        {...inputProps}
        onBlur={onBlur}
        onChange={onChange}
      />
    </InputGroup>
  ))
}
