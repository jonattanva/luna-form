import { SOURCE } from '../util/constant'
import { interpolate } from '../util/string'
import { isDataSource } from '../util/is-type'
import type { ChangeEvent, DataSource, Nullable } from '../type'

export function handleSourceEvent(
  selected: Nullable<Record<string, unknown>> = null,
  changes: ChangeEvent = [],
  setSource: (name: string, source: Nullable<DataSource>) => void
) {
  changes
    .filter((event) => event.action === SOURCE)
    .forEach((event) => {
      const { target, source } = event

      if (!selected) {
        setSource(target, null)
        return
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
    })
}
