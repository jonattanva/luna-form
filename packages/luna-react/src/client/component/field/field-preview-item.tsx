import { isEmpty, isObject } from '@luna-form/core'
import { twMerge } from 'tailwind-merge'
import { useResolvedValue } from '../../hook/use-resolved-value'

export function FieldPreviewItem({
  className,
  initialValue,
  name,
  separator,
}: Readonly<{
  className?: string
  initialValue?: unknown
  name: string
  separator?: boolean
}>) {
  const value = useResolvedValue(name, initialValue)

  if (isEmpty(value) || isObject(value) || Array.isArray(value)) {
    return null
  }

  const displayValue = String(value)

  return (
    <div className="flex items-center gap-1.5 overflow-hidden">
      {separator && (
        <span
          aria-hidden="true"
          className="text-xs text-slate-300 select-none dark:text-slate-600"
        >
          ·
        </span>
      )}
      <span
        aria-label={displayValue}
        className={twMerge(
          'max-w-[150px] overflow-hidden text-xs text-ellipsis whitespace-nowrap',
          className
        )}
        title={displayValue}
      >
        {displayValue}
      </span>
    </div>
  )
}
