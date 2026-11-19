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

type AriaKey = keyof React.AriaAttributes

function isAriaKey(key: string): key is AriaKey {
  return key.startsWith('aria-')
}

/**
 * Splits the `aria-*` attributes the form hands a control from the rest of its
 * props. The form names the field and says when it is invalid through them
 * (`aria-labelledby`, `aria-invalid`, `aria-errormessage`), and a component
 * built from several parts has to put them on the one that takes focus, not on
 * a root that renders nothing.
 */
export function splitAria<T extends React.AriaAttributes>(
  props: T
): [React.AriaAttributes, Omit<T, AriaKey>] {
  const aria: React.AriaAttributes = {}
  const rest: Partial<T> = {}
  for (const key of Object.keys(props) as Array<keyof T & string>) {
    if (isAriaKey(key)) {
      Object.assign(aria, { [key]: props[key] })
    } else {
      rest[key] = props[key]
    }
  }
  return [aria, rest as Omit<T, AriaKey>]
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
