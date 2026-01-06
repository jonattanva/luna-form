import { Group } from '../group'
import { Legend } from '../legend'
import { useStyle, type Style } from '../../lib/use-style'
import type { Section } from '@luna-form/core'

export function FieldSet(
  props: Readonly<{
    children?: React.ReactNode
    section: Section
    style?: Style
  }>,
) {
  const localStyle = {
    compact: props.section.compact,
    orientation: props.section.orientation,
  }
  const { compact, orientation } = useStyle(props.style, localStyle)

  if (!props.section.title && !props.section.description) {
    return (
      <Group compact={compact} orientation={orientation}>
        {props.children}
      </Group>
    )
  }

  const fields = props.section.fields || []

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
      <Group compact={compact} orientation={orientation}>
        {props.children}
      </Group>
    </fieldset>
  )
}
