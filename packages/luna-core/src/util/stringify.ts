import { isString } from './is-type'

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
    return null
  }
}
