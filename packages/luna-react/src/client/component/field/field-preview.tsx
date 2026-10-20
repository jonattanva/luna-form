import {
  dateFormatOf,
  evaluateCondition,
  flattenListFields,
  getPreviewOptions,
  translate,
  type DateFormat,
  type Option,
  type Localization,
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
      dateFormat?: DateFormat
      key: string
      previewName: string
      initialValue: unknown
      options?: Array<Option | string>
    }

/**
 * The row that holds the list `name` is a row of, or `undefined` for a
 * top-level list, which has none. A row is `<list>.<index>`, and a nested list
 * is named after its own row (`section.0.field`), so the row above is what is
 * left once the index and the list's own name are taken off.
 */
function parentRowOf(name: string): string | undefined {
  const segments = name.split('.')
  return segments.length > 2 ? segments.slice(0, -2).join('.') : undefined
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
  localization?: Localization
  name: string
  previews: PreviewItem | PreviewItem[]
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
  localization,
  name,
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
          staticLabel: translate(item.label, localization?.translations),
        })
        continue
      }

      if (item.field === undefined) {
        continue
      }

      // A parent entry reads the row that holds this list; its field is not one
      // of this list's leaves, so it has no options or date format to borrow.
      const parentRow = item.scope === 'parent' ? parentRowOf(name) : name
      if (parentRow === undefined) {
        continue
      }

      const previewName = `${parentRow}.${item.field}`
      const initialValue =
        value != null ? resolveValue(previewName, value) : undefined

      const childField =
        item.scope === 'parent' ? undefined : fieldLookup?.[item.field]
      const options = childField
        ? getPreviewOptions(childField, localization)
        : undefined

      result.push({
        dateFormat: dateFormatOf(childField),
        key: `${index}:${item.field}`,
        initialValue,
        options,
        previewName,
      })
    }
    return result
  }, [items, itemValue, localization, name, value, fieldLookup])

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
          dateFormat={'dateFormat' in item ? item.dateFormat : undefined}
          initialValue={'initialValue' in item ? item.initialValue : undefined}
          key={item.key}
          lang={localization?.lang}
          name={'previewName' in item ? item.previewName : undefined}
          options={'options' in item ? item.options : undefined}
          separator={index > 0}
          staticLabel={'staticLabel' in item ? item.staticLabel : undefined}
        />
      ))}
    </div>
  )
}
