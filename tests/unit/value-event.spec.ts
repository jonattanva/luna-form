import { describe, expect, test } from 'vitest'
import {
  handleValueEvent,
  type ValueEventApply,
} from '@/packages/luna-core/src/handle/value-event'
import { isEmpty } from '@/packages/luna-core/src/util/is-type'
import type { ValueEvent } from '@/packages/luna-core/src/type'

// The empty-vs-touched decision now lives in the consumer of
// `handleValueEvent` (the React layer keeps a per-target "last auto-filled
// value" map to distinguish auto-fill writes from user edits). The harness
// here replicates the simpler "skip if non-empty" behavior so the existing
// end-to-end assertions still hold.
type Apply = ValueEventApply

function createApply(initialStore: Record<string, unknown> = {}) {
  const store: Record<string, unknown> = { ...initialStore }
  const calls: { name: string; value: unknown }[] = []

  const apply: Apply = (name, candidate, options) => {
    const current = store[name]
    if (options.onlyIfTargetEmpty && !isEmpty(current)) {
      return
    }
    if (candidate === current) {
      return
    }
    store[name] = candidate
    calls.push({ name, value: candidate })
  }

  return { apply, calls, store }
}

describe('handle value event', () => {
  test('should do nothing if events is empty', () => {
    const { apply, calls } = createApply()
    handleValueEvent({}, [], apply)
    expect(calls).toHaveLength(0)
  })

  test('should clear target with undefined when selected is null', () => {
    const { apply, calls } = createApply({ other: 'pre-existing' })

    const events: ValueEvent[] = [{ action: 'value', value: { other: '{id}' } }]

    handleValueEvent(null, events, apply)

    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ name: 'other', value: undefined })
  })

  test('should interpolate value and call apply with the candidate', () => {
    const { apply, calls } = createApply()

    const events: ValueEvent[] = [{ action: 'value', value: { other: '{id}' } }]

    handleValueEvent({ id: 123 }, events, apply)

    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ name: 'other', value: '123' })
  })

  test('should handle multiple values in a single event', () => {
    const { apply, calls } = createApply()

    const events: ValueEvent[] = [
      { action: 'value', value: { field1: '{id}', field2: '{type}' } },
    ]

    handleValueEvent({ id: 123, type: 'admin' }, events, apply)

    expect(calls).toHaveLength(2)
    expect(calls).toContainEqual({ name: 'field1', value: '123' })
    expect(calls).toContainEqual({ name: 'field2', value: 'admin' })
  })

  test('should handle multiple events', () => {
    const { apply, calls } = createApply()

    const events: ValueEvent[] = [
      { action: 'value', value: { field1: '{id}' } },
      { action: 'value', value: { field2: '{type}' } },
    ]

    handleValueEvent({ id: 123, type: 'admin' }, events, apply)

    expect(calls).toHaveLength(2)
    expect(calls[0]).toEqual({ name: 'field1', value: '123' })
    expect(calls[1]).toEqual({ name: 'field2', value: 'admin' })
  })

  test('should handle nested interpolation', () => {
    const { apply, calls } = createApply()

    const events: ValueEvent[] = [
      { action: 'value', value: { role: '{user.profile.type}' } },
    ]

    handleValueEvent({ user: { profile: { type: 'premium' } } }, events, apply)

    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ name: 'role', value: 'premium' })
  })

  describe('options.onlyIfTargetEmpty', () => {
    test('forwards `false` when the event omits the flag', () => {
      const seenOptions: Array<{ name: string; onlyIfTargetEmpty: boolean }> =
        []

      handleValueEvent(
        { value: 'x' },
        [{ action: 'value', value: { a: '{value}' } }],
        (name, _candidate, options) => {
          seenOptions.push({
            name,
            onlyIfTargetEmpty: options.onlyIfTargetEmpty,
          })
        }
      )

      expect(seenOptions).toEqual([{ name: 'a', onlyIfTargetEmpty: false }])
    })

    test('forwards the flag verbatim when set on the event', () => {
      const seenOptions: Array<{ name: string; onlyIfTargetEmpty: boolean }> =
        []

      handleValueEvent(
        { value: 'x' },
        [
          {
            action: 'value',
            onlyIfTargetEmpty: true,
            value: { a: '{value}' },
          },
        ],
        (name, _candidate, options) => {
          seenOptions.push({
            name,
            onlyIfTargetEmpty: options.onlyIfTargetEmpty,
          })
        }
      )

      expect(seenOptions).toEqual([{ name: 'a', onlyIfTargetEmpty: true }])
    })

    test('should set value when target is empty string', () => {
      const { apply, calls } = createApply({ display_name: '' })

      const events: ValueEvent[] = [
        {
          action: 'value',
          onlyIfTargetEmpty: true,
          value: { display_name: '{value}' },
        },
      ]

      handleValueEvent({ value: 'lunabot' }, events, apply)

      expect(calls).toHaveLength(1)
      expect(calls[0]).toEqual({ name: 'display_name', value: 'lunabot' })
    })

    test('should set value when target is null or undefined', () => {
      const { apply, calls } = createApply({
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

      handleValueEvent({ value: 'x' }, events, apply)

      expect(calls).toHaveLength(2)
      expect(calls).toContainEqual({ name: 'nullable', value: 'x' })
      expect(calls).toContainEqual({ name: 'absent', value: 'x' })
    })

    test('should skip target when it already has a value (default harness)', () => {
      const { apply, calls } = createApply({
        display_name: 'manual entry',
      })

      const events: ValueEvent[] = [
        {
          action: 'value',
          onlyIfTargetEmpty: true,
          value: { display_name: '{value}' },
        },
      ]

      handleValueEvent({ value: 'lunabot' }, events, apply)

      expect(calls).toHaveLength(0)
    })

    test('should evaluate each target independently when multiple are present', () => {
      const { apply, calls } = createApply({
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
        apply
      )

      expect(calls).toHaveLength(2)
      expect(calls).toContainEqual({ name: 'currency', value: 'USD' })
      expect(calls).toContainEqual({ name: 'timezone', value: 'UTC' })
    })

    test('should overwrite when onlyIfTargetEmpty is false or undefined', () => {
      const { apply, calls } = createApply({
        a: 'existing',
        b: 'existing',
      })

      const events: ValueEvent[] = [
        { action: 'value', value: { a: '{value}' } },
        { action: 'value', onlyIfTargetEmpty: false, value: { b: '{value}' } },
      ]

      handleValueEvent({ value: 'next' }, events, apply)

      expect(calls).toHaveLength(2)
      expect(calls).toContainEqual({ name: 'a', value: 'next' })
      expect(calls).toContainEqual({ name: 'b', value: 'next' })
    })

    test('should treat 0 and false as non-empty values', () => {
      const { apply, calls } = createApply({ count: 0, active: false })

      const events: ValueEvent[] = [
        {
          action: 'value',
          onlyIfTargetEmpty: true,
          value: { count: '{count}', active: '{active}' },
        },
      ]

      handleValueEvent({ count: 5, active: true }, events, apply)

      expect(calls).toHaveLength(0)
    })
  })
})
