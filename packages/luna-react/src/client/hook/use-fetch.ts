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

export function useFetch<T>(
  dataSource: Nullable<DataSource | T[]> = null,
  config: Config,
  disabled = false
): Nullable<T[]> {
  const { data, error } = useSWR<Record<string, T> | T[]>(
    buildSource(dataSource, config, disabled),
    config.fetcher.provider
  )

  if (error) {
    logger.error('Error fetching data source:', error)
  }

  if (dataSource) {
    if (Array.isArray(dataSource)) {
      return dataSource
    }

    if (data) {
      return getArray(data, dataSource.namespace)
    }
  }

  return null
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
