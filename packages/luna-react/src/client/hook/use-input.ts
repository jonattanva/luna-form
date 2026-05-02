import { KeepValueContext } from '../context/keep-value-context'
import { getSchema } from '@luna-form/core'
import { useContext, useEffect, useEffectEvent, useMemo } from 'react'
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

  const keepValue = useContext(KeepValueContext)

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
