import type { RemotePattern } from '../type'

const COMMON_URL = 'http://luna.internal'

/**
 * Validates a URL against a list of allowed remote patterns.
 * Internal URLs are allowed by default.
 * If patterns is undefined, all URLs are allowed.
 * If patterns is an empty array, all external URLs are blocked.
 */
export function matchRemotePattern(
  urlStr: string,
  patterns?: RemotePattern[]
): boolean {
  if (!patterns || !isExternalUrl(urlStr)) {
    return true
  }

  if (patterns.length === 0) {
    return false
  }

  try {
    const url = new URL(urlStr)
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
  } catch {
    return false
  }
}

function getPort(protocol: string) {
  return protocol === 'https' ? '443' : '80'
}

export function isExternalUrl(url: string): boolean {
  return /^(https?:)?\/\//.test(url)
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
