# Tools for agents

An AI agent fills a form through tools: functions it calls with arguments that
a JSON Schema describes. `buildToolSchema` derives that schema from the same
`sections` that render the form, so a tool takes the fields, options and bounds
the form checks on submit, and nothing an agent should not write.

The form does not register tools on its own yet. Use the schema with the tools
you register, through WebMCP or for your own model.

## Building the schema

```ts
import { buildToolSchema } from 'react-luna-form/schema'

const { lookup, required, schema } = buildToolSchema(sections, {
  context,
  definition,
  localization: { lang: 'es', translations: dictionary },
  types,
})
```

- **`schema`** is the input of a tool that fills the form: an object with one
  property per field an agent may write, in the order the form shows them,
  keyed by the name the form submits. It declares no `required`: a fill may
  name only some fields, and the ones it leaves out keep their value.
- **`required`** lists the fields a submit needs, to name in the tool's
  description.
- **`lookup`** lists the fields whose options are not in the schema: more than
  25, fetched from a source, or installed by a `source` event. An agent needs
  another tool to search them.

`definition` and `context` resolve [`$ref` entries](../structure/definition.md)
and have to be the ones the form renders with. `localization.translations` is
the dictionary for the form's language: titles, descriptions and option labels
are translated with it.

## What a field becomes

| Field                                          | Schema                                                                                   |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `input`, `input/text`, `input/tel`, `textarea` | `string`, with `minLength`, `maxLength` and `pattern` when the field declares them       |
| `input/email`                                  | `string` with `format: "email"`                                                          |
| `input/number`                                 | `integer`, or `number` when its `step`, or the bound the step counts from, is fractional |
| `input/date`                                   | `string` with `format: "date"` (`yyyy-MM-dd`); a range is an array of two                |
| `input/time`                                   | `string`, 24-hour `HH:mm` (or `HH:mm:ss`), whatever format the field shows               |
| `checkbox`, `select/active`                    | `boolean`                                                                                |
| `select`, `radio`                              | `string` with an `enum` of the option values; their labels go in the description         |
| `chips`, `chips/day`, `chips/month`            | an `array` of those values                                                               |
| `select/day`                                   | `string` with an `enum` of the 7 weekdays                                                |
| `select/month`                                 | `integer` from 1 to 12                                                                   |
| `select/year`                                  | `integer` between the years the field offers                                             |
| `select/timezone`                              | `string`, an IANA zone; its options are looked up                                        |
| `list`                                         | an `array` of row objects; `minItems` is the rows the list always holds, one by default  |
| `column`                                       | nothing of its own: its fields join the level that holds it                              |
| any other type                                 | the schema `types` gives for it, or `string`                                             |

A field with more than 25 options, or with options that are fetched or that a
`source` event installs, is a `string` in the schema and is listed in `lookup`.

A month, a year and a Yes/No are numbers and a boolean here, while the form
stores them as text: a tool that writes them converts them.

Two fields under one name hold one value, as they do in the form: the schema
describes it once, by the first of them an agent may write, and lists it in
`required` once when either is required.

## What an agent cannot write

These fields are not in the schema, and a tool should refuse them:

- `input/password`, always.
- A field or a list with `"advanced": { "agent": false }`.
- A `transient` field, and a `readonly` one.
- A `hidden` or `disabled` field, unless a `state` event that a field the agent
  may write fires shows it or unlocks it. Then it is in the schema, and its
  description says which field makes it available.

`advanced.agent: false` is for data an agent should not be the one to ask for:

```json
{
  "label": "National ID",
  "name": "document",
  "type": "input/text",
  "advanced": { "agent": false }
}
```

## Text the agent reads

- A field's `title` is its translated label, and its `description` is the
  field's own description followed by what JSON Schema cannot say: option
  labels, a number's step, a date's bounds and reserved days, which field shows
  a hidden one, a `requiredWhen`, that a required `checkbox` has to be `true`.
- A field whose `advanced.length` the form cannot read, such as `"min": "x"`,
  has no bounds in the schema, and its description says the submit refuses any
  value for it.
- A label or a description that interpolates a value, with a
  [`{placeholder}`](../interpolation/overview.md), is left out: the agent would
  read the placeholder, or a value someone typed.

## What every consumer reads

The schema uses only these keywords: `type`, `properties`, `required`,
`additionalProperties`, `items`, `enum`, `minimum`, `maximum`, `minLength`,
`maxLength`, `minItems`, `maxItems`, `pattern`, `format`, `title` and
`description`. There is no `oneOf`, `const`, `$ref` or `multipleOf`: one of the
model APIs reads a subset of OpenAPI that does not document them. A pattern goes
in only when it has no flags and compiles in Unicode mode, the way JSON Schema
reads it; any other pattern is checked on submit and only mentioned in the
description.

The same definition in the same language gives the same schema, byte for byte:
nothing in it depends on the time or on what a person typed. A tool registered
with it is not registered again for nothing, and a model that caches the start
of its prompt keeps the cache.

## Custom types

A field whose type no built-in type describes takes text, unless `types` gives
its schema:

```ts
buildToolSchema(sections, {
  types: { rating: { maximum: 5, minimum: 1, type: 'integer' } },
})
```

The field's label and description are added to the schema you give.
