import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Hands a picked value to the form the way it reads every change: off
 * `target.value`, and nothing else. Radix and Base UI report the bare value
 * they picked, so each wrapper here turns it back into that shape -- with this,
 * rather than each with its own copy of the cast.
 */
export function reportValue(
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
) {
  return (value: string | boolean | null) => {
    onChange?.({ target: { value } } as React.ChangeEvent<HTMLInputElement>)
  }
}

/**
 * The selection after `option` is pressed: added or taken out, or, when only
 * one can be picked, the only one or none.
 */
export function toggleSelection(
  selected: string[],
  option: string,
  multiple: boolean
): string[] {
  if (multiple) {
    return selected.includes(option)
      ? selected.filter((value) => value !== option)
      : [...selected, option]
  }

  return selected.includes(option) ? [] : [option]
}
