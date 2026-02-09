import { expect, test } from '@playwright/test'
import { translate } from '@/packages/luna-core/src/util/translate'

test.describe('Translate Helper', { tag: ['@unit'] }, () => {
  test('should return an empty string if no key is provided', () => {
    expect(translate()).toBe('')
  })

  test('should return the key if no dictionary is provided', () => {
    expect(translate('hello')).toBe('hello')
  })

  test('should return the translated value if the key exists in the dictionary', () => {
    const dictionary = { hello: 'hola', world: 'mundo' }
    expect(translate('hello', dictionary)).toBe('hola')
    expect(translate('world', dictionary)).toBe('mundo')
  })

  test('should return the key if the key is not in the dictionary', () => {
    const dictionary = { hello: 'hola' }
    expect(translate('unknown', dictionary)).toBe('unknown')
  })
})
