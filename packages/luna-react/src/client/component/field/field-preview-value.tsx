import { previewText, type DateFormat } from '@luna-form/core'
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

  return <>{children(previewText(value, dateFormat, lang))}</>
}
