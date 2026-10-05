import { interpolate, type InterpolateOptions } from '../util/string'
import { isDataSource } from '../util/is-type'
import type { DataSource, Nullable, SourceEvent } from '../type'

// `options` carries the form's language, which a filter in the url or the
// body formats with.
export function handleSourceEvent<T>(
  selected: Nullable<T> = null,
  events: SourceEvent[] = [],
  setSource: (name: string, source?: DataSource) => void,
  options?: InterpolateOptions
) {
  for (const event of events) {
    const { target, source } = event

    if (!selected) {
      setSource(target, undefined)
      continue
    }

    if (isDataSource(source)) {
      const newUrl = interpolate(source.url, selected, options)
      const newBody = source.body
        ? interpolate(source.body, selected, options)
        : source.body

      setSource(target, {
        ...source,
        url: newUrl,
        body: newBody,
      })
    }
  }
}
