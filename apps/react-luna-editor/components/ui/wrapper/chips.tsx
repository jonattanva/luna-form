'use client'

import { cn } from '@/lib/utils'

type Option = {
  label: string
  value: string
}

export function Chips({
  'aria-label': ariaLabel,
  'aria-labelledby': labelledBy,
  disabled,
  id,
  name,
  onChange,
  options = [],
  value = [],
  multiple = true,
}: {
  // A row of buttons has no one element a `<label for>` can name, so the
  // group takes the label the form points it at, or the name `advanced.aria`
  // gives it instead.
  'aria-label'?: string
  'aria-labelledby'?: string
  // A disabled field is neither changed nor sent: every button is disabled,
  // and so is every hidden input, which the browser then leaves out.
  disabled?: boolean
  id?: string
  name?: string
  // Reports an array, and says so. The runtime reads nothing off a change but
  // `target.value` (`InputChangeEvent` in `input-strategies`), and its value is
  // a `Value` -- an array included -- so there is nothing here to pretend is a
  // `React.ChangeEvent<HTMLInputElement>`, whose `value` is a `string`.
  onChange?: (event: { target: { value: string[] } }) => void
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

    onChange?.({ target: { value: next } })
  }

  return (
    <div
      aria-label={ariaLabel}
      aria-labelledby={labelledBy}
      className="flex w-full flex-wrap gap-2"
      id={id}
      role="group"
    >
      {name &&
        value.map((v) => (
          <input
            key={v}
            disabled={disabled}
            type="hidden"
            name={name}
            value={v}
          />
        ))}
      {options.map((option) => {
        const selected = value.includes(option.value)
        return (
          <button
            key={option.value}
            disabled={disabled}
            type="button"
            onClick={() => toggleDay(option.value)}
            className={cn(
              'flex min-w-0 flex-1 items-center justify-center rounded-md p-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
              'sm:min-w-[80px] sm:flex-none',
              selected
                ? 'bg-violet-600 text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            <span className="truncate">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
