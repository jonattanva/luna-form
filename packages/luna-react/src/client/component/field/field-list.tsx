import { FieldListItem } from '../../../component/field/field-list-item'
import { FieldPreview } from './field-preview'
import { getLabel, isMultiFieldList } from '@luna-form/core'
import { twMerge } from 'tailwind-merge'
import { useFieldList } from '../../hook/use-field-list'
import type { ListProps } from '../../../component/field/field-list'

export function FieldList(props: ListProps) {
  const [items, addItem, handleRemove, canAdd, canRemove, max] = useFieldList(
    props.field,
    props.value
  )

  const label = getLabel(props.field)
  const action = props.field.advanced?.action ?? 'Add item'

  const hasLimit = max !== Infinity

  const isMultiField = isMultiFieldList(props.field)
  const previews = props.field.advanced?.preview

  return (
    <>
      {items.map((key, index) => (
        <FieldListItem
          canRemove={canRemove}
          collapsible={props.field.advanced?.collapsible}
          collapsed={props.field.advanced?.collapsed}
          index={index}
          isMultiField={isMultiField}
          key={key}
          label={label}
          onRemove={handleRemove}
          preview={
            previews && (
              <FieldPreview
                name={`${props.field.name}.${key}`}
                previews={previews}
                value={props.value}
              />
            )
          }
        >
          {props.children(key)}
        </FieldListItem>
      ))}
      <button
        aria-disabled={!canAdd}
        aria-label={hasLimit ? `${action}, ${items.length} of ${max}` : action}
        className={twMerge(
          'flex h-9 w-full items-center gap-2 rounded-md border border-dashed border-slate-200 px-4',
          'text-sm font-medium text-slate-500',
          'transition-colors duration-150',
          'hover:border-slate-300 hover:text-slate-800',
          'focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:outline-none',
          'dark:border-slate-800 dark:text-slate-400',
          'dark:hover:border-slate-700 dark:hover:text-slate-200',
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
    </>
  )
}
