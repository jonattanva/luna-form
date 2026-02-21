import { VALUE } from '../util/constant'
import { extract } from '../util/extract'
import { isBoolean, isObject, isString } from '../util/is-type'
import { operators } from '../util/operator'
import type { Condition, FieldState, Nullable, StateEvent } from '../type'

export function handleStateEvent<T>(
  selected: Nullable<T> = null,
  events: StateEvent[] = [],
  setState: (name: string[], state?: FieldState) => void
) {
  for (const event of events) {
    const { target, state, when } = event

    const targets = Array.isArray(target) ? target : [target]
    if (!selected) {
      setState(targets)
      continue
    }

    const matches = evaluateCondition(selected, when)
    setState(targets, matches ? state : undefined)
  }
}

function evaluateCondition<T>(
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
