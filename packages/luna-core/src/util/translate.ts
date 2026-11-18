import { baseLanguage, toLocale } from './date'
import { isObject, isString } from './is-type'

// Every string the library renders on its own behalf. A form cannot name these
// in its schema — they are not in its JSON — so the library owns both the key
// and its translations. English needs no entry: the source text is the key.
//
// This type is the single place they are named. Keys live as bare literals in
// the components that render them, and nothing but string equality connects the
// two: a rename on either side would silently fall back to English instead of
// failing. Typing every key against this closes that gap — a misspelled or
// missing key stops the build. A type and not an array: the list was only ever
// read for its type, and nothing at runtime asks which keys there are.
export type BuiltInKey =
  | '(Optional)'
  | 'Add item'
  | 'An unexpected error occurred submitting the form.'
  // What a screen reader is told when an agent fills fields in.
  | 'An agent filled 1 field'
  | 'An agent filled {count} fields'
  | 'Collapse {label} {index}'
  | 'Collapse {name} ({label} {index})'
  | 'Expand {label} {index}'
  | 'Expand {name} ({label} {index})'
  | 'Please correct the errors and try again.'
  | 'Remove {label} item {index}'
  | 'Remove {name} ({label} item {index})'
  | 'There were validation errors submitting the form.'
  | 'Unknown error'
  | 'No'
  | 'Yes'
  // What a field says about a value its validation holds back, when the
  // definition gives no message of its own. Kept in the library's words, not
  // the validator's: `Too small: expected string to have >=1 characters` is
  // no message for the person filling the form in, in any language.
  | 'Add at least {min} items'
  | 'Add at most {max} items'
  | 'Add at least 1 item'
  | 'Add at most 1 item'
  | 'Date must be on or after {date}'
  | 'Date must be on or before {date}'
  | 'Enter a number'
  | 'Enter a whole number'
  | 'Enter at least {min} characters'
  | 'Enter at most {max} characters'
  | 'Enter at least 1 character'
  | 'Enter at most 1 character'
  | 'Enter {max} or less'
  | 'Enter {min} or more'
  | 'Invalid date'
  | 'Invalid date range'
  | 'Invalid email address'
  | 'Invalid number: must be a multiple of {step}'
  | 'Invalid number: must be {base} plus a multiple of {step}'
  | 'Invalid value'
  | 'This date cannot be checked'
  | 'This date is not available'
  | 'This field is required'
  | 'This list cannot be checked'
  | 'This option is not available'
  | 'This value cannot be checked'
  | 'This year is not available'

// A language ships either every key or none: a half-translated dictionary would
// mix two languages in one form, which reads worse than staying in English.
const BUILT_IN: Record<string, Record<BuiltInKey, string>> = {
  es: {
    '(Optional)': '(Opcional)',
    'Add item': 'Añadir elemento',
    'An unexpected error occurred submitting the form.':
      'Ocurrió un error inesperado al enviar el formulario.',
    'An agent filled 1 field': 'Un agente llenó 1 campo',
    'An agent filled {count} fields': 'Un agente llenó {count} campos',
    'Collapse {label} {index}': 'Contraer {label} {index}',
    'Collapse {name} ({label} {index})': 'Contraer {name} ({label} {index})',
    'Expand {label} {index}': 'Expandir {label} {index}',
    'Expand {name} ({label} {index})': 'Expandir {name} ({label} {index})',
    'Please correct the errors and try again.':
      'Corrige los errores e inténtalo de nuevo.',
    'Remove {label} item {index}': 'Eliminar {label} {index}',
    'Remove {name} ({label} item {index})': 'Eliminar {name} ({label} {index})',
    'There were validation errors submitting the form.':
      'Se encontraron errores de validación al enviar el formulario.',
    'Unknown error': 'Error desconocido',
    No: 'No',
    Yes: 'Sí',
    'Add at least {min} items': 'Añade al menos {min} elementos',
    'Add at most {max} items': 'Añade como máximo {max} elementos',
    'Add at least 1 item': 'Añade al menos 1 elemento',
    'Add at most 1 item': 'Añade como máximo 1 elemento',
    'Date must be on or after {date}':
      'La fecha debe ser igual o posterior a {date}',
    'Date must be on or before {date}':
      'La fecha debe ser igual o anterior a {date}',
    'Enter a number': 'Escribe un número',
    'Enter a whole number': 'Escribe un número entero',
    'Enter at least {min} characters': 'Escribe al menos {min} caracteres',
    'Enter at most {max} characters': 'Escribe como máximo {max} caracteres',
    'Enter at least 1 character': 'Escribe al menos 1 carácter',
    'Enter at most 1 character': 'Escribe como máximo 1 carácter',
    'Enter {max} or less': 'Escribe {max} o menos',
    'Enter {min} or more': 'Escribe {min} o más',
    'Invalid date': 'Fecha no válida',
    'Invalid date range': 'Rango de fechas no válido',
    'Invalid email address': 'Correo electrónico no válido',
    'Invalid number: must be a multiple of {step}':
      'Número no válido: debe ser múltiplo de {step}',
    'Invalid number: must be {base} plus a multiple of {step}':
      'Número no válido: debe ser {base} más un múltiplo de {step}',
    'Invalid value': 'Valor no válido',
    'This date cannot be checked': 'Esta fecha no se puede comprobar',
    'This date is not available': 'Esta fecha no está disponible',
    'This field is required': 'Este campo es obligatorio',
    'This list cannot be checked': 'Esta lista no se puede comprobar',
    'This option is not available': 'Esta opción no está disponible',
    'This value cannot be checked': 'Este valor no se puede comprobar',
    'This year is not available': 'Este año no está disponible',
  },
}

// Resolves a key the library owns. Identical to `translate` at runtime; the
// point is the compile-time link, so renaming a built-in breaks the build
// rather than the translation.
export function translateBuiltIn(
  key: BuiltInKey,
  dictionary?: Record<string, string>
): string {
  return translate(key, dictionary)
}

// Picks the dictionary a form renders with: the entries it authored for `lang`,
// layered over whatever the library ships for that language. The form always
// wins, so declaring a key keeps overriding the built-in text.
export function resolveDictionary(
  lang?: string,
  translations?: Record<string, Record<string, string>>
): Record<string, string> | undefined {
  if (!lang) {
    return undefined
  }

  // From the general to the specific: the library's own copy, the form's block
  // for the base language, and its block for the exact tag. The language lives
  // in `lang` alone, so it carries the region its money and dates are written
  // for, and an `es-CO` form reads its `es` block, with `es-CO` winning key by
  // key where it has one. Read the way the months and the filters read it, so
  // a tag that is no tag is English here too.
  const tag = toLocale(lang)
  const base = baseLanguage(tag)
  const layers = [
    BUILT_IN[base],
    translations?.[base],
    base === tag ? undefined : translations?.[tag],
  ].filter((layer) => layer !== undefined)

  // One layer is passed through by reference: the result is what each field's
  // schema is memoized on, and a new object per call would rebuild them all.
  if (layers.length <= 1) {
    return layers[0]
  }

  return Object.assign({}, ...layers)
}

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

// Resolves a string that may not be there. Distinct from `translate`, which
// collapses a missing key to '': callers here feed optional slots (a legend, a
// validation message) where `undefined` and '' mean different things.
export function translateOptional(
  value?: string,
  dictionary?: Record<string, string>
): string | undefined {
  return value ? translate(value, dictionary) : undefined
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
