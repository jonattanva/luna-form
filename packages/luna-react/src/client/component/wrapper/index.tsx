import { Field as FieldWrapper } from '../../../component/field/field'
import { withErrors } from './with-error'

export const Field = withErrors(FieldWrapper)
