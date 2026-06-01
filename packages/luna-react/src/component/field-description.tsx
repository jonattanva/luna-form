import { FormattedDescription } from './formatted-description'
import { reportFieldStateAtom } from '../client/lib/state-store'
import { reportValueAtom } from '../client/lib/value-store'
import { useAtomValue } from 'jotai'
import type { Config } from '../type'
import type { Field } from '@luna-form/core'

export function FieldDescription(
  props: Readonly<{
    config?: Config
    context?: Record<string, unknown>
    field: Field
    translations?: Record<string, string>
  }>
) {
  const value = useAtomValue(reportValueAtom(props.field.name))
  const state = useAtomValue(reportFieldStateAtom(props.field.name))

  const text = state?.description ?? props.field.description

  return (
    <FormattedDescription
      config={props.config}
      context={props.context}
      text={text}
      translations={props.translations}
      value={value}
    />
  )
}
