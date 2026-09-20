import { reportInputErrorAtom } from '../../lib/error-store'
import { reportFieldStateAtom } from '../../lib/state-store'
import { type Atom, useAtomValue } from 'jotai'

function createFieldHOC<TValue>(atomFamily: (name: string) => Atom<TValue>) {
  return <P extends { field: { name: string } }>(
    Component: React.ComponentType<P>,
    apply: (value: TValue, props: Readonly<P>) => Partial<P> | null
  ) => {
    const WithField = (props: Readonly<P>) => {
      const value = useAtomValue(atomFamily(props.field.name))
      const patch = apply(value, props)
      if (patch === null) return null
      return <Component {...props} {...patch} />
    }
    return WithField
  }
}

const applyError = createFieldHOC(reportInputErrorAtom)

// The field's own errors, as the store holds them. Wrapped in a record keyed by
// name, this handed the field a new object on every render of the form, and a
// field that had been validated once never matched its memo again -- which is
// the whole point of the memo underneath. The array itself keeps its identity
// until the errors change, and the name is already how the atom was found.
export function withError<
  P extends { errors?: string[]; field: { name: string } },
>(Component: React.ComponentType<P>) {
  return applyError(Component, (errors) => ({ errors }) as Partial<P>)
}

const applyState = createFieldHOC(reportFieldStateAtom)

export function withState<
  P extends { disabled?: boolean; field: { name: string; hidden?: boolean } },
>(Component: React.ComponentType<P>) {
  return applyState(Component, (fieldState, props) => {
    const hidden = fieldState?.hidden ?? props.field.hidden ?? false
    if (hidden) return null
    return { disabled: fieldState?.disabled ?? props.disabled } as Partial<P>
  })
}
