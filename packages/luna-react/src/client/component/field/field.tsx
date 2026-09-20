import { Field as Component } from '../../../component/field/field'
import { memo } from 'react'
import { reportFieldStateAtom } from '../../lib/state-store'
import { reportInputErrorAtom } from '../../lib/error-store'
import { useAtomValue } from 'jotai'
import type { FieldProps } from '../../../component/field/field'

/**
 * Everything a field reads from the store, in one component, with the memo
 * around it rather than inside.
 *
 * Two wrappers used to sit outside that memo, one per atom, and both of them
 * ran on every render of the form: a hundred fields cost two hundred renders a
 * keystroke on a controlled host, for the memo underneath to then find every
 * prop unchanged. Outside, the same comparison stops the field whole, the two
 * reads included.
 *
 * Stopping there does not cut a field off from the store. What it reads are
 * subscriptions, so its own state and its own errors render it whatever its
 * props do -- which is the only way either of them changes.
 */
function FieldWithMeta(props: FieldProps) {
  const state = useAtomValue(reportFieldStateAtom(props.field.name))
  const errors = useAtomValue(reportInputErrorAtom(props.field.name))

  if (state?.hidden ?? props.field.hidden ?? false) {
    return null
  }

  return (
    <Component
      {...props}
      disabled={state?.disabled ?? props.disabled}
      errors={errors}
    />
  )
}

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
 * whose identity never changes. What used to move, `errors`, is read from the
 * store now, on the inside of this comparison.
 */
export const Field = memo(FieldWithMeta)
