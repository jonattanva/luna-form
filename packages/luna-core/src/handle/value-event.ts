import { interpolate } from '../util/string'
import type { Nullable, ValueEvent } from '../type'

export type ValueEventApply = (
  name: string,
  candidate: unknown,
  options: { onlyIfTargetEmpty: boolean }
) => void

// Iterates value events and produces, for each target, the candidate value
// the auto-fill would write (after interpolating the source). The decision
// to actually apply the candidate is delegated to the consumer via `apply`
// because that decision needs context the core layer does not have:
//   - The target may carry a `transform` pipeline that mutates the candidate
//     before it is compared to the current value (so the empty/touched check
//     must run against the post-transform value).
//   - `onlyIfTargetEmpty` is meant to protect user-typed values, but a target
//     with a transform is non-empty after the very first source keystroke;
//     the consumer needs its own "user-touched" tracking to decide whether
//     the current value belongs to the auto-fill or to the user.
export function handleValueEvent<T>(
  selected: Nullable<T> = null,
  events: ValueEvent[] = [],
  apply: ValueEventApply
) {
  for (const event of events) {
    for (const [target, value] of Object.entries(event.value)) {
      apply(
        target,
        selected ? interpolate(value, selected) : undefined,
        { onlyIfTargetEmpty: event.onlyIfTargetEmpty ?? false }
      )
    }
  }
}
