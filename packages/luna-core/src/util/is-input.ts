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
import { isString } from './is-type'
import type { Column, Field, Input, Select, Value } from '../type'

export const isSelectMonth = (field: Field): boolean =>
  createTypeChecker(SELECT_MONTH)(field)

export const isSelectYear = (field: Field): boolean =>
  createTypeChecker(SELECT_YEAR)(field)

export const isCheckbox = createTypeChecker<Input>(CHECKBOX)
export const isInput = createTypeChecker<Input>(INPUT)
export const isRadio = createTypeChecker<Select>(RADIO)
export const isSelect = createTypeChecker<Select>(SELECT)
export const isTextArea = createTypeChecker<Input>(TEXTAREA)
export const isText = createTypeChecker<Input>(
  TYPE_TEXT,
  TYPE_EMAIL,
  TYPE_PASSWORD,
  TYPE_TEL
)

export const isEmail = createTypeChecker<Input>(INPUT_EMAIL, TYPE_EMAIL)
export const isNumber = createTypeChecker<Input>(INPUT_NUMBER, TYPE_NUMBER)

export function isSelector(slot: Field): boolean {
  return isSelect(slot) || isRadio(slot) || isCheckbox(slot)
}

export function isColumn(slot: Field | Column): slot is Column {
  return slot.type === COLUMN
}

export function isField(slot: Field | Column): slot is Field {
  return slot.type !== COLUMN
}

export function isOptions(field: Field): field is Input {
  return isSelect(field) || isRadio(field)
}

export function isValidValue(value?: Value): boolean {
  return value !== undefined && value !== null && value !== ''
}

function createTypeChecker<T extends Field>(
  ...types: string[]
): (field: Field) => field is T {
  return (field): field is T => {
    const inputType = isString(field.type) ? field.type : undefined
    if (!inputType) {
      return false
    }

    return types.some((type) => {
      return inputType === type || inputType?.startsWith(`${type}/`)
    })
  }
}
