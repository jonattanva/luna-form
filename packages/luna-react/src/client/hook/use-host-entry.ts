import {
  hostEntryAtom,
  readHostEntry,
  type HostEntry,
} from '../lib/host-value-store'
import { ListPathContext } from '../context/list-path-context'
import { use, useCallback } from 'react'
import { useAtomValue, useStore } from 'jotai'

/**
 * The name the host's record actually uses.
 *
 * A leaf inside a list is named after its row's stable id, while the record is
 * positional, and the two part company the moment a non-tail row is removed.
 * The translation lives in a context, so it has to happen where a context is in
 * scope -- which is why two earlier attempts, resolving the entry inside a
 * `memo` comparator, both ended with a field showing another row's value.
 */
function useTranslatedName(name: string): string {
  const translateListPath = use(ListPathContext)
  return translateListPath(name)
}

/**
 * What the host says about one field. Re-renders this field when its own entry
 * changes, and only then.
 */
export function useHostEntry(name: string): HostEntry {
  const translated = useTranslatedName(name)
  return readHostEntry(useAtomValue(hostEntryAtom(translated)))
}

/**
 * The same answer, read at the moment it is asked rather than at the moment the
 * component rendered.
 *
 * For a reader that decides once and marks itself done. The store is written
 * from the form's effect, and a parent's effects run after its children's, so a
 * child asking during its own effect is always one commit behind. Asking from
 * the microtask that follows the commit is not: every effect in that commit has
 * run by then, the form's write included.
 */
export function useHostEntryReader(name: string): () => HostEntry {
  const translated = useTranslatedName(name)
  const store = useStore()

  // Stable, so an effect can depend on it without re-running every render.
  return useCallback(
    () => readHostEntry(store.get(hostEntryAtom(translated))),
    [store, translated]
  )
}
