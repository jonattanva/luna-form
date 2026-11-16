import { isList, isObject, prepare, resolveEntry } from '@luna-form/core'
import type { Definition, Fields, Sections } from '@luna-form/core'

// A field the form declares, under the name it reads it by. A list's rows are
// read by position inside the array under its name, each by the names of the
// fields the list declares, so those travel with it.
type Declared = {
  name: string
  row?: Declared[]
}

// In declaration order. A column carries no name of its own and only groups
// what is inside it, so it is walked through.
function collect(fields: Fields, declared: Declared[] = []): Declared[] {
  for (const field of fields) {
    if (isList(field) && typeof field.name === 'string') {
      declared.push({ name: field.name, row: collect(field.fields ?? []) })
    } else if ('name' in field && typeof field.name === 'string') {
      declared.push({ name: field.name })
    } else if ('fields' in field) {
      collect(field.fields ?? [], declared)
    }
  }
  return declared
}

// `result` with `name` set, copied from `value` the first time only, so a value
// that already names everything comes back as itself.
function withKey(
  result: Record<string, unknown>,
  value: Record<string, unknown>,
  name: string,
  next: unknown
): Record<string, unknown> {
  const copy = result === value ? { ...value } : result
  copy[name] = next
  return copy
}

function declareRows(rows: unknown[], row: Declared[]): unknown[] {
  let changed = false
  const next = rows.map((item) => {
    if (!isObject(item)) {
      return item
    }
    const filled = declare(item, row)
    changed ||= filled !== item
    return filled
  })
  return changed ? next : rows
}

function declare(
  value: Record<string, unknown>,
  declared: Declared[]
): Record<string, unknown> {
  let result = value
  for (const { name, row } of declared) {
    const entry = resolveEntry(name, value)
    if (!entry.found) {
      result = withKey(result, value, name, undefined)
    } else if (row && Array.isArray(entry.value)) {
      const rows = declareRows(entry.value, row)
      if (rows !== entry.value) {
        result = withKey(result, value, name, rows)
      }
    }
  }
  return result
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
 * A list is completed the same way, one row at a time: each row the value holds
 * gets the fields the list declares that it leaves out. A row loses a key the
 * same way the value does, and a row that moves up when one above it is removed
 * reads, until the caller answers, what the row it replaced held; only an
 * answer that names the missing fields takes that back.
 *
 * Absence is decided with the same lookup the form itself uses, so a name that
 * is a path (`basicAuth.username` against a nested object) is left exactly as it
 * is rather than shadowed by a flat key.
 *
 * @param sections - The form's own declaration, the list of what it will read.
 * @param value - What the caller has, left untouched.
 * @param definition - What a `$ref` in `sections` points into, the form's own:
 *   a field it brings in is only known once the reference is resolved.
 * @param context - What a `$ref` under `#/context/` reads, the form's own.
 * @returns `value` when it already names every field, a copy otherwise.
 */
export function withDeclaredFields(
  sections: Sections,
  value: Record<string, unknown>,
  definition?: Definition,
  context?: Record<string, unknown>
): Record<string, unknown> {
  // The form resolves its sections through the same cache, so a host passing
  // the objects the form gets pays for the walk once, not on every change.
  const declared: Declared[] = []
  for (const section of prepare(sections, definition, context)) {
    collect(section.fields ?? [], declared)
  }

  return declare(value, declared)
}
