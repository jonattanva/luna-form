import { expect, test } from '@playwright/test'
import { handleFetchEvent } from '@/packages/luna-core/src/handle/fetch-event'
import type { DataSource, Nullable } from '@/packages/luna-core/src/type'

test.describe('handleFetchEvent', { tag: ['@unit'] }, () => {
  test('should do nothing if changes is empty', () => {
    let called = false
    const setSource = () => {
      called = true
    }
    handleFetchEvent({}, [], setSource)
    expect(called).toBe(false)
  })

  test('should call setSource with null if selected is null', () => {
    const calls: { name: string; source: Nullable<DataSource> }[] = []
    const setSource = (name: string, source: Nullable<DataSource>) => {
      calls.push({ name, source })
    }

    handleFetchEvent(
      null,
      [{ action: 'fetch', target: 'user', source: { url: '/api/user' } }],
      setSource
    )

    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ name: 'user', source: null })
  })

  test('should interpolate URL and call setSource when action is fetch', () => {
    const calls: { name: string; source: Nullable<DataSource> }[] = []
    const setSource = (name: string, source: Nullable<DataSource>) => {
      calls.push({ name, source })
    }
    const selected = { id: 123 }
    const source = { url: '/api/user/{id}' }

    handleFetchEvent(
      selected,
      [{ action: 'fetch', target: 'user', source }],
      setSource
    )

    expect(calls).toHaveLength(1)
    expect(calls[0].name).toBe('user')
    expect(calls[0].source?.url).toBe('/api/user/123')
  })

  test('should ignore non-fetch actions', () => {
    let called = false
    const setSource = () => {
      called = true
    }

    handleFetchEvent(
      { id: 123 },
      // @ts-expect-error - testing invalid action
      [{ action: 'set', target: 'user', value: 'test' }],
      setSource
    )

    expect(called).toBe(false)
  })

  test('should handle multiple fetch events', () => {
    const calls: { name: string; source: Nullable<DataSource> }[] = []
    const setSource = (name: string, source: Nullable<DataSource>) => {
      calls.push({ name, source })
    }
    const selected = { id: 123, type: 'admin' }

    handleFetchEvent(
      selected,
      [
        { action: 'fetch', target: 'user', source: { url: '/api/user/{id}' } },
        {
          action: 'fetch',
          target: 'roles',
          source: { url: '/api/roles/{type}' },
        },
      ],
      setSource
    )

    expect(calls).toHaveLength(2)
    expect(calls[0].source?.url).toBe('/api/user/123')
    expect(calls[1].source?.url).toBe('/api/roles/admin')
  })
})
