import {
  ARIA_ERROR_MESSAGE,
  ARIA_INVALID,
  PREFIX_ARIA,
  PREFIX_DATA,
} from './constant'
import { entries } from './prepare'
import type { AriaAttributes, DataAttributes, Field } from '../type'

export function getPrefixedAttributes(
  prefix: string,
  record?: Record<string, string | number | boolean>
) {
  const attrs: Record<string, string | number | boolean> = {}
  for (const [key, value] of entries(record)) {
    attrs[`${prefix}-${key}`] = value
  }
  return attrs
}

export function getAriaAttributes(
  record?: Record<string, string | number | boolean>
) {
  return getPrefixedAttributes(PREFIX_ARIA, record)
}

export function getDataAttributes(
  record?: Record<string, string | number | boolean>
) {
  return getPrefixedAttributes(PREFIX_DATA, record)
}

export function buildAriaAttributes(field: Field, errors?: string[]) {
  const ariaAttributes = getAriaAttributes(
    field.advanced?.aria
  ) as AriaAttributes

  if (errors && errors.length > 0) {
    ariaAttributes[ARIA_INVALID] = 'true'
    ariaAttributes[ARIA_ERROR_MESSAGE] = `${field.name}-error`
  }

  return ariaAttributes
}

export function buildDataAttributes(field: Field) {
  return getDataAttributes(field.advanced?.data) as DataAttributes
}
