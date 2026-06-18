import { isEmpty, isObject } from '@luna-form/core'
import { useResolvedValue } from '../../hook/use-resolved-value'

export function FieldPreviewValue({
  children,
  initialValue,
  name,
}: Readonly<{
  children: (value: string) => React.ReactNode
  initialValue?: unknown
  name: string
}>) {
  const value = useResolvedValue(name, initialValue)

  const hasInvalidValue =
    isEmpty(value) || isObject(value) || Array.isArray(value)

  const displayValue = hasInvalidValue ? '' : String(value)

  return <>{children(displayValue)}</>
}
