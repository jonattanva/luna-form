import { Column as ColumnWrapper } from '../../../component/column'
import { Field as FieldWrapper } from '../../../component/field'
import { withErrors } from './with-error'

export const Column = withErrors(ColumnWrapper)
export const Field = withErrors(FieldWrapper)
