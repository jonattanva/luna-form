import { Field as Component } from '../../../component/field/field'
import { memo } from 'react'
import { withError, withState } from './field-with-state'

/**
 * A field renders when something it can see has changed, and not because a
 * field elsewhere in the form did.
 *
 * The default comparison, on purpose. An earlier attempt wrote its own, and
 * that is a list of props kept in step by hand: the day someone adds one and
 * forgets this file, the field silently stops updating, and nothing -- not the
 * compiler, which does not ask a comparator to be exhaustive -- says so. The
 * failure is wrong data on screen, which is exactly how that attempt was found
 * out.
 *
 * What makes the default enough is that every prop reaching this component is
 * steady across a keystroke. The value the host holds no longer travels as a
 * prop, so `children` is a stable callback rather than a closure rebuilt
 * whenever that value moved; a field reads its own entry from the store, and
 * the one thing that has to be read while rendering comes through a context
 * whose identity never changes. `errors` is the one prop that moves, and it
 * moves for the field it belongs to.
 */
export const Field = withState(withError(memo(Component)))
