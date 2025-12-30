import { expect, test } from '@playwright/test'
import {
  isExternalUrl,
  matchRemotePattern,
  mergeUrl,
} from '@/packages/luna-core/src/util/url'

test.describe('URL Helper', { tag: ['@unit'] }, () => {
  test('should return true for absolute http URLs', () => {
    expect(isExternalUrl('http://example.com')).toBe(true)
  })

  test('should return true for absolute https URLs', () => {
    expect(isExternalUrl('https://example.com')).toBe(true)
  })

  test('should return true for protocol-relative URLs', () => {
    expect(isExternalUrl('//example.com')).toBe(true)
  })

  test('should return false for relative URLs', () => {
    expect(isExternalUrl('/api/data')).toBe(false)
    expect(isExternalUrl('api/data')).toBe(false)
    expect(isExternalUrl('./api/data')).toBe(false)
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
