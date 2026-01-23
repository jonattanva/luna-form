import { Field as FieldWrapper } from '../../../component/field/field'
import { withErrors } from './with-error'
import { withFieldState } from './with-field-state'

export const Field = withFieldState(withErrors(FieldWrapper))
