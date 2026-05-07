import { interpolate } from '../util/string'
import { isEmpty } from '../util/is-type'
import type { Nullable, ValueEvent } from '../type'

export function handleValueEvent<T>(
  selected: Nullable<T> = null,
  events: ValueEvent[] = [],
  setValue: (name: string, resolve: (current: unknown) => unknown) => void
) {
  for (const event of events) {
    for (const [target, value] of Object.entries(event.value)) {
      setValue(target, (current) => {
        if (event.onlyIfTargetEmpty && !isEmpty(current)) {
          return current
        }
        return selected ? interpolate(value, selected) : undefined
      })
    }
  }
}
