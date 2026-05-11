import { ChevronIcon } from '../chevron-icon'
import { Collapsible } from '../collapsible'
import { formatMarkdown } from '../../lib/string'
import { useCallback, useState } from 'react'
import type { Section } from '@luna-form/core'

export function FieldSetAdvanced(
  props: Readonly<{
    section: Section
    group: React.ReactNode
  }>
) {
  const { fields = [] } = props.section

  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = useCallback(() => setIsOpen((previous) => !previous), [])

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
          className="flex cursor-pointer items-center gap-2 text-base font-medium text-zinc-600 dark:text-zinc-400"
          onClick={handleOpen}
          type="button"
        >
          <ChevronIcon expanded={isOpen} />
          <span>{formatMarkdown(props.section.title)}</span>
        </button>
      </legend>
      <Collapsible visible={isOpen}>
        <div
          className="mt-3 ml-1.5 flex flex-col gap-4 border-l-2 border-zinc-300 pl-4 dark:border-zinc-600"
          data-slot="field-set-content"
        >
          {props.section.description && (
            <p className="text-sm leading-normal font-normal text-zinc-600 dark:text-zinc-400">
              {formatMarkdown(props.section.description)}
            </p>
          )}
          {props.group}
        </div>
      </Collapsible>
    </fieldset>
  )
}
