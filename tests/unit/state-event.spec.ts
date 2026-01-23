import { expect, test } from '@playwright/test'
import { handleStateEvent } from '@/packages/luna-core/src/handle/state-event'
import type { FieldState, StateEvent } from '@/packages/luna-core/src/type'

test.describe('handle state event', { tag: ['@unit'] }, () => {
  test('should do nothing if events is empty', () => {
    let called = false
    const setState = () => {
      called = true
    }
    handleStateEvent('foo', [], setState)
    expect(called).toBe(false)
  })

  test('should call setState when selected matches string condition', () => {
    const calls: { name: string; state?: FieldState }[] = []
    const setState = (name: string, state?: FieldState) => {
      calls.push({ name, state })
    }

    const events: StateEvent[] = [
      {
        action: 'state',
        target: 'field1',
        state: { hidden: true },
        when: 'active',
      },
    ]

    handleStateEvent('active', events, setState)

    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ name: 'field1', state: { hidden: true } })
  })

  test('should call setState with undefined state when selected does not match string condition', () => {
    const calls: { name: string; state?: FieldState }[] = []
    const setState = (name: string, state?: FieldState) => {
      calls.push({ name, state })
    }

    const events: StateEvent[] = [
      {
        action: 'state',
        target: 'field1',
        state: { hidden: true },
        when: 'active',
      },
    ]

    handleStateEvent('inactive', events, setState)

    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ name: 'field1', state: undefined })
  })

  test('should call setState when selected matches one of string array conditions', () => {
    const calls: { name: string; state?: FieldState }[] = []
    const setState = (name: string, state?: FieldState) => {
      calls.push({ name, state })
    }

    const events: StateEvent[] = [
      {
        action: 'state',
        target: 'field1',
        state: { disabled: true },
        when: ['active', 'pending'],
      },
    ]

    handleStateEvent('pending', events, setState)

    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ name: 'field1', state: { disabled: true } })
  })

  test('should call setState with undefined state when selected is not in string array conditions', () => {
    const calls: { name: string; state?: FieldState }[] = []
    const setState = (name: string, state?: FieldState) => {
      calls.push({ name, state })
    }

    const events: StateEvent[] = [
      {
        action: 'state',
        target: 'field1',
        state: { disabled: true },
        when: ['active', 'pending'],
      },
    ]

    handleStateEvent('inactive', events, setState)

    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ name: 'field1', state: undefined })
  })

  test('should call setState with eq operator condition', () => {
    const calls: { name: string; state?: FieldState }[] = []
    const setState = (name: string, state?: FieldState) => {
      calls.push({ name, state })
    }

    const events: StateEvent[] = [
      {
        action: 'state',
        target: 'field1',
        state: { hidden: true },
        when: { operator: 'eq', value: 'yes' },
      },
    ]

    handleStateEvent('yes', events, setState)

    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ name: 'field1', state: { hidden: true } })
  })

  test('should call setState with undefined state when eq operator does not match', () => {
    const calls: { name: string; state?: FieldState }[] = []
    const setState = (name: string, state?: FieldState) => {
      calls.push({ name, state })
    }

    const events: StateEvent[] = [
      {
        action: 'state',
        target: 'field1',
        state: { hidden: true },
        when: { operator: 'eq', value: 'yes' },
      },
    ]

    handleStateEvent('no', events, setState)

    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ name: 'field1', state: undefined })
  })

  test('should call setState with neq operator condition', () => {
    const calls: { name: string; state?: FieldState }[] = []
    const setState = (name: string, state?: FieldState) => {
      calls.push({ name, state })
    }

    const events: StateEvent[] = [
      {
        action: 'state',
        target: 'field1',
        state: { disabled: true },
        when: { operator: 'neq', value: 'admin' },
      },
    ]

    handleStateEvent('user', events, setState)

    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ name: 'field1', state: { disabled: true } })
  })

  test('should call setState with in operator condition', () => {
    const calls: { name: string; state?: FieldState }[] = []
    const setState = (name: string, state?: FieldState) => {
      calls.push({ name, state })
    }

    const events: StateEvent[] = [
      {
        action: 'state',
        target: 'field1',
        state: { hidden: true },
        when: { operator: 'in', value: ['a', 'b', 'c'] },
      },
    ]

    handleStateEvent('b', events, setState)

    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ name: 'field1', state: { hidden: true } })
  })

  test('should call setState with undefined state when in operator does not match', () => {
    const calls: { name: string; state?: FieldState }[] = []
    const setState = (name: string, state?: FieldState) => {
      calls.push({ name, state })
    }

    const events: StateEvent[] = [
      {
        action: 'state',
        target: 'field1',
        state: { hidden: true },
        when: { operator: 'in', value: ['a', 'b', 'c'] },
      },
    ]

    handleStateEvent('d', events, setState)

    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ name: 'field1', state: undefined })
  })

  test('should call setState with nin operator condition', () => {
    const calls: { name: string; state?: FieldState }[] = []
    const setState = (name: string, state?: FieldState) => {
      calls.push({ name, state })
    }

    const events: StateEvent[] = [
      {
        action: 'state',
        target: 'field1',
        state: { disabled: true },
        when: { operator: 'nin', value: ['a', 'b'] },
      },
    ]

    handleStateEvent('c', events, setState)

    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ name: 'field1', state: { disabled: true } })
  })

  test('should evaluate condition using nested field from object', () => {
    const calls: { name: string; state?: FieldState }[] = []
    const setState = (name: string, state?: FieldState) => {
      calls.push({ name, state })
    }

    const events: StateEvent[] = [
      {
        action: 'state',
        target: 'field1',
        state: { hidden: true },
        when: { field: 'user.role', operator: 'eq', value: 'admin' },
      },
    ]

    handleStateEvent({ user: { role: 'admin' } }, events, setState)

    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ name: 'field1', state: { hidden: true } })
  })

  test('should evaluate condition using direct field from object', () => {
    const calls: { name: string; state?: FieldState }[] = []
    const setState = (name: string, state?: FieldState) => {
      calls.push({ name, state })
    }

    const events: StateEvent[] = [
      {
        action: 'state',
        target: 'field1',
        state: { disabled: true },
        when: { field: 'status', operator: 'neq', value: 'active' },
      },
    ]

    handleStateEvent({ status: 'inactive' }, events, setState)

    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ name: 'field1', state: { disabled: true } })
  })

  test('should handle multiple events', () => {
    const calls: { name: string; state?: FieldState }[] = []
    const setState = (name: string, state?: FieldState) => {
      calls.push({ name, state })
    }

    const events: StateEvent[] = [
      {
        action: 'state',
        target: 'field1',
        state: { hidden: true },
        when: 'active',
      },
      {
        action: 'state',
        target: 'field2',
        state: { disabled: true },
        when: 'active',
      },
    ]

    handleStateEvent('active', events, setState)

    expect(calls).toHaveLength(2)
    expect(calls[0]).toEqual({ name: 'field1', state: { hidden: true } })
    expect(calls[1]).toEqual({ name: 'field2', state: { disabled: true } })
  })

  test('should apply state for matching events and reset for non-matching', () => {
    const calls: { name: string; state?: FieldState }[] = []
    const setState = (name: string, state?: FieldState) => {
      calls.push({ name, state })
    }

    const events: StateEvent[] = [
      {
        action: 'state',
        target: 'field1',
        state: { hidden: true },
        when: 'active',
      },
      {
        action: 'state',
        target: 'field2',
        state: { disabled: true },
        when: 'inactive',
      },
    ]

    handleStateEvent('active', events, setState)

    expect(calls).toHaveLength(2)
    expect(calls[0]).toEqual({ name: 'field1', state: { hidden: true } })
    expect(calls[1]).toEqual({ name: 'field2', state: undefined })
  })

  test('should call setState when no when condition is specified', () => {
    const calls: { name: string; state?: FieldState }[] = []
    const setState = (name: string, state?: FieldState) => {
      calls.push({ name, state })
    }

    const events: StateEvent[] = [
      {
        action: 'state',
        target: 'field1',
        state: { hidden: true },
      },
    ]

    handleStateEvent('anything', events, setState)

    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ name: 'field1', state: { hidden: true } })
  })

  test('should default operator to eq when not specified in condition', () => {
    const calls: { name: string; state?: FieldState }[] = []
    const setState = (name: string, state?: FieldState) => {
      calls.push({ name, state })
    }

    const events: StateEvent[] = [
      {
        action: 'state',
        target: 'field1',
        state: { hidden: true },
        when: { value: 'test' },
      },
    ]

    handleStateEvent('test', events, setState)

    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ name: 'field1', state: { hidden: true } })
  })

  test('should reset state when selected is null', () => {
    const calls: { name: string; state?: FieldState }[] = []
    const setState = (name: string, state?: FieldState) => {
      calls.push({ name, state })
    }

    const events: StateEvent[] = [
      {
        action: 'state',
        target: 'field1',
        state: { hidden: true },
        when: 'value',
      },
    ]

    handleStateEvent(null, events, setState)

    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ name: 'field1', state: undefined })
  })
})
