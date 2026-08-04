import { resolveEntry } from './resolve-value'
import type { Fields, Sections } from '@luna-form/core'

// Every field name the form declares, in declaration order. A column carries no
// name of its own and only groups what is inside it, so it is walked through. A
// list does have one — its value is the array under that name — so it is
// collected and its children are left alone: they are addressed positionally
// inside that array, not as fields of the value object.
function collectNames(fields: Fields, names: string[]): void {
  for (const field of fields) {
    if ('name' in field && typeof field.name === 'string') {
      names.push(field.name)
      continue
    }

    if ('fields' in field) {
      collectNames(field.fields ?? [], names)
    }
  }
}

/**
 * The value a form is fed, with every field it declares present in it.
 *
 * A form reads a name its value object leaves out as a field the caller did not
 * mention, and leaves that field showing whatever it was showing. That is the
 * right reading while the caller is only ever adding values, and the wrong one
 * the moment it loses any: reverting to an earlier state does not empty a key,
 * it removes it, and the input would go on displaying text that no longer
 * exists anywhere else.
 *
 * Naming the field is the difference between saying nothing about it and saying
 * it holds nothing, and only the second empties the input. Calling this is
 * therefore the opt-in: pass the result as `value` and the object becomes the
 * form's state; pass your own object and nothing changes.
 *
 * Absence is decided with the same lookup the form itself uses, so a name that
 * is a path (`basicAuth.username` against a nested object) is left exactly as it
 * is rather than shadowed by a flat key.
 *
 * @param sections - The form's own declaration, the list of what it will read.
 * @param value - What the caller has, left untouched.
 * @returns `value` when it already names every field, a copy otherwise.
 */
export function withDeclaredFields(
  sections: Sections,
  value: Record<string, unknown>
): Record<string, unknown> {
  const names: string[] = []
  for (const section of sections) {
    collectNames(section.fields ?? [], names)
  }

  let result = value
  for (const name of names) {
    if (resolveEntry(name, value).found) {
      continue
    }

    if (result === value) {
      result = { ...value }
    }
    result[name] = undefined
  }

  return result
}
