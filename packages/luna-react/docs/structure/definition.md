# Definition and `$ref`

A definition names a piece of JSON once so the rest of the form can point at it.
Anywhere inside `sections`, an object shaped `{ "$ref": "#/definition/<path>" }`
is replaced by whatever `<path>` holds in the `definition` you pass alongside
them.

```tsx
<Form sections={sections} definition={definition} config={config} />
```

```json
{
  "definition": {
    "sources": {
      "countries": { "url": "/api/countries", "namespace": "results" }
    }
  },
  "sections": [
    {
      "fields": [
        {
          "name": "origin",
          "type": "select",
          "label": "Origin",
          "source": { "$ref": "#/definition/sources.countries" }
        },
        {
          "name": "destination",
          "type": "select",
          "label": "Destination",
          "source": { "$ref": "#/definition/sources.countries" }
        }
      ]
    }
  ]
}
```

## The path is dotted, not slashed

Everything after `#/definition/` is a **dot path** into the definition object:
`#/definition/sources.countries`, never `#/definition/sources/countries`. The
prefix is the only part that uses slashes, and it looks enough like a JSON
Pointer to be written the wrong way on the first try.

## What can be a reference

Any object in the tree. The `$ref` object is replaced whole, so a reference can
stand for a `source`, an array of options, a whole field, or the `fields` of a
section:

```json
{
  "definition": {
    "email": {
      "name": "email",
      "type": "input/email",
      "label": "Email",
      "required": true
    }
  },
  "sections": [{ "fields": [{ "$ref": "#/definition/email" }] }]
}
```

References inside a definition are resolved too, so one entry can be built out
of others.

## What the host knows: `#/context/`

A definition is JSON the form reuses. What the host only knows when it renders,
such as the options a user may pick or the nights already booked, is passed as
the form's `context` prop instead and read with the same syntax, under
`#/context/`:

```json
{
  "name": "room",
  "type": "select",
  "source": { "$ref": "#/context/rooms" }
}
```

```tsx
const context = useMemo(() => ({ rooms }), [rooms])

<Form sections={sections} context={context} config={config} />
```

Both roots resolve the same way and follow the rules below. A path with no root
reads the definition, as it always has, and an entry of the definition can
point into `#/context/`.

Keep `context` the same object while nothing in it changes, and hand over a new
one when something does. Every field renders again when `context` is a new
object, since a label or a description may interpolate it, and a field whose
JSON reads `#/context/` is resolved again as well. A value changed in place, in
the same object, is not something the form can notice.

## The rules

- **Resolution happens once, before anything else.** The tree is resolved first,
  and only then filtered and sorted, so an `order` or a `hidden` that arrives
  through a reference behaves like one written in place.
- **An unresolved path leaves the reference standing.** Nothing throws: the node
  stays as the literal `{ "$ref": ... }` object. What that looks like on screen
  depends on where it was — a field whose `source` is still a reference renders
  with no options at all, which is the usual way a typo in the path is noticed.
  A path that holds nothing is unresolved too: a key that is missing, and one
  the host left `undefined` or `null`.
- **An empty or missing root resolves nothing under it.** `definition={{}}` is
  treated as absent, and so is `context={{}}`: every `$ref` into a root that is
  absent is left as written.
- **A cycle stops instead of hanging.** Two entries pointing at each other
  resolve until the loop closes and leave the reference that would repeat
  unresolved.

## Pass it everywhere the sections go

`definition` and `context` are props of both the client and the server `Form`,
and the third and fourth arguments of the headless builder:

```ts
import { buildFormSchema } from 'react-luna-form/schema'

const schema = buildFormSchema(sections, translations, definition, context)
```

A schema built without them sees `$ref` objects where the form sees
fields — the rendered form and the validated shape drift apart, which is the one
thing [the schema being derived from the same descriptors](../validation/overview.md#headless-validation)
is meant to prevent.
