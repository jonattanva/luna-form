import { createInput } from './input-create'
import { useFormat } from '../hook/use-format'
import { useWriteOnlySource } from '../hook/use-write-only-source'
import {
  fromNativeDate,
  fromNativeTime,
  getDateFormat,
  getFormatProps,
  getTimeFormat,
  isDate,
  isTime,
  isValidValue,
} from '@luna-form/core'

export const InputDateable = createInput({
  useSource: useWriteOnlySource,

  useExtraProps: (field) => {
    const { dateFormat, timeFormat } = useFormat(field)
    return getFormatProps(dateFormat, timeFormat)
  },

  getValue: (event, field) => {
    const raw = event.target.value
    const timeFormat = isTime(field) ? getTimeFormat(field) : null

    if (timeFormat !== null) {
      return fromNativeTime(raw, timeFormat)
    }

    const dateFormat = isDate(field) ? getDateFormat(field) : null
    if (dateFormat !== null) {
      const converted = fromNativeDate(raw, dateFormat)
      return converted || raw
    }

    return raw
  },

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
