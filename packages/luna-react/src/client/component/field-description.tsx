import { FormattedDescription } from './formatted-description'
import { atom, useAtomValue } from 'jotai'
import { fieldStateAtom } from '../lib/state-store'
import { isInterpolated } from '@luna-form/core'
import { memo } from 'react'
import { useEntryAtom } from '../hook/use-entry-atom'
import { valueAtom } from '../lib/value-store'
import type { DescriptionProps } from '../../component/field-description'

// Read in place of the field's value when there is nowhere to put it: an atom
// nobody writes, so it never wakes the description up.
const NO_VALUE = atom<unknown>(undefined)

// The description as it stands: the text a `state` event may have replaced, and
// the value `{value}` interpolates with. Both are the client's to know, which
// is why this is the client's component and `StaticDescription` is the one the
// shared tree renders by default.
//
// The value is read only when the text has a placeholder to put it in. Every
// field renders one of these, description or not, and each one subscribed to
// its field's value: a keystroke rendered the description of the field typed in
// for text that could not change, and every keystroke anywhere had the store
// recompute one entry per field on the form just to find nothing had moved.
// Which text that is follows the field's state, so a description a `state`
// event brings in with `{value}` in it starts reading the value when it arrives.
//
// Memoized for the same reason as the label beside it: the input renders on
// every keystroke, and nothing it hands this changes with one.
export const FieldDescription = memo(function FieldDescription(
  props: DescriptionProps
) {
  const state = useAtomValue(useEntryAtom(fieldStateAtom, props.field.name))
  const text = state?.description ?? props.field.description

  const entryAtom = useEntryAtom(valueAtom, props.field.name)
  const value = useAtomValue(isInterpolated(text) ? entryAtom : NO_VALUE)

  // A field that holds nothing has nothing to put in `{value}`, the same as one
  // the user emptied. Handed over as missing, the placeholder stayed on screen
  // as written until the first keystroke.
  return (
    <FormattedDescription
      config={props.config}
      context={props.context}
      localization={props.localization}
      text={text}
      value={value ?? ''}
    />
  )
})
