import { evaluateCondition } from '../util/condition'
import type { FieldState, Nullable, StateEvent } from '../type'

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
