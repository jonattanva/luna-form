import { isString } from './is-type'
import {
  CHECKBOX,
  CHIPS,
  CHIPS_DAYS,
  CHIPS_MONTHS,
  COLUMN,
  INPUT,
  INPUT_EMAIL,
  INPUT_NUMBER,
  INPUT_TIME,
  LIST,
  RADIO,
  SELECT,
  SELECT_DAY,
  SELECT_MONTH,
  SELECT_TIMEZONE,
  SELECT_YEAR,
  TEXTAREA,
  TYPE_EMAIL,
  TYPE_NUMBER,
  TYPE_PASSWORD,
  TYPE_TEL,
  TYPE_TEXT,
} from './constant'
import type {
  Chips,
  Column,
  Field,
  Input,
  List,
  Nullable,
  Select,
  Time,
} from '../type'

export const isSelectDay = (field: Field): boolean =>
  createTypeChecker(SELECT_DAY)(field)

export const isSelectMonth = (field: Field): boolean =>
  createTypeChecker(SELECT_MONTH)(field)

export const isSelectYear = (field: Field): boolean =>
  createTypeChecker(SELECT_YEAR)(field)

export const isSelectTimezone = (field: Field): boolean =>
  createTypeChecker(SELECT_TIMEZONE)(field)

export const isChipsDays = (field: Field): boolean =>
  createTypeChecker(CHIPS_DAYS)(field)

export const isChipsMonths = (field: Field): boolean =>
  createTypeChecker(CHIPS_MONTHS)(field)

export const isCheckbox = createTypeChecker<Input>(CHECKBOX)
export const isChips = createTypeChecker<Chips>(CHIPS)
export const isInput = createTypeChecker<Input>(INPUT)
export const isRadio = createTypeChecker<Select>(RADIO)
export const isSelect = createTypeChecker<Select>(SELECT)
export const isTextArea = createTypeChecker<Input>(TEXTAREA)
export const isTime = createTypeChecker<Time>(INPUT_TIME)
export const isText = createTypeChecker<Input>(
  TYPE_TEXT,
  TYPE_EMAIL,
  TYPE_PASSWORD,
  TYPE_TEL
)

export const isEmail = createTypeChecker<Input>(INPUT_EMAIL, TYPE_EMAIL)
export const isNumber = createTypeChecker<Input>(INPUT_NUMBER, TYPE_NUMBER)

export function isClickable(field: Field): boolean {
  return isRadio(field) || isCheckbox(field)
}

export function isList(slot: Field | Column | List): slot is List {
  return slot.type === LIST
}

export function isColumn(slot: Field | Column | List): slot is Column {
  return slot.type === COLUMN
}

export function isField(slot: Field | Column | List): slot is Field {
  return slot.type !== COLUMN && slot.type !== LIST
}

export function isOptions(field: Field): field is Select {
  return isSelect(field) || isRadio(field)
}

export function isTextable(field: Field): boolean {
  return isInput(field) || isTextArea(field)
}

export function isValidValue<T>(value?: Nullable<T>): boolean {
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
