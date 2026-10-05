import { createInput } from './input-create'
import { useWriteOnlySource } from '../hook/use-write-only-source'
import {
  fromNativeTime,
  getTimeFormat,
  holdValue,
  isString,
  isTime,
  isValidValue,
} from '@luna-form/core'

export const InputDateable = createInput({
  useSource: useWriteOnlySource,

  getValue: (event, field) => {
    const raw = event.target.value

    // Both conversions below read text: the native control's (`yyyy-MM-dd`,
    // `HH:mm`) or what a person typed. A date or time field holds one moment
    // and never a list, so anything that is not text is not a date this can
    // read: hand it back untouched rather than let `String()` turn it into a
    // date nobody entered.
    if (!isString(raw)) {
      return raw
    }

    const timeFormat = isTime(field) ? getTimeFormat(field) : null

    if (timeFormat !== null) {
      return fromNativeTime(raw, timeFormat)
    }

    // A day is held as `yyyy-MM-dd`, whether a calendar picked it or a person
    // typed it in the field's format. See `holdValue`.
    return holdValue(field, raw)
  },

  shouldSkipChange: ({ shouldSkipOnChange, inputValue, valueRef }) =>
    shouldSkipOnChange() && inputValue === valueRef.current,

  dispatchChange: ({ applyChangeEventsRef, inputValue, setTimeoutRef }) => {
    setTimeoutRef(() => {
      applyChangeEventsRef.current({ value: inputValue })
    }, 300)
  },

  buildInitialSelected: (defaultValue) => ({ value: String(defaultValue) }),

  isInitialReady: (_field, defaultValue) => isValidValue(defaultValue),
})
