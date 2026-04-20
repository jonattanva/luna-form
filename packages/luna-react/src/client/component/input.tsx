import { InputDateable } from './input-dateable'
import { InputSelectable } from './input-selectable'
import { InputTextable } from './input-textable'
import { isDate, isTextable, isTime } from '@luna-form/core'
import type { InputCoreProps } from '../hook/use-input-core'

// Order matters: isDate/isTime must be checked before isTextable.
// isTextable matches any field whose type starts with "input/", which
// includes "input/date" and "input/time". Reversing the order routes
// date/time fields to InputTextable, skipping format conversion.
export function Input(props: InputCoreProps) {
  if (isDate(props.field) || isTime(props.field)) {
    return <InputDateable {...props} />
  }

  if (isTextable(props.field)) {
    return <InputTextable {...props} />
  }

  return <InputSelectable {...props} />
}
