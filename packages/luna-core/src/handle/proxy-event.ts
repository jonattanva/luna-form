import { SOURCE, VALUE } from '../util/constant'
import type { ChangeEvent, SourceEvent, ValueEvent } from '../type'

export function handleProxyEvent(
  events: ChangeEvent = [],
  callback: (props: { sources: SourceEvent[]; values: ValueEvent[] }) => void
) {
  const values: ValueEvent[] = []
  const sources: SourceEvent[] = []

  events.forEach((event) => {
    if (event.action === VALUE) {
      values.push(event)
    }

    if (event.action === SOURCE) {
      sources.push(event)
    }
  })

  callback({ sources, values })
}
