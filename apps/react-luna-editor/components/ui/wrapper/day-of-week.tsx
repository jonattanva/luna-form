'use client'

import { cn } from '@/lib/utils'

type Option = {
  label: string
  value: string
}

export function DayOfWeekWrapper({
  name,
  onChange,
  options = [],
  value = [],
  multiple = true,
}: {
  name?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  options?: Option[]
  value?: string[]
  multiple?: boolean
}) {
  function toggleDay(dayValue: string) {
    let next: string[]
    if (multiple) {
      next = value.includes(dayValue)
        ? value.filter((v) => v !== dayValue)
        : [...value, dayValue]
    } else {
      next = value.includes(dayValue) ? [] : [dayValue]
    }

    onChange?.({
      target: { value: next as unknown as string },
    } as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <div className="flex gap-2">
      {name &&
        value.map((v) => <input key={v} type="hidden" name={name} value={v} />)}
      {options.map((option) => {
        const selected = value.includes(option.value)
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => toggleDay(option.value)}
            className={cn(
              'flex size-10 items-center justify-center rounded-full text-sm font-semibold transition-colors',
              selected
                ? 'bg-violet-600 text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {option.label.charAt(0).toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
