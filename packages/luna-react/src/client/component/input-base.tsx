import { FieldDescription } from './field-description'
import { InputGroup } from '../../component/input-group'
import { renderIfExists } from '../../lib/render-If-exists'
import { useCallback } from 'react'
import { useInputCore, type InputCoreProps } from '../hook/use-input-core'
import { useValue } from '../hook/use-value'
import { useLatest } from '../hook/use-latest'
import { useRegisterApply, type ApplyOptions } from '../hook/use-apply'
import { useReplayedChangeEvents } from '../hook/use-replayed-change-events'
import { deepEqual } from 'fast-equals'
import { useSetAtom, useStore } from 'jotai'
import { touchAtom, valueAtom } from '../lib/value-store'
import {
  applyTransformToChange,
  flattenOptions,
  isDateRange,
  isInput,
  isString,
  isValidValue,
  prepareInputProps,
  prepareInputValue,
  transformCaret,
  type Field,
  type Nullable,
  type Value,
} from '@luna-form/core'
import {
  toChangeValue,
  type InputChangeEvent,
  type InputStrategies,
} from './input-strategies'

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

  const {
    hostFound,
    hostValue,
    setValue,
    shouldSkipOnChange,
    takeHostChange,
    value,
  } = useValue(props.field)
  const {
    data,
    fetching = false,
    setSource,
    isStaticSource,
  } = useSource(props.field, props.config, value)

  const {
    applyChangeEventsRef,
    applyStateEventsRef,
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
  const store = useStore()
  const touch = useSetAtom(touchAtom)

  // Withheld when a `source` change event swapped the schema's array for a
  // remote DataSource: the fetched labels are data, not authored copy.
  const { commonPropsWithOptions, defaultValue } = prepareInputProps(
    props.field,
    commonProps,
    {
      data,
      translations: isStaticSource
        ? props.localization?.translations
        : undefined,
      value,
    }
  )

  const inputProps = prepareInputValue(props.field, defaultValue)
  // The text the control holds before a change, which a transform leaves alone.
  const shownRef = useLatest(isString(defaultValue) ? defaultValue : undefined)

  // Disabled or read-only, the field is locked, and the value is the form's to
  // keep: a component that does not honour `disabled` -- a calendar button left
  // enabled -- can still send a change, and the form does not take it.
  const locked = Boolean(commonPropsWithOptions.disabled)

  // The change events at mount, and the `state` rules again for a value the
  // host puts in later. After `useValue`, whose effect notices the host's.
  const markReplayed = useReplayedChangeEvents(props.field, {
    applyChangeEventsRef,
    applyStateEventsRef,
    buildInitialSelected,
    data,
    entity,
    getField,
    hostFound,
    hostValue,
    isInitialReady,
    takeHostChange,
  })

  // A change to the field, whoever makes it: the control's `onChange`, or a
  // value an agent writes from outside (`apply` is set, see
  // `useRegisterApply`), which hands the value in the control's own shape and
  // goes through every step a person's change does, and reaches the consumer
  // as the agent's. `true` when the field holds the value afterwards.
  const change = useCallback(
    (event: InputChangeEvent, apply?: ApplyOptions) => {
      if (locked) {
        return false
      }

      const inputValue = getValue(event, props.field)

      // A value written from outside is never the echo of the host's own
      // write, which is all `shouldSkipOnChange` recognises: consuming it here
      // would drop the write and leave the echo it waits for unskipped.
      if (
        shouldSkipChange({
          field: props.field,
          shouldSkipOnChange: apply ? isNoEcho : shouldSkipOnChange,
          hasClickable,
          inputValue,
          valueRef,
        })
      ) {
        return deepEqual(inputValue, valueRef.current)
      }

      // Written again from outside, the value the field holds changes nothing,
      // and runs its events no second time. What it holds is read from the
      // store, not from the last render: a submit that just succeeded has
      // emptied the store already, and the field still shows what it sent.
      if (
        apply &&
        deepEqual(inputValue, store.get(valueAtom)[props.field.name])
      ) {
        return true
      }

      // A value written from outside replaces the whole text, so its
      // transform rewrites all of it, not only what differs from the text the
      // control showed last.
      const shown = apply ? undefined : shownRef.current
      keepCaret(event.target, props.field, shown)
      onValueChangeRef.current(inputValue, apply ? 'agent' : 'user', shown)
      if (!apply) {
        touch(props.field.name)
      }
      if (apply?.validate ?? props.config.validation.change) {
        validated(inputValue)
      }

      // The user's change runs the events, so there is nothing left for the
      // mount-time run to do -- and a field that mounted empty has now been
      // through them, which is what lets a value the host puts back later
      // undo what this change revealed.
      markReplayed()

      // Written from outside, the events run on the next task rather than
      // once the typing stops: there is no typing to wait for. Still through
      // the timer, so a change that follows clears the one before it.
      if (props.field.event?.change) {
        dispatchChange({
          applyChangeEventsRef,
          data,
          entity,
          inputValue,
          setTimeoutRef: apply?.immediate
            ? (callback) => setTimeoutRef(callback, 0)
            : setTimeoutRef,
        })
      }

      return true
    },
    [
      applyChangeEventsRef,
      data,
      dispatchChange,
      entity,
      getValue,
      hasClickable,
      locked,
      markReplayed,
      onValueChangeRef,
      props.config.validation.change,
      props.field,
      setTimeoutRef,
      shouldSkipChange,
      shouldSkipOnChange,
      shownRef,
      store,
      touch,
      validated,
      valueRef,
    ]
  )

  const onChange = useCallback(
    (event: InputChangeEvent) => {
      change(event)
    },
    [change]
  )

  // The options the control was handed: the definition's, the fetched ones, or
  // the ones a `source` event installed.
  const options =
    'options' in commonPropsWithOptions &&
    Array.isArray(commonPropsWithOptions.options)
      ? commonPropsWithOptions.options
      : undefined

  useRegisterApply(
    props.field.name,
    {
      change,
      fetching,
      locked,
      options: () => options && flattenOptions(options),
      // What the field holds, checked as leaving it checks it, and shown when
      // the form shows errors before a submit.
      validate: () =>
        validated(
          isValidValue(valueRef.current) ? toChangeValue(valueRef.current) : '',
          props.config.validation.blur || props.config.validation.change
        ),
    },
    props.onRegisterApply
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
        localization={props.localization}
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

// What `change` hands a strategy for a value written from outside: no echo to
// skip.
function isNoEcho() {
  return false
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

// `advanced.transform` rewrites what the user types or pastes, and leaves the
// rest of the text as it was (`applyTransformToChange`). A control whose value
// changes under it puts the caret at the end, so the next key would land there.
// Writing the rewritten text here, with the caret after what the user typed,
// leaves the field rendering the text the control already holds, and React
// does not touch the control.
//
// `email` and `number` controls report no caret, and are left as they were.
function keepCaret(
  target: InputChangeEvent['target'],
  field: Field,
  shown: string | undefined
) {
  if (!isInput(field) || !(target instanceof HTMLInputElement)) {
    return
  }

  const transform = field.advanced?.transform
  const caret = target.selectionStart
  if (!transform || caret === null) {
    return
  }

  const rewritten = String(
    applyTransformToChange(shown, target.value, transform)
  )
  if (rewritten === target.value) {
    return
  }

  const position = transformCaret(shown, target.value, caret, transform)
  target.value = rewritten
  target.setSelectionRange(position, position)
}
