import { COLUMN } from './constant'
import { extract } from './extract'
import { isColumn, isList } from './is-input'
import { isRows } from './is-type'
import type { Field, Fields, List, Nullable } from '../type'

function getInitialCount(
  list: List,
  value?: Nullable<Record<string, unknown>>
): number {
  const min = list.advanced?.length?.min ?? 1

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
// it is rows, not a value. `getNestedLists` is the lookup for the other
// question.
export function flattenListFields(fields: Fields): Record<string, Field> {
  const out: Record<string, Field> = {}
  for (const row of fields) {
    if (isColumn(row)) {
      for (const child of row.fields) {
        if (!isList(child)) {
          out[child.name] = child
        }
      }
    } else if (!isList(row)) {
      out[row.name] = row
    }
  }
  return out
}

/**
 * The names a row's leaves answer to, in the order they are declared.
 *
 * Columns are walked through rather than treated as a leaf: a column is a
 * layout, so what it holds belongs to the row just as much as a field declared
 * beside it. Same rule `flattenListFields` follows, which is where a leaf's
 * definition is looked up; this is the half that only needs the names, and it
 * is what keys a list's values in the flat store.
 */
export function getListLeafNames(list: List): string[] {
  const names: string[] = []
  for (const slot of list.fields) {
    if (isColumn(slot)) {
      for (const child of slot.fields) {
        names.push(child.name)
      }
    } else {
      names.push(slot.name)
    }
  }
  return names
}

/**
 * The leaves of a row that are lists in their own right, by the name they
 * answer to.
 *
 * A leaf like that is not a value and cannot be written like one: its values
 * live one level deeper and its row count is state inside the component that
 * renders it. So whoever assigns a row has to tell the two apart, and this is
 * the question they ask.
 */
export function getNestedLists(list: List): Record<string, List> {
  const out: Record<string, List> = {}
  for (const slot of list.fields) {
    if (isColumn(slot)) {
      for (const child of slot.fields) {
        if (isList(child)) {
          out[child.name] = child
        }
      }
    } else if (isList(slot)) {
      out[slot.name] = slot
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
  const min = list.advanced?.length?.min ?? 1
  const max = list.advanced?.length?.max ?? Infinity
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
  const nested = getNestedLists(list)
  const leafNames = getListLeafNames(list)
  const count = getAssignedCount(list, rows.length)

  const value: Array<Record<string, unknown>> = []

  for (let index = 0; index < count; index++) {
    const row = rows[index]
    const item: Record<string, unknown> = {}

    for (const name of leafNames) {
      const inner = nested[name]
      const leaf = row?.[name]

      item[name] = inner
        ? normalizeListRows(inner, isRows(leaf) ? leaf : [])
        : leaf
    }

    value.push(item)
  }

  return value
}
