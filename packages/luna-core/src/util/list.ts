import { COLUMN } from './constant'
import { extract } from './extract'
import { isColumn, isList } from './is-input'
import { isRows } from './is-type'
import type { AnyField, Field, Fields, List, Nullable } from '../type'

/**
 * How few and how many rows a list will show.
 *
 * The defaults are here rather than at each reading, because they are read at
 * mount, on every add and remove, and on assignment -- four chances for one of
 * them to say a list shows one row by default and another to say none.
 */
export function getListBounds(list: List): { min: number; max: number } {
  return {
    min: list.advanced?.length?.min ?? 1,
    max: list.advanced?.length?.max ?? Infinity,
  }
}

/**
 * Every leaf of a row, in the order it is declared.
 *
 * A column is walked through rather than counted as one: it is a layout, so
 * what it holds belongs to the row just as much as a field declared beside it.
 * That rule is written down once here because three questions are asked of the
 * same walk -- what a leaf's definition is, what names a row owns in the flat
 * store, and which of those leaves are lists rather than values -- and three
 * copies of it drift the moment one of them learns about a new kind of slot.
 *
 * A nested list is one of the leaves. It is not a value and is not stored like
 * one, so a caller that only handles values has to say `isList` and skip it.
 */
export function getListLeaves(fields: Fields): Array<AnyField | List> {
  const leaves: Array<AnyField | List> = []
  for (const slot of fields) {
    if (isColumn(slot)) {
      for (const child of slot.fields) {
        leaves.push(child)
      }
    } else {
      leaves.push(slot)
    }
  }
  return leaves
}

function getInitialCount(
  list: List,
  value?: Nullable<Record<string, unknown>>
): number {
  const { min } = getListBounds(list)

  if (value) {
    const data = extract(value, list.name)
    if (Array.isArray(data)) {
      return Math.max(data.length, min)
    }
  }
  return Math.max(min, 0)
}

export function isMultiFieldList(list: List): boolean {
  if (!Array.isArray(list.fields) || list.fields.length === 0) {
    return false
  }
  return list.fields.length > 1 || list.fields[0].type === COLUMN
}

export function getInitialList(
  list: List,
  value?: Nullable<Record<string, unknown>>
) {
  const count = getInitialCount(list, value)
  return Array.from({ length: count }, (_, index) => index)
}

export function getLabel(list: List): string {
  return list.advanced?.title ?? list.label ?? list.name
}

// A nested list is left out on purpose: the one caller looks a leaf up to ask
// what its options are for rendering a preview of it, and a list has none --
// it is rows, not a value.
export function flattenListFields(fields: Fields): Record<string, Field> {
  const out: Record<string, Field> = {}
  for (const leaf of getListLeaves(fields)) {
    if (!isList(leaf)) {
      out[leaf.name] = leaf
    }
  }
  return out
}

/**
 * How many rows a list shows when it is handed `length` of them.
 *
 * A list never shows fewer than `min`, so a short assignment leaves the
 * remainder standing and empty -- the same thing `getInitialCount` does with a
 * short `value` prop at mount -- and never more than `max`, the ceiling adding
 * a row already respects.
 */
export function getAssignedCount(list: List, length: number): number {
  const { min, max } = getListBounds(list)
  return Math.min(Math.max(length, min), max)
}

/**
 * The rows an assignment is worth, as the list will hold them.
 *
 * Every leaf spelled in and the ones the row left out `undefined`, the count
 * clamped by `getAssignedCount`. That is the shape a list is read back out
 * with, so an assignment can be compared against what is already there without
 * one of them being different merely for having been written rather than read.
 *
 * A leaf that is a list of its own is normalised the same way one level down,
 * against its own fields and its own `min`/`max`. That recursion is the whole
 * point: an assignment used to stop at the row, creating it and dropping
 * everything inside it, because a row's inner rows were never anybody's to
 * write. A leaf pointed at a nested list without rows to give it is read as
 * none, which empties it rather than leaving somebody else's rows behind.
 */
export function normalizeListRows(
  list: List,
  rows: Array<Record<string, unknown>>
): Array<Record<string, unknown>> {
  const leaves = getListLeaves(list.fields)
  const count = getAssignedCount(list, rows.length)

  const value: Array<Record<string, unknown>> = []

  for (let index = 0; index < count; index++) {
    const row = rows[index]
    const item: Record<string, unknown> = {}

    for (const leaf of leaves) {
      const current = row?.[leaf.name]

      item[leaf.name] = isList(leaf)
        ? normalizeListRows(leaf, isRows(current) ? current : [])
        : current
    }

    value.push(item)
  }

  return value
}
