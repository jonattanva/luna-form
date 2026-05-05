import { FieldPreviewItem } from './field-preview-item'
import { resolveValue } from '../../lib/resolve-value'
import type { Nullable } from '@luna-form/core'

export function FieldPreview({
  name,
  previews,
  value,
}: Readonly<{
  name: string
  previews: string[]
  value?: Nullable<Record<string, unknown>>
}>) {
  return (
    <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
      {previews.map((preview, index) => {
        const path = `${name}.${preview}`
        return (
          <FieldPreviewItem
            initialValue={value ? resolveValue(path, value) : undefined}
            key={preview}
            name={path}
            separator={index > 0}
          />
        )
      })}
    </div>
  )
}
