import {
  evaluateCondition,
  flattenListFields,
  getPreviewOptions,
  translate,
  type Option,
} from '@luna-form/core'
import { FieldPreviewItem } from './field-preview-item'
import { resolveValue } from '../../lib/resolve-value'
import { useLiveItemValue } from '../../hook/use-live-item-value'
import { useMemo } from 'react'
import type { Fields, PreviewItem } from '@luna-form/core'

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

type PreviewProps = Readonly<{
  className?: string
  fields?: Fields
  label?: string
  lang?: string
  name: string
  previews: PreviewItem | PreviewItem[]
  translations?: Record<string, string>
  value?: Record<string, unknown> | unknown[] | null
}>

export function FieldPreview(props: PreviewProps) {
  const items = useMemo(
    () =>
      (Array.isArray(props.previews) ? props.previews : [props.previews]).map(
        normalize
      ),
    [props.previews]
  )

  // A condition is the only thing in a preview that has to follow what the user
  // types, and only then does anything here read the form's values. Without one
  // a preview is what the form was given plus the value of each field it names,
  // and every one of those is a subscription of its own, by name.
  if (items.some((item) => item.when !== undefined)) {
    return <LivePreview items={items} {...props} />
  }

  return <PreviewEntries items={items} itemValue={undefined} {...props} />
}

// The row as it stands now, for the conditions that ask. See `useLiveItemValue`
// for what this subscribes to, which is the row and not the record.
function LivePreview(
  props: PreviewProps & Readonly<{ items: NormalizedPreview[] }>
) {
  const itemValue = useLiveItemValue(props.name, props.value)
  return <PreviewEntries itemValue={itemValue} {...props} />
}

function PreviewEntries({
  className,
  fields,
  items,
  itemValue,
  label = 'Preview',
  lang,
  name,
  translations,
  value,
}: PreviewProps &
  Readonly<{ items: NormalizedPreview[]; itemValue: unknown }>) {
  const fieldLookup = useMemo(
    () => (fields ? flattenListFields(fields) : undefined),
    [fields]
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
      const options = childField
        ? getPreviewOptions(childField, { lang, translations })
        : undefined

      result.push({
        key: `${index}:${item.field}`,
        initialValue,
        options,
        previewName,
      })
    }
    return result
  }, [items, itemValue, lang, name, value, translations, fieldLookup])

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
