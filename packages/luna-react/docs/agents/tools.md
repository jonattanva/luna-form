# Tools for agents

An AI agent fills a form through tools: functions it calls with arguments that
a JSON Schema describes. A form with `agent` offers itself as tools: through
[WebMCP](#webmcp) when the browser has it, and through
[`listTools()` and `callTool()`](#without-webmcp) for any other agent. The
tools write each field through its own change, as a person does, so the
field's transforms, change events and validation all run.

```tsx
<Form
  sections={sections}
  config={config}
  action={action}
  agent={{
    name: 'signup',
    description: 'Creates an account with an email and a password.',
    submit: true,
    allow: (call, { signal }) =>
      call.tool === 'submit' ? askPerson(call.values, signal) : true,
  }}
/>
```

- **`name`** prefixes the tools: `signup_fill`, `signup_read`,
  `signup_options`, `signup_submit`. Letters, digits, `_` and `-`, up to 56 of
  them, unique on the page. Any other name registers nothing and says so in
  the console.
- **`description`** is what the form is for, in your words: it opens the
  description of every tool, and it is what weighs most in how a model uses
  them. Write it as trusted text; nothing a person typed goes in it.
- **`submit`** offers `<name>_submit`. Off by default, and only with an
  `action`: sending has effects outside the page.
- **`allow(call, { signal })`** is asked before a fill and before a submit,
  never before a read. `call` is `{ tool: 'fill' | 'submit', values }`.
  Answer `true` to go on, or `false` or the reason to refuse, which the agent
  is given; a promise is waited for, as while a person confirms. `signal` is
  aborted when the agent cancels, when the form unmounts, or after five
  minutes, and the call is refused then. An `allow` that throws refuses it.
- **`onCall(call)`** is told of every call once it was answered, to audit
  what an agent asked and what it got, a call that wrote nothing included:
  `{ tool, input, output, duration }`, with `tool` one of `fill`, `read`,
  `options` or `submit` and `duration` in milliseconds, waiting in line
  included. A refused, cancelled or busy call is told too, and one that threw
  comes with `error` instead of `output`. `input` is what the agent sent, a
  name that is no field included, such as `password`, though nothing is
  written to it. It runs after the answer, on copies: a slow log keeps no
  agent waiting, and what it changes reaches no one. What it throws, or a
  promise it returns that fails, is logged and changes nothing.

The tools are built from the schema [below](#building-the-schema). Nothing is
built, and the code that builds them is not loaded, until WebMCP is on the
page or `listTools()` or `callTool()` is called.

## The tools

### `<name>_fill`

Takes the values to write, keyed by field name, in the formats the schema
gives. A field left out keeps its value. It writes in the order the form shows
the fields, and in rounds: a field that another value of the same call shows
or unlocks is written once it is. On a busy page it waits for that field to be
drawn, up to about two seconds, so a `hidden` or `locked` skip there can mean
the page did not draw it in time. Each value is checked when it is written;
the field validates them all once, at the end, and shows the errors as leaving
a field does.

It takes an option by its value or its label, in any case and without
accents, and a number written as text. `null` empties a field that can be
empty; a single choice cannot.

A list takes all its rows at once, replacing the ones it holds. One leaf of
one row is written by its route instead, the row counted from 0, without
sending the list again:

```json
{ "items.2.quantity": 4 }
```

A route to a row the list does not hold answers `unknown`. A row the same call
adds can be written into by its route too. The schema cannot declare routes,
so the list's description is where an agent learns them.

```json
{
  "ok": false,
  "applied": ["email", "plan", "frequency"],
  "revealed": ["frequency"],
  "values": {
    "email": "ada@example",
    "plan": "pro",
    "frequency": "weekly",
    "city": "Bogotá"
  },
  "adjusted": [],
  "skipped": [
    {
      "name": "country",
      "code": "invalid_option",
      "message": "No option \"Perú\". Options: co (Colombia), mx (México)."
    }
  ],
  "errors": { "email": ["Invalid email address"] }
}
```

- **`values`** holds the final value of every field that changed during the
  call, the ones a change event filled included (`city`), in the formats of
  the schema. A list the call did not send whole, holding the same rows, is
  told by the leaves that changed, under their route. A field skipped as
  [`changed`](#a-person-and-an-agent-at-once) is there too, with what it
  holds.
- **`skipped`** holds what was not written, with a [code](#codes).
- **`errors`** name a row's leaf by its route too: `items.2.quantity`.
- A time is written and read back as the schema gives it, `HH:mm`, or
  `HH:mm:ss` when the field shows seconds, whatever format it shows. It
  reaches the action with its seconds, `09:30:00`, as a time input sends it
  when a person picks one.
- **`ok`** is `false` when a value did not fit its field, broke a rule or was
  skipped as `changed`. A field skipped as `hidden` or `locked` does not make
  it `false`.
- What was written stays written when another field fails, as when a person
  writes.

### `<name>_read`

Takes `{ fields? }` and answers what the form holds now: `values`, the fields
`hidden` and `locked`, the `errors` on screen, and `submit`, the last
submission (`idle`, `pending`, `success` with its `data`, or `error`). Up to
100 fields a call; `more` says how many are left to ask for.

### `<name>_options`

Offered when a field's options are not in the schema. Takes
`{ field, text? }` and answers up to 50 `items` whose label or value contains
`text`, and `more`. A list's leaf is named through its first row,
`items.0.product`.

A field whose options are fetched answers with them once they arrive: the tool
waits up to five seconds for the field's own request, and asks for nothing
itself, so the request keeps to
[`remotePatterns`](../setup.md#fetcherremotepatterns), the source's headers
and its cache. When there are none to wait for, `items` is empty and `message`
says why: the field is hidden, disabled or read-only, or its options come from
another field's
[`source` event](../events/change.md#3-source-action-sourceevent), named so
the agent fills it first.

### `<name>_submit`

Submits the form as its submit button does: the same validation, action,
pending state and start over (see [Submit](../forms/submit.md)). A success is
answered once the form has started over, so a `<name>_read` right after it
reads what the form holds then. Answers `{ ok: true, data }` with what the
action returned, `{ ok: false, error, errors }` when it failed, or
`{ pending: true }` when a submission is still running or the action takes
more than 15 seconds; `<name>_read` gives the outcome later.

With [`validation.submit: false`](../forms/submit.md#turning-submit-validation-off)
the values are sent unchecked, and the descriptions say so: `<name>_submit`
leaves the checking to the action, and `<name>_fill` names no field a
submission needs. The notes on each field still describe the form's rules,
which such a submit does not check.

### Codes

| `code`           | Where      | Meaning                                         |
| ---------------- | ---------- | ----------------------------------------------- |
| `invalid_type`   | `skipped`  | The value is not of the field's type            |
| `invalid_option` | `skipped`  | Not one of its options; the message lists them  |
| `invalid_format` | `skipped`  | A day or a time written wrong                   |
| `unknown`        | `skipped`  | No field so named, or one left out of the tools |
| `changed`        | `skipped`  | A person changed it since the agent read it     |
| `hidden`         | `skipped`  | The field is not on the form                    |
| `locked`         | `skipped`  | The field is disabled or read-only              |
| `rows_adjusted`  | `adjusted` | The list kept another number of rows            |
| `refused`        | answer     | `allow` refused the call                        |
| `busy`           | answer     | Ten calls are waiting already                   |
| `cancelled`      | answer     | The agent cancelled the call                    |

A form answers its calls one at a time, in the order they come. Every tool
declares an `outputSchema`, and what an agent can correct comes back in the
answer with a `code`, never as an error thrown.

## A person and an agent at once

A person can keep writing in the form while an agent fills it. A fill does not
write over a field a person changed since the agent last read it: the field is
skipped as `changed`, and `values` has what it holds now. The agent decides
with that, and a second fill of the field writes it. A field that already
holds what the agent sends is written as any other.

A person's change is what they write in a field and the rows they add or
remove; a row they add or remove protects the whole list, since a row named by
its position may be another one now. What a change event writes, what the
host puts in through `value` and what the agent writes are not. What counts as
read: the fields a `<name>_read` returned with their values, and every field a
fill answered with; a row's leaf among them tells the rows moved too. A
submission that succeeds starts the form over, with nothing a person changed
in it yet.

## What the person sees

The form shows the person an agent at work, through attributes for your CSS;
it brings no style of its own.

- **`data-agent-active`** is on the `<form>` while a call of any of its tools
  runs, until it answers, a cancelled call included.
- **`data-agent-filled`** is on the field (`[data-slot="field"]`) of each value
  a fill changed, and of each one its change events filled in, until the
  person changes that field, or adds or removes a row of a list it is in. A
  value the field already held is not marked. A field drawn again, when a value
  hides and shows it, or a form started over after a success, comes back
  without it.
- A polite live region inside the form says how many fields a fill filled, in
  the form's language: `An agent filled 3 fields`.

```css
form[data-agent-active] {
  outline: 2px solid rgb(99 102 241 / 0.4);
}

[data-slot='field'][data-agent-filled] input {
  background: rgb(99 102 241 / 0.08);
}
```

## What the host hears

A change an agent makes reaches `onValueChange` as a person's does, with
`source: 'agent'`: a field it writes, and the rows of a list it assigns. What
that change sets off is the definition's: a `value` event that fills another
field, or a `state` that hides one and clears it, comes with `source: 'event'`.
A person's change comes with `source: 'user'`.

```tsx
<Form
  sections={sections}
  config={config}
  agent={{ name: 'signup' }}
  onValueChange={({ name, source, value }) => {
    if (source === 'agent') {
      audit(name, value)
    }
  }}
/>
```

## WebMCP

Where the browser offers `document.modelContext`, the form registers its tools
there on mount, and takes them down when it unmounts. A definition that
changes registers them again half a second later, and only when the tools
come out different. A page that turns tools off with
`Permissions-Policy: tools=()` gets none, and the form works as before.

## Without WebMCP

`listTools()` and `callTool()` give any agent the tools of every form with
`agent` on the page: for a model you call through its API, whose loop usually
runs on your server. Each tool has `name`, `title`, `description`,
`inputSchema`, `outputSchema` and `annotations`, the shape MCP and WebMCP use;
rename the schema to what your model's API calls it.

```ts
import { callTool, listTools } from 'react-luna-form'

const tools = await listTools()
const definitions = tools.map((tool) => ({
  name: tool.name,
  description: tool.description,
  parameters: tool.inputSchema,
}))

// For each tool call the model asks for:
const result = await callTool(call.name, call.input)
```

## What the agent reads

Labels, values and options come from the page, and a person or a remote
source may have written them: every tool is marked `untrustedContentHint` and
says so in its description. Leave a field out of the tools with
[`advanced.agent: false`](#what-an-agent-cannot-write) when an agent should not
be the one to ask for it; a password is always left out, and a field left out
answers `unknown`, as one that does not exist.

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
  25, more than 1000 characters to list, fetched from a source, or installed by
  a `source` event. An agent needs another tool to search them.

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

A field with more than 25 options, with options that take more than 1000
characters to list, or with options that are fetched or that a `source` event
installs, is a `string` in the schema and is listed in `lookup`.

A month, a year and a Yes/No are numbers and a boolean here, while the form
stores them as text: the tools convert them both ways.

Two fields under one name hold one value, as they do in the form: the schema
describes it once, by the first of them an agent may write, and lists it in
`required` once when either is required.

## What an agent cannot write

These fields are not in the schema, and the tools refuse them:

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
- A label is cut at 200 characters and a description at 500, ending in
  `...`. They can come from the host, through `#/context/` or the dictionary,
  and hold text people wrote; a long one would be room for instructions in
  what every agent reads first. An option is never cut, since an agent names it
  by its value or its label: a field whose options take more than 1000
  characters to list is looked up instead, through `<name>_options`, whose
  answer is marked as untrusted. What the form shows is not cut. A whole field
  put in through `#/context/` brings its name and its rules too, which nothing
  cuts: write those yourself.

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

A field whose type no built-in type describes takes text, unless its type
declares what an agent writes into it. Declare it where the type is
registered, and a form with `agent` describes the field with it:

```ts
defineCustomInput('rating', Rating, {
  agent: { schema: { maximum: 5, minimum: 1, type: 'integer' } },
})
```

The field's label and description are added to the schema you give, and the
tools write the value in that shape: a whole number here, handed to the
component as one. Use the same keywords as the rest of the schema
([What every consumer reads](#what-every-consumer-reads)).

- **What the tools check.** No rule of the form knows your schema, so the
  tools check a value against it before writing: its type, its `enum`, a
  number's `minimum` and `maximum`, a text's `minLength`, `maxLength` and
  `pattern`, and an array's `minItems` and `maxItems`. A value outside them is
  skipped with `invalid_option` or `invalid_format`.
- **What a person types** is checked by the field's own
  [validation](../validation/overview.md), as for any field: the schema only
  speaks to agents. Give the field the same rules when a person's value has to
  keep them too.
- **A value or a list of values.** A field never holds an object, so a schema
  of `type: "object"`, or an array of them, is left out with a warning, and the
  field takes text.
- **A built-in type** you register your own component for can declare a schema
  too, and it replaces the one the library would give.
- The last registration of a type is the one that counts, schema included.

Calling `buildToolSchema` yourself, pass the same schemas as `types`:

```ts
buildToolSchema(sections, {
  types: { rating: { maximum: 5, minimum: 1, type: 'integer' } },
})
```
