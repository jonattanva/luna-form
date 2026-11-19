import { COLUMN, LIST, VALUE } from './constant'
import { isObject, isString } from './is-type'
import { refOf, resolveRefs } from './prepare'
import { resolveTarget } from './path'
import { mapRuleFields } from './schema'

/** A value of parsed JSON, as a form's definition is written. */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | readonly JsonValue[]
  | { readonly [key: string]: JsonValue }

type JsonObject = Readonly<Record<string, JsonValue>>

/** Something in a definition that keeps it from rendering as written. */
export type DefinitionProblem = Readonly<{
  message: string
  /** Where it is, as `sections[0].fields[2]`. */
  path: string
}>

// What a walk of the fields reads, the types the config registers, and what
// it gathers: the name of every field as the form renders it, a row's leaf as
// in the first row (`items.0.sku`), which of them are lists, every target an
// event names, by the rendered name of the field that sends it, and every
// field a rule compares one to, with the row it reads. A field the host puts
// in through `#/context/` has a name nothing here can know, so neither goes
// checked when there is one.
type Walk = {
  // The groups dotted names make, `basicAuth` of `basicAuth.username`, which
  // a rule may name too.
  groups: Set<string>
  lists: Set<string>
  names: Set<string>
  opaque: boolean
  problems: DefinitionProblem[]
  references: Array<
    Readonly<{ field: string; inRow: boolean; name: string; path: string }>
  >
  registered: ReadonlySet<string>
  targets: Array<Readonly<{ path: string; sender: string; target: string }>>
}

/**
 * The problems in a form's JSON that would keep it from rendering as written,
 * for a host that takes a definition from somewhere it does not control, such
 * as an agent, and wants to answer before rendering it. An empty array is a
 * definition with none of them.
 *
 * `types` are the field types the host's config registers: a field of any
 * other type renders nothing. What is checked, after `$ref` is resolved
 * against `form.definition`:
 *
 * - `sections` is an array of objects, and every `fields` an array;
 * - every field has a `type` the config registers, and a `name`;
 * - every `$ref` into `#/definition/` resolves;
 * - every event targets a field the form has, read the way the form reads it;
 * - every field a `requiredWhen`, `rules` or `custom` compares one to is one
 *   the form has, in the row of a list the rule sits in.
 *
 * It does not check the other keys of a field, or its conditions: those
 * render, and do what they say, or fail where they are.
 */
export function checkDefinition(
  form: JsonObject,
  types: readonly string[]
): DefinitionProblem[] {
  const walk: Walk = {
    groups: new Set(),
    lists: new Set(),
    names: new Set(),
    opaque: false,
    problems: [],
    references: [],
    registered: new Set(types),
    targets: [],
  }

  const definition = isObject<JsonValue>(form.definition)
    ? form.definition
    : undefined
  // What `$ref` resolves to is part of the same JSON.
  const sections = resolveRefs(form.sections, definition) as JsonValue
  if (!isArray(sections)) {
    walk.problems.push({
      message: 'Expected an array of sections.',
      path: 'sections',
    })
    return walk.problems
  }

  sections.forEach((section, index) => {
    const path = `sections[${index}]`
    if (unresolved(section, path, walk)) {
      return
    }
    if (!isObject<JsonValue>(section)) {
      walk.problems.push({ message: 'Expected a section object.', path })
    } else if (section.fields !== undefined) {
      walkFields(section.fields, `${path}.fields`, '', walk)
    }
  })

  if (!walk.opaque) {
    for (const { path, sender, target } of walk.targets) {
      if (
        !walk.names.has(firstRow(resolveTarget(target, sender), walk.lists))
      ) {
        walk.problems.push({
          message: `The event targets "${target}", which no field is.`,
          path,
        })
      }
    }

    for (const { field, inRow, name, path } of walk.references) {
      const read = firstRow(name, walk.lists)
      if (!walk.names.has(read) && !walk.groups.has(read)) {
        walk.problems.push({
          message: inRow
            ? `The rule names "${field}", which its row has no field called: a rule in a row reads the fields of its own row.`
            : `The rule names "${field}", which no field is.`,
          path,
        })
      }
    }
  }

  return walk.problems
}

function isArray(value: JsonValue): value is readonly JsonValue[] {
  return Array.isArray(value)
}

// A rendered name as it is in the first row of every list it sits in:
// `groups.2.checks` and `groups.0.checks` are the same field. Only the
// position after a list is a row: a field may be called `address.1`.
function firstRow(name: string, lists: ReadonlySet<string>): string {
  const segments: string[] = []
  for (const segment of name.split('.')) {
    const row = lists.has(segments.join('.')) && /^\d+$/.test(segment)
    segments.push(row ? '0' : segment)
  }
  return segments.join('.')
}

// Whether `value` is a `$ref` that resolved to nothing, so there is nothing
// to check in it. One into the definition is told as a problem; one into
// `#/context/` is the host's to resolve when it renders.
function unresolved(value: JsonValue, path: string, walk: Walk): boolean {
  const ref = refOf(value)
  if (ref === undefined) {
    return false
  }
  if (ref.startsWith('#/context/')) {
    walk.opaque = true
  } else {
    walk.problems.push({ message: `"${ref}" resolves to nothing.`, path })
  }
  return true
}

// `prefix` is what the form puts before the name of a field where it is:
// nothing at the top, `items.0.` in a row of `items`.
function walkFields(
  fields: JsonValue,
  path: string,
  prefix: string,
  walk: Walk
) {
  if (unresolved(fields, path, walk)) {
    return
  }
  if (!isArray(fields)) {
    walk.problems.push({ message: 'Expected an array of fields.', path })
    return
  }

  fields.forEach((slot, index) => {
    const at = `${path}[${index}]`
    if (unresolved(slot, at, walk)) {
      return
    }
    if (!isObject<JsonValue>(slot) || !isString(slot.type)) {
      walk.problems.push({
        message: 'Expected a field object with a type.',
        path: at,
      })
      return
    }

    if (slot.type === COLUMN) {
      walkFields(slot.fields, `${at}.fields`, prefix, walk)
      return
    }

    if (!isString(slot.name) || slot.name === '') {
      walk.problems.push({ message: 'The field has no name.', path: at })
      return
    }
    const name = `${prefix}${slot.name}`
    walk.names.add(name)
    const segments = name.split('.')
    for (let end = 1; end < segments.length; end++) {
      walk.groups.add(segments.slice(0, end).join('.'))
    }

    if (slot.type === LIST) {
      walk.lists.add(name)
      walkFields(slot.fields, `${at}.fields`, `${name}.0.`, walk)
      return
    }

    if (!walk.registered.has(slot.type)) {
      walk.problems.push({
        message: `No input is registered for the type "${slot.type}", so "${slot.name}" would not render.`,
        path: at,
      })
    }
    collectTargets(slot.event, at, name, walk)
    collectReferences(slot.validation, at, prefix, walk)
  })
}

// The fields a field's change events write to or act on.
function collectTargets(
  event: JsonValue | undefined,
  path: string,
  sender: string,
  walk: Walk
) {
  if (!isObject<JsonValue>(event) || !isArray(event.change)) {
    return
  }

  event.change.forEach((action, index) => {
    if (!isObject<JsonValue>(action)) {
      return
    }
    const at = `${path}.event.change[${index}]`
    const targets =
      action.action === VALUE && isObject<JsonValue>(action.value)
        ? Object.keys(action.value)
        : [action.target].flat()
    for (const target of targets) {
      if (isString(target)) {
        walk.targets.push({ path: at, sender, target })
      }
    }
  })
}

// The fields a field's rules compare it to, by the name the form reads: in
// the row of a list the field sits in, as `inRow` names them.
function collectReferences(
  validation: JsonValue | undefined,
  path: string,
  prefix: string,
  walk: Walk
) {
  mapRuleFields(validation, (field, at) => {
    walk.references.push({
      field,
      inRow: prefix !== '',
      name: `${prefix}${field}`,
      path: `${path}.validation${at}`,
    })
    return field
  })
}
