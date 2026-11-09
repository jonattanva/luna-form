import {
  applyTransform,
  applyTransformToChange,
  transformCaret,
} from '../../packages/luna-core/src/util/transform'
import type { Transform } from '../../packages/luna-core/src/type'
import { describe, expect, it } from 'vitest'

describe('applyTransform', () => {
  it('should return original value if it is not a string', () => {
    expect(applyTransform(123, 'uppercase')).toBe(123)
    expect(applyTransform(null, 'uppercase')).toBe(null)
  })

  it('should return original value if it is an empty string', () => {
    expect(applyTransform('', 'uppercase')).toBe('')
  })

  it('should transform to uppercase', () => {
    expect(applyTransform('hello', 'uppercase')).toBe('HELLO')
  })

  it('should transform to lowercase', () => {
    expect(applyTransform('HELLO', 'lowercase')).toBe('hello')
  })

  it('should remove spaces', () => {
    expect(applyTransform('h e l l o', 'remove-space')).toBe('hello')
    expect(applyTransform('  hello  world  ', 'remove-space')).toBe(
      'helloworld'
    )
  })

  it('should remove accents', () => {
    expect(applyTransform('áéíóúÁÉÍÓÚñÑ', 'remove-accent')).toBe('aeiouAEIOUnN')
  })

  it('should apply multiple transforms in order', () => {
    // Accents removed then uppercase
    expect(applyTransform('áéíóú', ['remove-accent', 'uppercase'])).toBe(
      'AEIOU'
    )

    // Spaces removed then lowercase
    expect(applyTransform('HELLO WORLD', ['remove-space', 'lowercase'])).toBe(
      'helloworld'
    )

    // Combined multiple
    expect(
      applyTransform('  Café Olé  ', [
        'remove-accent',
        'remove-space',
        'lowercase',
      ])
    ).toBe('cafeole')
  })

  it('should handle single transform as an array', () => {
    expect(applyTransform('hello', ['uppercase'])).toBe('HELLO')
  })

  it('should return value as is if transform name is unknown', () => {
    expect(applyTransform('hello', 'unknown' as never)).toBe('hello')
  })

  it('should handle undefined or null transform gracefully', () => {
    expect(applyTransform('hello', null as never)).toBe('hello')
    expect(applyTransform('hello', undefined as never)).toBe('hello')
  })
})

// What a key field declares: the shape luna-flow's webhook gives a technical key.
const KEY: Transform[] = ['remove-space', 'lowercase', 'remove-accent']

describe('applyTransformToChange', () => {
  it('rewrites what was typed into a stored value, and leaves the rest', () => {
    expect(applyTransformToChange('customerEmail', 'customerEmailX', KEY)).toBe(
      'customerEmailx'
    )
  })

  it('rewrites what was typed in the middle, and keeps both sides', () => {
    expect(
      applyTransformToChange('customerEmail', 'customerPrimaryEmail', KEY)
    ).toBe('customerprimaryEmail')
  })

  it('leaves a stored value as it was once a letter is typed and erased', () => {
    expect(applyTransformToChange('customerEmailx', 'customerEmail', KEY)).toBe(
      'customerEmail'
    )
  })

  it('rewrites what is pasted over a selection', () => {
    expect(
      applyTransformToChange('customerEmail', 'customerHome Phone', KEY)
    ).toBe('customerhomephone')
  })

  it('drops an accent typed as a mark of its own', () => {
    expect(applyTransformToChange('cafe', 'cafe\u0301', KEY)).toBe('cafe')
  })

  it('rewrites the whole text when there was none before', () => {
    expect(applyTransformToChange(undefined, 'Customer Email', KEY)).toBe(
      'customeremail'
    )
    expect(applyTransformToChange('', 'Customer Email', KEY)).toBe(
      'customeremail'
    )
  })

  it('leaves what is not text, or has no transform, as it came', () => {
    expect(applyTransformToChange('customer', 12, KEY)).toBe(12)
    expect(applyTransformToChange('customer', 'customerX', undefined)).toBe(
      'customerX'
    )
  })
})

describe('transformCaret', () => {
  it('puts the caret after what was typed, once that is rewritten', () => {
    // `customer|Email`, then ` X`: the space goes, so the caret moves back one.
    expect(transformCaret('customerEmail', 'customer XEmail', 10, KEY)).toBe(9)
  })

  it('keeps a caret before what changed where it was', () => {
    expect(transformCaret('customerEmail', 'customer XEmail', 3, KEY)).toBe(3)
  })

  it('moves a caret after what changed by what the rewrite took away', () => {
    expect(transformCaret('customerEmail', 'customer XEmail', 15, KEY)).toBe(14)
  })

  it('counts the whole text as typed when there was none before', () => {
    expect(transformCaret(undefined, 'Customer Email', 14, KEY)).toBe(13)
  })
})
