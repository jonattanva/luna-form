import { evaluateCondition, translate } from '@luna-form/core'
import { FieldListItem } from '../../../component/field/field-list-item'
import { FieldPreview } from './field-preview'
import { FieldPreviewValue } from './field-preview-value'
import { resolveValue } from '../../lib/resolve-value'
import { useLiveItemValue } from '../../hook/use-live-item-value'
import type { List, Nullable, PreviewItem } from '@luna-form/core'
import type { ReactNode } from 'react'

export function FieldListPreviewItem({
  canRemove,
  children,
  field,
  index,
  isMultiField,
  itemKey,
  label,
  onRemove,
  previewBadge,
  previewLabel,
  previewTags,
  translations,
  value,
}: {
  canRemove: boolean
  children: ReactNode
  field: List
  index: number
  isMultiField: boolean
  itemKey: string | number
  label: string
  onRemove: (index: number) => void
  previewBadge?: PreviewItem
  previewLabel?: PreviewItem
  previewTags?: PreviewItem[]
  translations?: Record<string, string>
  value?: Nullable<Record<string, unknown> | unknown[]>
}) {
  const name = `${field.name}.${itemKey}`
  const fallbackLabel = `${label} ${index + 1}`

  // Live item value used to evaluate `previewLabel.when` reactively against
  // user edits. Mirrors FieldPreview's reactive `itemValue` logic.
  const liveItemValue = useLiveItemValue(name, value)

  return (
    <FieldListItem
      canRemove={canRemove}
      collapsed={field.advanced?.collapsed}
      index={index}
      isMultiField={isMultiField}
      label={label}
      onRemove={onRemove}
      previewLabel={renderPreviewLabel({
        fallbackLabel,
        liveItemValue,
        name,
        previewLabel,
        translations,
        value,
      })}
      previewBadge={
        previewBadge ? (
          <FieldPreview
            className="bg-primary text-primary-foreground rounded-md px-1.5 py-0.5 leading-none font-bold uppercase"
            fields={field.fields}
            name={name}
            previews={previewBadge}
            translations={translations}
            value={value}
          />
        ) : undefined
      }
      previewTags={
        previewTags ? (
          <FieldPreview
            fields={field.fields}
            name={name}
            previews={previewTags}
            translations={translations}
            value={value}
          />
        ) : undefined
      }
    >
      {children}
    </FieldListItem>
  )
}

function renderPreviewLabel({
  fallbackLabel,
  liveItemValue,
  name,
  previewLabel,
  translations,
  value,
}: {
  fallbackLabel: string
  liveItemValue: unknown
  name: string
  previewLabel?: PreviewItem
  translations?: Record<string, string>
  value?: Nullable<Record<string, unknown> | unknown[]>
}): ReactNode {
  if (previewLabel === undefined) {
    return undefined
  }

  const item =
    typeof previewLabel === 'string' ? { field: previewLabel } : previewLabel

  if (item.when !== undefined) {
    if (!evaluateCondition(liveItemValue, item.when)) {
      return undefined
    }
  }

  if (item.label !== undefined) {
    return translate(item.label, translations)
  }

  if (item.field === undefined) {
    return undefined
  }

  const fieldName = `${name}.${item.field}`
  return (
    <FieldPreviewValue
      initialValue={value ? resolveValue(fieldName, value) : undefined}
      name={fieldName}
    >
      {(val) => val || fallbackLabel}
    </FieldPreviewValue>
  )
}
