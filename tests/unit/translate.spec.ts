import { describe, expect, test } from 'vitest'
import {
  resolveDictionary,
  translate,
  translateOptional,
} from '@/packages/luna-core/src/util/translate'

describe('Translate Helper', () => {
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

describe('Translate Optional', () => {
  test('should return undefined when there is no value', () => {
    expect(translateOptional()).toBeUndefined()
    expect(translateOptional('')).toBeUndefined()
    expect(translateOptional(undefined, { hello: 'hola' })).toBeUndefined()
  })

  test('should keep undefined distinct from the empty string', () => {
    // The difference from `translate`, which collapses a missing key to ''.
    // Callers feed optional slots where the two are not interchangeable.
    expect(translate()).toBe('')
    expect(translateOptional()).toBeUndefined()
  })

  test('should return the value when there is no dictionary', () => {
    expect(translateOptional('hello')).toBe('hello')
  })

  test('should return the translation when the key exists', () => {
    expect(translateOptional('hello', { hello: 'hola' })).toBe('hola')
  })

  test('should return the value when the key is not in the dictionary', () => {
    expect(translateOptional('unknown', { hello: 'hola' })).toBe('unknown')
  })
})

describe('Resolve Dictionary', () => {
  test('should return the built-in dictionary when the form declares none', () => {
    expect(resolveDictionary('es')?.['(Optional)']).toBe('(Opcional)')
    expect(resolveDictionary('es')?.['Add item']).toBe('Añadir elemento')
    expect(resolveDictionary('es')?.Yes).toBe('Sí')
  })

  // The submit summary is copy no form can name in its schema, the same as
  // `(Optional)`: it is only reachable through the built-in dictionary.
  test('should return the built-in submit error summary', () => {
    const result = resolveDictionary('es')

    expect(result?.['There were validation errors submitting the form.']).toBe(
      'Se encontraron errores de validación al enviar el formulario.'
    )
    expect(result?.['Please correct the errors and try again.']).toBe(
      'Corrige los errores e inténtalo de nuevo.'
    )
    expect(result?.['An unexpected error occurred submitting the form.']).toBe(
      'Ocurrió un error inesperado al enviar el formulario.'
    )
  })

  test('should let the form override a built-in entry', () => {
    const result = resolveDictionary('es', {
      es: { 'Add item': 'Agregar contacto' },
    })

    expect(result?.['Add item']).toBe('Agregar contacto')
    // Entries the form left alone still come from the built-in dictionary.
    expect(result?.['(Optional)']).toBe('(Opcional)')
  })

  test('should apply the built-in dictionary to a regional tag', () => {
    expect(resolveDictionary('es-MX')?.['Add item']).toBe('Añadir elemento')
    expect(resolveDictionary('es_MX')?.['Add item']).toBe('Añadir elemento')
    expect(resolveDictionary('ES')?.['Add item']).toBe('Añadir elemento')
  })

  test('should match a form dictionary on the exact tag only', () => {
    // Authored lookup is unchanged from before the built-ins existed: an
    // `es-MX` form still has to key its own block by `es-MX`.
    expect(resolveDictionary('es-MX', { es: { hello: 'hola' } })?.hello).toBe(
      undefined
    )
    expect(
      resolveDictionary('es-MX', { 'es-MX': { hello: 'hola' } })?.hello
    ).toBe('hola')
  })

  test('should return the form dictionary for a language with no built-ins', () => {
    expect(resolveDictionary('ja', { ja: { hello: 'こんにちは' } })).toEqual({
      hello: 'こんにちは',
    })
  })

  test('should return undefined when neither side has entries', () => {
    expect(resolveDictionary('ja')).toBeUndefined()
    expect(resolveDictionary()).toBeUndefined()
    expect(
      resolveDictionary(undefined, { es: { hello: 'hola' } })
    ).toBeUndefined()
  })

  test('should never mutate the built-in dictionary', () => {
    resolveDictionary('es', { es: { 'Add item': 'Agregar contacto' } })
    expect(resolveDictionary('es')?.['Add item']).toBe('Añadir elemento')
  })

  // The result is a dependency of the per-field schema memo, so a needless new
  // object per call would rebuild every field's schema on every render. Only
  // the merge case has to allocate; these two paths must pass a reference
  // through untouched.
  test('should pass the form dictionary through by reference with no built-ins', () => {
    const authored = { hello: 'hola' }

    expect(resolveDictionary('ja', { ja: authored })).toBe(authored)
  })

  test('should return a stable reference when the form declares nothing', () => {
    expect(resolveDictionary('es')).toBe(resolveDictionary('es'))
    expect(resolveDictionary('es-MX')).toBe(resolveDictionary('es'))
  })
})
