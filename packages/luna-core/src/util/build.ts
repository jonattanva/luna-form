import { $REF } from './constant'
import { isObject } from './is-type'
import { isCheckbox, isChips, isRadio, isSelect } from './is-input'
import type { Field, Nullable } from '../type'

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

export function buildDisabled(field: Field, disabled?: boolean) {
  const readonly = field.readonly ?? false
  return disabled ? disabled : readonly
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

function isValid(field: Field) {
  return (
    isRadio(field) || isChips(field) || (isSelect(field) && !field.disabled)
  )
}
