import {
  displayDate,
  isEmpty,
  isObject,
  type DateFormat,
} from '@luna-form/core'
import { useResolvedValue } from '../../hook/use-resolved-value'

export function FieldPreviewValue({
  children,
  dateFormat,
  initialValue,
  name,
}: Readonly<{
  children: (value: string) => React.ReactNode
  dateFormat?: DateFormat
  initialValue?: unknown
  name: string
}>) {
  const value = useResolvedValue(name, initialValue)

  const hasInvalidValue =
    isEmpty(value) || isObject(value) || Array.isArray(value)

  const text = hasInvalidValue ? '' : String(value)
  const displayValue = text && dateFormat ? displayDate(text, dateFormat) : text

  return <>{children(displayValue)}</>
}
