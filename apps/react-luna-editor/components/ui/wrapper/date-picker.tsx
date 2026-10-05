'use client'

import * as React from 'react'
import { format as fnsFormat, isValid, parse } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { readDateProps } from 'react-luna-form/config'

import { Calendar } from '@/components/ui/calendar'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const ISO_FORMAT = 'yyyy-MM-dd'

// Struck through, as shadcn's booked-dates example does.
const RESERVED_CLASS = { reserved: '[&>button]:line-through opacity-100' }

// `yyyy-MM-dd` is a day, not an instant, so it is read in local time:
// `new Date('2026-10-02')` is midnight UTC, the day before anywhere west of
// Greenwich. As strict as the form is: `2024-6-5` is no day here either.
function parseDay(value?: string): Date | undefined {
  if (!value || !ISO_DATE.test(value)) {
    return undefined
  }

  const date = parse(value, ISO_FORMAT, new Date())
  return isValid(date) ? date : undefined
}

// The form hands over a day as `yyyy-MM-dd`, or the text someone typed that is
// no day: the first is shown in the field's format, the second as it is.
function display(value: string | undefined, format: string): string {
  const day = parseDay(value)
  return day ? fnsFormat(day, format) : (value ?? '')
}

export function DatePickerInput({
  defaultValue,
  onBlur,
  onChange,
  value,
  ...props
}: {
  'data-format'?: string
  'data-reserved'?: string
  defaultValue?: string
  max?: string
  min?: string
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  value?: string
}) {
  const { format, max, min, reserved } = readDateProps(props)

  // The client form hands over `value`, the server form `defaultValue`.
  const current = value ?? defaultValue

  const [open, setOpen] = React.useState(false)

  // What the person is typing, while they type it. `null` shows the day the
  // field holds, in its format, so nothing has to copy the prop into state.
  const [draft, setDraft] = React.useState<string | null>(null)

  function commit(raw: string) {
    if (onChange) {
      onChange({
        target: { value: raw },
      } as React.ChangeEvent<HTMLInputElement>)
    }
  }

  // What a person types goes to the form as typed: the form reads it in the
  // field's format, and keeps it as text if it is no day.
  function handleValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    const raw = event.target.value
    setDraft(raw)
    commit(raw)
  }

  // The form's own blur runs too: it validates the field and releases an
  // auto-fill that was waiting for the user to leave it.
  function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    setDraft(null)
    onBlur?.(event)
  }

  function handleCalendarSelect(date: Date | undefined) {
    setDraft(null)
    commit(date ? fnsFormat(date, ISO_FORMAT) : '')
    setOpen(false)
  }

  const selectedDate = parseDay(current)

  // A day outside the bounds or a reserved one cannot be picked, and a month
  // outside the bounds cannot be reached. With no day selected, the calendar
  // opens on today, or on the bound nearest to it. The form checks the same
  // days for what is typed.
  const firstDay = parseDay(min)
  const lastDay = parseDay(max)

  // The calendar asks every day it shows whether it is reserved, on every
  // render, so each day is looked up in a set rather than compared with every
  // reserved date.
  const reservedDays = new Set(reserved)
  const isReserved = (date: Date) =>
    reservedDays.has(fnsFormat(date, ISO_FORMAT))

  const unavailable = [
    ...(firstDay ? [{ before: firstDay }] : []),
    ...(lastDay ? [{ after: lastDay }] : []),
    isReserved,
  ]

  return (
    <InputGroup>
      <InputGroupInput
        {...props}
        type="text"
        value={draft ?? display(current, format)}
        onChange={handleValueChange}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOpen(true)
          }
        }}
      />
      <InputGroupAddon align="inline-end">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <InputGroupButton
              aria-label="Select date"
              id="date-picker"
              size="icon-xs"
              variant="ghost"
            >
              <CalendarIcon />
              <span className="sr-only">Select date</span>
            </InputGroupButton>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              defaultMonth={selectedDate}
              disabled={unavailable}
              startMonth={firstDay}
              endMonth={lastDay}
              modifiers={{ reserved: isReserved }}
              modifiersClassNames={RESERVED_CLASS}
              onSelect={handleCalendarSelect}
            />
          </PopoverContent>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  )
}
