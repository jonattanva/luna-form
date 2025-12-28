import type { RemotePattern } from '../../type'

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
