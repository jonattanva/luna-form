import { FieldPreviewItem } from './field-preview-item'

export function FieldPreview({
  name,
  previews,
}: Readonly<{
  name: string
  previews: string[]
}>) {
  return (
    <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
      {previews.map((preview, index) => (
        <FieldPreviewItem
          key={preview}
          name={`${name}.${preview}`}
          separator={index > 0}
        />
      ))}
    </div>
  )
}
