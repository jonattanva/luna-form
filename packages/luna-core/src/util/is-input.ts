import {
  CHECKBOX,
  COLUMN,
  INPUT,
  INPUT_EMAIL,
  INPUT_NUMBER,
  RADIO,
  SELECT,
  SELECT_MONTH,
  SELECT_YEAR,
  TEXTAREA,
  TYPE_EMAIL,
  TYPE_NUMBER,
  TYPE_PASSWORD,
  TYPE_TEL,
  TYPE_TEXT,
} from './constant'
import type { Column, Field, Input, Select, Value } from '../type'
import { isString } from './is-type'

export function isSelectMonth(field: Field): boolean {
  return field.type === SELECT_MONTH
}

export function isSelectYear(field: Field): boolean {
  return field.type === SELECT_YEAR
}

export function isOptions(field: Field): field is Input {
  return isSelect(field) || isRadio(field)
}

export const isCheckbox = createTypeChecker<Input>(CHECKBOX)
export const isInput = createTypeChecker<Input>(INPUT)
export const isRadio = createTypeChecker<Select>(RADIO)
export const isSelect = createTypeChecker<Select>(SELECT)

export function isColumn(slot: Field | Column): slot is Column {
  return slot.type === COLUMN
}

export function isField(slot: Field | Column): slot is Field {
  return slot.type !== COLUMN
}

export function isTextArea(field: Field): field is Input {
  return field.type === TEXTAREA
}

export function isText(field: Field): field is Input {
  return (
    field.type === TYPE_TEXT ||
    field.type === TYPE_EMAIL ||
    field.type === TYPE_PASSWORD ||
    field.type === TYPE_TEL
  )
}

export function isNumber(field: Field): field is Input {
  return field.type === INPUT_NUMBER || field.type === TYPE_NUMBER
}

export function isEmail(field: Field): field is Input {
  return field.type === INPUT_EMAIL || field.type === TYPE_EMAIL
}

function createTypeChecker<T extends Field>(
  type: string
): (field: Field) => field is T {
  return (field): field is T => {
    const inputType = isString(field.type) ? field.type : undefined
    if (inputType) {
      return inputType === type || inputType?.startsWith(`${type}/`)
    }
    return false
  }
}

export function isValidValue(value?: Value): boolean {
  return value !== undefined && value !== null && value !== ''
}
