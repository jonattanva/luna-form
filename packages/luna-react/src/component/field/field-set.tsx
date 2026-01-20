import { Group } from '../group'
import { Legend } from '../legend'
import { mergeStyle, type Section, type Style } from '@luna-form/core'

export function FieldSet(
  props: Readonly<{
    children?: React.ReactNode
    section: Section
    style?: Style
  }>
) {
  const fields = props.section.fields || []

  const { compact } = mergeStyle(props.style, {
    compact: props.section.compact,
  })

  if (!props.section.title && !props.section.description) {
    return <Group compact={compact}>{props.children}</Group>
  }

  return (
    <fieldset
      data-slot="field-set"
      data-empty={fields.length === 0}
      className="flex flex-col data-[empty=false]:gap-6"
    >
      <Legend
        description={props.section.description}
        title={props.section.title}
      />
      <Group compact={compact}>{props.children}</Group>
    </fieldset>
  )
}
