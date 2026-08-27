import type { Config } from '../../type'
import type { DataSource, Field, Nullable, Value } from '@luna-form/core'

/**
 * What the input pipeline reads off a change, and all it reads: the new value.
 *
 * Not `React.ChangeEvent<HTMLInputElement>`, for two reasons. Most inputs a
 * form is configured with are not an `<input>` -- a select, a date picker, a
 * chips field are components that synthesize this object -- so the rest of a
 * DOM event is a promise none of them keeps. And `HTMLInputElement.value` is a
 * `string`, which a multi-value field's value is not: a `chips` field emits its
 * array here. A real DOM event still satisfies this shape.
 */
export type InputChangeEvent = Readonly<{
  target: Readonly<{ value: Value }>
}>

export type InputStrategies = Readonly<{
  useSource: (
    field: Field,
    config: Config,
    value?: Nullable<Record<string, unknown>>
  ) => {
    data: Nullable<unknown[]>
    // Only set by sources that can carry options; write-only sources omit it.
    isStaticSource?: boolean
    setSource: (target: string, source?: DataSource) => void
  }

  // `Value`, not `string`: a `chips` field hands over the array it holds, and
  // every consumer below has to say what it does with one.
  getValue: (event: InputChangeEvent, field: Field) => Value

  shouldSkipChange: (
    ctx: Readonly<{
      field: Field
      shouldSkipOnChange: () => boolean
      hasClickable: boolean
      inputValue: Value
      valueRef: React.RefObject<unknown>
    }>
  ) => boolean

  dispatchChange: (
    ctx: Readonly<{
      applyChangeEventsRef: React.RefObject<((s: unknown) => void) | null>
      data: Nullable<unknown[]>
      entity?: string
      inputValue: Value
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
