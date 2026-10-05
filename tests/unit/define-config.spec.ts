import { defineConfig } from '@/packages/luna-react/src/config'
import { describe, expect, test, vi } from 'vitest'

// When to validate, and whether to summarise the errors. All four default to
// true, and a form that wants to change one should not have to restate the
// other three: `{ submit: false }` used to turn off validating on blur, on
// change and the error summary as well, with nothing on screen to say why. The
// documentation warned about it in bold, which describes a trap rather than
// removing it.
describe('defineConfig validation', () => {
  const DEFAULTS = {
    blur: true,
    change: true,
    showError: true,
    submit: true,
  }

  test('should default to validating everywhere', () => {
    expect(defineConfig({ inputs: [] }).validation).toEqual(DEFAULTS)
  })

  test.each([
    ['submit', { submit: false }],
    ['blur', { blur: false }],
    ['change', { change: false }],
    ['showError', { showError: false }],
  ])('should change only %s', (key, validation) => {
    expect(defineConfig({ inputs: [], validation }).validation).toEqual({
      ...DEFAULTS,
      ...validation,
    })
  })

  // Whoever passes all four notices no difference, which is what makes this
  // safe to change under them.
  test('should give back all four exactly as they were passed', () => {
    const validation = {
      blur: false,
      change: true,
      showError: false,
      submit: true,
    }

    expect(defineConfig({ inputs: [], validation }).validation).toEqual(
      validation
    )
  })
})

// The language lives in the form's `lang`: an `env.locale` left in the config
// formats nothing any more, and a development build says so.
describe('defineConfig env.locale', () => {
  test('should name an env.locale nothing reads', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      defineConfig({ env: { locale: 'es-ES', currency: 'EUR' }, inputs: [] })
      expect(warn).toHaveBeenCalledTimes(1)
      expect(String(warn.mock.calls[0])).toContain('lang')
    } finally {
      warn.mockRestore()
    }
  })

  test('should say nothing about an env without one', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      defineConfig({ env: { currency: 'EUR' }, inputs: [] })
      expect(warn).not.toHaveBeenCalled()
    } finally {
      warn.mockRestore()
    }
  })
})
