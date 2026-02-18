import { twMerge } from 'tailwind-merge'
import { Group } from '../group'

export function FieldListItem(
  props: Readonly<{
    canRemove?: boolean
    children: React.ReactNode
    index: number
    isMultiField: boolean
    label: string
    onRemove?: (index: number) => void
  }>
) {
  function handleRemove() {
    if (props.canRemove && props.onRemove) {
      props.onRemove(props.index)
    }
  }

  const removeButton = props.canRemove && props.onRemove != null && (
    <button
      aria-label={`Remove ${props.label} item ${props.index + 1}`}
      className={twMerge(
        'rounded p-1 text-xl text-slate-400',
        'transition-colors duration-150',
        'hover:text-red-500',
        'focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none',
        'dark:text-slate-500 dark:hover:text-red-400'
      )}
      onClick={handleRemove}
      type="button"
    >
      <span aria-hidden="true">&#215;</span>
    </button>
  )

  if (props.isMultiField) {
    return (
      <div className="rounded-lg border border-slate-100 p-4 dark:border-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
            {props.label} {props.index + 1}
          </span>
          {removeButton}
        </div>
        <Group>{props.children}</Group>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2">
      <Group>{props.children}</Group>
      {removeButton && <div className="shrink-0">{removeButton}</div>}
    </div>
  )
}
