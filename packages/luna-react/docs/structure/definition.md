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

## The rules

- **Resolution happens once, before anything else.** The tree is resolved first,
  and only then filtered and sorted, so an `order` or a `hidden` that arrives
  through a reference behaves like one written in place.
- **An unresolved path leaves the reference standing.** Nothing throws: the node
  stays as the literal `{ "$ref": ... }` object. What that looks like on screen
  depends on where it was — a field whose `source` is still a reference renders
  with no options at all, which is the usual way a typo in the path is noticed.
- **An empty or missing `definition` resolves nothing.** `definition={{}}` is
  treated as absent, and every `$ref` in the form is left as written.
- **A cycle stops instead of hanging.** Two entries pointing at each other
  resolve until the loop closes and leave the reference that would repeat
  unresolved.

## Pass it everywhere the sections go

`definition` is a prop of both the client and the server `Form`, and the third
argument of the headless builder:

```ts
import { buildFormSchema } from 'react-luna-form/schema'

const schema = buildFormSchema(sections, translations, definition)
```

A schema built without the definition sees `$ref` objects where the form sees
fields — the rendered form and the validated shape drift apart, which is the one
thing [the schema being derived from the same descriptors](../validation/overview.md#headless-validation)
is meant to prevent.
