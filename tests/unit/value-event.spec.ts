import { expect, test } from '@playwright/test'
import { handleValueEvent } from '@/packages/luna-core/src/handle/value-event'
import type { ValueEvent } from '@/packages/luna-core/src/type'

test.describe('handle value event', { tag: ['@unit'] }, () => {
  test('should do nothing if events is empty', () => {
    let called = false
    const setValue = () => {
      called = true
    }
    handleValueEvent({}, [], setValue)
    expect(called).toBe(false)
  })

  test('should call setValue with undefined if selected is null', () => {
    const calls: { name: string; value: unknown }[] = []
    const setValue = (name: string, value: unknown) => {
      calls.push({ name, value })
    }

    const events: ValueEvent[] = [{ action: 'value', value: { other: '{id}' } }]

    handleValueEvent(null, events, setValue)

    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ name: 'other', value: undefined })
  })

  test('should interpolate value and call setValue', () => {
    const calls: { name: string; value: unknown }[] = []
    const setValue = (name: string, value: unknown) => {
      calls.push({ name, value })
    }

    const events: ValueEvent[] = [{ action: 'value', value: { other: '{id}' } }]

    handleValueEvent({ id: 123 }, events, setValue)

    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ name: 'other', value: '123' })
  })

  test('should handle multiple values in a single event', () => {
    const calls: { name: string; value: unknown }[] = []
    const setValue = (name: string, value: unknown) => {
      calls.push({ name, value })
    }

    const events: ValueEvent[] = [
      { action: 'value', value: { field1: '{id}', field2: '{type}' } },
    ]

    handleValueEvent({ id: 123, type: 'admin' }, events, setValue)

    expect(calls).toHaveLength(2)
    expect(calls).toContainEqual({ name: 'field1', value: '123' })
    expect(calls).toContainEqual({ name: 'field2', value: 'admin' })
  })

  test('should handle multiple events', () => {
    const calls: { name: string; value: unknown }[] = []
    const setValue = (name: string, value: unknown) => {
      calls.push({ name, value })
    }

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
    const calls: { name: string; value: unknown }[] = []
    const setValue = (name: string, value: unknown) => {
      calls.push({ name, value })
    }

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
})
