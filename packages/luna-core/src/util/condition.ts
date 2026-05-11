import { VALUE } from './constant'
import { extract } from './extract'
import { isBoolean, isObject, isString } from './is-type'
import { operators } from './operator'
import type { Condition, Nullable } from '../type'

export function evaluateCondition<T>(
  selected: T,
  when?: string | string[] | Condition
): boolean {
  if (when === undefined) {
    return true
  }

  if (isString(when)) {
    return getValue(selected, VALUE) === when
  }

  if (isBoolean(when)) {
    return Boolean(getValue(selected, VALUE)) === when
  }

  if (Array.isArray(when)) {
    return when.includes(String(getValue(selected, VALUE)))
  }

  return evaluateOperator(selected, when)
}

function evaluateOperator<T>(
  selected: Nullable<T> = null,
  condition: Condition
) {
  const current = getValue(selected, condition.field ?? VALUE)
  const { operator = 'eq', value } = condition

  const operation = operators[operator]
  if (operation) {
    return operation(current, value)
  }

  return false
}

function getValue<T>(selected: T, field: string): unknown {
  if (isObject(selected)) {
    return extract(selected, field)
  }
  return selected
}
