import { describe, expect, test } from 'vitest'
import type { FieldState, List } from '@/packages/luna-core/src/type'

function resolveContainerHidden(
  container: List,
  states: Record<string, FieldState>
): boolean {
  return states[container.name]?.hidden ?? container.hidden ?? false
}

function resolveAllFieldsHidden(
  fields: List['fields'],
  states: Record<string, FieldState>
): boolean {
  if (fields.length === 0) return true
  return fields.every((entry) => {
    if ('fields' in entry) {
      return entry.fields?.every(
        (f) => states[f.name]?.hidden ?? f.hidden ?? false
      )
    }
    return states[entry.name]?.hidden ?? entry.hidden ?? false
  })
}

describe('SectionGuard container logic', () => {
  test('list with static hidden:true should be hidden', () => {
    const container: List = {
      name: 'items',
      type: 'list',
      fields: [],
      hidden: true,
    }
    const states: Record<string, FieldState> = {}

    expect(resolveContainerHidden(container, states)).toBe(true)
  })

  test('list hidden via dynamic state event overrides static', () => {
    const container: List = {
      name: 'items',
      type: 'list',
      fields: [],
      hidden: true,
    }
    const states: Record<string, FieldState> = {
      items: { hidden: false },
    }

    expect(resolveContainerHidden(container, states)).toBe(false)
  })

  test('list without hidden property is visible by default', () => {
    const container: List = {
      name: 'items',
      type: 'list',
      fields: [],
    }
    const states: Record<string, FieldState> = {}

    expect(resolveContainerHidden(container, states)).toBe(false)
  })

  test('list made hidden via state event when static hidden is unset', () => {
    const container: List = {
      name: 'items',
      type: 'list',
      fields: [],
    }
    const states: Record<string, FieldState> = {
      items: { hidden: true },
    }

    expect(resolveContainerHidden(container, states)).toBe(true)
  })

  test('list with all internal fields hidden should be considered hidden', () => {
    const fields: List['fields'] = [
      {
        name: 'value',
        type: 'input/text',
        hidden: true,
      },
    ]
    const states: Record<string, FieldState> = {}

    expect(resolveAllFieldsHidden(fields, states)).toBe(true)
  })

  test('list with at least one visible field should not be fully hidden', () => {
    const fields: List['fields'] = [
      {
        name: 'value',
        type: 'input/text',
        hidden: true,
      },
      {
        name: 'label',
        type: 'input/text',
      },
    ]
    const states: Record<string, FieldState> = {}

    expect(resolveAllFieldsHidden(fields, states)).toBe(false)
  })

  test('empty fields array is treated as all-hidden', () => {
    const fields: List['fields'] = []
    const states: Record<string, FieldState> = {}

    expect(resolveAllFieldsHidden(fields, states)).toBe(true)
  })
})
