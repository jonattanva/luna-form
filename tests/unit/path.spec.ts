import { describe, expect, test } from 'vitest'
import { resolveTarget } from '@/packages/luna-core/src/util/path'

describe('resolveTarget', () => {
  test('should aim a row target at the row the change came from', () => {
    expect(resolveTarget('items/note', 'items.2.flag')).toBe('items.2.note')
  })

  // Audit BUG-02: the list name goes into a regular expression unescaped, so a
  // name such as `tags[]` matches nothing and the change lands on a top-level
  // `label` instead of the row's. Drop .fails once fixed.
  test.fails('should read a list name as written', () => {
    expect(resolveTarget('tags[]/label', 'tags[].0.flag')).toBe(
      'tags[].0.label'
    )
  })

  // Audit BUG-02: `a[` is not a valid regular expression. Drop .fails once
  // fixed.
  test.fails('should not throw on a list name that is no regex', () => {
    expect(() => resolveTarget('a[/b', 'a[.0.c')).not.toThrow()
  })
})
