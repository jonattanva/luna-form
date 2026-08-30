# Interpolation

A `{placeholder}` in a form is resolved against a set of values that depends on
**where the placeholder is written**. There are two of them, and most confusion
about interpolation is one being read as the other.

- **In rendered text** — a field's `label`, a field or column `description` —
  the values are `context`, `env` and, in a description, that field's own
  `value`.
- **In an event payload** — what a [`value` action](../events/change.md#1-value-action-valueevent)
  writes, and the `url` and `body` of a [`source` action](../events/change.md#3-source-action-sourceevent) —
  the values are **the selected option itself**: `{value}`, `{label}` and every
  other key the option carries.

[Format filters](format-filters.md) work in both.

## Where each namespace applies

| Written in                        | Resolves against                        |
| --------------------------------- | --------------------------------------- |
| a field `label`                   | `context`, `env`                        |
| a field `description`             | `context`, `env`, `value`               |
| a column `description`            | `context`, `env`                        |
| a `state` action's `description`  | `context`, `env`, `value` of the target |
| a `value` action's payload        | the selected option                     |
| a `source` action's `url`, `body` | the selected option                     |
| a section `title`, `description`  | nothing — see below                     |

## Rendered text

`context` is a prop of the form and `env` is a key of
[`defineConfig`](../setup.md#style-alert-env). Both are addressed by name, with
dot notation for anything nested:

```tsx
<Form
  sections={sections}
  config={config}
  context={{ user: { firstName: 'Jane' }, plan: 'pro' }}
/>
```

```json
{
  "name": "greeting",
  "type": "input/text",
  "label": "Welcome {context.user.firstName}",
  "description": "You are on the {context.plan} plan, billed in {env.currency}"
}
```

Three details decide most of what you will hit:

- **`{value}` is a description's, not a label's.** A description is rendered
  with the field's current value in scope, so `{value}` there tracks what the
  user typed. A label is not: the same placeholder in a `label` resolves to
  nothing and stays on screen as the literal `{value}`.
- **Interpolation runs first, translation second.** The resolved string is what
  gets looked up in the [`translations`](../fields/list.md#localization)
  dictionary, so a label written as `Welcome {context.user.firstName}` is
  looked up as `Welcome Jane` — which is not a key anybody wrote. Translate the
  whole sentence with the placeholder inside it (`"welcome_user": "Hola
{context.user.firstName}"` keyed on the source text) rather than expecting the
  key to survive.
- **A section heading is not interpolated at all.** `title` and `description` on
  a [section](../structure/sections.md#title-and-description-are-translated-not-interpolated)
  are translated and take markdown links, but a placeholder in one is printed
  as written. A column description is interpolated, so that is the place to put
  one.

## Event payloads

What a change event carries is the **selected option**, not the form's values.
For a field whose options are declared or fetched, that is the whole row behind
the selection:

```json
{
  "name": "country",
  "type": "select",
  "source": [
    { "value": "cl", "label": "Chile", "dial": "+56" },
    { "value": "mx", "label": "Mexico", "dial": "+52" }
  ],
  "event": {
    "change": [
      {
        "action": "value",
        "value": { "phone_prefix": "{dial}", "country_name": "{label}" }
      }
    ]
  }
}
```

Selecting Chile writes `+56` and `Chile`. The keys available are the keys of
that option: there is no `{context.*}` or `{env.*}` here, and no way to read
another field's value.

Two shapes to keep in mind:

- **A text, textarea or date field carries `{ value }` and nothing else.** There
  is no option row behind it, so `{value}` is the only placeholder that resolves
  in its events.
- **A `chips` field carries its array** — see
  [change.md](../events/change.md#when-a-change-event-runs-at-mount). `{value}`
  is the array itself, and there is no `{label}` to read.

When the option rows do not use `value` as their identifying key — a remote
source mapped with `advanced.options` — the row is found through
[`advanced.entity`](../fields/select.md#advancedentity). Without it the event
sees only `{ value }` and every other placeholder stays literal.

### A `state` description is interpolated by the field that shows it

Unlike `value` and `source`, a [`state` action](../events/change.md#2-state-action-stateevent)
stores its `description` as written and the **target** interpolates it when it
renders. So `{value}` in that description is the target field's own value, not
the value of the field whose change set it.

Aimed at the field that raised the event — the common case — the two are the
same thing, which is why this rarely comes up:

```json
{
  "action": "state",
  "target": "price",
  "state": { "description": "Total to pay: {value | currency:USD}" }
}
```

Aimed at a different field, `{value}` reads that other field, and it is empty
until somebody fills it.

## Resolution rules

- **Dot notation walks objects.** `{context.user.firstName}`, `{env.branding.name}`.
- **A key that resolves to nothing is left alone.** The placeholder stays in the
  text exactly as written — `{context.missing}` renders as `{context.missing}`.
  This is deliberate: a half-rendered sentence is easier to spot than a blank.
- **So is a value that is not a scalar.** A placeholder standing for an object or
  an array is left literal in text. The one exception is a `value` action, where
  a template that is _nothing but_ the placeholder hands the structure over
  untouched — that is what fills a
  [list](../events/change.md#targeting-a-list).
- **An unknown filter leaves the whole placeholder.** `{total | nope}` renders as
  `{total | nope}` rather than dropping the value.
- **Spaces are trimmed.** `{ value }` and `{value}` are the same placeholder, as
  are `{total|currency:USD}` and `{total | currency:USD}`.

## The locale filters use

Locale-aware filters read `config.env.locale`:

```ts
defineConfig({ inputs: [...], env: { locale: 'es-ES', currency: 'EUR' } })
```

It reaches every filter the form renders — a label and a description format the
same value the same way. With no `locale` set, filters fall back to the locale of
whatever is running the code: the browser in the client form, the process in the
server one, which are not always the same machine. Set it once in `env` and both
renders agree.

## An unresolved placeholder cancels a request

A `source.url` still holding a `{placeholder}` after interpolation is **not
fetched**. The field renders with no options, no request appears in the network
panel, and nothing is logged: from the outside it looks exactly like an empty
response.

That is the intended behaviour — a cascading select should not call
`/api/states?country={value}` before a country is picked — but it is also what a
typo produces. A field that never fetches is worth checking for a placeholder
that nothing resolves, before checking the network.

A URL that _is_ fully resolved and still comes back empty is a different
problem: see [`fetcher.remotePatterns`](../setup.md#fetcherremotepatterns),
which does log when it blocks one.
