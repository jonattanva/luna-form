import {
  dateFormatOf,
  evaluateCondition,
  flattenListFields,
  isString,
  translate,
  type Localization,
} from '@luna-form/core'
import { FieldListItem } from '../../../component/field/field-list-item'
import { FieldPreview } from './field-preview'
import { FieldPreviewValue } from './field-preview-value'
import { resolveValue } from '../../lib/resolve-value'
import { useLiveItemValue } from '../../hook/use-live-item-value'
import { useMemo } from 'react'
import type { DateFormat, List, Nullable, PreviewItem } from '@luna-form/core'
import type { ReactNode } from 'react'

export function FieldListPreviewItem({
  canRemove,
  children,
  field,
  index,
  isMultiField,
  itemKey,
  label,
  localization,
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
  localization?: Localization
  onRemove: (index: number) => void
  previewBadge?: PreviewItem
  previewLabel?: PreviewItem
  previewTags?: PreviewItem[]
  value?: Nullable<Record<string, unknown> | unknown[]>
}) {
  const { lang, translations } = localization ?? {}
  const name = `${field.name}.${itemKey}`
  const fallbackLabel = `${label} ${index + 1}`

  // The label names one leaf of the row; when that leaf is a date, the label
  // shows it the way the field does. See `dateFormatOf`.
  const labelDateFormat = useMemo(() => {
    const leaf = isString(previewLabel) ? previewLabel : previewLabel?.field
    return leaf
      ? dateFormatOf(flattenListFields(field.fields)[leaf])
      : undefined
  }, [field.fields, previewLabel])

  return (
    <FieldListItem
      canRemove={canRemove}
      collapsed={field.advanced?.collapsed}
      index={index}
      isMultiField={isMultiField}
      label={label}
      onRemove={onRemove}
      previewLabel={renderPreviewLabel({
        dateFormat: labelDateFormat,
        fallbackLabel,
        lang,
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
            localization={localization}
            name={name}
            previews={previewBadge}
            value={value}
          />
        ) : undefined
      }
      previewTags={
        previewTags ? (
          <FieldPreview
            fields={field.fields}
            localization={localization}
            name={name}
            previews={previewTags}
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
  dateFormat?: DateFormat
  fallbackLabel: string
  lang?: string
  item: Exclude<PreviewItem, string>
  name: string
  translations?: Record<string, string>
  value?: Nullable<Record<string, unknown> | unknown[]>
}>

function renderPreviewLabel({
  dateFormat,
  fallbackLabel,
  lang,
  name,
  previewLabel,
  translations,
  value,
}: {
  dateFormat?: DateFormat
  fallbackLabel: string
  lang?: string
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
        dateFormat={dateFormat}
        fallbackLabel={fallbackLabel}
        item={item}
        lang={lang}
        name={name}
        translations={translations}
        value={value}
      />
    )
  }

  return previewLabelContent({
    dateFormat,
    fallbackLabel,
    item,
    lang,
    name,
    translations,
    value,
  })
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
  dateFormat,
  fallbackLabel,
  item,
  lang,
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
      dateFormat={dateFormat}
      initialValue={value ? resolveValue(fieldName, value) : undefined}
      lang={lang}
      name={fieldName}
    >
      {(value) => value || fallbackLabel}
    </FieldPreviewValue>
  )
}
