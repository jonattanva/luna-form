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
    <span className="text-sm font-medium text-slate-300 group-hover:underline dark:text-slate-400">
      {props.label} {props.index + 1}
      {!isOpen && props.preview && (
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap text-slate-400 dark:text-slate-500">
          {props.preview}
        </div>
      )}
    </span>
  )

  const header = (props.isMultiField || props.collapsible) && (
    <div
      className={twMerge(
        'flex items-center justify-between gap-2',
        props.isMultiField && 'mb-3'
      )}
    >
      {props.collapsible ? (
        <button
          aria-expanded={isOpen}
          aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${props.label} ${props.index + 1}`}
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
        className="rounded-lg border border-slate-100 p-4 dark:border-slate-900"
      >
        {header}
        <Collapsible visible={isOpen}>
          <Group>{props.children}</Group>
        </Collapsible>
      </div>
    )
  }

  if (props.collapsible) {
    return (
      <div className="flex flex-col gap-2">
        {header}
        <Collapsible visible={isOpen}>
          <Group>{props.children}</Group>
        </Collapsible>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2">
      <div className="flex grow flex-col">
        <Group>{props.children}</Group>
      </div>
      {removeButton && <div className="shrink-0">{removeButton}</div>}
    </div>
  )
}
