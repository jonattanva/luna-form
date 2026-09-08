import { KeepValueContext } from '../context/keep-value-context'
import { getSchema, keepsValue } from '@luna-form/core'
import { use, useEffect, useEffectEvent, useMemo } from 'react'
import type { Field, Schema } from '@luna-form/core'

export function useInput(
  field: Field,
  onMount: (name: string, schema: Schema, field: Field) => void,
  onUnmount: (name: string, options?: { keepValue?: boolean }) => void,
  translations?: Record<string, string>
) {
  const { name } = field
  const schema = useMemo(
    () => getSchema(field, translations),
    [field, translations]
  )

  // The field's own declaration ADDS to what it inherits, never replaces it:
  // a field inside a collapsible is already kept, and its own `keepValue` must
  // not be the thing that starts dropping it.
  //
  // Both clears have to honour the flag or it only half works. This one is the
  // quiet half -- it empties the form's copy without telling the consumer, so
  // on a controlled form the value comes back from the host anyway and the
  // flag looks unnecessary. On a form that holds its own values it is the only
  // clear there is.
  const inherited = use(KeepValueContext)
  const keepValue = inherited || keepsValue(field)

  const onMountHandler = useEffectEvent((name: string) => {
    if (name) {
      onMount(name, schema, field)
    }
  })

  const onUnmountHandler = useEffectEvent((name: string) => {
    if (name) {
      onUnmount(name, {
        keepValue,
      })
    }
  })

  useEffect(() => {
    onMountHandler(name)
    return () => {
      onUnmountHandler(name)
    }
  }, [name])

  return schema
}
