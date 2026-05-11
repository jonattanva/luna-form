import {
  evaluateCondition,
  flattenListFields,
  getPreviewOptions,
  translate,
  type Option,
} from '@luna-form/core'
import { FieldPreviewItem } from './field-preview-item'
import { resolveValue } from '../../lib/resolve-value'
import { useMemo } from 'react'
import type { Column, Field, PreviewItem } from '@luna-form/core'

type NormalizedPreview = Exclude<PreviewItem, string>

type Entry =
  | { key: string; staticLabel: string }
  | {
      key: string
      previewName: string
      initialValue: unknown
      options?: Array<Option | string>
    }

function normalize(item: PreviewItem): NormalizedPreview {
  if (typeof item === 'string') {
    return { field: item }
  }
  return item
}

export function FieldPreview({
  className,
  fields,
  label = 'Preview',
  name,
  previews,
  translations,
  value,
}: Readonly<{
  className?: string
  fields?: Array<Field | Column>
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

  const fieldLookup = useMemo(
    () => (fields ? flattenListFields(fields) : undefined),
    [fields]
  )

  const itemValue = useMemo(
    () => (value ? resolveValue(name, value) : undefined),
    [name, value]
  )

  const visibleItems = useMemo<Entry[]>(() => {
    const result: Entry[] = []
    for (const [index, item] of items.entries()) {
      if (item.when !== undefined && !evaluateCondition(itemValue, item.when)) {
        continue
      }

      if (item.label !== undefined) {
        result.push({
          key: item.field ?? `label:${item.label}:${index}`,
          staticLabel: translate(item.label, translations),
        })
        continue
      }

      if (item.field === undefined) {
        continue
      }

      const previewName = `${name}.${item.field}`
      const initialValue =
        value != null ? resolveValue(previewName, value) : undefined

      const childField = fieldLookup?.[item.field]
      const options = childField ? getPreviewOptions(childField) : undefined

      result.push({
        key: item.field,
        initialValue,
        options,
        previewName,
      })
    }
    return result
  }, [items, itemValue, name, value, translations, fieldLookup])

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
          options={'options' in item ? item.options : undefined}
          separator={index > 0}
          staticLabel={'staticLabel' in item ? item.staticLabel : undefined}
        />
      ))}
    </div>
  )
}
