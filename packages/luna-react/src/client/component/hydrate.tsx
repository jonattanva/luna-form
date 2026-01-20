import { useHydrateAtoms } from 'jotai/utils'
import type { WritableAtom } from 'jotai'

export function Hydrate<T>(
  props: Readonly<{
    children?: React.ReactNode
    value: Iterable<readonly [WritableAtom<unknown, [T], unknown>, unknown]>
  }>
) {
  useHydrateAtoms(new Map(props.value))
  return props.children
}
