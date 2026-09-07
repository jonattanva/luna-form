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
 * What a list on screen is holding: the stable ids of its live rows, in the
 * order they are shown, and the name of every leaf a row owns.
 *
 * Enough to read the list back out of the flat value atom, which is the whole
 * reason it is published. See `composeListValue`.
 */
export type MountedList = {
  items: readonly number[]
  leafNames: readonly string[]
  /**
   * The list's own `hidden`, as its definition declares it.
   *
   * Here rather than looked up, because there is nowhere to look it up: the
   * schema registry `getSchema` answers from is filled by `onMount` on the
   * input path, and a container never goes through it. That gap is what let a
   * list keep its values through a hide -- the branch that clears a target
   * reverting to its static hidden asked only that registry, found nothing,
   * and skipped the list, while an explicit `hidden: true` cleared it. Same
   * declaration, two outcomes. See `tests/e2e/hidden-clear.spec.ts`.
   *
   * A list that is not on screen has no entry, and that is the right answer
   * rather than a gap: the only target worth clearing is one that was showing.
   */
  hidden?: boolean
  /** The list's own `keepValue`, published for the same reason as `hidden`. */
  keepValue?: boolean
}

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
 * A list registers what it holds rather than a bare `true`, because a list
 * nested inside another one is the only thing that can say what its row is
 * worth. The parent sees the child's name among its own leaf names, but the
 * atom holds nothing under that name: the child's values are flat keys one
 * level deeper, and which of them are live, and in what order, is `useState`
 * inside the child. A parent with no way to ask rebuilt every such row as
 * `undefined` and handed that to the consumer to save -- which is how a
 * configured row was lost the moment its list was added to or removed from.
 *
 * Only ever read with `store.get` from inside an event handler, so registering
 * costs nothing at render time.
 */
const mountedLists = createAtomStore<MountedList>()

export const mountedListsAtom = mountedLists.atom
export const reportMountedListAtom = mountedLists.report
