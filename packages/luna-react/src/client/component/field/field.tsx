import { Field as Component } from '../../../component/field/field'
import { withError, withState } from './field-with-state'

export const Field = withState(withError(Component))
