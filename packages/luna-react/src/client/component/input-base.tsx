import { InputGroup } from '../../component/input-group'
import { renderIfExists } from '../../lib/render-If-exists'
import { resolveValue } from '../lib/resolve-value'
import { useCallback, useEffect, useRef } from 'react'
import { useInputCore, type InputCoreProps } from '../hook/use-input-core'
import { useValue } from '../hook/use-value'
import {
  isValidValue,
  prepareInputProps,
  prepareInputValue,
} from '@luna-form/core'
import type { InputChangeEvent, InputStrategies } from './input-strategies'

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
  const { data, setSource, isStaticSource } = useSource(
    props.field,
    props.config,
    value
  )

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

  const { getSchema } = props

  const extraProps = useExtraProps?.(props.field)

  const initialEventsProcessedRef = useRef(false)

  // Withheld when a `source` change event swapped the schema's array for a
  // remote DataSource: the fetched labels are data, not authored copy.
  const { commonPropsWithOptions, defaultValue } = prepareInputProps(
    props.field,
    commonProps,
    data,
    value,
    isStaticSource ? props.translations : undefined
  )

  const inputProps = prepareInputValue(props.field, defaultValue)

  useEffect(() => {
    const hasInitialSource =
      !!props.value || isValidValue(props.field.defaultValue)

    if (initialEventsProcessedRef.current || !hasInitialSource) {
      return
    }

    if (!props.field.event?.change) {
      initialEventsProcessedRef.current = true
      return
    }

    const resolvedValue = props.value
      ? resolveValue(props.field.name, props.value)
      : undefined

    const hydratedValue = isValidValue(resolvedValue)
      ? resolvedValue
      : props.field.defaultValue

    if (!isValidValue(hydratedValue)) {
      return
    }

    if (!isInitialReady(props.field, hydratedValue, data)) {
      return
    }

    initialEventsProcessedRef.current = true

    const selected = buildInitialSelected(hydratedValue, data, entity)

    // Handed to a microtask instead of run here, because what these events
    // write is addressed to *other* fields and this effect runs while those
    // are still mounting. Two things go wrong when it runs too early, and
    // only for the actions that write somewhere -- `value` and `source`,
    // which is why a `state` reveal looks fine while the field beside it
    // comes up empty:
    //
    // - the target is not in the schema yet, so `applyAutoFill` finds no
    //   field to name it by and the consumer is never told what was written.
    //   A controlled form then holds a value its host does not have, and the
    //   next value it is fed takes it away again.
    // - whatever was written into a target that mounts later is cleared by
    //   that target's own unmount (a row toggling, a step left behind,
    //   React's double-invoke in development) and nothing replays it: this
    //   effect has already marked itself done.
    //
    // A microtask runs once the commit has flushed every effect, so the form
    // is whole by the time the events go out -- and still before the browser
    // paints, so nothing is visible in between.
    queueMicrotask(() => {
      // Gone before the microtask ran. `onUnmount` took the field out of the
      // schema and its value with it, and an event sent on its behalf now
      // would write into a form that no longer has it.
      const [, fields] = getSchema()
      if (!fields.some((field) => field.name === props.field.name)) {
        return
      }

      applyChangeEventsRef.current?.(selected)
    })
  }, [
    applyChangeEventsRef,
    buildInitialSelected,
    data,
    entity,
    getSchema,
    isInitialReady,
    props.field,
    props.value,
  ])

  const onChange = useCallback(
    (event: InputChangeEvent) => {
      const inputValue = getValue(event, props.field)

      if (
        shouldSkipChange({
          field: props.field,
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
