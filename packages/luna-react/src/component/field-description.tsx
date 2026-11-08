import { DescriptionText } from './description'
import type { Config } from '../type'
import type { Field, Localization } from '@luna-form/core'

export type DescriptionProps = Readonly<{
  config?: Config
  context?: Record<string, unknown>
  field: Field
  localization?: Localization
  // What the field is rendered holding, for a tree that cannot read it as it
  // changes. The client's description reads it itself, and leaves this out.
  value?: unknown
}>

// The description the form was defined with, which is all a server-rendered
// form has: the text a `state` event can put in its place is a thing only the
// client knows. `{value}` reads what the field was rendered with -- the host's
// value -- and nothing when it holds nothing, as on the client.
//
// The client passes the one that reads them as they change, the way it passes
// its guard and its field set to `Form`. That injection is what keeps this tree
// loadable under the `react-server` condition: an import of an atom, of a
// context or of `useState` reaches for what React does not export there.
export function StaticDescription(props: DescriptionProps) {
  return (
    <DescriptionText
      config={props.config}
      context={props.context}
      localization={props.localization}
      text={props.field.description}
      value={props.value ?? ''}
    />
  )
}
