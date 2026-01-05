import { Control } from './control'
import { FieldSet } from './field/field-set'
import { Fragment } from 'react'
import { Group } from './group'
import { Separator } from './separator'
import { useStyle } from '../lib/use-style'
import { prepare, type Definition, type Sections } from '@luna-form/core'
import type { Config, Slot } from '../type'

export function Form(
  props: Readonly<{
    action?: (formData: FormData) => void
    children: Slot
    config: Config
    control?: React.ReactNode
    definition?: Definition
    noValidate?: boolean
    readOnly?: boolean
    sections: Sections
  }>
) {
  const sections = prepare(props.sections, props.definition)

  return (
    <div className="h-full w-full">
      <form noValidate={props.noValidate} action={props.action}>
        <Group>
          {sections.map((section, index) => {
            const localStyle = { compact: section.compact }
            const mergedStyle = useStyle(props.config.style, localStyle)
            return (
              <Fragment key={index}>
                <FieldSet section={section} style={mergedStyle}>
                  {props.children({
                    disabled: props.readOnly,
                    fields: section.fields,
                    style: mergedStyle,
                  })}
                </FieldSet>
                {section.separator && <Separator />}
              </Fragment>
            )
          })}
          {props.control && <Control>{props.control}</Control>}
        </Group>
      </form>
    </div>
  )
}
