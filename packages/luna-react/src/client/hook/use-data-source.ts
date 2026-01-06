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
  const [data] = useFetch(currentSource, config, field.disabled)

  return [data, setSource] as const
}
