import { FieldSetBase } from './field-set-base'
import { Group } from '../group'
import { formatMarkdown } from '../../lib/string'
import {
  mergeStyle,
  translateOptional,
  type Section,
  type Style,
} from '@luna-form/core'

// The sections of a form rendered on the server, where a collapsible one is
// open and has no button to close it: opening and closing is state, and this
// tree has none. The client renders the same section with its toggle.
export function StaticFieldSet(
  props: Readonly<{
    advanced?: {
      step?: boolean
    }
    children?: React.ReactNode
    section: Section
    step?: number
    style?: Style
    translations?: Record<string, string>
  }>
) {
  const { fields = [] } = props.section

  const step = props.advanced?.step ? props.step : undefined
  const { compact } = mergeStyle(props.style, {
    compact: props.section.advanced?.compact,
  })

  const group = <Group compact={compact}>{props.children}</Group>
  if (!props.section.title && !props.section.description) {
    return group
  }

  const title = translateOptional(props.section.title, props.translations)
  const description = translateOptional(
    props.section.description,
    props.translations
  )

  if (props.section.advanced?.collapsible) {
    return (
      <fieldset
        data-slot="field-set"
        data-advanced="true"
        data-expanded={true}
        data-empty={fields.length === 0}
        className="flex flex-col"
        id={props.section.id?.toString()}
      >
        <legend>
          <span className="flex items-center gap-2 text-base font-medium text-zinc-600 dark:text-zinc-400">
            {formatMarkdown(title)}
          </span>
        </legend>
        <div
          className="mt-3 ml-1.5 flex flex-col gap-4 border-l-2 border-zinc-300 pl-4 dark:border-zinc-600"
          data-slot="field-set-content"
        >
          {description && (
            <p className="text-sm leading-normal font-normal text-zinc-600 dark:text-zinc-400">
              {formatMarkdown(description)}
            </p>
          )}
          {group}
        </div>
      </fieldset>
    )
  }

  return (
    <FieldSetBase
      description={description}
      empty={fields.length === 0}
      id={props.section.id?.toString()}
      step={step}
      title={title}
    >
      {group}
    </FieldSetBase>
  )
}
