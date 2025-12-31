import { COMMON_URL } from './util/constant'
import { isInterpolated } from './util/string'
import { isString } from './util/is-type'
import { stringify } from './util/stringify'
import type { DataSource } from './type'

const REGEX_INVALID_URL_SEGMENTS = /(^|[\/?=&])(null|undefined)([\/?=&]|$)/

export async function fetcher(dataSource: DataSource) {
  const [url, method] = buildRequest(dataSource)

  let body = dataSource.body
  let headers = buildHeaders(dataSource)

  if (body && !isGetMethod(method)) {
    const bodyStringify = stringify(body)
    if (bodyStringify !== null) {
      body = bodyStringify
      headers = asJson(headers)
    }
  }

  const target =
    url.origin === COMMON_URL
      ? url.toString().replace(COMMON_URL, '')
      : url.toString()

  const request = await fetch(target, {
    body: buildBody(method, body),
    cache: dataSource.cache,
    headers,
    method,
  })

  const response = await request.json()
  if (request.ok) {
    return response
  }

  throw response
}

function buildRequest(dataSource: DataSource) {
  const current = dataSource.url?.trim()
  if (!current || !isValid(current)) {
    throw new Error(`Invalid URL: ${dataSource.url}`)
  }

  const url = new URL(current, COMMON_URL)
  const method = buildMethod(dataSource)

  if (dataSource.body && isGetMethod(method)) {
    Object.entries(dataSource.body)
      .filter(([, value]) => value !== undefined && value !== 'undefined')
      .forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
      })
  }

  return [url, method] as const
}

function asJson(headers: HeadersInit) {
  return {
    ...headers,
    'Content-Type': 'application/json',
  }
}

function isValid(value: string) {
  if (!isString(value) || isInterpolated(value)) {
    return false
  }
  return !REGEX_INVALID_URL_SEGMENTS.test(value)
}

function buildMethod(dataSource: DataSource) {
  return dataSource.method ?? 'GET'
}

function buildHeaders(dataSource: DataSource): HeadersInit {
  const headers = dataSource.headers ?? {}
  return {
    Accept: 'application/json',
    ...headers,
  }
}

function isGetMethod(method: string) {
  return method.toUpperCase() === 'GET'
}

function buildBody(method: string, body?: BodyInit | Record<string, unknown>) {
  if (!isGetMethod(method)) {
    return body as BodyInit
  }
}
