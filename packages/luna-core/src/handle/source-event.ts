import { interpolate } from '../util/string'
import { isDataSource } from '../util/is-type'
import type { DataSource, Nullable, SourceEvent } from '../type'

export function handleSourceEvent<T>(
  selected: Nullable<T> = null,
  events: SourceEvent[] = [],
  setSource: (name: string, source?: DataSource) => void
) {
  for (const event of events) {
    const { target, source } = event

    if (!selected) {
      setSource(target, undefined)
      continue
    }

    if (isDataSource(source)) {
      const newUrl = interpolate(source.url, selected)
      const newBody = source.body
        ? interpolate(source.body, selected)
        : source.body

      setSource(target, {
        ...source,
        url: newUrl,
        body: newBody,
      })
    }
  }
}
