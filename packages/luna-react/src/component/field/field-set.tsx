import { Activity, useState } from 'react'
import { ChevronIcon } from '../chevron-icon'
import { Group } from '../group'
import { Legend } from '../legend'
import { formatMarkdown } from '../../lib/string'
import { mergeStyle, type Section, type Style } from '@luna-form/core'

export function FieldSet(
  props: Readonly<{
    children?: React.ReactNode
    section: Section
    style?: Style
  }>
) {
  const fields = props.section.fields || []
  const [isOpen, setIsOpen] = useState(false)

  const { compact } = mergeStyle(props.style, {
    compact: props.section.compact,
  })

  if (!props.section.title && !props.section.description) {
    return <Group compact={compact}>{props.children}</Group>
  }

  if (props.section.advanced) {
    return (
      <fieldset
        data-slot="field-set"
        data-advanced="true"
        data-expanded={isOpen}
        data-empty={fields.length === 0}
        className="flex flex-col"
        id={props.section.id?.toString()}
      >
        <legend>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex cursor-pointer items-center gap-2 text-base font-medium text-slate-600 dark:text-slate-400"
          >
            <ChevronIcon expanded={isOpen} />
            <span>{formatMarkdown(props.section.title)}</span>
          </button>
        </legend>
        <Activity mode={isOpen ? 'visible' : 'hidden'}>
          <div
            className="mt-3 flex flex-col gap-4 border-l-2 border-slate-300 pl-4 dark:border-slate-600"
            data-slot="field-set-content"
          >
            {props.section.description && (
              <p className="text-sm leading-normal font-normal text-slate-600 dark:text-slate-400">
                {formatMarkdown(props.section.description)}
              </p>
            )}
            <Group compact={compact}>{props.children}</Group>
          </div>
        </Activity>
      </fieldset>
    )
  }

  return (
    <fieldset
      data-slot="field-set"
      data-empty={fields.length === 0}
      className="flex flex-col data-[empty=false]:gap-6"
      id={props.section.id?.toString()}
    >
      <Legend
        description={props.section.description}
        title={props.section.title}
      />
      <Group compact={compact}>{props.children}</Group>
    </fieldset>
  )
}
