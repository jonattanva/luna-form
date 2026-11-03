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
   * schema registry `getField` answers from is filled by `onRegister` on the
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
  /**
   * The list's own `advanced.keepValue`, published for the same reason as
   * `hidden` and flattened on the way in: this registry answers about a list
   * that is on screen, not about the JSON that declared it.
   */
  keepValue?: boolean
}

/**
 * The lists currently on screen, by name.
 *
 * The sender has to know whether a target is a list before it can decide where
 * to put the value, and it cannot ask the schema: `onRegister` is called from
 * the input path, so the schema registry only ever knows about inputs -- a list
 * is not in there, only its leaves are.
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

/**
 * The stable ids of a list's rows, by the list's name, held for as long as the
 * values in those rows are.
 *
 * A list that keeps its value through a hide still loses its rows: their ids
 * are `useState`, and a hide unmounts it. What the rows held is still in the
 * value atom, keyed by those ids, and a list nested in one of the rows is named
 * after one of them -- so a list that came back numbering its rows afresh read
 * none of it, and showed no rows, or the row count of the value its own row was
 * mounted with, while the form went on reporting every row it had.
 *
 * Written while the list is on screen, by a list whose leaves keep their values
 * when it goes, and dropped by the clear that takes those values: a hide that
 * keeps nothing takes the ids with the values, under the same names. Written on
 * the way out it would come too late -- that clear runs before the unmount, and
 * the ids would be left standing over values that are gone.
 */
const heldRows = createAtomStore<readonly number[]>()

export const heldListRowsAtom = heldRows.atom
