import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { fetcher } from '@/packages/luna-core/src/fetcher'

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

let originalFetch: typeof fetch
let calls: Array<{ url: string; init?: RequestInit }>

describe('Fetcher', () => {
  beforeEach(() => {
    calls = []
    originalFetch = globalThis.fetch

    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({
        url: typeof input === 'string' ? input : input.toString(),
        init,
      })

      return jsonResponse({ ok: true })
    }
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
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

  // A non-2xx response is an error, whatever its body holds: an array in the
  // body of a 500 must not reach the field as its options.
  test('should reject a non-2xx response with its parsed body', async () => {
    const body = [{ value: 'error', label: 'Internal Server Error' }]
    globalThis.fetch = async () => jsonResponse(body, 500)

    await expect(
      fetcher({ url: 'http://example.com/api', method: 'GET' })
    ).rejects.toEqual(body)
  })

  // The body is always parsed as JSON, so a response that is not JSON fails
  // even when its status is 2xx.
  test('should reject a response that is not JSON', async () => {
    globalThis.fetch = async () =>
      new Response('<html>Bad Gateway</html>', {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      })

    await expect(
      fetcher({ url: 'http://example.com/api', method: 'GET' })
    ).rejects.toThrow(SyntaxError)
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
