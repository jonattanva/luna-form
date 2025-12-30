import { expect, test } from '@playwright/test'
import { mergeSource } from '@/packages/luna-core/src/util/source'
import type { DataSource } from '@/packages/luna-core/src/type'

test.describe('Source Util', { tag: ['@unit'] }, () => {
  test('should return null for empty array', () => {
    expect(mergeSource([])).toBeNull()
  })

  test('should merge multiple sources', () => {
    const sources: DataSource[] = [
      { url: '/api/data?a=1', body: { x: 1 }, headers: { 'X-A': '1' } },
      { url: '/api/data?b=2', body: { y: 2 }, headers: { 'X-B': '2' } },
      { url: '/api/data?c=3', headers: { 'X-Test': 'true' } },
    ]

    const result = mergeSource(sources)

    expect(result?.url).toBe('/api/data?a=1&b=2&c=3')
    expect(result?.body).toEqual({ x: 1, y: 2 })
    expect(result?.headers).toEqual({
      'X-A': '1',
      'X-B': '2',
      'X-Test': 'true',
    })
  })

  test('should overwrite non-mergeable properties with the last one', () => {
    const sources: DataSource[] = [
      { url: '/api', method: 'GET' },
      { url: '/api', method: 'POST' },
    ]

    const result = mergeSource(sources)
    expect(result?.method).toBe('POST')
  })
})
