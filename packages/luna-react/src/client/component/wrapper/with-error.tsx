import { reportInputErrorAtom } from '../../lib/error-store'
import { useAtomValue } from 'jotai'

export function withErrors<
  P extends { errors?: Record<string, string[]>; field: { name: string } },
>(Component: React.ComponentType<P>) {
  const WithErrors = (props: Readonly<P>) => {
    const errors = useAtomValue(reportInputErrorAtom(props.field.name))
    return (
      <Component
        {...props}
        errors={errors ? { [props.field.name]: errors } : undefined}
      />
    )
  }
  return WithErrors
}
