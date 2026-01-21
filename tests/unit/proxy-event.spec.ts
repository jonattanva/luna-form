import { expect, test } from '@playwright/test'
import { handleProxyEvent } from '@/packages/luna-core/src/handle/proxy-event'
import type { ChangeEvent } from '@/packages/luna-core/src/type'

test.describe('Proxy Event Handler', { tag: ['@unit'] }, () => {
  test('should separate source and value events', () => {
    const events: ChangeEvent = [
      { action: 'source', source: { url: '/api/data' }, target: 'field1' },
      { action: 'value', value: { name: 'John' } },
      { action: 'source', source: { url: '/api/other' }, target: 'field2' },
      { action: 'value', value: { age: 25 } },
    ]

    handleProxyEvent(events, ({ sources, values }) => {
      expect(sources).toHaveLength(2)
      expect(values).toHaveLength(2)

      expect(sources[0]).toEqual({
        action: 'source',
        source: { url: '/api/data' },
        target: 'field1',
      })
      expect(sources[1]).toEqual({
        action: 'source',
        source: { url: '/api/other' },
        target: 'field2',
      })

      expect(values[0]).toEqual({ action: 'value', value: { name: 'John' } })
      expect(values[1]).toEqual({ action: 'value', value: { age: 25 } })
    })
  })

  test('should handle empty events array', () => {
    handleProxyEvent([], ({ sources, values }) => {
      expect(sources).toHaveLength(0)
      expect(values).toHaveLength(0)
    })
  })

  test('should handle undefined events', () => {
    handleProxyEvent(undefined, ({ sources, values }) => {
      expect(sources).toHaveLength(0)
      expect(values).toHaveLength(0)
    })
  })

  test('should handle only source events', () => {
    const events: ChangeEvent = [
      { action: 'source', source: { url: '/api/users' }, target: 'users' },
      {
        action: 'source',
        source: { url: '/api/products' },
        target: 'products',
      },
    ]

    handleProxyEvent(events, ({ sources, values }) => {
      expect(sources).toHaveLength(2)
      expect(values).toHaveLength(0)
    })
  })

  test('should handle only value events', () => {
    const events: ChangeEvent = [
      { action: 'value', value: { field1: 'value1' } },
      { action: 'value', value: { field2: 'value2' } },
    ]

    handleProxyEvent(events, ({ sources, values }) => {
      expect(sources).toHaveLength(0)
      expect(values).toHaveLength(2)
    })
  })

  test('should preserve event order within each category', () => {
    const events: ChangeEvent = [
      { action: 'source', source: { url: '/first' }, target: 'a' },
      { action: 'value', value: { x: 1 } },
      { action: 'source', source: { url: '/second' }, target: 'b' },
      { action: 'value', value: { y: 2 } },
      { action: 'source', source: { url: '/third' }, target: 'c' },
    ]

    handleProxyEvent(events, ({ sources, values }) => {
      expect(sources[0].target).toBe('a')
      expect(sources[1].target).toBe('b')
      expect(sources[2].target).toBe('c')

      expect(values[0].value).toEqual({ x: 1 })
      expect(values[1].value).toEqual({ y: 2 })
    })
  })

  test('should handle source events with complex data sources', () => {
    const events: ChangeEvent = [
      {
        action: 'source',
        source: { url: '/api/data?param={value}', method: 'POST' },
        target: 'dynamicField',
      },
    ]

    handleProxyEvent(events, ({ sources }) => {
      expect(sources).toHaveLength(1)
      expect(sources[0].source).toEqual({
        url: '/api/data?param={value}',
        method: 'POST',
      })
    })
  })

  test('should handle value events with nested values', () => {
    const events: ChangeEvent = [
      {
        action: 'value',
        value: { items: [{ id: 1 }, { id: 2 }] },
      },
    ]

    handleProxyEvent(events, ({ values }) => {
      expect(values).toHaveLength(1)
      expect(values[0].value).toEqual({ items: [{ id: 1 }, { id: 2 }] })
    })
  })
})
