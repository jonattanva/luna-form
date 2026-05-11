import { evaluateCondition, translate } from '@luna-form/core'
import { FieldPreviewItem } from './field-preview-item'
import { resolveValue } from '../../lib/resolve-value'
import { useMemo } from 'react'
import type { PreviewItem } from '@luna-form/core'

type NormalizedPreview = Exclude<PreviewItem, string>

function normalize(item: PreviewItem): NormalizedPreview {
  if (typeof item === 'string') {
    return { field: item }
  }
  return item
}

export function FieldPreview({
  className,
  label = 'Preview',
  name,
  previews,
  translations,
  value,
}: Readonly<{
  className?: string
  label?: string
  name: string
  previews: PreviewItem | PreviewItem[]
  translations?: Record<string, string>
  value?: Record<string, unknown> | unknown[] | null
}>) {
  const items = useMemo(
    () => (Array.isArray(previews) ? previews : [previews]).map(normalize),
    [previews]
  )

  const itemValue = useMemo(
    () => (value ? resolveValue(name, value) : undefined),
    [name, value]
  )

  const visibleItems = useMemo(
    () =>
      items
        .map((item, index) => {
          if (
            item.when !== undefined &&
            !evaluateCondition(itemValue, item.when)
          ) {
            return null
          }

          if (item.label !== undefined) {
            return {
              key: item.field ?? `label:${item.label}:${index}`,
              staticLabel: translate(item.label, translations),
            }
          }

          if (item.field === undefined) {
            return null
          }

          return {
            key: item.field,
            initialValue:
              value != null
                ? resolveValue(`${name}.${item.field}`, value)
                : undefined,
            previewName: `${name}.${item.field}`,
          }
        })
        .filter(<T,>(value: T | null): value is T => value != null),
    [items, itemValue, name, value, translations]
  )

  if (visibleItems.length === 0) {
    return null
  }

  return (
    <div
      aria-label={label}
      className="flex items-center gap-1.5 overflow-hidden"
    >
      {visibleItems.map((item, index) => (
        <FieldPreviewItem
          className={className}
          initialValue={'initialValue' in item ? item.initialValue : undefined}
          key={item.key}
          name={'previewName' in item ? item.previewName : undefined}
          separator={index > 0}
          staticLabel={'staticLabel' in item ? item.staticLabel : undefined}
        />
      ))}
    </div>
  )
}
