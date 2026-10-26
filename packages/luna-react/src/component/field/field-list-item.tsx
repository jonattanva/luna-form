import { ChevronIcon } from '../chevron-icon'
import { Collapsible } from '../collapsible'
import { Group } from '../group'
import {
  interpolate,
  splitTemplate,
  translateBuiltIn,
  type BuiltInKey,
} from '@luna-form/core'
import { twMerge } from 'tailwind-merge'
import { useDisclosure } from '../../client/hook/use-disclosure'
import { useId } from 'react'

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
    translations?: Record<string, string>
  }>
) {
  const isCollapsible = props.isMultiField || props.collapsed != null
  const [isOpen, toggle, reveal] = useDisclosure(
    isCollapsible ? !props.collapsed : true
  )

  function handleRemove() {
    if (props.canRemove && props.onRemove) {
      props.onRemove(props.index)
    }
  }

  // The whole accessible name is one dictionary key, placeholders included, so
  // a translation can reorder the parts instead of only renaming them. Left
  // untranslated the template fills in to the English text it replaced.
  const fill = (template: string) =>
    interpolate(template, {
      index: props.index + 1,
      label: props.label,
    })

  // A row that shows a label of its own is named after it: the label is what
  // the toggle displays (WCAG 2.5.3), and it tells rows apart where the list
  // title and position do not. That label is a node, kept up to date as the
  // user types, so the name points at it with aria-labelledby instead of
  // copying its text. The words around it stay in the template, split at
  // `{name}` and held in hidden spans, so a translation still orders them.
  const id = useId()
  const rowNameId = `${id}-name`
  const hasRowName = isCollapsible && props.previewLabel != null

  const accessibleName = (
    slot: string,
    template: BuiltInKey,
    rowTemplate: BuiltInKey
  ) => {
    const parts = hasRowName
      ? splitTemplate(translateBuiltIn(rowTemplate, props.translations), 'name')
      : undefined

    if (parts === undefined) {
      return {
        attributes: {
          'aria-label': fill(translateBuiltIn(template, props.translations)),
        },
      }
    }

    const [before, after] = parts
    const beforeId = `${id}-${slot}-before`
    const afterId = `${id}-${slot}-after`

    return {
      attributes: {
        'aria-labelledby': `${beforeId} ${rowNameId} ${afterId}`,
      },
      parts: (
        <>
          <span hidden id={beforeId}>
            {fill(before)}
          </span>
          <span hidden id={afterId}>
            {fill(after)}
          </span>
        </>
      ),
    }
  }

  const removeName = accessibleName(
    'remove',
    'Remove {label} item {index}',
    'Remove {name} ({label} item {index})'
  )

  const toggleName = accessibleName(
    'toggle',
    isOpen ? 'Collapse {label} {index}' : 'Expand {label} {index}',
    isOpen
      ? 'Collapse {name} ({label} {index})'
      : 'Expand {name} ({label} {index})'
  )

  const removeButton = props.canRemove && props.onRemove != null && (
    <button
      {...removeName.attributes}
      className={twMerge(
        'flex size-6 items-center justify-center rounded text-xl leading-none text-zinc-400',
        'transition-colors duration-150',
        'hover:text-red-500',
        'focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none',
        'dark:text-zinc-500 dark:hover:text-red-400'
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
    <div className="flex min-w-0 flex-col font-medium text-zinc-700 dark:text-zinc-400">
      <span className="text-base" id={rowNameId}>
        {props.previewLabel ?? (
          <>
            {props.label} {props.index + 1}
          </>
        )}
      </span>
      {!isOpen && props.previewTags && (
        <div className="flex items-center gap-2 overflow-hidden text-xs font-normal text-ellipsis whitespace-nowrap text-zinc-500 dark:text-zinc-500">
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
            {...toggleName.attributes}
            aria-expanded={isOpen}
            className={twMerge(
              'group flex min-w-0 grow items-center gap-2 rounded p-1 text-left text-zinc-400',
              'focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none',
              'dark:text-zinc-500'
            )}
            onClick={toggle}
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
      {toggleName.parts}
      {removeButton && removeName.parts}
    </div>
  )

  if (props.isMultiField) {
    return (
      <div
        data-slot="list-item-card"
        className="box-border w-full min-w-0 rounded-lg border border-zinc-100 p-4 dark:border-zinc-900"
      >
        {header}
        <Collapsible onReveal={reveal} visible={isOpen}>
          <Group>{props.children}</Group>
        </Collapsible>
      </div>
    )
  }

  if (isCollapsible) {
    return (
      <div className="box-border flex w-full min-w-0 flex-col gap-2">
        {header}
        <Collapsible onReveal={reveal} visible={isOpen}>
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
