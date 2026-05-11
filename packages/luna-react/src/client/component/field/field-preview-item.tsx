import { Fragment } from 'react'
import {
  isEmpty,
  isObject,
  resolveOptionLabel,
  type Option,
} from '@luna-form/core'
import { twMerge } from 'tailwind-merge'
import { useResolvedValue } from '../../hook/use-resolved-value'

export function FieldPreviewItem({
  className,
  initialValue,
  name,
  options,
  separator,
  staticLabel,
}: Readonly<{
  className?: string
  initialValue?: unknown
  name?: string
  options?: Array<Option | string>
  separator?: boolean
  staticLabel?: string
}>) {
  const value = useResolvedValue(name ?? '', initialValue)

  if (staticLabel === undefined && options) {
    const raw = Array.isArray(value)
      ? value
      : value == null || value === ''
        ? []
        : [value]

    const labels = raw
      .filter((v) => v !== null && v !== undefined && v !== '')
      .map((v) => resolveOptionLabel(v, options))

    if (labels.length === 0) {
      return null
    }

    return (
      <div className="flex items-center gap-1.5 overflow-hidden">
        {labels.map((label, i) => (
          <Fragment key={`${i}:${label}`}>
            {(separator || i > 0) && (
              <span
                aria-hidden="true"
                className="text-xs text-zinc-300 select-none dark:text-zinc-600"
              >
                ·
              </span>
            )}
            <span
              aria-label={label}
              className={twMerge(
                'max-w-[150px] overflow-hidden text-xs text-ellipsis whitespace-nowrap',
                className
              )}
              title={label}
            >
              {label}
            </span>
          </Fragment>
        ))}
      </div>
    )
  }

  if (staticLabel === undefined) {
    if (isEmpty(value) || isObject(value) || Array.isArray(value)) {
      return null
    }
  }

  const displayValue = staticLabel ?? String(value)

  return (
    <div className="flex items-center gap-1.5 overflow-hidden">
      {separator && (
        <span
          aria-hidden="true"
          className="text-xs text-zinc-300 select-none dark:text-zinc-600"
        >
          ·
        </span>
      )}
      <span
        aria-label={displayValue}
        className={twMerge(
          'max-w-[150px] overflow-hidden text-xs text-ellipsis whitespace-nowrap',
          className
        )}
        title={displayValue}
      >
        {displayValue}
      </span>
    </div>
  )
}
