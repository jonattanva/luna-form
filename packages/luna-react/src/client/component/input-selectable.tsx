import { createInput } from './input-create'
import { deepEqual } from 'fast-equals'
import { getEntity, isOptions, isSelect, isValidValue } from '@luna-form/core'
import { useDataSource } from '../hook/use-data-source'
import type { Config } from '../../type'
import type { Field, Nullable } from '@luna-form/core'

function useSelectableSource(
  field: Field,
  config: Config,
  value?: Nullable<Record<string, unknown>>
) {
  const [data, setSource] = useDataSource(field, config, value)
  return { data, setSource }
}

// Radix (and similar components) re-emit onChange("") when a select trigger
// remounts (e.g. a collapsible list item toggling its React `Activity`). An
// empty string is never a real selection for a select field, so skip it to
// avoid wiping an already-selected value.
export function isEmptySelectChange(field: Field, inputValue: string): boolean {
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
      (!inputValue || deepEqual(inputValue, valueRef.current))),

  dispatchChange: ({ applyChangeEventsRef, data, entity, inputValue }) => {
    applyChangeEventsRef.current?.(getEntity(inputValue, data, entity))
  },

  buildInitialSelected: (defaultValue, data, entity) =>
    getEntity(String(defaultValue), data, entity),

  isInitialReady: (field, defaultValue, data) =>
    (!isOptions(field) || (!!data && data.length > 0)) &&
    isValidValue(defaultValue),
})
