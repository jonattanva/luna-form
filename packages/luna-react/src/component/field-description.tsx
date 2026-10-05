import { DescriptionText } from './description'
import type { Config } from '../type'
import type { Field, Localization } from '@luna-form/core'

export type DescriptionProps = Readonly<{
  config?: Config
  context?: Record<string, unknown>
  field: Field
  localization?: Localization
}>

// The description the form was defined with, which is all a server-rendered
// form has: the text a `state` event can put in its place, and the value
// `{value}` is interpolated with, are both things only the client knows.
//
// The client passes the one that reads them, the way it passes its guard and
// its field set to `Form`. That injection is what keeps this tree loadable
// under the `react-server` condition: an import of an atom, of a context or of
// `useState` reaches for what React does not export there.
export function StaticDescription(props: DescriptionProps) {
  return (
    <DescriptionText
      config={props.config}
      context={props.context}
      localization={props.localization}
      text={props.field.description}
    />
  )
}
