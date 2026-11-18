import useSWR from 'swr'
import {
  getArray,
  isInterpolated,
  logger,
  matchRemotePattern,
  type DataSource,
  type Nullable,
} from '@luna-form/core'
import type { Config } from '../../type'

/**
 * The options a source gives: its array, or what its request answered.
 * `fetching` while a request is out and has not answered yet.
 */
export function useFetch<T>(
  dataSource: Nullable<DataSource | T[]> = null,
  config: Config,
  disabled = false
): Readonly<{ data: Nullable<T[]>; fetching: boolean }> {
  const { data, error, isLoading } = useSWR<Record<string, T> | T[]>(
    buildSource(dataSource, config, disabled),
    config.fetcher.provider
  )

  if (error) {
    logger.error('Error fetching data source:', error)
  }

  if (Array.isArray(dataSource)) {
    return { data: dataSource, fetching: false }
  }
  return {
    data: dataSource && data ? getArray(data, dataSource.namespace) : null,
    fetching: isLoading,
  }
}

function buildSource<T>(
  dataSource: Nullable<DataSource | Array<T>> = null,
  config: Config,
  disabled = false
): Nullable<DataSource | Array<T>> {
  if (dataSource && !Array.isArray(dataSource) && !disabled) {
    if (dataSource.url) {
      const interpolated = isInterpolated(dataSource.url)
      if (!interpolated) {
        const allowed = matchRemotePattern(
          dataSource.url,
          config.fetcher.remotePatterns
        )

        if (allowed) {
          return dataSource
        }

        logger.warn(
          `URL blocked by remotePatterns: ${dataSource.url}. Check your luna.config.ts`
        )
      }
    }
  }
  return null
}
