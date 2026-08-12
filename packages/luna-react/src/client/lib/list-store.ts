import { createAtomStore } from './store-helper'

/**
 * Rows delivered to a list by a `value` change event, waiting for the list to
 * take them.
 *
 * A list is the one target that cannot be written where every other target is
 * written. Its values do not live under its own name -- they are flat keys of
 * the form `list.<stableId>.<leaf>` -- and how many rows there are is
 * `useState` inside the component that renders it. Nothing outside that
 * component can grow or shrink it, so the sender leaves the rows here and the
 * list applies them.
 *
 * Keyed by the list's name, one delivery each: the last one wins, because
 * `value` assigns rather than adds. Read through the family so that a delivery
 * to one list is not a re-render for every other.
 *
 * Same shape as `pendingAutoFillAtom` in `value-store`, and the same idea --
 * work handed to whoever owns the state -- but that one holds a single
 * delivery because only one field can hold the caret, while any number of
 * lists can be waiting at once.
 */
const pendingRows = createAtomStore<Array<Record<string, unknown>>>()

export const pendingListRowsAtom = pendingRows.atom
export const reportPendingListRowsAtom = pendingRows.report

/**
 * The lists currently on screen, by name.
 *
 * The sender has to know whether a target is a list before it can decide where
 * to put the value, and it cannot ask the schema: `onMount` is called from the
 * input path, so `getSchema` only ever knew about inputs -- a list is not in
 * there, only its leaves are.
 *
 * Guessing from the value instead does not work either. `Array<Record<string,
 * unknown>>` reads like rows, but an empty array is equally a chips field
 * being cleared, and that write must still reach the chips field.
 *
 * Only ever read with `store.get` from inside an event handler, so registering
 * costs nothing at render time.
 */
const mountedLists = createAtomStore<true>()

export const mountedListsAtom = mountedLists.atom
export const reportMountedListAtom = mountedLists.report
