import { FETCH } from '../util/constant'
import { interpolate } from '../helper/string'
import { isDataSource } from '../util/is-type'
import type { ChangeEvent, DataSource, Nullable } from '../type'

export function handleFetchEvent(
  selected: Nullable<Record<string, unknown>> = null,
  changes: ChangeEvent = [],
  setSource: (name: string, source: Nullable<DataSource>) => void
) {
  changes
    .filter((event) => event.action === FETCH)
    .forEach((event) => {
      const { target, source } = event

      if (!selected) {
        setSource(target, null)
        return
      }

      if (isDataSource(source)) {
        const newUrl = interpolate(source.url, selected)
        setSource(target, {
          ...source,
          url: newUrl,
        })
      }
    })
}
