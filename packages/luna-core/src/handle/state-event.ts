import { extract } from '../util/extract'
import { isObject, isString } from '../util/is-type'
import type { Condition, FieldState, Nullable, StateEvent } from '../type'

type Value = string | number | string[]

export function handleStateEvent<T>(
  selected: Nullable<T> = null,
  events: StateEvent[] = [],
  setState: (name: string, state?: FieldState) => void
) {
  events.forEach((event) => {
    const { target, state, when } = event

    if (!selected) {
      setState(target)
      return
    }

    const matches = evaluateCondition(selected, when)
    setState(target, matches ? state : undefined)
  })
}

function evaluateCondition<T>(
  selected: T,
  when?: string | string[] | Condition
): boolean {
  if (when === undefined) {
    return true
  }

  if (isString(when)) {
    return getValue(selected, 'value') === when
  }

  if (Array.isArray(when)) {
    const current = getValue(selected, 'value')
    return when.includes(String(current))
  }

  return evaluateOperator(selected, when)
}

function evaluateOperator<T>(
  selected: Nullable<T> = null,
  condition: Condition
) {
  const current = getValue(selected, condition.field ?? 'value')
  const { operator = 'eq', value } = condition

  const operation = operators[operator]
  if (operation) {
    return operation(current, value)
  }

  return false
}

const operators: Record<string, (current: unknown, value: Value) => boolean> = {
  eq,
  neq,
  in: includes,
  nin,
}

function eq(current: unknown, value: Value): boolean {
  return current === value
}

function neq(current: unknown, value: Value): boolean {
  return current !== value
}

function includes(current: unknown, value: Value): boolean {
  return Array.isArray(value) && value.includes(String(current))
}

function nin(current: unknown, value: Value): boolean {
  return Array.isArray(value) && !value.includes(String(current))
}

function getValue<T>(selected: T, field: string): unknown {
  if (isObject(selected)) {
    return field.includes('.') ? extract(selected, field) : selected[field]
  }
  return selected
}
