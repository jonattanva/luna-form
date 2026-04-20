import { reportSourceAtom } from '../lib/source-store'
import { useSetAtom } from 'jotai'
import type { DataSource, Field, Nullable } from '@luna-form/core'

export function useWriteOnlySource(field: Field): {
  data: Nullable<unknown[]>
  setSource: (target: string, source?: DataSource) => void
} {
  const setSource = useSetAtom(reportSourceAtom(field.name))
  return { data: null, setSource }
}
