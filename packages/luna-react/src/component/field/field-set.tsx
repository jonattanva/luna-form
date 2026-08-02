import { FieldSetAdvanced } from './field-set-advanced'
import { FieldSetBase } from './field-set-base'
import { Group } from '../group'
import {
  mergeStyle,
  translate,
  type Section,
  type Style,
} from '@luna-form/core'

export function FieldSet(
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

  const title = props.section.title
    ? translate(props.section.title, props.translations)
    : undefined

  const description = props.section.description
    ? translate(props.section.description, props.translations)
    : undefined

  if (props.section.advanced?.collapsible) {
    return (
      <FieldSetAdvanced
        description={description}
        group={group}
        section={props.section}
        title={title}
      />
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
