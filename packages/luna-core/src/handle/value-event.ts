import { interpolate } from '../util/string'
import type { Nullable, ValueEvent } from '../type'

export function handleValueEvent<T>(
  selected: Nullable<T> = null,
  events: ValueEvent[] = [],
  setValue: (name: string, value: unknown) => void
) {
  for (const event of events) {
    for (const [target, value] of Object.entries(event.value)) {
      setValue(target, selected ? interpolate(value, selected) : undefined)
    }
  }
}
