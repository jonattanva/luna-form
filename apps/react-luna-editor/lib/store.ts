import { useAtomValue } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useSyncExternalStore } from 'react'

// Read from `localStorage` as soon as the atom exists, not in an effect after
// the first render: a test injects the definition there before the page loads,
// and the first client render past hydration already has it.
export const codeAtom = atomWithStorage<string>(
  'luna-editor:code',
  '',
  undefined,
  { getOnInit: true }
)

const subscribe = () => () => {}

/**
 * The definition a preview renders, and whether it has been read. The server
 * cannot see `localStorage`, so it renders no form, and hydration has to
 * render what the server did. `read` is false until both are past: a preview
 * renders its form, and the Submit that sends it, only once it is true, so no
 * Submit can be clicked before the definition it submits.
 */
export function useDefinition(): { code: string; read: boolean } {
  const code = useAtomValue(codeAtom)
  const read = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
  return { code, read }
}
