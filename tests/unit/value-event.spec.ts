import { describe, expect, test } from 'vitest'
import { handleValueEvent } from '@/packages/luna-core/src/handle/value-event'
import type { ValueEvent } from '@/packages/luna-core/src/type'

type Resolve = (current: unknown) => unknown

function createSetValue(initialStore: Record<string, unknown> = {}) {
  const store: Record<string, unknown> = { ...initialStore }
  const calls: { name: string; value: unknown }[] = []

  const setValue = (name: string, resolve: Resolve) => {
    const current = store[name]
    const next = resolve(current)
    if (next === current) {
      return
    }
    store[name] = next
    calls.push({ name, value: next })
  }

  return { calls, setValue, store }
}

describe('handle value event', () => {
  test('should do nothing if events is empty', () => {
    const { calls, setValue } = createSetValue()
    handleValueEvent({}, [], setValue)
    expect(calls).toHaveLength(0)
  })

  test('should clear target with undefined when selected is null', () => {
    const { calls, setValue } = createSetValue({ other: 'pre-existing' })

    const events: ValueEvent[] = [{ action: 'value', value: { other: '{id}' } }]

    handleValueEvent(null, events, setValue)

    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ name: 'other', value: undefined })
  })

  test('should interpolate value and call setValue', () => {
    const { calls, setValue } = createSetValue()

    const events: ValueEvent[] = [{ action: 'value', value: { other: '{id}' } }]

    handleValueEvent({ id: 123 }, events, setValue)

    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ name: 'other', value: '123' })
  })

  test('should handle multiple values in a single event', () => {
    const { calls, setValue } = createSetValue()

    const events: ValueEvent[] = [
      { action: 'value', value: { field1: '{id}', field2: '{type}' } },
    ]

    handleValueEvent({ id: 123, type: 'admin' }, events, setValue)

    expect(calls).toHaveLength(2)
    expect(calls).toContainEqual({ name: 'field1', value: '123' })
    expect(calls).toContainEqual({ name: 'field2', value: 'admin' })
  })

  test('should handle multiple events', () => {
    const { calls, setValue } = createSetValue()

    const events: ValueEvent[] = [
      { action: 'value', value: { field1: '{id}' } },
      { action: 'value', value: { field2: '{type}' } },
    ]

    handleValueEvent({ id: 123, type: 'admin' }, events, setValue)

    expect(calls).toHaveLength(2)
    expect(calls[0]).toEqual({ name: 'field1', value: '123' })
    expect(calls[1]).toEqual({ name: 'field2', value: 'admin' })
  })

  test('should handle nested interpolation', () => {
    const { calls, setValue } = createSetValue()

    const events: ValueEvent[] = [
      { action: 'value', value: { role: '{user.profile.type}' } },
    ]

    handleValueEvent(
      { user: { profile: { type: 'premium' } } },
      events,
      setValue
    )

    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ name: 'role', value: 'premium' })
  })

  describe('onlyIfTargetEmpty', () => {
    test('should set value when target is empty string', () => {
      const { calls, setValue } = createSetValue({ display_name: '' })

      const events: ValueEvent[] = [
        {
          action: 'value',
          onlyIfTargetEmpty: true,
          value: { display_name: '{value}' },
        },
      ]

      handleValueEvent({ value: 'lunabot' }, events, setValue)

      expect(calls).toHaveLength(1)
      expect(calls[0]).toEqual({ name: 'display_name', value: 'lunabot' })
    })

    test('should set value when target is null or undefined', () => {
      const { calls, setValue } = createSetValue({
        nullable: null,
        absent: undefined,
      })

      const events: ValueEvent[] = [
        {
          action: 'value',
          onlyIfTargetEmpty: true,
          value: { nullable: '{value}', absent: '{value}' },
        },
      ]

      handleValueEvent({ value: 'x' }, events, setValue)

      expect(calls).toHaveLength(2)
      expect(calls).toContainEqual({ name: 'nullable', value: 'x' })
      expect(calls).toContainEqual({ name: 'absent', value: 'x' })
    })

    test('should skip target when it already has a value', () => {
      const { calls, setValue } = createSetValue({
        display_name: 'manual entry',
      })

      const events: ValueEvent[] = [
        {
          action: 'value',
          onlyIfTargetEmpty: true,
          value: { display_name: '{value}' },
        },
      ]

      handleValueEvent({ value: 'lunabot' }, events, setValue)

      expect(calls).toHaveLength(0)
    })

    test('should evaluate each target independently when multiple are present', () => {
      const { calls, setValue } = createSetValue({
        currency: '',
        language: 'en',
        timezone: null,
      })

      const events: ValueEvent[] = [
        {
          action: 'value',
          onlyIfTargetEmpty: true,
          value: {
            currency: '{currency}',
            language: '{language}',
            timezone: '{timezone}',
          },
        },
      ]

      handleValueEvent(
        { currency: 'USD', language: 'es', timezone: 'UTC' },
        events,
        setValue
      )

      expect(calls).toHaveLength(2)
      expect(calls).toContainEqual({ name: 'currency', value: 'USD' })
      expect(calls).toContainEqual({ name: 'timezone', value: 'UTC' })
    })

    test('should overwrite when onlyIfTargetEmpty is false or undefined', () => {
      const { calls, setValue } = createSetValue({
        a: 'existing',
        b: 'existing',
      })

      const events: ValueEvent[] = [
        { action: 'value', value: { a: '{value}' } },
        { action: 'value', onlyIfTargetEmpty: false, value: { b: '{value}' } },
      ]

      handleValueEvent({ value: 'next' }, events, setValue)

      expect(calls).toHaveLength(2)
      expect(calls).toContainEqual({ name: 'a', value: 'next' })
      expect(calls).toContainEqual({ name: 'b', value: 'next' })
    })

    test('should treat 0 and false as non-empty values', () => {
      const { calls, setValue } = createSetValue({ count: 0, active: false })

      const events: ValueEvent[] = [
        {
          action: 'value',
          onlyIfTargetEmpty: true,
          value: { count: '{count}', active: '{active}' },
        },
      ]

      handleValueEvent({ count: 5, active: true }, events, setValue)

      expect(calls).toHaveLength(0)
    })
  })
})
