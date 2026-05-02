import { isObject } from '@luna-form/core'
import { reportValueAtom } from '../../lib/value-store'
import { useAtomValue } from 'jotai'

export function FieldPreviewItem({
  name,
  separator,
}: Readonly<{
  name: string
  separator?: boolean
}>) {
  const value = useAtomValue(reportValueAtom(name))
  if (value == null || value === '') {
    return null
  }

  if (isObject(value) || Array.isArray(value)) {
    return null
  }

  return (
    <>
      {separator && (
        <span className="text-xs text-slate-300 dark:text-slate-600">·</span>
      )}
      <span className="max-w-[150px] overflow-hidden text-xs text-ellipsis">
        {`${value}`}
      </span>
    </>
  )
}
