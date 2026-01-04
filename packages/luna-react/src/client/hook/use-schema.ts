import { startTransition, useCallback, useRef } from 'react'
import { useStore } from './use-store'
import type { Schema, Schemas } from '@luna-form/core'

export function useSchema() {
  const clear = useStore()

  const schemaRef = useRef<Schemas>({})
  const pendingUnmounts = useRef<Set<string>>(new Set())

  const onMount = useCallback((name: string, schema: Schema) => {
    if (!(name in schemaRef.current)) {
      schemaRef.current[name] = schema
    }
  }, [])

  const onUnmount = useCallback(
    (name: string) => {
      if (schemaRef.current[name]) {
        delete schemaRef.current[name]
        pendingUnmounts.current.add(name)

        startTransition(() => {
          if (pendingUnmounts.current.size > 0) {
            clear(Array.from(pendingUnmounts.current))
            pendingUnmounts.current.clear()
          }
        })
      }
    },
    [clear]
  )

  function getSchema() {
    return schemaRef.current
  }

  return [getSchema, onMount, onUnmount] as const
}
