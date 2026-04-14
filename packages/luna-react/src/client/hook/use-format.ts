import {
  getDateFormat,
  getTimeFormat,
  isDate,
  isTime,
  type Field,
} from '@luna-form/core'

export function useFormat(field: Field) {
  const dateFormat = isDate(field) ? getDateFormat(field) : null
  const timeFormat = isTime(field) ? getTimeFormat(field) : null

  return {
    dateFormat,
    timeFormat,
  }
}
