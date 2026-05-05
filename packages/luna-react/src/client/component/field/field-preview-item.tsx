import { isObject } from '@luna-form/core'
import { reportValueAtom } from '../../lib/value-store'
import { useAtomValue } from 'jotai'

export function FieldPreviewItem({
  initialValue,
  name,
  separator,
}: Readonly<{
  initialValue?: unknown
  name: string
  separator?: boolean
}>) {
  // Inputs that mount inside a collapsed `<Activity mode="hidden">` defer their
  // effects until they become visible, so the value atom is empty on the first
  // render. Fall back to the form's initial value tree (resolved by the
  // parent) so the preview reflects the loaded data even before the user
  // expands the item. Once the input mounts and reports its value, the atom
  // takes precedence.
  const atomValue = useAtomValue(reportValueAtom(name))
  const value = atomValue ?? initialValue

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
