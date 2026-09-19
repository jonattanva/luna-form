import { evaluateCondition, isString, translate } from '@luna-form/core'
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
  lang,
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
  lang?: string
  onRemove: (index: number) => void
  previewBadge?: PreviewItem
  previewLabel?: PreviewItem
  previewTags?: PreviewItem[]
  translations?: Record<string, string>
  value?: Nullable<Record<string, unknown> | unknown[]>
}) {
  const name = `${field.name}.${itemKey}`
  const fallbackLabel = `${label} ${index + 1}`

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
            lang={lang}
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
            lang={lang}
            name={name}
            previews={previewTags}
            translations={translations}
            value={value}
          />
        ) : undefined
      }
      translations={translations}
    >
      {children}
    </FieldListItem>
  )
}

type PreviewLabelProps = Readonly<{
  fallbackLabel: string
  item: Exclude<PreviewItem, string>
  name: string
  translations?: Record<string, string>
  value?: Nullable<Record<string, unknown> | unknown[]>
}>

function renderPreviewLabel({
  fallbackLabel,
  name,
  previewLabel,
  translations,
  value,
}: {
  fallbackLabel: string
  name: string
  previewLabel?: PreviewItem
  translations?: Record<string, string>
  value?: Nullable<Record<string, unknown> | unknown[]>
}): ReactNode {
  if (previewLabel === undefined) {
    return undefined
  }

  const item = isString(previewLabel) ? { field: previewLabel } : previewLabel

  // A condition is the only part of a label that has to follow what the user
  // types, and it reads the row from a component of its own. A row whose label
  // asks nothing -- or that has no label at all, which is most of them -- then
  // never subscribes to the form's values.
  if (item.when !== undefined) {
    return (
      <ConditionalPreviewLabel
        fallbackLabel={fallbackLabel}
        item={item}
        name={name}
        translations={translations}
        value={value}
      />
    )
  }

  return previewLabelContent({ fallbackLabel, item, name, translations, value })
}

function ConditionalPreviewLabel(props: PreviewLabelProps) {
  const liveItemValue = useLiveItemValue(props.name, props.value)

  const content = evaluateCondition(liveItemValue, props.item.when)
    ? previewLabelContent(props)
    : undefined

  // `FieldListItem` shows "label index" for a row that hands it no label, and
  // a row that hands it this component has handed it one: what a condition
  // that does not hold falls back to is this component's to render.
  return content ?? props.fallbackLabel
}

function previewLabelContent({
  fallbackLabel,
  item,
  name,
  translations,
  value,
}: PreviewLabelProps): ReactNode {
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
      {(value) => value || fallbackLabel}
    </FieldPreviewValue>
  )
}
