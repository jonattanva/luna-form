import { Control } from './control'
import { FieldSet } from './field-set'
import { Fragment } from 'react'
import { Group } from './group'
import { Separator } from './separator'
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
          {sections.map((section, index) => (
            <Fragment key={index}>
              <FieldSet
                compact={props.config.style?.compact}
                description={section.description}
                title={section.title}
              >
                {props.children({
                  disabled: props.readOnly,
                  fields: section.fields,
                })}
              </FieldSet>
              {section.separator && <Separator />}
            </Fragment>
          ))}
          {props.control && <Control>{props.control}</Control>}
        </Group>
      </form>
    </div>
  )
}
