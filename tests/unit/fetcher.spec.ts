import { expect, test } from '@playwright/test'
import { fetcher } from '@/packages/luna-core/src/fetcher'

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

let originalFetch: typeof fetch
let calls: Array<{ url: string; init?: RequestInit }>

test.describe('Fetcher', { tag: ['@unit'] }, () => {
  test.beforeEach(() => {
    calls = []
    originalFetch = global.fetch

    global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({
        url: typeof input === 'string' ? input : input.toString(),
        init,
      })

      return jsonResponse({ ok: true })
    }
  })

  test.afterEach(() => {
    global.fetch = originalFetch
  })

  test('should throw error for invalid URL', async () => {
    const invalidUrls = [
      'http://example.com/undefined',
      'http://example.com/null',
      'http://example.com/api?id=null',
      'http://example.com/api?id=undefined',
      'http://example.com/{id}',
    ]

    for (const url of invalidUrls) {
      const dataSource = { url, method: 'GET' }
      await expect(fetcher(dataSource)).rejects.toThrow(`Invalid URL: ${url}`)
    }
  })

  test('should allow valid URLs with null/undefined as substrings', async () => {
    const validUrls = [
      'http://example.com/nullify',
      'http://example.com/annullment',
      'http://example.com/api/null-pointer',
    ]

    for (const url of validUrls) {
      const dataSource = { url, method: 'GET' }
      const result = await fetcher(dataSource)
      expect(result).toEqual({ ok: true })
    }
  })

  test('should append query parameters for GET requests', async () => {
    const dataSource = {
      url: 'http://example.com/api',
      method: 'GET',
      body: {
        param1: 'value1',
        param2: 'value2',
      },
    }

    const result = await fetcher(dataSource)

    expect(result).toEqual({ ok: true })
    expect(calls).toHaveLength(1)
    expect(calls[0]?.url).toBe(
      'http://example.com/api?param1=value1&param2=value2'
    )
    expect(calls[0]?.init?.method).toBe('GET')
    expect(calls[0]?.init?.body).toBeUndefined()
  })

  test('should send body for non-GET requests', async () => {
    const dataSource = {
      url: 'http://example.com/api',
      method: 'POST',
      body: {
        key: 'value',
      },
    }

    const result = await fetcher(dataSource)

    expect(result).toEqual({ ok: true })
    expect(calls).toHaveLength(1)
    expect(calls[0]?.url).toBe('http://example.com/api')
    expect(calls[0]?.init?.method).toBe('POST')
    expect(calls[0]?.init?.body).toBe(JSON.stringify(dataSource.body))
    expect(calls[0]?.init?.headers).toMatchObject({
      'Content-Type': 'application/json',
    })
  })

  test('should send FormData without JSON headers', async () => {
    const formData = new FormData()
    formData.append('key', 'value')

    const dataSource = {
      url: 'http://example.com/api',
      method: 'POST',
      body: formData,
    }

    const result = await fetcher(dataSource)

    expect(result).toEqual({ ok: true })
    expect(calls).toHaveLength(1)
    expect(calls[0]?.init?.body).toBeInstanceOf(FormData)
    expect(calls[0]?.init?.headers).not.toHaveProperty('Content-Type')
  })

  test('should send string body with JSON headers', async () => {
    const body = JSON.stringify({ key: 'value' })
    const dataSource = {
      url: 'http://example.com/api',
      method: 'POST',
      body,
    }

    const result = await fetcher(dataSource)

    expect(result).toEqual({ ok: true })
    expect(calls).toHaveLength(1)
    expect(calls[0]?.init?.body).toBe(body)
    expect(calls[0]?.init?.headers).toMatchObject({
      'Content-Type': 'application/json',
    })
  })

  test('should handle circular references by not setting JSON headers', async () => {
    const circular: Record<string, unknown> = { key: 'value' }
    circular.self = circular

    const dataSource = {
      url: 'http://example.com/api',
      method: 'POST',
      body: circular,
    }

    const result = await fetcher(dataSource)

    expect(result).toEqual({ ok: true })
    expect(calls).toHaveLength(1)
    expect(calls[0]?.init?.body).toBe(circular)
    expect(calls[0]?.init?.headers).not.toHaveProperty('Content-Type')
  })
})
