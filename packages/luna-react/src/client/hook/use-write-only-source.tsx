import { SOURCE_OPTIONS, sourceAtom } from '../lib/source-store'
import { useContributionAtom } from './use-entry-atom'
import { useSetAtom } from 'jotai'
import type { DataSource, Field, Nullable } from '@luna-form/core'

export function useWriteOnlySource(field: Field): {
  data: Nullable<unknown[]>
  setSource: (target: string, source?: DataSource) => void
} {
  const setSource = useSetAtom(
    useContributionAtom(sourceAtom, field.name, SOURCE_OPTIONS)
  )
  return { data: null, setSource }
}
