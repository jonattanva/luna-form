import { getOfferedValues, getSchema } from '@luna-form/core'
import { useKeepsValue } from '../context/keep-value-context'
import { useEffect, useEffectEvent, useMemo } from 'react'
import type { Field, Schema } from '@luna-form/core'

// What a field registers itself with, and what its schema is built from.
// Read off one at a time below, so each memo and effect depends on the values
// it uses and not on this object, which is a new one on every render.
type InputOptions = Readonly<{
  onRegister: (
    name: string,
    schema: Schema,
    field: Field,
    offered?: ReadonlySet<string>
  ) => void
  onUnmount: (name: string, options?: { keepValue?: boolean }) => void
  sourceTargets?: ReadonlySet<string>
  translations?: Record<string, string>
}>

export function useInput(field: Field, options: InputOptions) {
  const { onRegister, onUnmount, sourceTargets, translations } = options
  const { name } = field
  const schema = useMemo(
    () => getSchema(field, translations, sourceTargets),
    [field, translations, sourceTargets]
  )

  // The options the definition writes, which the submit holds the field's
  // value to. See `withHeldOptions`.
  const offered = useMemo(
    () => getOfferedValues(field, sourceTargets),
    [field, sourceTargets]
  )

  // Whether the field is kept is `useKeepsValue`'s question.
  //
  // Both clears have to honour the flag or it only half works. This one is the
  // quiet half -- it empties the form's copy without telling the consumer, so
  // on a controlled form the value comes back from the host anyway and the
  // flag looks unnecessary. On a form that holds its own values it is the only
  // clear there is.
  const keepValue = useKeepsValue(field)

  // Registered again whenever the definition changes, not only when the field
  // mounts. A definition replaced without a remount -- the editor swapping its
  // JSON, a host changing `sections` -- has to be the one the submit validates
  // and the events read, and registering once per name kept the first.
  useEffect(() => {
    if (name) {
      onRegister(name, schema, field, offered)
    }
  }, [name, schema, field, offered, onRegister])

  const onUnmountHandler = useEffectEvent((name: string) => {
    if (name) {
      onUnmount(name, {
        keepValue,
      })
    }
  })

  // Taken out only when the field goes: unmounted, or renamed, which is the old
  // name going. A new definition under the same name is the effect above, and
  // it clears no value.
  useEffect(() => {
    return () => {
      onUnmountHandler(name)
    }
  }, [name])

  return schema
}
