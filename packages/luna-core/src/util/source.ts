import { isObject } from './is-type'
import { mergeUrl } from './url'
import type { DataSource, Nullable } from '../type'

export function mergeSource(sources: DataSource[]): Nullable<DataSource> {
  if (!Array.isArray(sources) || sources.length === 0) {
    return null
  }

  return sources.reduce((previous, current) => {
    const url = mergeUrl(previous.url, current.url)
    const body = getBody(previous, current)
    const headers = getHeaders(previous, current)

    return {
      ...previous,
      ...current,
      url,
      body,
      headers,
    }
  })
}

function getBody(previous: DataSource, current: DataSource) {
  if (isObject(current.body) && isObject(previous?.body)) {
    return {
      ...previous.body,
      ...current.body,
    }
  }
  return current.body ?? previous?.body
}

function getHeaders(previous: DataSource, current: DataSource) {
  if (isObject(current.headers) && isObject(previous?.headers)) {
    return {
      ...previous.headers,
      ...current.headers,
    }
  }
  return current.headers ?? previous?.headers
}
