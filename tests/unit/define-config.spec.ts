import {
  defineConfig,
  defineCustomInput,
  defineInput,
} from '@/packages/luna-react/src/config'
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

// The schema a custom type declares for agents, gathered by type for the
// tools of a form with `agent`. A type that declares none takes text there.
describe('defineCustomInput agent schema', () => {
  const Rating = () => null
  const Text = () => null

  test('should gather each type it registers under its schema', () => {
    const schema = { maximum: 5, minimum: 1, type: 'integer' } as const
    const config = defineConfig({
      inputs: [
        defineInput(Text),
        defineCustomInput(['rating', 'rating/stars'], Rating, {
          agent: { schema },
        }),
      ],
    })

    expect(config.agentTypes).toEqual({
      rating: schema,
      'rating/stars': schema,
    })
    expect(config.inputs.rating).toBe(Rating)
  })

  test('should keep the schema of the last registration of a type', () => {
    const config = defineConfig({
      inputs: [
        defineCustomInput('rating', Rating, {
          agent: { schema: { type: 'integer' } },
        }),
        defineCustomInput('rating', Text),
      ],
    })

    expect(config.inputs.rating).toBe(Text)
    expect(config.agentTypes).toBeUndefined()
  })

  test('should leave out a schema that asks for an object, and say so', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      const config = defineConfig({
        inputs: [
          defineCustomInput('address', Rating, {
            agent: { schema: { properties: {}, type: 'object' } },
          }),
          defineCustomInput('people', Rating, {
            agent: { schema: { items: { type: 'object' }, type: 'array' } },
          }),
        ],
      })

      expect(config.agentTypes).toBeUndefined()
      expect(warn).toHaveBeenCalledTimes(2)
    } finally {
      warn.mockRestore()
    }
  })

  test('should leave no schemas when no type declares one', () => {
    const config = defineConfig({
      inputs: [defineCustomInput('rating', Rating)],
    })

    expect(config.agentTypes).toBeUndefined()
    expect(defineCustomInput('rating', Rating)).toEqual({
      input: Rating,
      types: 'rating',
    })
  })
})

// A type of its own that an agent must never write: kept from the tools of
// every form, as a password is, with no field to mark one by one.
describe('defineCustomInput closed to agents', () => {
  const Secret = () => null

  test('should take agent: false', () => {
    expect(defineCustomInput('secret', Secret, { agent: false })).toEqual({
      agent: false,
      input: Secret,
      types: 'secret',
    })
  })

  test('should keep each type it registers from agents', () => {
    const config = defineConfig({
      inputs: [
        defineCustomInput(['secret', 'secret/key'], Secret, { agent: false }),
      ],
    })
    expect(config.agentTypes).toEqual({ secret: false, 'secret/key': false })
  })

  test('should say of a type what its last registration says', () => {
    const schema = { type: 'integer' } as const
    const config = defineConfig({
      inputs: [
        defineCustomInput(['a', 'b', 'c'], Secret, { agent: false }),
        defineCustomInput('a', Secret, { agent: { schema } }),
        defineCustomInput('b', Secret),
        defineCustomInput('d', Secret, { agent: { schema } }),
        defineCustomInput('d', Secret, { agent: false }),
      ],
    })
    expect(config.agentTypes).toEqual({ a: schema, c: false, d: false })
  })
})
