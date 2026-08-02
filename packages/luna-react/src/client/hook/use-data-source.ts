import { reportSourceAtom } from '../lib/source-store'
import { resolveSource, type Field, type Nullable } from '@luna-form/core'
import { useAtom } from 'jotai'
import { useFetch } from './use-fetch'
import type { Config } from '../../type'

export function useDataSource(
  field: Field,
  config: Config,
  value?: Nullable<Record<string, unknown>>
) {
  const dataSource = resolveSource(field, value)
  const [source, setSource] = useAtom(reportSourceAtom(field.name))

  const currentSource = source ?? dataSource
  const data = useFetch(currentSource, config, field.disabled)

  // A `source` change event always installs a DataSource, so an array here
  // means the options still come from the array declared in the schema.
  const isStaticSource = Array.isArray(currentSource)

  return [data, setSource, isStaticSource] as const
}
