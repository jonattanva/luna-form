import { reportValueAtom } from '../lib/value-store'
import { useAtomValue } from 'jotai'

/**
 * Resolves the display value for a field by checking its reported
 * atom value first, then falling back to an initial value.
 */
export function useResolvedValue(name: string, initialValue?: unknown) {
  const atomValue = useAtomValue(reportValueAtom(name))
  return atomValue ?? initialValue
}
