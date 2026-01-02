import { expect, test } from '@playwright/test'
import { handleSourceEvent } from '@/packages/luna-core/src/handle/source-event'
import type { DataSource } from '@/packages/luna-core/src/type'

test.describe('handle source event', { tag: ['@unit'] }, () => {
  test('should do nothing if changes is empty', () => {
    let called = false
    const setSource = () => {
      called = true
    }
    handleSourceEvent({}, [], setSource)
    expect(called).toBe(false)
  })

  test('should call setSource with undefined if selected is null', () => {
    const calls: { name: string; source: DataSource | undefined }[] = []
    const setSource = (name: string, source?: DataSource) => {
      calls.push({ name, source })
    }

    handleSourceEvent(
      null,
      [{ action: 'source', target: 'user', source: { url: '/api/user' } }],
      setSource
    )

    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ name: 'user', source: undefined })
  })

  test('should interpolate URL and call setSource when action is fetch', () => {
    const calls: { name: string; source: DataSource | undefined }[] = []
    const setSource = (name: string, source?: DataSource) => {
      calls.push({ name, source })
    }
    const selected = { id: 123 }
    const source = { url: '/api/user/{id}' }

    handleSourceEvent(
      selected,
      [{ action: 'source', target: 'user', source }],
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

    handleSourceEvent(
      { id: 123 },
      // @ts-expect-error - testing invalid action
      [{ action: 'set', target: 'user', value: 'test' }],
      setSource
    )

    expect(called).toBe(false)
  })

  test('should handle multiple fetch events', () => {
    const calls: { name: string; source: DataSource | undefined }[] = []
    const setSource = (name: string, source?: DataSource) => {
      calls.push({ name, source })
    }
    const selected = { id: 123, type: 'admin' }

    handleSourceEvent(
      selected,
      [
        { action: 'source', target: 'user', source: { url: '/api/user/{id}' } },
        {
          action: 'source',
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

  test('should interpolate body if present', () => {
    const calls: { name: string; source: DataSource | undefined }[] = []
    const setSource = (name: string, source?: DataSource) => {
      calls.push({ name, source })
    }
    const selected = { userId: 456, category: 'electronics' }
    const source = {
      url: '/api/products',
      body: {
        user: '{userId}',
        cat: '{category}',
        static: 'value',
      },
    }

    handleSourceEvent(
      selected,
      [{ action: 'source', target: 'products', source }],
      setSource
    )

    expect(calls).toHaveLength(1)
    expect(calls[0].source?.body).toEqual({
      user: '456',
      cat: 'electronics',
      static: 'value',
    })
  })

  test('should handle nested interpolation in URL and body', () => {
    const calls: { name: string; source: DataSource | undefined }[] = []
    const setSource = (name: string, source?: DataSource) => {
      calls.push({ name, source })
    }
    const selected = {
      user: { id: 789, profile: { type: 'premium' } },
    }
    const source = {
      url: '/api/users/{user.id}/data',
      body: {
        accountType: '{user.profile.type}',
      },
    }

    handleSourceEvent(
      selected,
      [{ action: 'source', target: 'user-data', source }],
      setSource
    )

    expect(calls).toHaveLength(1)
    expect(calls[0].source?.url).toBe('/api/users/789/data')
    expect(calls[0].source?.body).toEqual({
      accountType: 'premium',
    })
  })

  test('should keep placeholders if values are missing in selected', () => {
    const calls: { name: string; source: DataSource | undefined }[] = []
    const setSource = (name: string, source?: DataSource) => {
      calls.push({ name, source })
    }
    const selected = { id: 123 }
    const source = {
      url: '/api/user/{id}/{missing}',
      body: {
        key: '{otherMissing}',
      },
    }

    handleSourceEvent(
      selected,
      [{ action: 'source', target: 'user', source }],
      setSource
    )

    expect(calls).toHaveLength(1)
    expect(calls[0].source?.url).toBe('/api/user/123/{missing}')
    expect(calls[0].source?.body).toEqual({
      key: '{otherMissing}',
    })
  })
})
