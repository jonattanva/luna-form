import { Field as Component } from '../../../component/field/field'
import { withError } from './field-with-error'
import { withState } from './field-with-state'

export const Field = withState(withError(Component))
