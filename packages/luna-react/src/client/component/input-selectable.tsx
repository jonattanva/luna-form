import { createInput } from './input-create'
import { getEntity, isOptions, isValidValue } from '@luna-form/core'
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

export const InputSelectable = createInput({
  useSource: useSelectableSource,

  getValue: (event) => event.target.value,

  shouldSkipChange: ({ shouldSkipOnChange, hasClickable }) =>
    !hasClickable && shouldSkipOnChange(),

  dispatchChange: ({ applyChangeEventsRef, data, entity, inputValue }) => {
    applyChangeEventsRef.current?.(getEntity(inputValue, data, entity))
  },

  buildInitialSelected: (defaultValue, data, entity) =>
    getEntity(String(defaultValue), data, entity),

  isInitialReady: (field, defaultValue, data) =>
    (!isOptions(field) || (!!data && data.length > 0)) &&
    isValidValue(defaultValue),
})
