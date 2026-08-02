import { isObject, isString } from './is-type'

export function translate(
  key?: string,
  dictionary?: Record<string, string>
): string {
  if (!key) {
    return ''
  }

  if (!dictionary) {
    return key
  }

  return dictionary[key] ?? key
}

// Resolves the display text of a list of options against the dictionary.
// Only `label` and `description` are touched: `value` is what the form submits,
// so translating it would change the payload with the language. Plain string
// items are left alone for the same reason, since there the string is both the
// label and the value.
export function translateOptions<T>(
  options: T[],
  dictionary?: Record<string, string>
): T[] {
  if (!dictionary) {
    return options
  }

  let changed = false
  const result = options.map((option) => {
    const translated = translateOption(option, dictionary)
    if (translated !== option) {
      changed = true
    }
    return translated
  })

  // Preserve identity when nothing resolved, so consumers comparing the options
  // array between renders do not see a new reference on every pass.
  return changed ? result : options
}

function translateOption<T>(option: T, dictionary: Record<string, string>): T {
  if (!isObject<unknown>(option)) {
    return option
  }

  const label = translateEntry(option.label, dictionary)

  // Option groups (`{ label, items }`) reach the combobox untouched by
  // `toOptions`, so resolve the group heading and its items too.
  const items = option.items
  if (Array.isArray(items)) {
    const translated = translateOptions(items, dictionary)
    if (translated === items && label === option.label) {
      return option
    }
    return {
      ...option,
      ...(label !== undefined && { label }),
      items: translated,
    } as T
  }

  const description = translateEntry(option.description, dictionary)
  if (label === option.label && description === option.description) {
    return option
  }

  return {
    ...option,
    ...(label !== undefined && { label }),
    ...(description !== undefined && { description }),
  } as T
}

// Non-string entries are returned untouched so an option that carries no label
// (or a numeric one) still compares equal and keeps its identity.
function translateEntry(value: unknown, dictionary: Record<string, string>) {
  return isString(value) ? translate(value, dictionary) : value
}
