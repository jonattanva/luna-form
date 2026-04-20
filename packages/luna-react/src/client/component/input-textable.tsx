import { createInput } from './input-create'
import { isValidValue } from '@luna-form/core'
import { useWriteOnlySource } from '../hook/use-write-only-source'

export const InputTextable = createInput({
  useSource: useWriteOnlySource,

  getValue: (event) => event.target.value,

  shouldSkipChange: ({ shouldSkipOnChange, inputValue, valueRef }) =>
    shouldSkipOnChange() && inputValue === valueRef.current,

  dispatchChange: ({ applyChangeEventsRef, inputValue, setTimeoutRef }) => {
    setTimeoutRef(() => {
      applyChangeEventsRef.current?.({ value: inputValue })
    }, 300)
  },

  buildInitialSelected: (defaultValue) => ({ value: String(defaultValue) }),

  isInitialReady: (_field, defaultValue) => isValidValue(defaultValue),
})
