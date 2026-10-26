import {
  ARIA_ERROR_MESSAGE,
  ARIA_INVALID,
  ARIA_LABEL,
  ARIA_LABELLEDBY,
  PREFIX_ARIA,
  PREFIX_DATA,
} from './constant'
import { entries } from './prepare'
import type { Field } from '../type'

function getPrefixedAttributes(
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

// The id of the label a field renders, which `InputGroup` draws only for a
// field with both a name and a label.
export function getLabelId(field: Field) {
  return field.name && field.label ? `${field.name}-label` : undefined
}

export function buildAriaAttributes(field: Field, errors?: string[]) {
  const ariaAttributes = getAriaAttributes(field.advanced?.aria)

  // A `<label for>` names only an element it can label, which a component
  // drawn as a group of buttons does not have. Pointing at the label names
  // whatever element the component puts this on, and says the same as the
  // `for` everywhere else. A name `advanced.aria` gives is the author's.
  const labelId = getLabelId(field)
  if (
    labelId &&
    !(ARIA_LABEL in ariaAttributes) &&
    !(ARIA_LABELLEDBY in ariaAttributes)
  ) {
    ariaAttributes[ARIA_LABELLEDBY] = labelId
  }

  if (errors && errors.length > 0) {
    ariaAttributes[ARIA_INVALID] = 'true'
    ariaAttributes[ARIA_ERROR_MESSAGE] = `${field.name}-error`
  }

  return ariaAttributes
}

export function buildDataAttributes(field: Field) {
  return getDataAttributes(field.advanced?.data)
}
