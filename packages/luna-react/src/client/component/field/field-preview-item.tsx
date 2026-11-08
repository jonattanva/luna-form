import { Fragment } from 'react'
import {
  previewText,
  resolveOptionLabel,
  type DateFormat,
  type Option,
} from '@luna-form/core'
import { twMerge } from 'tailwind-merge'
import { useResolvedValue } from '../../hook/use-resolved-value'

// What one entry of a preview reads: its own text, the label of every option
// its value picks, or the value itself as a preview shows one.
function previewLabels(
  value: unknown,
  entry: Readonly<{
    dateFormat?: DateFormat
    lang?: string
    options?: Array<Option | string>
    staticLabel?: string
  }>
): string[] {
  const { dateFormat, lang, options, staticLabel } = entry
  if (staticLabel !== undefined) {
    return [staticLabel]
  }

  if (options) {
    const raw = Array.isArray(value)
      ? value
      : value == null || value === ''
        ? []
        : [value]

    return raw
      .filter((v) => v !== null && v !== undefined && v !== '')
      .map((v) => resolveOptionLabel(v, options))
  }

  const text = previewText(value, dateFormat, lang)
  return text ? [text] : []
}

export function FieldPreviewItem({
  className,
  dateFormat,
  initialValue,
  lang,
  name,
  options,
  separator,
  staticLabel,
}: Readonly<{
  className?: string
  dateFormat?: DateFormat
  initialValue?: unknown
  lang?: string
  name?: string
  options?: Array<Option | string>
  separator?: boolean
  staticLabel?: string
}>) {
  const value = useResolvedValue(name ?? '', initialValue)

  // One entry for a text, one per selected option for a field with options,
  // and the same markup for both: a dot before each one but the first of the
  // preview, and the text, cut short where it runs long.
  const labels = previewLabels(value, {
    dateFormat,
    lang,
    options,
    staticLabel,
  })

  if (labels.length === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-1.5 overflow-hidden">
      {labels.map((label, i) => (
        <Fragment key={i}>
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
