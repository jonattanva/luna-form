import { getLabel, isMultiFieldList } from '@luna-form/core'
import { FieldListItem } from '../../../component/field/field-list-item'
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

  return (
    <>
      {items.map((key, index) => (
        <FieldListItem
          canRemove={canRemove}
          index={index}
          isMultiField={isMultiField}
          key={key}
          label={label}
          onRemove={handleRemove}
        >
          {props.children(key)}
        </FieldListItem>
      ))}
      <button
        aria-disabled={!canAdd}
        aria-label={hasLimit ? `${action}, ${items.length} of ${max}` : action}
        className={twMerge(
          'flex w-full items-center gap-1.5 rounded py-1',
          'text-sm font-medium text-slate-500',
          'transition-colors duration-150',
          'hover:text-slate-800',
          'focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:outline-none',
          'dark:text-slate-400 dark:hover:text-slate-200',
          !canAdd &&
            'cursor-not-allowed opacity-50 hover:text-slate-500 dark:hover:text-slate-400'
        )}
        disabled={!canAdd}
        onClick={addItem}
        type="button"
      >
        <span aria-hidden="true">+</span>
        {action}
        {hasLimit && (
          <span
            aria-hidden="true"
            className="ml-auto text-slate-400 tabular-nums dark:text-slate-500"
          >
            {items.length} / {max}
          </span>
        )}
      </button>
    </>
  )
}
