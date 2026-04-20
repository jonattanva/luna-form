import type { Config } from '../../type'
import type { DataSource, Field, Nullable } from '@luna-form/core'

export type InputStrategies = Readonly<{
  useSource: (
    field: Field,
    config: Config,
    value?: Nullable<Record<string, unknown>>
  ) => {
    data: Nullable<unknown[]>
    setSource: (target: string, source?: DataSource) => void
  }

  getValue: (event: React.ChangeEvent<HTMLInputElement>, field: Field) => string

  shouldSkipChange: (
    ctx: Readonly<{
      shouldSkipOnChange: () => boolean
      hasClickable: boolean
      inputValue: string
      valueRef: React.RefObject<unknown>
    }>
  ) => boolean

  dispatchChange: (
    ctx: Readonly<{
      applyChangeEventsRef: React.RefObject<((s: unknown) => void) | null>
      data: Nullable<unknown[]>
      entity?: string
      inputValue: string
      setTimeoutRef: (cb: () => void, ms: number) => void
    }>
  ) => void

  buildInitialSelected: (
    defaultValue: unknown,
    data: Nullable<unknown[]>,
    entity: string | undefined
  ) => unknown

  isInitialReady: (
    field: Field,
    defaultValue: unknown,
    data: Nullable<unknown[]>
  ) => boolean

  useExtraProps?: (field: Field) => Record<string, unknown> | undefined
}>
