import { atom } from 'jotai'
import { createAtomStore } from './store-helper'

const store = createAtomStore<unknown>()

export const valueAtom = store.atom
export const clearAllValueAtom = store.clearAll
export const clearInputValueAtom = store.clear
export const reportValueAtom = store.report

// What a `value` change event has delivered to each target, and what it still
// owes one. Both are keyed by the target rather than by the source that
// produced them, because they describe the target: more than one source can
// point at the same field, and the field that receives an auto-fill is
// rendered by a different component than the one that sends it.
//
// Plain atoms rather than `createAtomStore`: only the record itself is ever
// read or written, and the family of per-name atoms that helper also builds
// would be dead weight in the bundle.

// The last value the auto-fill wrote to a target. Tells "still mirroring its
// source" apart from "the user has taken this field over", which emptiness
// cannot: a target carrying a transform is non-empty from the source's very
// first keystroke.
export const appliedAutoFillAtom = atom<Record<string, unknown>>({})

// A delivery held back because the caret was inside the target when it came
// due, released when the field is left. See `use-input-core`.
//
// One at a time, not a record: only one field can hold the caret, so only one
// delivery can ever be waiting on it.
export const pendingAutoFillAtom = atom<{
  target: string
  value: unknown
} | null>(null)
