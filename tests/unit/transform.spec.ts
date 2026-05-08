import { applyTransform } from '../../packages/luna-core/src/util/transform'
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
