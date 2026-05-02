import { ChevronIcon } from '../chevron-icon'
import { Collapsible } from '../collapsible'
import { Group } from '../group'
import { twMerge } from 'tailwind-merge'
import { useState } from 'react'

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
    preview?: React.ReactNode
  }>
) {
  // When `collapsible` is false there is no toggle button, so `collapsed: true`
  // would render an unreachable state. Ignore `collapsed` in that case.
  const [isOpen, setIsOpen] = useState(
    props.collapsible ? !props.collapsed : true
  )

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
      <div
        data-slot="list-item-card"
        className="rounded-lg border border-slate-100 p-4 dark:border-slate-900"
      >
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
            <span className="text-sm font-medium text-slate-300 dark:text-slate-400">
              {props.label} {props.index + 1}
              {!isOpen && props.preview && (
                <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap text-slate-400 dark:text-slate-500">
                  {props.preview}
                </div>
              )}
            </span>
          </div>
          {removeButton}
        </div>
        <Collapsible visible={isOpen}>
          <Group>{props.children}</Group>
        </Collapsible>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2">
      {props.collapsible && (
        <button
          aria-label={isOpen ? 'Collapse' : 'Expand'}
          className={twMerge(
            'rounded p-1 text-slate-400 hover:bg-slate-50',
            'transition-colors duration-150',
            'dark:text-slate-500 dark:hover:bg-slate-800',
            isOpen && 'mt-7'
          )}
          onClick={handleToggle}
          type="button"
        >
          <ChevronIcon expanded={isOpen} />
        </button>
      )}
      <div className="flex grow flex-col">
        <Collapsible visible={isOpen}>
          <Group>{props.children}</Group>
        </Collapsible>
      </div>
      {removeButton && (
        <div className={twMerge('shrink-0', isOpen && 'mt-7')}>
          {removeButton}
        </div>
      )}
    </div>
  )
}
