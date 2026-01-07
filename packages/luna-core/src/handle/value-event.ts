import { interpolate } from '../util/string'
import type { Nullable, ValueEvent } from '../type'

export function handleValueEvent<T>(
  selected: Nullable<T> = null,
  events: ValueEvent[] = [],
  setValue: (name: string, value: unknown) => void
) {
  events.forEach((event) => {
    Object.entries(event.value).forEach(([target, value]) => {
      setValue(target, selected ? interpolate(value, selected) : undefined)
    })
  })
}
