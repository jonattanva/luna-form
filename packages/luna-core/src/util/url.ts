import { COMMON_URL } from './constant'
import type { RemotePattern } from '../type'

/**
 * Validates a URL against a list of allowed remote patterns.
 * Internal URLs are allowed by default.
 * If patterns is undefined, all URLs are allowed.
 * If patterns is an empty array, all external URLs are blocked.
 *
 * The URL is read with `resolveUrl`, as the fetcher reads it, so what is
 * checked is what is called.
 */
export function matchRemotePattern(
  urlStr: string,
  patterns?: RemotePattern[]
): boolean {
  if (!patterns) {
    return true
  }

  const url = resolveUrl(urlStr)
  if (!url) {
    return false
  }
  if (url.origin === COMMON_URL) {
    return true
  }

  const protocol = url.protocol.replace(':', '')
  const hostname = url.hostname
  const port = url.port || getPort(protocol)

  return patterns.some((pattern) => {
    if (pattern.protocol && pattern.protocol !== protocol) {
      return false
    }

    if (pattern.hostname && pattern.hostname !== hostname) {
      return false
    }

    if (pattern.port !== undefined && String(pattern.port) !== port) {
      return false
    }

    return true
  })
}

function getPort(protocol: string) {
  return protocol === 'https' ? '443' : '80'
}

/**
 * A source's URL as it is called: trimmed and resolved against a stand-in for
 * the page, whose origin is what tells a URL of the page's own. Any case of
 * scheme and a backslash for a slash are read as a browser reads them. `null`
 * when it is no URL.
 */
export function resolveUrl(url: string): URL | null {
  try {
    return new URL(url.trim(), COMMON_URL)
  } catch {
    return null
  }
}

export function mergeUrl(baseUrl: string, targetUrl: string): string {
  try {
    if (!baseUrl) {
      return targetUrl
    }

    if (!targetUrl) {
      return baseUrl
    }

    const url1 = new URL(baseUrl, COMMON_URL)
    const url2 = new URL(targetUrl, COMMON_URL)

    url2.searchParams.forEach((value, key) => {
      url1.searchParams.set(key, value)
    })

    const result = url1.toString()
    return baseUrl.startsWith('/') || !baseUrl.includes('://')
      ? result.replace(COMMON_URL, '')
      : result
  } catch {
    return targetUrl || baseUrl
  }
}
