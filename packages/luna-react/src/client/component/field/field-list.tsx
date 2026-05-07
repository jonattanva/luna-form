import { FieldListPreviewItem } from './field-list-preview-item'
import { getLabel, isMultiFieldList } from '@luna-form/core'
import { twMerge } from 'tailwind-merge'
import { useFieldList } from '../../hook/use-field-list'
import type { ListProps } from '../../../component/field/field-list'

const ADD_BUTTON_BASE_CLASSES =
  'flex h-9 w-full items-center gap-2 rounded-md border border-dashed border-slate-200 px-4 text-sm font-medium text-slate-500 transition-colors duration-150 hover:border-slate-300 hover:text-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200'

export function FieldList(props: ListProps) {
  const { field, value, children } = props

  const [items, addItem, handleRemove, canAdd, canRemove, max] = useFieldList(
    field,
    value
  )

  const label = getLabel(field)
  const action = field.advanced?.action ?? 'Add item'

  const hasLimit = max !== Infinity
  const isMultiField = isMultiFieldList(field)

  const {
    label: previewLabel,
    tags: previewTags,
    badge: previewBadge,
  } = field.advanced?.preview ?? {}

  return (
    <div className="flex w-full flex-col gap-4">
      {items.map((key, index) => (
        <FieldListPreviewItem
          canRemove={canRemove}
          field={field}
          index={index}
          isMultiField={isMultiField}
          itemKey={key}
          key={key}
          label={label}
          onRemove={handleRemove}
          previewBadge={previewBadge}
          previewLabel={previewLabel}
          previewTags={previewTags}
          value={value}
        >
          {children(key)}
        </FieldListPreviewItem>
      ))}
      <button
        aria-disabled={!canAdd}
        aria-label={hasLimit ? `${action}, ${items.length} of ${max}` : action}
        className={twMerge(
          ADD_BUTTON_BASE_CLASSES,
          hasLimit ? 'justify-between' : 'justify-center',
          !canAdd &&
            'cursor-not-allowed opacity-50 hover:border-slate-200 hover:text-slate-500 dark:hover:border-slate-800 dark:hover:text-slate-400'
        )}
        disabled={!canAdd}
        onClick={addItem}
        type="button"
      >
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="text-base leading-none">
            +
          </span>
          {action}
        </span>
        {hasLimit && (
          <span
            aria-hidden="true"
            className="text-slate-400 tabular-nums dark:text-slate-500"
          >
            {items.length} / {max}
          </span>
        )}
      </button>
    </div>
  )
}
