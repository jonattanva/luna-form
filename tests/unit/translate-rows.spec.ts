import { describe, expect, test } from 'vitest'
import { translateRows } from '@/packages/luna-react/src/client/lib/list-store'

describe('translateRows', () => {
  const mounted = { items: { items: [3, 1] } }

  test('should name a row by its id and by its position', () => {
    expect(translateRows('items.0.sku', mounted, 'id')).toBe('items.3.sku')
    expect(translateRows('items.3.sku', mounted, 'position')).toBe(
      'items.0.sku'
    )
  })

  test('should leave a name that is in no list as written', () => {
    expect(translateRows('plain.0', mounted, 'id')).toBe('plain.0')
  })

  // The lists on screen are a plain record: a name that starts with a member
  // every object inherits must not read that member as a list.
  test.each(['constructor.0', 'toString.1', 'hasOwnProperty.0.x'])(
    'should leave %s as written, as no list is there',
    (name) => {
      expect(translateRows(name, mounted, 'id')).toBe(name)
      expect(translateRows(name, mounted, 'position')).toBe(name)
    }
  )
})
