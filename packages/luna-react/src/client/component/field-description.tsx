import { FormattedDescription } from './formatted-description'
import { fieldStateAtom } from '../lib/state-store'
import { useAtomValue } from 'jotai'
import { useEntryAtom } from '../hook/use-entry-atom'
import { valueAtom } from '../lib/value-store'
import type { DescriptionProps } from '../../component/field-description'

// The description as it stands: the text a `state` event may have replaced, and
// the value `{value}` interpolates with. Both are the client's to know, which
// is why this is the client's component and `StaticDescription` is the one the
// shared tree renders by default.
export function FieldDescription(props: DescriptionProps) {
  const value = useAtomValue(useEntryAtom(valueAtom, props.field.name))
  const state = useAtomValue(useEntryAtom(fieldStateAtom, props.field.name))

  return (
    <FormattedDescription
      config={props.config}
      context={props.context}
      text={state?.description ?? props.field.description}
      translations={props.translations}
      value={value}
    />
  )
}
