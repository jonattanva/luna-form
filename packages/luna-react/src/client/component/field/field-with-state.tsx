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

export function withError<
  P extends { errors?: Record<string, string[]>; field: { name: string } },
>(Component: React.ComponentType<P>) {
  return applyError(
    Component,
    (errors, props) =>
      ({
        errors: errors ? { [props.field.name]: errors } : undefined,
      }) as Partial<P>
  )
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
