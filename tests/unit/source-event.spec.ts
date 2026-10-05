import { describe, expect, test } from 'vitest'
import { handleSourceEvent } from '@/packages/luna-core/src/handle/source-event'
import type { DataSource, SourceEvent } from '@/packages/luna-core/src/type'

describe('handle source event', () => {
  test('should do nothing if events is empty', () => {
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

    const events: SourceEvent[] = [
      { action: 'source', target: 'user', source: { url: '/api/user' } },
    ]

    handleSourceEvent(null, events, setSource)

    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual({ name: 'user', source: undefined })
  })

  test('should interpolate URL and call setSource', () => {
    const calls: { name: string; source: DataSource | undefined }[] = []
    const setSource = (name: string, source?: DataSource) => {
      calls.push({ name, source })
    }
    const selected = { id: 123 }
    const events: SourceEvent[] = [
      { action: 'source', target: 'user', source: { url: '/api/user/{id}' } },
    ]

    handleSourceEvent(selected, events, setSource)

    expect(calls).toHaveLength(1)
    expect(calls[0].name).toBe('user')
    expect(calls[0].source?.url).toBe('/api/user/123')
  })

  test('should interpolate body if present', () => {
    const calls: { name: string; source: DataSource | undefined }[] = []
    const setSource = (name: string, source?: DataSource) => {
      calls.push({ name, source })
    }
    const selected = { userId: 456, category: 'electronics' }
    const events: SourceEvent[] = [
      {
        action: 'source',
        target: 'products',
        source: {
          url: '/api/products',
          body: {
            user: '{userId}',
            cat: '{category}',
            static: 'value',
          },
        },
      },
    ]

    handleSourceEvent(selected, events, setSource)

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
    const events: SourceEvent[] = [
      {
        action: 'source',
        target: 'order',
        source: {
          url: '/api/users/{user.id}/data',
          body: {
            accountType: '{user.profile.type}',
          },
        },
      },
    ]

    handleSourceEvent(selected, events, setSource)

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
    const events: SourceEvent[] = [
      {
        action: 'source',
        target: 'user',
        source: {
          url: '/api/user/{id}/{missing}',
          body: {
            key: '{otherMissing}',
          },
        },
      },
    ]

    handleSourceEvent(selected, events, setSource)

    expect(calls).toHaveLength(1)
    expect(calls[0].source?.url).toBe('/api/user/123/{missing}')
    expect(calls[0].source?.body).toEqual({
      key: '{otherMissing}',
    })
  })

  // Like a value payload, a url and a body format in the form's language, and
  // in English without one, as the docs say (interpolation/format-filters.md,
  // "Language").
  test('should format filters in URL and body in English without a language', () => {
    const calls: { name: string; source: DataSource | undefined }[] = []
    const setSource = (name: string, source?: DataSource) => {
      calls.push({ name, source })
    }
    const events: SourceEvent[] = [
      {
        action: 'source',
        target: 'total',
        source: {
          url: '/api/total?amount={value | number}',
          body: { amount: '{value | number}' },
        },
      },
    ]

    handleSourceEvent({ value: 1234567 }, events, setSource)

    const formatted = '1,234,567'
    expect(calls).toHaveLength(1)
    expect(calls[0].source?.url).toBe(`/api/total?amount=${formatted}`)
    expect(calls[0].source?.body).toEqual({ amount: formatted })
  })
})

describe('handleSourceEvent language', () => {
  test('should format a url in the language it is given', () => {
    const calls: { name: string; source: DataSource | undefined }[] = []
    const events: SourceEvent[] = [
      {
        action: 'source',
        target: 'list',
        source: { url: '/api?n={n | number}' },
      },
    ]

    handleSourceEvent(
      { n: 1234.5 },
      events,
      (name, source) => calls.push({ name, source }),
      { locale: 'de' }
    )

    expect(calls[0].source?.url).toBe('/api?n=1.234,5')
  })
})
