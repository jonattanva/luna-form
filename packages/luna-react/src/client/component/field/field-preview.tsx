import { FieldPreviewItem } from './field-preview-item'
import { resolveValue } from '../../lib/resolve-value'
import { useMemo } from 'react'

export function FieldPreview({
  className,
  label = 'Preview',
  name,
  previews,
  value,
}: Readonly<{
  className?: string
  label?: string
  name: string
  previews: string | string[]
  value?: Record<string, unknown> | unknown[] | null
}>) {
  const fields = useMemo(
    () => (Array.isArray(previews) ? previews : [previews]),
    [previews]
  )

  const resolvedValues = useMemo(() => {
    if (value == null) {
      return {}
    }

    return Object.fromEntries(
      fields.map((preview) => [
        preview,
        resolveValue(`${name}.${preview}`, value),
      ])
    )
  }, [fields, value, name])

  return (
    <div
      aria-label={label}
      className="flex items-center gap-1.5 overflow-hidden"
    >
      {fields.map((preview, index) => (
        <FieldPreviewItem
          className={className}
          initialValue={resolvedValues[preview]}
          key={preview}
          name={`${name}.${preview}`}
          separator={index > 0}
        />
      ))}
    </div>
  )
}
