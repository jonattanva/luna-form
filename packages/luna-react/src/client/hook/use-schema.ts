import { useCallback, useRef } from 'react'
import { useStore } from './use-store'
import type { Field, Schema } from '@luna-form/core'

type Registration = Readonly<{ field: Field; schema: Schema }>

export function useSchema() {
  const clear = useStore()

  // Keyed by name in a `Map`. A plain object was asked `name in`, which is true
  // for whatever it inherits: a field named `toString` read as registered
  // already, and was never validated or submitted.
  const registry = useRef(new Map<string, Registration>())

  // An upsert, and called again whenever a field's definition changes without
  // a remount -- the editor swapping its JSON, a host changing `sections`. The
  // latest schema and field are the ones the submit validates and the events
  // read. A name registered before keeps its place: `Map` updates it where it
  // stands.
  const onRegister = useCallback(
    (name: string, schema: Schema, field: Field) => {
      registry.current.set(name, { field, schema })
    },
    []
  )

  const onUnmount = useCallback(
    (name: string, options?: { keepValue?: boolean }) => {
      if (registry.current.delete(name)) {
        clear([name], {
          keepValue: options?.keepValue,
        })
      }
    },
    [clear]
  )

  // What the submit validates: every schema by name, and the fields whose
  // declarative rules apply. `Object.fromEntries` makes each name a property of
  // its own, where an assignment named `__proto__` would reach a setter.
  const getSchema = useCallback(() => {
    const registrations = [...registry.current]
    return [
      Object.fromEntries(
        registrations.map(([name, { schema }]) => [name, schema])
      ),
      registrations.map(([, { field }]) => field),
    ] as const
  }, [])

  // What a field asks about another one by name, without walking them all.
  const getField = useCallback(
    (name: string) => registry.current.get(name)?.field,
    []
  )

  return [getSchema, getField, onRegister, onUnmount] as const
}
