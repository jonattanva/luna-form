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
    const current = getValue(selected, VALUE)
    if (Array.isArray(current)) {
      return current.length === 1 && current[0] === when
    }
    return current === when
  }

  if (isBoolean(when)) {
    const current = getValue(selected, VALUE)
    const truthy = Array.isArray(current) ? current.length > 0 : Boolean(current)
    return truthy === when
  }

  if (Array.isArray(when)) {
    const current = getValue(selected, VALUE)
    if (Array.isArray(current)) {
      return current.some((value) => when.includes(String(value)))
    }
    return when.includes(String(current))
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
