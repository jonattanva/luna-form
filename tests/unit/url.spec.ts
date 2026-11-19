import { describe, expect, test } from 'vitest'
import { matchRemotePattern, mergeUrl } from '@/packages/luna-core/src/util/url'

describe('URL Helper', () => {
  // An empty list lets through only what the page calls itself.
  test('should block an absolute or protocol-relative URL with no pattern', () => {
    expect(matchRemotePattern('http://example.com', [])).toBe(false)
    expect(matchRemotePattern('https://example.com', [])).toBe(false)
    expect(matchRemotePattern('//example.com', [])).toBe(false)
  })

  test('should let a relative URL through with no pattern', () => {
    expect(matchRemotePattern('/api/data', [])).toBe(true)
    expect(matchRemotePattern('api/data', [])).toBe(true)
    expect(matchRemotePattern('./api/data', [])).toBe(true)
  })

  test('should return true if patterns is undefined', () => {
    expect(matchRemotePattern('https://example.com', undefined)).toBe(true)
  })

  test('should return true for internal URLs regardless of patterns', () => {
    expect(matchRemotePattern('/api/data', [])).toBe(true)
  })

  test('should return false for external URLs if patterns is empty array', () => {
    expect(matchRemotePattern('https://example.com', [])).toBe(false)
  })

  test('should match by hostname', () => {
    const patterns = [{ hostname: 'example.com' }]
    expect(matchRemotePattern('https://example.com/api', patterns)).toBe(true)
    expect(matchRemotePattern('https://other.com/api', patterns)).toBe(false)
  })

  test('should match by protocol', () => {
    const patterns = [{ protocol: 'https' as const }]
    expect(matchRemotePattern('https://example.com', patterns)).toBe(true)
    expect(matchRemotePattern('http://example.com', patterns)).toBe(false)
  })

  test('should match by port', () => {
    const patterns = [{ port: 8080 }]
    expect(matchRemotePattern('http://example.com:8080', patterns)).toBe(true)
    expect(matchRemotePattern('http://example.com:3000', patterns)).toBe(false)
  })

  test('should match multiple criteria', () => {
    const patterns = [
      { protocol: 'https' as const, hostname: 'api.example.com', port: 443 },
    ]
    expect(matchRemotePattern('https://api.example.com', patterns)).toBe(true)
    expect(matchRemotePattern('http://api.example.com', patterns)).toBe(false)
  })

  test('should match any pattern in the list', () => {
    const patterns = [{ hostname: 'a.com' }, { hostname: 'b.com' }]
    expect(matchRemotePattern('https://a.com', patterns)).toBe(true)
    expect(matchRemotePattern('https://b.com', patterns)).toBe(true)
    expect(matchRemotePattern('https://c.com', patterns)).toBe(false)
  })

  test('should return true for non-external strings (treated as internal)', () => {
    expect(matchRemotePattern('not-a-url', [{ hostname: 'example.com' }])).toBe(
      true
    )
  })

  // Each of these is fetched from evil.com, so each has to be checked as the
  // external URL it is.
  test('should read a URL the way the fetcher does', () => {
    const patterns = [{ hostname: 'example.com' }]
    for (const url of [
      'HTTPS://evil.com/x',
      ' https://evil.com/x',
      '\thttps://evil.com/x',
      '/\\evil.com/x',
      '\\\\evil.com/x',
      'https:evil.com/x',
    ]) {
      expect(matchRemotePattern(url, patterns), url).toBe(false)
    }
    expect(matchRemotePattern(' HTTPS://example.com/x', patterns)).toBe(true)
  })

  test('should return false for invalid external URLs', () => {
    expect(matchRemotePattern('http://', [{ hostname: 'example.com' }])).toBe(
      false
    )
  })

  test('should merge query parameters from two relative URLs', () => {
    const result = mergeUrl('/api/data?a=1', '/api/data?b=2')
    expect(result).toBe('/api/data?a=1&b=2')
  })

  test('should overwrite existing query parameters', () => {
    const result = mergeUrl('/api/data?a=1', '/api/data?a=2')
    expect(result).toBe('/api/data?a=2')
  })

  test('should handle absolute URLs', () => {
    const result = mergeUrl(
      'https://api.com/data?a=1',
      'https://api.com/data?b=2'
    )
    expect(result).toBe('https://api.com/data?a=1&b=2')
  })

  test('should return target if base is empty', () => {
    expect(mergeUrl('', '/api/data')).toBe('/api/data')
  })

  test('should return base if target is empty', () => {
    expect(mergeUrl('/api/data', '')).toBe('/api/data')
  })
})
