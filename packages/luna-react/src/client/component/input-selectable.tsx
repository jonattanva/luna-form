import { createInput } from './input-create'
import { deepEqual } from 'fast-equals'
import {
  getEntity,
  isMultiple,
  isOptions,
  isSelect,
  isValidValue,
} from '@luna-form/core'
import { useDataSource } from '../hook/use-data-source'
import type { Config } from '../../type'
import type { Field, Nullable, Value } from '@luna-form/core'

function useSelectableSource(
  field: Field,
  config: Config,
  value?: Nullable<Record<string, unknown>>
) {
  const [data, setSource, isStaticSource] = useDataSource(field, config, value)
  return { data, setSource, isStaticSource }
}

// Radix (and similar components) re-emit onChange("") when a select trigger
// remounts (e.g. a collapsible list item toggling its React `Activity`). An
// empty string is never a real selection for a select field, so skip it to
// avoid wiping an already-selected value.
//
// Deliberately `select` only, and deliberately the empty *string* only. A
// `chips` field emits `[]` for "nothing is selected any more", which is the
// user unpicking the last chip and has to travel: it is what re-hides a target
// a `when` had revealed. Reading an empty array as this same remount noise
// would make deselection the one change a chips field cannot report.
export function isEmptySelectChange(field: Field, inputValue: Value): boolean {
  return isSelect(field) && inputValue === ''
}

export const InputSelectable = createInput({
  useSource: useSelectableSource,

  getValue: (event) => event.target.value,

  shouldSkipChange: ({
    field,
    shouldSkipOnChange,
    hasClickable,
    inputValue,
    valueRef,
  }) =>
    isEmptySelectChange(field, inputValue) ||
    (!hasClickable &&
      shouldSkipOnChange() &&
      // `!inputValue` catches the empty *scalar* a control echoes back right
      // after a programmatic write. An array is always truthy and falls
      // through to `deepEqual`, which is the right test for it anyway: an
      // emptied chips field is only an echo when what it held was already
      // empty, and `deepEqual([], [])` says so.
      (!inputValue || deepEqual(inputValue, valueRef.current))),

  dispatchChange: ({ applyChangeEventsRef, data, entity, inputValue }) => {
    applyChangeEventsRef.current?.(getEntity(inputValue, data, entity))
  },

  // What the mount-time replay hands to the change events, and it has to be
  // the same thing `dispatchChange` hands them: a form reopened on saved data
  // reveals what it revealed when it was filled in. A `chips` value is an array
  // and travels as one -- `String()` on it joins the selections into
  // "email,sms", which answers to no option and matches no `when`. Everything
  // else is a scalar the collection is keyed by as text: a numeric option value
  // is found by "1", not by 1.
  buildInitialSelected: (defaultValue, data, entity) =>
    getEntity(
      isMultiple(defaultValue) ? defaultValue : String(defaultValue),
      data,
      entity
    ),

  isInitialReady: (field, defaultValue, data) =>
    (!isOptions(field) || (!!data && data.length > 0)) &&
    isValidValue(defaultValue),
})
