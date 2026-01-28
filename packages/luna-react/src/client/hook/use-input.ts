import { getSchema } from '@luna-form/core'
import { useEffect, useEffectEvent, useMemo } from 'react'
import type { Field, Schema } from '@luna-form/core'

export function useInput(
  field: Field,
  onMount: (name: string, schema: Schema, field: Field) => void,
  onUnmount: (name: string) => void
) {
  const { name } = field
  const schema = useMemo(() => getSchema(field), [field])

  const onMountHandler = useEffectEvent((name: string) => {
    if (name) {
      onMount(name, schema, field)
    }
  })

  const onUnmountHandler = useEffectEvent((name: string) => {
    if (name) {
      onUnmount(name)
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
