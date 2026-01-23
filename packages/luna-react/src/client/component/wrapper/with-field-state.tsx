import { reportFieldStateAtom } from '../../lib/state-store'
import { useAtomValue } from 'jotai'

export function withFieldState<
  P extends { disabled?: boolean; field: { name: string; hidden?: boolean } },
>(Component: React.ComponentType<P>) {
  const WithFieldState = (props: Readonly<P>) => {
    const fieldState = useAtomValue(reportFieldStateAtom(props.field.name))
    const hidden = fieldState?.hidden ?? props.field.hidden ?? false
    if (hidden) {
      return null
    }

    const disabled = fieldState?.disabled ?? props.disabled
    return <Component {...props} disabled={disabled} />
  }
  return WithFieldState
}
