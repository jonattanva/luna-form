import { defineConfig } from '@/packages/luna-react/src/config'
import { describe, expect, test } from 'vitest'

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
