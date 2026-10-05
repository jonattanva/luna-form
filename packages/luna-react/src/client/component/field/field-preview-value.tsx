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
  lang,
  name,
}: Readonly<{
  children: (value: string) => React.ReactNode
  dateFormat?: DateFormat
  initialValue?: unknown
  lang?: string
  name: string
}>) {
  const value = useResolvedValue(name, initialValue)

  const hasInvalidValue =
    isEmpty(value) || isObject(value) || Array.isArray(value)

  const text = hasInvalidValue ? '' : String(value)
  const displayValue =
    text && dateFormat ? displayDate(text, dateFormat, lang) : text

  return <>{children(displayValue)}</>
}
