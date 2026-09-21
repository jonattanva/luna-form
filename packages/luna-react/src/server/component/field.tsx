import { FieldGroup } from '../../component/field/field-group'
import { InputBase } from '../../component/input/input-base'
import {
  buildDisabled,
  buildOrientation,
  buildReadOnly,
  getSpan,
  mergeStyle,
} from '@luna-form/core'
import { twMerge } from 'tailwind-merge'
import type { FieldProps } from '../../component/field/field'

// A field rendered on the server: the same layout, without the errors. There
// are none to show -- an error is what validating a value produced, and no
// value has been typed yet -- and the list that shows them asks to be brought
// into view after a failed submit, which is an effect and a context this tree
// cannot have.
export function Field(props: FieldProps) {
  const cols = props.field.advanced?.cols

  const { horizontal = false } = mergeStyle(props.style, {
    horizontal: buildOrientation(props.field),
  })

  const disabled = buildDisabled(props.field, props.disabled)
  const readOnly = buildReadOnly(props.field, props.disabled)

  return (
    <div className={twMerge('flex flex-col gap-3', getSpan(cols))}>
      <FieldGroup
        disabled={disabled}
        field={props.field}
        horizontal={horizontal}
      >
        <InputBase
          disabled={disabled}
          field={props.field}
          horizontal={horizontal}
          lang={props.lang}
          readOnly={readOnly}
          translations={props.translations}
        >
          {props.children}
        </InputBase>
      </FieldGroup>
    </div>
  )
}
