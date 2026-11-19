import { describe, expect, test } from 'vitest'
import { resolveTarget } from '@/packages/luna-core/src/util/path'

describe('resolveTarget', () => {
  test('returns a target without a list name as is', () => {
    expect(resolveTarget('note', 'items.2.flag')).toBe('note')
    expect(resolveTarget('order.note', 'items.2.flag')).toBe('order.note')
  })

  test('resolves a row-relative target to the row of the source', () => {
    expect(resolveTarget('items/note', 'items.2.flag')).toBe('items.2.note')
  })

  test('keeps the path of a list nested under a group', () => {
    expect(resolveTarget('items/note', 'order.items.1.flag')).toBe(
      'order.items.1.note'
    )
  })

  test('reads a dotted list name as its segments', () => {
    expect(resolveTarget('order.lines/qty', 'order.lines.2.price')).toBe(
      'order.lines.2.qty'
    )
  })

  test('prefers a row at the start of the name, else the last row', () => {
    expect(resolveTarget('items/note', 'items.0.sub.items.3.flag')).toBe(
      'items.0.note'
    )
    expect(resolveTarget('items/note', 'a.items.0.sub.items.3.flag')).toBe(
      'a.items.0.sub.items.3.note'
    )
  })

  test('needs a field after the row index', () => {
    expect(resolveTarget('items/note', 'items.2')).toBe('note')
  })

  test('returns the field alone outside any row of the list', () => {
    expect(resolveTarget('items/note', 'flag')).toBe('note')
    expect(resolveTarget('items/note', 'xitems.0.flag')).toBe('note')
    expect(resolveTarget('items/note', 'items.first.flag')).toBe('note')
  })

  test('reads a list name with regular expression characters as written', () => {
    expect(resolveTarget('tags[]/label', 'tags[].0.flag')).toBe(
      'tags[].0.label'
    )
    expect(resolveTarget('items(1)/note', 'items(1).3.flag')).toBe(
      'items(1).3.note'
    )
    expect(resolveTarget('a+/b', 'a+.1.c')).toBe('a+.1.b')
  })

  test('does not read a dot in the list name as any character', () => {
    expect(resolveTarget('items/note', 'itemsX.0.flag')).toBe('note')
    expect(resolveTarget('order.lines/qty', 'orderXlines.2.price')).toBe('qty')
  })

  test('does not throw on a list name that is not a valid pattern', () => {
    expect(resolveTarget('a[/b', 'a[.0.c')).toBe('a[.0.b')
  })
})
