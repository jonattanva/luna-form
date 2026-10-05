import { createInput } from './input-create'
import { deepEqual } from 'fast-equals'
import { toChangeValue } from './input-strategies'
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

    // A time is read off the native control's `HH:mm`. Anything that is not
    // text is no time this can read: it goes back untouched rather than let
    // `String()` turn it into one nobody entered.
    if (isTime(field)) {
      return isString(raw) ? fromNativeTime(raw, getTimeFormat(field)) : raw
    }

    // A day is held as `yyyy-MM-dd`, whether a calendar picked it or a person
    // typed it in the field's format, and a range as `[from, to]`. See
    // `holdValue`.
    return holdValue(field, raw)
  },

  // A range is an array, so the same two days are equal, not identical.
  shouldSkipChange: ({ shouldSkipOnChange, inputValue, valueRef }) =>
    shouldSkipOnChange() && deepEqual(inputValue, valueRef.current),

  dispatchChange: ({ applyChangeEventsRef, inputValue, setTimeoutRef }) => {
    setTimeoutRef(() => {
      applyChangeEventsRef.current({ value: inputValue })
    }, 300)
  },

  buildInitialSelected: (defaultValue) => ({
    value: toChangeValue(defaultValue),
  }),

  isInitialReady: (_field, defaultValue) => isValidValue(defaultValue),
})
