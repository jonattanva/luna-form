import { $REF } from './constant'
import { describeBounds, isUnreadableLength, type BoundRules } from './date'
import { isObject } from './is-type'
import { isCheckbox, isChips, isList, isRadio, isSelect } from './is-input'
import { logger } from './logger'
import type { Field, Input, List, Nullable, Select } from '../type'

export function buildOptions(
  field: Field,
  values: Nullable<Record<string, unknown>> = {}
) {
  if (isSelect(field) && field.disabled) {
    const current = field.name ? values?.[field.name] : undefined
    if (current && isObject(current)) {
      return [current]
    }
  }
}

// A radio and a checkbox are horizontal whatever the schema says: the control
// belongs beside its label. Every other field answers with what it declares,
// and with `undefined` when it declares nothing -- that is what lets
// `config.style.horizontal` decide instead. Returning `false` here made the
// field overrule the form-wide default in every form that never mentioned it.
export function buildOrientation(field: Field) {
  if (isRadio(field) || isCheckbox(field)) {
    return true
  }
  return field.advanced?.horizontal
}

export function buildReverse(field: Field): boolean {
  if (!isCheckbox(field)) {
    return false
  }
  return field.advanced?.reverse !== false
}

// Whether a field can be edited. `field.disabled` is what the field says about
// itself: its declaration, or on the client the `disabled` a `state` event put
// in its place. `disabled` is the lock the form puts on every field, its
// `readOnly`, and it only ever adds one: a form that is not read-only leaves
// each field to its own. A read-only field is locked as well.
export function buildDisabled(field: Field, disabled?: boolean) {
  return Boolean(disabled || field.disabled || field.readonly)
}

// Locked the way a disabled field is, but still the form's: a read-only field
// is submitted, where a disabled one is not. `buildDisabled` answers whether it
// can be edited; this answers whether its value still travels. Disabled wins
// when a field is both, as it does in HTML.
export function buildReadOnly(field: Field, disabled?: boolean) {
  return Boolean(field.readonly) && !disabled && !field.disabled
}

// The step a number moves by, read the way the browser reads it: a number above
// 0. Anything else -- 0, a negative, text, no step at all -- is the browser's
// default of 1, a whole number. The input renders this and the schema validates
// it, so its arrows and what it accepts never disagree.
export function buildNumberStep(input: Input) {
  const step = input.advanced?.step
  if (typeof step === 'number' && Number.isFinite(step) && step > 0) {
    return step
  }
  return undefined
}

export type LengthLimits = Readonly<{
  max?: number
  min?: number
  // A bound the field declares that is no number: a `$ref` the host did not
  // resolve, or text such as a day. The form cannot tell what such a field
  // allows, so it takes nothing: on a server that forgot its `context`, taking
  // everything would let through what the bound was there to keep out, with
  // nothing in production to say so.
  unreadable: boolean
}>

const NO_LENGTH: LengthLimits = { unreadable: false }

// Read once per declaration, as a date's limits are: the form reads them on
// every render, and the form copies a field but never its `advanced`.
const readLengths = new WeakMap<object, LengthLimits>()

/**
 * The bounds `advanced.length` gives a field outside the date family, both
 * included: how many characters a text takes, the lowest and the highest
 * number, how few and how many rows a list holds. Each is a number, or a
 * `$ref` the host resolved to one.
 *
 * Read once for the props the field renders and for the schema that checks
 * it, so the two cannot disagree: a bound that is no number is never rendered,
 * and the schema holds back what it would have checked, the way a date does
 * with a bound that is no day. It is the one place they are read, on the
 * server and in the browser, so it is where such a bound is named for whoever
 * wrote the form.
 */
export function buildLengthLimits(field: Input | List): LengthLimits {
  const advanced = field.advanced
  if (!isObject(advanced)) {
    return NO_LENGTH
  }

  const known = readLengths.get(advanced)
  if (known) {
    return known
  }

  const length: unknown = advanced.length
  const declared = isObject(length) ? length : undefined
  const bounds = {
    max: readLength(declared?.max),
    min: readLength(declared?.min),
  }
  const limits: LengthLimits = {
    ...bounds,
    unreadable: isUnreadableLength(length, bounds),
  }
  readLengths.set(advanced, limits)

  const rules = isList(field) ? LIST_BOUNDS : FIELD_BOUNDS
  for (const problem of describeBounds(field.name, length, limits, rules)) {
    logger.warn(problem)
  }

  return limits
}

// A bound is a number. Text that reads as one, such as "3", is not: the
// contract keeps one type per key.
function readLength(value: unknown): number | undefined {
  return typeof value === 'number' && !Number.isNaN(value) ? value : undefined
}

const FIELD_BOUNDS: BoundRules = {
  disordered: 'no value passes',
  kind: 'number',
  lost: 'the field takes no value',
  needsBoth: false,
}

const LIST_BOUNDS: BoundRules = {
  disordered: 'no list passes',
  kind: 'number',
  lost: 'no list passes',
  needsBoth: false,
}

export function buildSource(field: Field) {
  if (isValid(field)) {
    const source = field.source
    if (Array.isArray(source) || (isObject(source) && !($REF in source))) {
      return source
    }
  }
}

// True only when the schema declares its options inline as an array. Remote
// sources, unresolved `$ref`s and the disabled-select fallback (which returns
// form data, not schema) are all excluded, so callers can use this to tell
// author-written labels apart from fetched data.
export function isArraySource(field: Field): boolean {
  return Array.isArray(buildSource(field))
}

// A disabled select fetches nothing, so a remote source gives way to the
// fallback in `buildOptions`, the value it holds. Options declared inline need
// no fetch: they stay, and a locked select still names what it holds.
function isValid(field: Field): field is Select {
  if (isSelect(field)) {
    return !field.disabled || Array.isArray(field.source)
  }
  return isRadio(field) || isChips(field)
}
