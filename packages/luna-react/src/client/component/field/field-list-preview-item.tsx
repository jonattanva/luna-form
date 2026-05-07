import { FieldListItem } from '../../../component/field/field-list-item'
import { FieldPreview } from './field-preview'
import { FieldPreviewValue } from './field-preview-value'
import { resolveValue } from '../../lib/resolve-value'
import type { List, Nullable } from '@luna-form/core'
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
  previewBadge?: string | string[]
  previewLabel?: string
  previewTags?: string | string[]
  value?: Nullable<Record<string, unknown> | unknown[]>
}) {
  const name = `${field.name}.${itemKey}`

  return (
    <FieldListItem
      canRemove={canRemove}
      collapsed={field.advanced?.collapsed}
      index={index}
      isMultiField={isMultiField}
      label={label}
      onRemove={onRemove}
      previewLabel={
        previewLabel ? (
          <FieldPreviewValue
            initialValue={
              value ? resolveValue(`${name}.${previewLabel}`, value) : undefined
            }
            name={`${name}.${previewLabel}`}
          >
            {(val) => val || `${label} ${index + 1}`}
          </FieldPreviewValue>
        ) : undefined
      }
      previewBadge={
        previewBadge ? (
          <FieldPreview
            className="bg-primary text-primary-foreground rounded-md px-1.5 py-0.5 leading-none font-bold uppercase"
            name={name}
            previews={previewBadge}
            value={value}
          />
        ) : undefined
      }
      previewTags={
        previewTags ? (
          <FieldPreview name={name} previews={previewTags} value={value} />
        ) : undefined
      }
    >
      {children}
    </FieldListItem>
  )
}
