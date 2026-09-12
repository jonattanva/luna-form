import { InputGroup } from '../../component/input-group'
import { renderIfExists } from '../../lib/render-If-exists'
import { useCallback, useEffect, useRef } from 'react'
import { useHostEntry, useHostEntryReader } from '../hook/use-host-entry'
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

  const { setValue, shouldSkipOnChange, value } = useValue(props.field)
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
  } = useInputCore(props, { setValue, value, setSource })

  const { getSchema } = props

  const extraProps = useExtraProps?.(props.field)

  const initialEventsProcessedRef = useRef(false)

  // Subscribed only to know when to look again: `found` flips once the host's
  // record names this field, and that is what re-runs the effect below.
  const { found: hostFound } = useHostEntry(props.field.name)
  const readHostEntry = useHostEntryReader(props.field.name)

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
    if (initialEventsProcessedRef.current) {
      return
    }

    // The whole decision runs in the microtask, not here, and that is the point
    // rather than a detail. This reader latches: it decides once and marks
    // itself done. The form writes the host's record from its own effect, and a
    // parent's effects run after its children's, so anything read at this line
    // is what the previous commit left -- and a decision made on it is made
    // against a value the host has already replaced. By the time the microtask
    // runs, every effect in this commit has run, the form's write included.
    //
    // It also runs once the commit has flushed, which is what the events
    // themselves need: what they write is addressed to other fields, and those
    // are still mounting while this effect runs. Both reasons want the same
    // place, so there is one hop, not two.
    queueMicrotask(() => {
      if (initialEventsProcessedRef.current) {
        return
      }

      const { found, value: hostValue } = readHostEntry()

      const hasInitialSource = found || isValidValue(props.field.defaultValue)
      if (!hasInitialSource) {
        return
      }

      if (!props.field.event?.change) {
        initialEventsProcessedRef.current = true
        return
      }

      const resolvedValue = found ? hostValue : undefined

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

      // Gone before the microtask ran. `onUnmount` took the field out of the
      // schema and its value with it, and an event sent on its behalf now
      // would write into a form that no longer has it.
      const [, fields] = getSchema()
      if (!fields.some((field) => field.name === props.field.name)) {
        return
      }

      applyChangeEventsRef.current?.(
        buildInitialSelected(hydratedValue, data, entity)
      )
    })
  }, [
    applyChangeEventsRef,
    buildInitialSelected,
    data,
    entity,
    getSchema,
    hostFound,
    isInitialReady,
    props.field,
    readHostEntry,
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
