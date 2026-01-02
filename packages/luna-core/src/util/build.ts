import { $REF, HORIZONTAL, VERTICAL } from './constant'
import { isObject } from './is-type'
import { isCheckbox, isRadio, isSelect } from './is-input'
import type { Field } from '../type'

export function buildOptions(
  field: Field,
  values: Record<string, unknown> = {}
) {
  if (isSelect(field) && field.disabled) {
    const current = field.name ? values[field.name] : undefined
    if (current && isObject(current)) {
      return [current]
    }
  }
}

export function buildOrientation(field: Field) {
  if (isRadio(field) || isCheckbox(field)) {
    return HORIZONTAL
  }
  return field.advanced?.orientation ?? VERTICAL
}

export function buildDisabled(field: Field, disabled?: boolean) {
  const readonly = field.readonly ?? false
  return disabled ? disabled : readonly
}

export function buildSource(field: Field) {
  if (isRadio(field) || (isSelect(field) && !field.disabled)) {
    const source = field.source
    if (Array.isArray(source) || (isObject(source) && !($REF in source))) {
      return source
    }
  }
}

export function buildFormData(form: Record<string, unknown>) {
  const formData = new FormData()
  for (const [key, value] of Object.entries(form)) {
    if (value !== null) {
      formData.append(key, String(value))
    }
  }
  return formData
}
