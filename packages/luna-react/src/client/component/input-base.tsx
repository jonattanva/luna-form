import { FieldDescription } from './field-description'
import { InputGroup } from '../../component/input-group'
import { renderIfExists } from '../../lib/render-If-exists'
import { useCallback, useEffect, useRef } from 'react'
import { useHostEntry, useHostEntryReader } from '../hook/use-host-entry'
import { useInputCore, type InputCoreProps } from '../hook/use-input-core'
import { useValue } from '../hook/use-value'
import {
  holdValue,
  isDateRange,
  isValidValue,
  prepareInputProps,
  prepareInputValue,
  type Nullable,
  type Value,
} from '@luna-form/core'
import type { InputChangeEvent, InputStrategies } from './input-strategies'

export function InputBase(
  props: InputCoreProps & {
    strategies: InputStrategies
  }
) {
  const {
    useSource,
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

  const { getField } = props

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

  // Disabled or read-only, the field is locked, and the value is the form's to
  // keep: a component that does not honour `disabled` -- a calendar button left
  // enabled -- can still send a change, and the form does not take it.
  const locked = Boolean(commonPropsWithOptions.disabled)

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

      // Held the way the field holds it, so the events fired at mount see the
      // same shape as the ones fired once the user has typed.
      const hydratedValue = holdValue(
        props.field,
        isValidValue(resolvedValue) ? resolvedValue : props.field.defaultValue
      )

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
      if (!getField(props.field.name)) {
        return
      }

      applyChangeEventsRef.current(
        buildInitialSelected(hydratedValue, data, entity)
      )
    })
  }, [
    applyChangeEventsRef,
    buildInitialSelected,
    data,
    entity,
    getField,
    hostFound,
    isInitialReady,
    props.field,
    readHostEntry,
  ])

  const onChange = useCallback(
    (event: InputChangeEvent) => {
      if (locked) {
        return
      }

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

      onValueChangeRef.current(inputValue)
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
      locked,
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

  // The form sends what the field holds whenever the control cannot. A
  // read-only field is locked the one way every control understands, by being
  // disabled, and a disabled control sends nothing; one control cannot carry
  // the two ends of a range either. The value is still the form's, so the form
  // sends it: the control goes without a name, and what the field holds
  // travels in hidden inputs instead. Nothing the control renders is sent, so
  // no control can send it twice. A disabled range sends nothing, as any
  // disabled control, and its control has no name all the same: what it shows
  // is never the value.
  const isRange = isDateRange(props.field)
  const formSends = props.readOnly || (isRange && !locked)

  const controlProps =
    props.readOnly || isRange
      ? { ...commonPropsWithOptions, name: undefined }
      : commonPropsWithOptions

  return renderIfExists(props.config.inputs[props.field.type], (Component) => (
    <>
      <InputGroup
        config={props.config}
        context={props.context}
        description={FieldDescription}
        field={props.field}
        horizontal={props.horizontal}
        translations={props.translations}
      >
        {/* `advanced.data` first: an attribute the form writes for its own
            rules, such as a date's format, is the form's to say. */}
        <Component
          {...props.dataAttributes}
          {...controlProps}
          {...props.ariaAttributes}
          {...inputProps}
          onBlur={onBlur}
          onChange={onChange}
        />
      </InputGroup>
      {formSends && <SubmittedValue name={props.field.name} {...inputProps} />}
    </>
  ))
}

// What a read-only field submits: its value from the field's state, in the
// shape the control itself would have sent. That shape is `prepareInputValue`,
// the same one the control is handed: a checkbox as "true" or "false", chips as
// one entry each, and a date as `yyyy-MM-dd`, which the schema reads as it is.
function SubmittedValue(
  props: Readonly<{
    checked?: boolean
    name: string
    value?: Nullable<Value>
  }>
) {
  if (props.checked !== undefined) {
    return (
      <input name={props.name} type="hidden" value={String(props.checked)} />
    )
  }

  if (Array.isArray(props.value)) {
    return props.value.map((entry, index) => (
      <input
        key={index}
        name={props.name}
        type="hidden"
        value={String(entry)}
      />
    ))
  }

  return (
    <input
      name={props.name}
      type="hidden"
      value={props.value == null ? '' : String(props.value)}
    />
  )
}
