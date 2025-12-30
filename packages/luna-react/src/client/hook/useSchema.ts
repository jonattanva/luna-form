import { clearInputErrorAtom } from '../lib/error-store'
import { clearInputSourceAtom } from '../lib/source-store'
import { startTransition, useCallback, useRef } from 'react'
import { useSetAtom } from 'jotai'
import type { Schema, Schemas } from '@luna-form/core'

export function useSchema() {
  const clearErrors = useSetAtom(clearInputErrorAtom)
  const clearSources = useSetAtom(clearInputSourceAtom)

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
            const names = Array.from(pendingUnmounts.current)
            clearErrors(names)
            clearSources(names)
            pendingUnmounts.current.clear()
          }
        })
      }
    },
    [clearErrors, clearSources]
  )

  function getSchema() {
    return schemaRef.current
  }

  return [getSchema, onMount, onUnmount] as const
}
