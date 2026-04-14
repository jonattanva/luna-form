'use client'

import * as React from 'react'
import { format as fnsFormat, isValid, parse } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

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

const NATIVE_FORMAT = 'yyyy-MM-dd'

function parseNativeDate(value: string): Date | undefined {
  if (!value) {
    return undefined
  }

  const date = parse(value, NATIVE_FORMAT, new Date())
  return isValid(date) ? date : undefined
}

export function DatePickerInput({
  onChange,
  value,
  ...props
}: {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  value?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [localValue, setLocalValue] = React.useState(value ?? '')
  const isFocused = React.useRef(false)

  React.useEffect(() => {
    if (!isFocused.current) {
      setLocalValue(value ?? '')
    }
  }, [value])

  function commit(raw: string) {
    if (onChange) {
      onChange({
        target: { value: raw },
      } as React.ChangeEvent<HTMLInputElement>)
    }
  }

  function handleValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    const raw = event.target.value
    setLocalValue(raw)
    commit(raw)
  }

  function handleFocus() {
    isFocused.current = true
  }

  function handleBlur() {
    isFocused.current = false
    setLocalValue(value ?? '')
  }

  function handleCalendarSelect(date: Date | undefined) {
    const formatted = date ? fnsFormat(date, NATIVE_FORMAT) : ''
    setLocalValue(formatted)
    commit(formatted)
    setOpen(false)
  }

  const selectedDate = parseNativeDate(value ?? '')

  return (
    <InputGroup>
      <InputGroupInput
        {...props}
        type="text"
        value={localValue}
        onChange={handleValueChange}
        onFocus={handleFocus}
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
              onSelect={handleCalendarSelect}
            />
          </PopoverContent>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  )
}
