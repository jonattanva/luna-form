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
- **`description`** is what the form is for, in your words, and it is what
  weighs most in how a model uses the tools. It goes only in the tools that
  write, `<name>_fill` and `<name>_submit`: each opens with what that tool
  does, and yours follows as the form's context:

  ```text
  Submits this form as its submit button does: every field is validated,
  then the values are sent. About this form: Creates an account with an
  email and a password. Call it once ...
  ```

  `<name>_read` and `<name>_options` only read, so a description that says
  what sending does, or what the form edits, is not in them: they name the
  form in their own first sentence instead, by `title` or else `name`,
  `Reads what the form "signup" holds now: ...` and
  `Finds the options of a field of the form "signup" that ...`.

  Write it as trusted text; nothing a person typed goes in it. It need not end
  in a period: one that does not end in `.`, `!`, `?`, `:` or an ellipsis is
  closed with a period before the sentences that follow it. A blank one adds
  nothing.

- **`title`** is what the form edits, in your words and your language, for
  the title of every tool: what the tool does, then yours, `Fill: Question 2`,
  `Read: Question 2`, `Find options: Question 2`, `Submit: Question 2`, and
  for the form the first sentence of `<name>_read` and `<name>_options` names.
  Without it, or blank, the titles name `name` instead, `Fill: signup`, so the
  tools of several forms on one page are told apart all the same; give a
  `title` when `name` is a key no person reads, such as `step_2`.
- **`target`** is which item the form edits now, for a form whose content
  depends on what is open, such as the settings of the step selected: an id
  or a fixed label. The tools keep their names when it changes, so every
  answer says it, and a fill or a submit meant for the item the agent read is
  refused once another is open. See
  [A form that edits one item of several](#a-form-that-edits-one-item-of-several).
- **`submit`** offers `<name>_submit`. Off by default, and only with an
  `action`: sending has effects outside the page. Without it, no tool speaks
  of a submission, so an agent does not look for a way to send the form:
  `<name>_fill` names the fields required (`Required fields: email.`) instead
  of what a submission needs, and `<name>_read` answers no `submit`.
- **`output`** is the shape of the `data` your action returns, so an agent
  knows what a submission answers before it sends one. With `submit`, it is
  the `data` that the `outputSchema` of `<name>_submit` declares, and the
  `submit.data` of `<name>_read`'s; without it both declare any object. It is
  a schema with `type: 'object'`, in the keywords of
  [What every consumer reads](#what-every-consumer-reads):

  ```ts
  output: {
    type: 'object',
    properties: { id: { type: 'string' }, version: { type: 'integer' } },
    required: ['id'],
  }
  ```

  When `<name>_submit` answers data that breaks it, a development build names
  where in the console: a value of another type, one outside its `enum`, a
  `required` property missing, one not declared under
  `additionalProperties: false`, or an array item that breaks `items`. Bounds,
  such as `minimum` or `pattern`, are not checked. The answer goes out all the
  same, `{ ok: true, data }`: the action already ran, and an answer that is not
  `ok` would have the agent send the form again. `data` is always an object,
  `{}` when the action returns none, so a `required` property is missing then.

- **`allow(call, { signal, deadline })`** is asked before a fill and before a
  submit, never before a read. `call` is `{ tool: 'fill' | 'submit', values }`.
  Answer `true` to go on, or `false` or the reason to refuse, which the agent
  is given; a promise is waited for, as while a person confirms. `deadline`
  is when the wait ends: five minutes after `allow` is asked, in milliseconds
  since the epoch, as `Date.now()` counts them, so a countdown shown to the
  person is the one that decides. `signal` is aborted when the agent cancels,
  when the form unmounts, or at `deadline`: the first is answered `cancelled`,
  and the other two are refused with a message that says which it was (see
  [Codes](#codes)). An `allow` that throws refuses it.
  A form with `allow` tells the agent that a person may need to approve a
  submission first; see [Waiting for a person](#waiting-for-a-person).
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

A list with [`advanced.fixed`](../fields/list.md) keeps its rows from an agent
as it does from a person: sent with another number of rows than it holds, or
`null`, it is skipped as `rows_fixed` and keeps them. The same holds for one in
a row of a list sent whole: a row the list holds keeps its rows, and a row the
call adds holds the ones such a list opens with. Rows that a value written in
the same call brings, through a `value` event, are waited for. Its rows are
corrected by sending them all, in order, or one leaf by its route.

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

- **`values`** holds what every field in `applied` holds now, one that already
  held the value sent included, and the final value of every other field that
  changed during the call, such as one a change event filled (`city`), in the
  formats of the schema. A list the call did not send whole, holding the same rows, is
  told by the leaves that changed, under their route. A field skipped as
  [`changed`](#a-person-and-an-agent-at-once) is there too, with what it
  holds. A row holds only the fields it shows, as `<name>_read` reads it.
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
`hidden` and `locked`, the `errors` on screen, and, when the form offers
`<name>_submit`, `submit`, the last submission (`idle`, `awaiting_approval` with its `deadline`, `refused` with
its `message`, `pending`, `success` with its `data`, or `error`). Up to 100
fields a call; `more` says how many are left to ask for.

A field that is not on the form is in `hidden` and not in `values`, as a
submit leaves it out. A row's field that its row does not show is the same:
it is in `hidden` by its route, and its row in `values` does not hold it. A
row of a collapsed list still shows its fields.

```json
{
  "hidden": ["body.0.mode", "body.1.value"],
  "values": {
    "body": [
      { "kind": "text", "value": "a" },
      { "kind": "group", "mode": "all" }
    ]
  }
}
```

### `<name>_options`

Offered when a field's options are not in the schema. Takes
`{ field, text? }` and answers up to 50 `items` whose label or value contains
`text`, and `more`. A list's leaf is named through its first row,
`items.0.product`. Either the `value` or the `label` of an item it answers
is a value `<name>_fill` takes for the field: `"caribe"` picks the option
`{ "label": "Caribe", "value": "r-02" }`. A text that is exactly an option's
value picks that option, even when it is another option's label too; a text
that reads as the label or value of more than one once case and accents are
set aside is skipped as `invalid_option`, with the options it could mean.

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
action returned, in the shape [`output`](#tools-for-agents) declares,
`{ ok: false, error, errors }` when it failed, or
`{ pending: true }` when a submission is still running or waits for a person,
or when the person and the action take more than 15 seconds between them;
`<name>_read` gives the outcome later.

With [`validation.submit: false`](../forms/submit.md#turning-submit-validation-off)
the values are sent unchecked, and the descriptions say so: `<name>_submit`
leaves the checking to the action, `<name>_fill` names no field a submission
needs or that is required, and the schema holds no rule only a submit checks (see
[Text the agent reads](#text-the-agent-reads)).

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
| `rows_fixed`     | `skipped`  | A fixed list sent with another number of rows   |
| `rows_adjusted`  | `adjusted` | The list kept another number of rows            |
| `refused`        | answer     | `allow` refused the call, or did not answer it  |
| `busy`           | answer     | Ten calls are waiting already                   |
| `cancelled`      | answer     | The agent cancelled the call                    |
| `target_changed` | answer     | The form edits another item than the one meant  |

A `refused` call changed nothing, and its `message` says why:

| Why                               | `message`                                                                                             |
| --------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `allow` answered a reason         | That reason, as it was given                                                                          |
| `allow` answered `false`          | `The page refused the call.`                                                                          |
| `allow` threw                     | `The page could not answer the call.`                                                                 |
| No answer by `deadline`           | `Nobody answered in time, so the call changed nothing. Ask your user before you try again.`           |
| The form unmounted while it asked | `The form is no longer on the page, so the call changed nothing. Ask your user before you try again.` |

Every description says what the codes of the answer mean, in one sentence
before the warning that the page's text is data. `busy` and `cancelled` can
answer any call, so every tool says:

```text
If code is busy, 10 calls were waiting: call again once one is answered;
cancelled, the call was stopped. message says more.
```

Only a call `allow` is asked about can be refused, so in a form with `allow`,
`<name>_fill` and `<name>_submit` open the same sentence with `refused`, in
words that hold for every reason above:

```text
If code is refused, the page did not let the call go on and it changed
nothing; busy, 10 calls were waiting: ...
```

A form answers its calls one at a time, in the order they come, except while
a submission waits for a person (below). Every tool
declares an `outputSchema`, and what an agent can correct comes back in the
answer with a `code`, never as an error thrown.

## Waiting for a person

With `allow`, the description of `<name>_submit` says that a person may need
to approve it first, so the agent can tell its user why it waits. While
`allow` has not answered a submit:

- `<name>_read` answers at once, with
  `submit: { status: 'awaiting_approval', deadline }`: the `deadline` `allow`
  was given, as an ISO 8601 time such as `'2026-11-25T12:39:42.000Z'`.
  So does a second `<name>_submit`, with `{ pending: true }` and a message
  that says it waits for a person; it is not asked about again.
- A `<name>_fill` waits in line until the person answers, so nothing is
  written over the values they decide on.
- Past 15 seconds, `<name>_submit` answers `{ pending: true }` and the wait
  goes on: once the person approves, the form is submitted, and
  `<name>_read` reads `pending`, then the outcome.
- When the person refuses, or does not answer by the deadline,
  `<name>_read` reads `{ status: 'refused', message }`, with the `message`
  the refused call is answered with (see [Codes](#codes)). A submit the agent cancels while
  it waits leaves the last submission as it was.
- With `target`, a call the person approves after another item was opened
  writes or sends nothing: see
  [A form that edits one item of several](#a-form-that-edits-one-item-of-several).

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

## A form that edits one item of several

A form whose content depends on what is open, such as the settings of the
step selected, offers the same tools whatever it edits: `step_fill` writes to
the step open when it runs. Name that item with `target`, and change it with
the item:

```tsx
<Form
  key={step.id}
  sections={sections}
  config={config}
  value={step.settings}
  agent={{ name: 'step', title: step.label, target: step.id }}
/>
```

- Every answer, of every tool, has `target`: the item the call acted on, and
  the `outputSchema` of each tool declares it. The descriptions of
  `<name>_read`, `<name>_fill` and `<name>_submit` say what it means.
- A `<name>_read` tells the agent which item the form edits, and so does a
  `<name>_fill` that runs. Once another is open, the next `<name>_fill` or `<name>_submit` is
  refused with `target_changed`, changing nothing: what it sends was meant
  for the item the agent read. The answer names the item open now, and its
  `message` asks the agent to read the form and to ask its user before it
  writes to this one:

  ```json
  {
    "code": "target_changed",
    "message": "The form edits another item than the one this call was meant for, so the call changed nothing. Call step_read, and ask your user before you write to this one.",
    "ok": false,
    "target": "B"
  }
  ```

- After a `<name>_read`, the fill goes on, on the item open now.
- A call that waits for a person is held to the item it started on: once
  `allow` approves it, a `<name>_fill` or `<name>_submit` is refused the same
  way if another item is open, since what the person approved was meant for
  the first. A submit is refused even when the agent read the item open now
  while it waited. A refused submit takes back its wait: `<name>_read` reads
  the last submission as it was before.
- An agent that has read no item yet is not refused: there is no item it
  meant.
- What the agent was told is kept by `name` on the page, past the form: a
  host that draws the form anew for each item, with a `key`, is held to it
  the same as one that hands the form the item's values.

Changing `target` alone does not register the tools again: which item it
names is read on every call, and only whether there is one changes the tools.
Without `target`, nothing of this is described, answered or refused.

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
  without it. The field is the one whose `data-field-name` is the value's name
  (see [Styling hooks](../structure/layout.md#styling-hooks)), so a
  [custom input](../fields/custom-inputs.md) is marked whether or not it
  renders a `name`.
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

Tools of your own page, beside those of its forms, register the same way
with `registerTools(tools, signal)`: each `Tool` is a `ToolDefinition` with
its `execute(input)`, it stays until `signal` is aborted, and without WebMCP
nothing happens. A page that turned tools off, or a signal aborted before the
tools were in, is not reported; any other failure is warned about in the
console.

```tsx
useEffect(() => {
  const controller = new AbortController()
  registerTools(tools, controller.signal)
  return () => controller.abort()
}, [])
```

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
be the one to ask for it, or every field of a custom type with
[`agent: false`](#custom-types); a password is always left out, and a field
left out answers `unknown`, as one that does not exist.

Every field in the schema is one an agent may be tempted to fill with what it
knows about the person. `<name>_fill` asks for what the person asked for and
the values it implies, such as a key made from a label, and to ask the person
before writing what they did not give, such as what the agent knows about
them. The same words fit a form about a person and one that configures
something, whose required technical keys no person types. The schema is still
the real limit: offer only the fields the form needs, and leave optional
personal data out of the tools.

## Building the schema

```ts
import { buildToolSchema } from 'react-luna-form/schema'

const { lookup, required, schema } = buildToolSchema(sections, {
  context,
  definition,
  localization: { lang: 'es', translations: dictionary },
  types,
  validates,
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
- **`fixed`** lists the lists with `advanced.fixed`, whose rows an agent can
  correct but not add or remove, by their whole name: a nested one through the
  first row of its list, `groups.0.checks`.

`definition` and `context` resolve [`$ref` entries](../structure/definition.md)
and have to be the ones the form renders with. `localization.translations` is
the dictionary for the form's language: titles, descriptions and option labels
are translated with it. `validates` is `false` when the form's submit checks
nothing, [`validation.submit: false`](../forms/submit.md#turning-submit-validation-off).

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
- A field or a list with `"advanced": { "agent": false }`, or
  `"advanced": { "agent": { "exclude": true } }`.
- A field of a type registered with `agent: false`, always (see
  [Custom types](#custom-types)).
- A `transient` field, and a `readonly` one.
- A `hidden` or `disabled` field, unless a `state` event that a field the agent
  may write fires shows it or unlocks it. Then it is in the schema, and its
  description says what makes it available (see
  [Text the agent reads](#text-the-agent-reads)).

`advanced.agent: false` is for data an agent should not be the one to ask for:

```json
{
  "label": "National ID",
  "name": "document",
  "type": "input/text",
  "advanced": { "agent": false }
}
```

`"agent": true` is the same as leaving the key out. It keeps nothing back and
opens nothing: a password, a field of a type registered with `agent: false`,
and a field in the rows of a list with `"agent": false` stay out.

`agent` can also be an object, to tell the agent what a field is without
drawing it for the person. `exclude: true` in it says what `false` does, and
`false` or no `exclude` what `true` does: it opens nothing either.
`description` is text only the agent reads, for a field whose name or label
could mislead it, such as a field named `required` that holds the message
shown when an answer is left empty:

```json
{
  "label": "If it is left empty",
  "name": "required",
  "type": "input/text",
  "advanced": {
    "agent": {
      "description": "The message shown when the answer is left empty"
    }
  }
}
```

The form never draws it, nor puts it on an element of the page. In the
schema it follows the field's own description, before the notes (see
[Text the agent reads](#text-the-agent-reads)).

## Text the agent reads

- A field's `title` is its translated label, and its `description` is the
  field's own description, then the `description` of its `advanced.agent`,
  followed by what JSON Schema cannot say: option
  labels, a number's step, a date's bounds and reserved days, which field shows
  a hidden one, a `requiredWhen`, each rule of `rules` and `custom`, that a
  required `checkbox` has to be `true`.
  The field's own description, the one of its `advanced.agent`, and a custom
  input's, is closed with a period before what follows when it does not end a
  sentence, as `description` above.
- A field or a list without a `label` that is the only one its
  [section](../structure/sections.md) holds, a column's fields counted among
  the section's, takes the section's translated `title`, and its
  `description` when it has none of its own. Of several in a section, none
  takes them, and a field kept from agents counts among them.
- A note in a list's row holds for each row, so it names no row by its number.
  A field of the same row is this row's, as in
  `Shown for some values of this row's flag` or
  `Required when this row's mode equals "strict".`, in a nested list too. A field
  in the rows of a list under it, or a field of a row named from outside the
  list, counts each row as `<row>`, the way the list's routes do:
  `this row's inner.<row>.flag`, `outer.<row>.flag`. A field outside every list
  is named as it is.
- A field listed in `lookup` has no `enum`, so its description points to
  `<name>_options` and says that an option is passed by its value or its
  label. A field whose options are listed does not say it: its `enum` holds
  the values only, and a client that checks the input against the schema
  would refuse a label, although `<name>_fill` takes one.
- A `pattern` goes in the `pattern` keyword only on a field written as text:
  `input`, `input/text`, `input/tel`, `input/email`, `textarea`, and a type
  `types` gives no schema for. Even there, one with `flags`, with
  `allowInterpolation`, or that does not compile in Unicode mode is not
  carried. Every other pattern is written in the description as a literal with
  its flags, such as `It must match /^[a-z]{3}$/i.`, when that takes 100
  characters or fewer, escapes included. A bare `/` is escaped, so
  `^https?://` reads `/^https?:\/\//`, and one already escaped is left as it
  is. A longer one is never cut, since a part of it would expect something
  else: the description says `It must match a pattern the form checks.`
  instead. The submit checks a pattern against any field that holds text, so a
  number, a day, a time, an option, a month, a year, a time zone and a type
  `types` describes as a `string`, `number` or `integer` say theirs this way.
  A field whose schema is a `boolean`, an `array` or an `object` says nothing
  of one. The pattern's translated `message` follows, in the keyword's case
  too, cut at 200 characters, unless it interpolates a value. A pattern carried
  in the keyword is not repeated in the description.
- A `requiredWhen` is written in words, one condition per rule joined by
  `or`, such as `Required when kind is not one of ["object","array"].` Each
  [operator](../validation/overview.md#operators) has its phrase: `eq`
  equals, `neq` does not equal, `in` is one of, `nin` is not one of, `gt` is
  greater than, `gte` is at least, `lt` is less than, `lte` is at most,
  `contains` contains, `exists` has a value, `empty` has no value, `truthy`
  has a value other than false or 0. The last three leave the `value` out,
  since they ignore it. A rule whose operator the form cannot read never
  holds, and is left out.
- Each rule of `rules` and `custom` is written in words, followed by its
  translated `message`, cut at 200 characters, unless it interpolates a value.
  An assertion says what passes it: `required` as `Required`, `min` and `max`
  as `At least 3` or `At most 20`, counted in characters on a field that holds
  text and in items on one that holds a list, `minItems` and `maxItems` as
  `At least 2 items` on a field that holds a list, `oneOf` as
  `One of ["eq","neq"]`, and `pattern` as the literal above. Its `when` follows
  in the phrases above, the conditions of an array or of `all` joined by `and`
  and those of `any` by `or`, such as
  `At least 1 when kind equals "a" and (size has a value or mode equals "b").`
  A `custom` compares the field with the one it names, as
  `The form checks that it equals the value of password.` In a row, the fields
  both name are this row's. A rule that never fails is left out: an `assert`
  the form does not know, a `pattern` with no pattern, a `custom` whose
  operator the form cannot read, and a `when` that never holds, since a
  condition it needs, or every condition its `any` may take, has such an
  operator. One that fails every value says
  `The form checks more rules for it.` before its message: a bound that is not
  a number, `minItems` or `maxItems` on a field that holds no list, and a
  `oneOf` without a list.
- A hidden or locked field says what makes it available, as a rule that holds
  whatever the form holds: the schema is built from the definition, so the
  note reads the same while the field is hidden and once it is shown. Whether
  it is hidden or locked right now is what `<name>_read` answers. When every
  `state` event that shows it (or unlocks it) compares the new value with
  values of its own, the description cites them, in the phrases above: a
  string `when` as `eq`, an array as `in`, a condition by its operator, such as
  `Shown while kind is one of ["list","group"]: send it in the same call.`
  Several events are joined by `or`. When one of them cannot be put that way,
  it names the fields whose values do it instead:
  `Shown for some values of kind`. That is an event with no `when`, a
  condition with `field` (it reads a key of the chosen option), one on a
  `chips` field (it is matched by its selections), or one whose operator the
  form cannot read. A field that is both hidden and locked says each, as
  `Shown while kind equals "list" and unlocked while kind equals "group"`, or
  `Shown and unlocked while ...` when the same thing does both. A required one
  adds `Required while it is available.`
- A submit that checks nothing leaves out of the schema what only a submit
  checks: a `requiredWhen`, a `rules`, a `pattern`, in a keyword or in a note.
  The rest stays, since the field checks it as it is written: its bounds, a
  whole number, a required `checkbox`, and a `custom`, whose note says it.
- A field whose `advanced.length` the form cannot read, such as `"min": "x"`,
  has no bounds in the schema, and its description says the form accepts no
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
in only on a field written as text, when it has no flags and compiles in
Unicode mode, the way JSON Schema reads it; any other pattern is checked on
submit and written in the description. A form whose submit checks nothing has
neither (see [Text the agent reads](#text-the-agent-reads)).

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

A type no agent should write, such as a secret, a connection picker or a JSON
editor, is closed with `agent: false`:

```ts
defineCustomInput('secret', SecretInput, { agent: false })
```

Every field of it is left out of the tools of every form, as a password is, in
the rows of a list too: it is not in the schema, `<name>_read` returns nothing
of it, and `<name>_fill` answers `unknown` when an agent names it. A field that
only a field of it shows or unlocks is left out with it. Nothing in the
definition opens it again: `"advanced": { "agent": true }` is the same as
leaving the key out. A built-in type
registered this way is closed too, and the last registration of a type decides
it, as it does a schema.

Calling `buildToolSchema` yourself, pass the same schemas as `types`, and
`false` for a closed type:

```ts
buildToolSchema(sections, {
  types: {
    rating: { maximum: 5, minimum: 1, type: 'integer' },
    secret: false,
  },
})
```

## A form an agent writes

An agent can also write the form itself: its JSON, from a request in natural
language. Before rendering JSON that came from somewhere you do not control,
`checkDefinition` says what would keep it from rendering as written, so the
agent can be answered and correct it:

```ts
import { checkDefinition } from 'react-luna-form/schema'

const problems = checkDefinition(form, Object.keys(config.inputs))
// [{ path: 'sections[0].fields[1]', message: 'No input is registered for ...' }]
```

`form` is the parsed JSON, with `sections` and, if it has one, `definition`;
the second argument is the field types your config registers. It resolves
`$ref` first, then checks:

- `sections` is an array of objects, and every `fields` an array;
- every field has a `name`, and a `type` the config registers: a type nothing
  implements [renders nothing](../index.md#two-things-that-surprise-people);
- every `$ref` into `#/definition/` resolves;
- every [change event](../events/change.md) targets a field the form has,
  read the way the form reads it: a plain name from the top of the form,
  `list/leaf` from the row the sender sits in, and a position such as
  `groups.0.checks` in any row;
- every field a `requiredWhen`, `rules` or `custom` compares one to is a field
  the form has, and one of its own row for a rule in a
  [list's row](../validation/overview.md#item-scope-inside-lists).

A `$ref` into `#/context/` is left to the host. Where it stands for a field,
its name cannot be known, so the targets of events and the fields rules name go
unchecked. Two fields under one name are not a problem: they hold one value.

An empty array is a form with none of these problems. It does not check the
other keys of a field, or its conditions: those render, and do what they say
or fail where they are.
