import { Activity, useState } from 'react'
import { ChevronIcon } from '../chevron-icon'
import { Group } from '../group'
import { twMerge } from 'tailwind-merge'

export function FieldListItem(
  props: Readonly<{
    canRemove?: boolean
    children: React.ReactNode
    collapsed?: boolean
    collapsible?: boolean
    index: number
    isMultiField: boolean
    label: string
    onRemove?: (index: number) => void
  }>
) {
  const [isOpen, setIsOpen] = useState(!props.collapsed)

  function handleRemove() {
    if (props.canRemove && props.onRemove) {
      props.onRemove(props.index)
    }
  }

  function handleToggle() {
    setIsOpen((previous) => !previous)
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
          <div className="flex items-center gap-2">
            {props.collapsible && (
              <button
                aria-label={isOpen ? 'Collapse' : 'Expand'}
                className={twMerge(
                  'rounded p-1 text-slate-400 hover:bg-slate-50',
                  'transition-colors duration-150',
                  'dark:text-slate-500 dark:hover:bg-slate-800'
                )}
                onClick={handleToggle}
                type="button"
              >
                <ChevronIcon expanded={isOpen} />
              </button>
            )}
            <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
              {props.label} {props.index + 1}
            </span>
          </div>
          {removeButton}
        </div>
        <Activity mode={isOpen ? 'visible' : 'hidden'}>
          <Group>{props.children}</Group>
        </Activity>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2">
      {props.collapsible && (
        <button
          aria-label={isOpen ? 'Collapse' : 'Expand'}
          className={twMerge(
            'mt-1 rounded p-1 text-slate-400 hover:bg-slate-50',
            'transition-colors duration-150',
            'dark:text-slate-500 dark:hover:bg-slate-800'
          )}
          onClick={handleToggle}
          type="button"
        >
          <ChevronIcon expanded={isOpen} />
        </button>
      )}
      <div className="flex grow flex-col">
        <Activity mode={isOpen ? 'visible' : 'hidden'}>
          <Group>{props.children}</Group>
        </Activity>
      </div>
      {removeButton && <div className="shrink-0">{removeButton}</div>}
    </div>
  )
}
