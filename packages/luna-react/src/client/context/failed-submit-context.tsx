import { createContext } from 'react'
import type { FormState } from '../hook/use-form-action'
import type { Nullable } from '@luna-form/core'

// The submit that failed, for as long as it is the last one, and `null`
// otherwise. A new one every time a submit fails, even with the same errors:
// that is what lets a field bring its error into view again after the user
// closed what held it. See `FieldError`.
export const FailedSubmitContext =
  createContext<Nullable<FormState<Record<string, unknown>>>>(null)
