import { FieldSetAdvanced } from './field-set-advanced'
import { FieldSetBase } from './field-set-base'
import { Group } from '../group'
import { mergeStyle, type Section, type Style } from '@luna-form/core'

export function FieldSet(
  props: Readonly<{
    children?: React.ReactNode
    section: Section
    style?: Style
  }>
) {
  const { fields = [] } = props.section

  const { compact } = mergeStyle(props.style, {
    compact: props.section.compact,
  })

  const group = <Group compact={compact}>{props.children}</Group>
  if (!props.section.title && !props.section.description) {
    return group
  }

  if (props.section.advanced) {
    return <FieldSetAdvanced section={props.section} group={group} />
  }

  return (
    <FieldSetBase
      description={props.section.description}
      empty={fields.length === 0}
      id={props.section.id?.toString()}
      title={props.section.title}
    >
      {group}
    </FieldSetBase>
  )
}
