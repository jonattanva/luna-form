import { isString } from './is-type'
import { logger } from './logger'

export function stringify<T>(body: T) {
  try {
    if (body instanceof FormData) {
      return null
    }

    if (isString(body)) {
      return body
    }

    return JSON.stringify(body)
  } catch {
    logger.error('Failed to stringify body:', body)
    return null
  }
}
