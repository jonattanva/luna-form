import { createInput } from './input-create'
import { dispatchTypedChange, hasInitialValue } from './input-strategies'
import { useWriteOnlySource } from '../hook/use-write-only-source'

export const InputTextable = createInput({
  useSource: useWriteOnlySource,

  getValue: (event) => event.target.value,

  shouldSkipChange: ({ shouldSkipOnChange, inputValue, valueRef }) =>
    shouldSkipOnChange() && inputValue === valueRef.current,

  dispatchChange: dispatchTypedChange,

  buildInitialSelected: (defaultValue) => ({ value: String(defaultValue) }),

  isInitialReady: hasInitialValue,
})
