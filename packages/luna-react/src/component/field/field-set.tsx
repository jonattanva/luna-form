import { FieldSetAdvanced } from './field-set-advanced'
import { FieldSetBase } from './field-set-base'
import { Group } from '../group'
import { mergeStyle, type Section, type Style } from '@luna-form/core'

export function FieldSet(
  props: Readonly<{
    advanced?: {
      step?: boolean
    }
    children?: React.ReactNode
    section: Section
    step?: number
    style?: Style
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

  if (props.section.advanced?.collapsible) {
    return <FieldSetAdvanced section={props.section} group={group} />
  }

  return (
    <FieldSetBase
      description={props.section.description}
      empty={fields.length === 0}
      id={props.section.id?.toString()}
      step={step}
      title={props.section.title}
    >
      {group}
    </FieldSetBase>
  )
}
