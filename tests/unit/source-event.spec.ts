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
    // Compared as the server reads it: the comma is encoded in the url.
    const url = new URL(calls[0].source?.url ?? '', 'http://localhost')
    expect(url.pathname).toBe('/api/total')
    expect(url.searchParams.get('amount')).toBe(formatted)
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

    const url = new URL(calls[0].source?.url ?? '', 'http://localhost')
    expect(url.searchParams.get('n')).toBe('1.234,5')
  })
})

describe('handleSourceEvent values in a url', () => {
  function urlFor(template: string, value: string): string {
    const calls: { name: string; source: DataSource | undefined }[] = []
    const events: SourceEvent[] = [
      { action: 'source', target: 'list', source: { url: template } },
    ]

    handleSourceEvent({ value }, events, (name, source) =>
      calls.push({ name, source })
    )

    return calls[0].source?.url ?? ''
  }

  test('should send a value with url syntax in it as one value', () => {
    const url = new URL(
      urlFor('/api/people?dept={value}', 'R&D'),
      'http://localhost'
    )

    expect(url.searchParams.get('dept')).toBe('R&D')
    expect([...url.searchParams.keys()]).toEqual(['dept'])
  })

  test('should not let a value add a parameter or a fragment', () => {
    const url = new URL(
      urlFor('/api/cities?country={value}', 'pe&admin=1#top'),
      'http://localhost'
    )

    expect(url.searchParams.get('country')).toBe('pe&admin=1#top')
    expect([...url.searchParams.keys()]).toEqual(['country'])
    expect(url.hash).toBe('')
  })

  test('should keep a value in a path segment inside that segment', () => {
    const url = new URL(
      urlFor('/api/countries/{value}/cities', '../../admin'),
      'http://localhost'
    )

    const segments = url.pathname.split('/')
    expect(segments).toHaveLength(5)
    expect(segments[1]).toBe('api')
    expect(segments[2]).toBe('countries')
    expect(decodeURIComponent(segments[3])).toBe('../../admin')
    expect(segments[4]).toBe('cities')
  })

  test('should send a value with a space in a path segment', () => {
    expect(urlFor('/api/cities/{value}', 'San Juan')).toBe(
      '/api/cities/San%20Juan'
    )
  })

  test('should not let a value at the start of a template change the host', () => {
    const url = new URL(
      urlFor('{value}/cities', '//attacker.example'),
      'http://localhost'
    )

    expect(url.host).toBe('localhost')
  })

  // A template that is nothing but a placeholder takes a whole url from the
  // selected option, such as an endpoint picked from a list. There is no
  // authored url around it to protect, so it is used as it is.
  test('should use a template that is only a placeholder as the url', () => {
    const endpoint = 'https://pokeapi.co/api/v2/pokemon/1/?lang=en&x=1'
    expect(urlFor('{value}', endpoint)).toBe(endpoint)
  })
})
