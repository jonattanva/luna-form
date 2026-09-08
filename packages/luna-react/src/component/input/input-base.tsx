import {
  buildAriaAttributes,
  buildCommon,
  buildDataAttributes,
  type Field,
} from '@luna-form/core'
import type { Children } from '../../type'

export function InputBase(
  props: Readonly<{
    children: Children
    disabled?: boolean
    errors?: string[]
    field: Field
    horizontal?: boolean
    lang?: string
    translations?: Record<string, string>
  }>
) {
  if (!props.field.type) {
    return null
  }

  const commonProps = buildCommon(props.field, props.disabled, {
    lang: props.lang,
    translations: props.translations,
  })

  const dataAttributes = buildDataAttributes(props.field)
  const ariaAttributes = buildAriaAttributes(props.field, props.errors)

  // Rebuilt only when it would say something new. This object is what
  // `useInput` memoizes the schema on, and spreading it unconditionally gave
  // every field a fresh identity on every render.
  //
  // Skipping is safe because the resolved `disabled` and the one the
  // definition carries are only ever compared for truthiness downstream:
  // `useFetch` takes it as `!disabled`, and `buildSource` and `isSelectable`
  // test it directly. A field that never declared one and a resolved `false`
  // are the same field to every reader.
  //
  // No `useMemo` on purpose: `server/component/form` reaches this component
  // through `Slot` and `Field`, and a hook here would not survive that.
  //
  // On its own this changes nothing measurable -- the identity chain has a
  // second break, in whatever hands `sections` to the form -- and the two have
  // to be fixed together. See `reactive-form-preview`.
  const field =
    Boolean(props.field.disabled) === commonProps.disabled
      ? props.field
      : {
          ...props.field,
          disabled: commonProps.disabled,
        }

  return props.children({
    ariaAttributes,
    commonProps,
    dataAttributes,
    field,
    horizontal: props.horizontal,
  })
}
