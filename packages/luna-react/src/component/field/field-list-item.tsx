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
    index: number
    isMultiField: boolean
    label: string
    onRemove?: (index: number) => void
    previewLabel?: React.ReactNode
    previewTags?: React.ReactNode
    previewBadge?: React.ReactNode
  }>
) {
  const isCollapsible = props.isMultiField || props.collapsed != null
  const [isOpen, setIsOpen] = useState(isCollapsible ? !props.collapsed : true)

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
        'flex size-6 items-center justify-center rounded text-xl leading-none text-slate-400',
        'transition-colors duration-150',
        'hover:text-red-500',
        'focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none',
        'dark:text-slate-500 dark:hover:text-red-400'
      )}
      onClick={handleRemove}
      type="button"
    >
      <span aria-hidden="true" className="leading-none">
        &#215;
      </span>
    </button>
  )

  const labelContent = (
    <div className="flex min-w-0 flex-col font-medium text-slate-700 dark:text-slate-400">
      <span className="text-base">
        {props.previewLabel ?? (
          <>
            {props.label} {props.index + 1}
          </>
        )}
      </span>
      {!isOpen && props.previewTags && (
        <div className="flex items-center gap-2 overflow-hidden text-xs font-normal text-ellipsis whitespace-nowrap text-slate-500 dark:text-slate-500">
          {props.previewTags}
        </div>
      )}
    </div>
  )

  const header = (
    <div
      className={twMerge(
        'flex items-center justify-between gap-2',
        props.isMultiField && isOpen && 'mb-3'
      )}
    >
      {isCollapsible ? (
        <div className="flex min-w-0 grow items-center gap-2">
          <button
            aria-expanded={isOpen}
            aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${props.label} ${
              props.index + 1
            }`}
            className={twMerge(
              'group flex grow items-center gap-2 rounded p-1 text-left text-slate-400',
              'focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none',
              'dark:text-slate-500'
            )}
            onClick={handleToggle}
            type="button"
          >
            <ChevronIcon expanded={isOpen} />
            {labelContent}
          </button>
          {!isOpen && props.previewBadge && (
            <div className="ml-auto shrink-0">{props.previewBadge}</div>
          )}
        </div>
      ) : (
        labelContent
      )}
      {removeButton}
    </div>
  )

  if (props.isMultiField) {
    return (
      <div
        data-slot="list-item-card"
        className="box-border w-full min-w-0 rounded-lg border border-slate-100 p-4 dark:border-slate-900"
      >
        {header}
        <Collapsible visible={isOpen}>
          <Group>{props.children}</Group>
        </Collapsible>
      </div>
    )
  }

  if (isCollapsible) {
    return (
      <div className="box-border flex w-full min-w-0 flex-col gap-2">
        {header}
        <Collapsible visible={isOpen}>
          <Group>{props.children}</Group>
        </Collapsible>
      </div>
    )
  }

  return (
    <div className="box-border flex w-full min-w-0 items-start gap-2">
      <div className="flex min-w-0 grow flex-col">
        <Group>{props.children}</Group>
      </div>
      {removeButton && <div className="shrink-0">{removeButton}</div>}
    </div>
  )
}
