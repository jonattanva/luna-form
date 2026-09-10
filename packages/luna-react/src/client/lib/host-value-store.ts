import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'
import { resolveEntry } from './resolve-value'
import type { Nullable } from '@luna-form/core'

/**
 * The value the host holds, as one entry rather than as a record every field
 * has to be handed.
 *
 * Prop-drilling the whole record meant every field's props changed whenever
 * any field's value did, so a keystroke re-rendered the form end to end and
 * nothing downstream could be memoized. Here the record lands once and each
 * field subscribes to its own key.
 */
const hostValue = atom<Nullable<Record<string, unknown>>>(null)

export const hostValueAtom = hostValue

/**
 * Says a path is not in the record at all, which is a different answer from a
 * path holding nothing -- a host is free to carry an empty value on purpose,
 * and `useValue` treats the two differently. See `resolveEntry`.
 *
 * A sentinel rather than the `{ found, value }` pair `resolveEntry` returns,
 * and that is the whole reason this exists: a fresh object every recompute
 * would be a new value to every subscriber on every write, so every field
 * would re-render exactly as it does today. What a subscriber gets back has to
 * be something `Object.is` can settle, or jotai has nothing to bail out on.
 */
const MISSING = Symbol('host-value-missing')

/**
 * One field's entry in that record.
 *
 * Keyed by the name the record actually uses -- the POSITIONAL one. A leaf
 * inside a list is named after its row's stable id, and the two diverge the
 * moment a non-tail row is removed, so the caller translates before it
 * subscribes. That translation lives in a React context, which an atom cannot
 * read; doing it at the call site is what keeps this correct where a memo
 * comparator could not be. See `ListPathContext`.
 *
 * Not released the way the per-name families in `store-helper` are, and it does
 * not need to be for the same reason it is keyed this way: a position is reused
 * where a stable id only ever climbs, so the keys here are bounded by the
 * widest the form has ever been rather than by every row it has ever held.
 * Measured going 1 -> 20 -> 14 -> 20 rows: the released families fall back to
 * 23 and this one stays at 29, its high-water mark. Worth knowing before
 * someone reads the absence of a release as an oversight.
 */
/** What the host says about one field, with the sentinel already read. */
export type HostEntry = {
  /** The host names this field. A field it does not name reads `undefined`. */
  found: boolean
  value: unknown
}

export function readHostEntry(entry: unknown): HostEntry {
  return entry === MISSING
    ? { found: false, value: undefined }
    : { found: true, value: entry }
}

export const hostEntryAtom = atomFamily((name: string) =>
  atom((get) => {
    const current = get(hostValue)
    if (!current) {
      return MISSING
    }

    const entry = resolveEntry(name, current)
    return entry.found ? entry.value : MISSING
  })
)
