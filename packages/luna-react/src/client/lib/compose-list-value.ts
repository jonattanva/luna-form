import { resolveValue } from './resolve-value'
import type { MountedList } from './list-store'
import type { Nullable } from '@luna-form/core'

// Every key a list owns in the flat value atom: its name, the row's stable id,
// the leaf's name. Built in seeding, reading, removing and assigning, which is
// three places too many for a template literal to be retyped correctly each
// time.
export function itemKey(
  listName: string,
  stableId: number,
  leafName: string
): string {
  return `${listName}.${stableId}.${leafName}`
}

/**
 * The three places a leaf can be found, declared in the order they are tried.
 *
 * They travel together because they are one thing -- where values come from --
 * and because none of them changes as `composeListValue` descends: only the
 * list being read does. Passing them as one argument is what keeps the
 * recursion from carrying the same three the whole way down.
 */
export type ValueSources = {
  /**
   * The lists on screen, by name, already read out of the store.
   *
   * The record rather than a lookup function, on purpose: reading the atom per
   * leaf instead of once per call cost more than everything else here put
   * together (46.59us against 13.80us for ten groups of five rules). Reading
   * it once is also no less correct -- this traversal is synchronous, so there
   * is no point at which the registry could change underneath it.
   */
  mounted: Record<string, MountedList>

  /** The flat value atom, keyed by stable id. */
  values: Record<string, unknown>

  /** The value the list was mounted with, if it had one. */
  initial?: Nullable<Record<string, unknown>>
}

/**
 * Reads a list back out of the flat value atom, as the rows a consumer is
 * given.
 *
 * A leaf is looked for in the three places `ValueSources` names, in that
 * order, and the order is the point:
 *
 * 1. A list mounted under that name. It is the only thing that knows which of
 *    its rows are live and in what order, so it is asked first even when the
 *    atom holds something there -- what the atom holds is the value the
 *    document was loaded with, seeded once at mount, and the list has been
 *    edited since.
 * 2. The atom, keyed by stable id. Where edited and seeded leaves live, and
 *    where a nested list that is currently collapsed -- unmounted, so unable
 *    to answer for itself -- is still readable as its seeded value.
 * 3. The value the list was mounted with, by the same stable-id path. Never
 *    the live value prop: the consumer compacts the array it is emitted, so
 *    after a row is removed from the middle it can no longer be indexed by
 *    stable id at all.
 *
 * Recurses through (1), so a list nested two deep reads back the same way.
 *
 * @param listName - The list's name, already carrying its ancestors' stable
 *   ids (`rules.0.rule`), which is what makes the keys unambiguous.
 */
export function composeListValue(
  listName: string,
  { items, leafNames }: MountedList,
  sources: ValueSources
): Array<Record<string, unknown>> {
  const { initial, mounted, values } = sources

  return items.map((stableId) => {
    const item: Record<string, unknown> = {}

    for (const name of leafNames) {
      const key = itemKey(listName, stableId, name)
      const nested = mounted[key]

      if (nested) {
        item[name] = composeListValue(key, nested, sources)
        continue
      }

      const stored = values[key]
      item[name] =
        stored !== undefined
          ? stored
          : initial
            ? resolveValue(key, initial)
            : undefined
    }

    return item
  })
}
