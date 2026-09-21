import { useAtomValue } from 'jotai'
import { useEntryAtom } from './use-entry-atom'
import { valueAtom } from '../lib/value-store'

/**
 * Resolves the display value for a field by checking its reported
 * atom value first, then falling back to an initial value.
 */
export function useResolvedValue(name: string, initialValue?: unknown) {
  const atomValue = useAtomValue(useEntryAtom(valueAtom, name))
  return atomValue ?? initialValue
}
