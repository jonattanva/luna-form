import { SOURCE, STATE, VALUE } from '../util/constant'
import type { ChangeEvent, SourceEvent, StateEvent, ValueEvent } from '../type'

export function handleProxyEvent(
  events: ChangeEvent = [],
  callback: (props: {
    sources: SourceEvent[]
    states: StateEvent[]
    values: ValueEvent[]
  }) => void
) {
  const values: ValueEvent[] = []
  const sources: SourceEvent[] = []
  const states: StateEvent[] = []

  events.forEach((event) => {
    if (event.action === VALUE) {
      values.push(event)
    }

    if (event.action === SOURCE) {
      sources.push(event)
    }

    if (event.action === STATE) {
      states.push(event)
    }
  })

  callback({ sources, states, values })
}
