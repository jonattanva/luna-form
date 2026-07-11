# Validation

Luna Form derives a [Zod](https://zod.dev) schema directly from the form JSON, so the **form definition is the single source of truth for validation**. Each field carries a `validation` object that maps a constraint to its error message; the builder turns those declarations into a runnable schema.

The same schema powers two paths:

- **In the browser**, the rendered `<Form>` validates on blur/submit.
- **On the server (or any headless caller)**, `react-luna-form/schema` exposes `buildFormSchema(sections)` so you can run the _exact same_ validation without React — see [Headless validation](#headless-validation).

This page documents every key of the `validation` object plus the shared operator vocabulary. Per-field basics also appear in each field's own page (e.g. [Input](../fields/input.md), [Select](../fields/select.md), [List](../fields/list.md)).

---

## The `validation` object

`validation` lives on a field and maps a constraint name to a message (or a rule declaration):

- **`required`** _(string)_: Message shown when a field marked `required: true` is empty.
- **`email`** _(string)_: Message for an invalid email format (`input/email`).
- **`length`** _({ min?: string, max?: string })_: Messages when the value's length breaches `advanced.length`.
- **`custom`** _(CustomValidation | CustomValidation[])_: Cross-field comparison. See [Custom (cross-field)](#custom-cross-field).
- **`requiredWhen`** _(WhenRule | WhenRule[])_: Conditionally required. See [requiredWhen](#requiredwhen).
- **`pattern`** _(PatternRule)_: Regex/format check. See [pattern](#pattern).
- **`rules`** _(AssertRule[])_: General gated assertions. See [rules](#rules).

> Emptiness is normalized for validation: an empty string, a whitespace-only string, `null`/`undefined`, and an empty array all count as "no value". So `pattern` and format rules never fire on an empty field — that is `required`/`requiredWhen`'s job.

---

## `requiredWhen`

Makes a field required **only when a condition over sibling data holds**. This is the declarative replacement for wiring "required" to visibility by hand.

A `WhenRule` is:

- **`field`** _(string, required)_: The sibling field whose value is tested.
- **`operator`** _(Operator, optional)_: How to compare. Defaults to `eq`. See [Operators](#operators).
- **`value`** _(string | number | boolean | Array, optional)_: The value to compare against (ignored by the unary operators `exists` / `truthy`).
- **`message`** _(string, optional)_: The error message. Falls back to `validation.required` when omitted.

Provide a single rule or an array. **An array is OR** — the field is required if _any_ rule's condition holds.

```json
{
  "name": "token",
  "type": "input/text",
  "validation": {
    "requiredWhen": {
      "field": "authType",
      "operator": "eq",
      "value": "bearer",
      "message": "Provide the access token"
    }
  }
}
```

### Item scope inside lists

When a `requiredWhen` field lives inside a [`list`](../fields/list.md), its `field` reference resolves **within the same item**, not the form root. This lets each row validate against its own siblings:

```json
{
  "name": "rules",
  "type": "list",
  "fields": [
    { "name": "operator", "type": "select" },
    {
      "name": "value",
      "type": "input/text",
      "validation": {
        "requiredWhen": {
          "field": "operator",
          "operator": "nin",
          "value": ["truthy", "exists"],
          "message": "Enter the value to compare against"
        }
      }
    }
  ]
}
```

Here `value` is required unless this row's `operator` is `truthy` or `exists`. Item-scoped `requiredWhen` is resolved by the [headless builder](#headless-validation).

---

## `pattern`

Validates a string value against a regular expression.

- **`regex`** _(string, required)_: The pattern source (compiled with `new RegExp`).
- **`flags`** _(string, optional)_: Regex flags, e.g. `"i"`.
- **`message`** _(string, optional)_: The error message.
- **`allowInterpolation`** _(boolean, optional)_: When `true`, the check is **skipped** if the value is dynamic and only resolved at run time — either an interpolation template (contains `{...}`) or an [`input/expression`](../fields/input.md) reference (a value beginning with `@`, e.g. `@Trigger.url`). Use this for fields that accept dynamic values, e.g. a URL like `{step.url}` or `@step.url`.

```json
{
  "name": "url",
  "type": "input/text",
  "validation": {
    "pattern": {
      "regex": "^https?://",
      "allowInterpolation": true,
      "message": "The web address must start with http:// or https://"
    }
  }
}
```

`pattern` never fires on an empty value — pair it with `required`/`requiredWhen` when the field is mandatory.

---

## `rules`

An escape hatch that keeps complex validation **in JSON**: an array of gated assertions evaluated in order.

Each `AssertRule` is:

- **`assert`** _(string, required)_: What to check — one of `required`, `minItems`, `maxItems`, `min`, `max`, `oneOf`, `pattern`.
- **`value`** _(depends on `assert`)_: The bound the assertion checks against (a number, an array for `oneOf`, or a `PatternRule` for `pattern`).
- **`message`** _(string, required)_: The error shown when the assertion fails.
- **`when`** _(WhenClause, optional)_: Only run the assertion when this condition holds. Omit to always run it.

### Assertions

| `assert`   | Passes when                                         | `value`       |
| ---------- | --------------------------------------------------- | ------------- |
| `required` | The field has a value                               | —             |
| `minItems` | Array length ≥ value                                | number        |
| `maxItems` | Array length ≤ value                                | number        |
| `min`      | Size ≥ value (number value, or string/array length) | number        |
| `max`      | Size ≤ value                                        | number        |
| `oneOf`    | Value is one of the listed values                   | array         |
| `pattern`  | Value matches the pattern                           | `PatternRule` |

### `when` clause

A `when` gate can be a single rule, an array, or an all/any object:

- A single **`WhenRule`** — runs when that condition holds.
- An **array of `WhenRule`** — **AND**: every condition must hold.
- **`{ all?: WhenRule[]; any?: WhenRule[] }`** — `all` requires every rule, `any` requires at least one; both must be satisfied when present.

```json
{
  "name": "port",
  "type": "input/number",
  "validation": {
    "rules": [
      {
        "when": { "field": "kind", "operator": "eq", "value": "custom" },
        "assert": "required",
        "message": "Port is required for custom connections"
      },
      {
        "assert": "oneOf",
        "value": ["eq", "neq", "gt"],
        "message": "Choose a valid operator"
      }
    ]
  }
}
```

---

## `custom` (cross-field)

Compares this field's value against **another field's value** using an operator. Provide one rule or an array (all are checked).

- **`field`** _(string)_: The other field to compare against.
- **`operator`** _(Operator, optional)_: Defaults to `eq`.
- **`message`** _(string)_: The error shown when the comparison fails.

```json
{
  "name": "confirmPassword",
  "type": "input/text",
  "required": true,
  "validation": {
    "custom": {
      "field": "password",
      "operator": "eq",
      "message": "Passwords must match"
    }
  }
}
```

---

## Operators

Operators are shared across `custom`, `requiredWhen`, `rules` gates, and [change-event conditions](../events/change.md). Each compares a `current` value against a `value`:

| Operator     | True when                                      | Notes                       |
| ------------ | ---------------------------------------------- | --------------------------- |
| `eq`         | `current === value`                            | default                     |
| `neq`        | `current !== value`                            |                             |
| `in`         | `value` (array) contains `current`             |                             |
| `nin`        | `value` (array) does **not** contain `current` |                             |
| `gt` / `gte` | `current > value` / `>=`                       | numeric                     |
| `lt` / `lte` | `current < value` / `<=`                       | numeric                     |
| `contains`   | `current` (string/array) contains `value`      |                             |
| `exists`     | `current` has a value                          | **unary** — `value` ignored |
| `truthy`     | `current` is truthy                            | **unary** — `value` ignored |

`contains`, `exists`, and `truthy` are the newest additions; the rest have always been available.

---

## List length

A [`list`](../fields/list.md) can require a minimum/maximum number of items. The bounds live on `advanced.length`, and the messages on `validation.length`:

```json
{
  "name": "rules",
  "type": "list",
  "advanced": { "length": { "min": 1, "max": 5 } },
  "validation": {
    "length": {
      "min": "Add at least one condition",
      "max": "You can add up to five conditions"
    }
  },
  "fields": [{ "name": "label", "type": "input/text" }]
}
```

A missing list key is treated as an empty list, so `length.min` still fails on an absent value rather than silently passing. List length is enforced by the [headless builder](#headless-validation).

---

## Headless validation

The server-safe entry `react-luna-form/schema` exposes the builder with **no React dependency**, so a backend can validate a stored configuration with the same rules the form uses:

```ts
import { buildFormSchema, collectIssues } from 'react-luna-form/schema'

const schema = buildFormSchema(sections) // sections: the form JSON
const result = schema.safeParse(config)

if (!result.success) {
  const issues = collectIssues(result.error)
  // [{ path: 'rules.0.value', message: 'Enter the value to compare against' }]
}
```

- **`buildFormSchema(sections, translations?, definition?)`** — walks the form tree (sections → columns → lists → fields) and returns a Zod schema. Lists become arrays of objects, so nested `requiredWhen`/`rules` resolve in **item scope**. `translations` maps messages to localized strings; `definition` resolves `$ref` sources.
- **`collectIssues(error)`** — flattens a `ZodError` into `{ path, message }` entries with **dotted paths** (e.g. `rules.0.value`), including nested list issues.

### What each path validates

| Rule                                          | Rendered `<Form>` submit | `buildFormSchema` (headless) |
| --------------------------------------------- | ------------------------ | ---------------------------- |
| `required`, `email`, `length` (field)         | ✅                       | ✅                           |
| `custom`                                      | ✅                       | ✅                           |
| `requiredWhen` (top-level)                    | ✅                       | ✅                           |
| `pattern`                                     | ✅                       | ✅                           |
| `rules` (top-level)                           | ✅                       | ✅                           |
| `requiredWhen` **inside a list** (item scope) | —                        | ✅                           |
| List `length`                                 | —                        | ✅                           |

The headless builder is the superset: item-scoped conditions and list length require the nested tree it produces.

### Nested (dotted) field names

A field whose `name` contains a dot — e.g. `basicAuth.username` — is grouped into a **nested object** by `buildFormSchema`, matching the nested config the runtime persists (the `<Form>` submits flat keys and then un-flattens them). So `{ "name": "basicAuth.username" }` validates against `{ basicAuth: { username } }`, and its issue path is `basicAuth.username`. The nested group is optional as a whole: a config may omit it entirely (e.g. no `basicAuth` when auth is off) and rely on `requiredWhen` for the conditional requirement.

### Hidden fields

`buildFormSchema` treats a `hidden: true` field as **not structurally required**, even if it declares `required: true`. A hidden field is only shown once an event reveals it, so its requirement is conditional by nature — express it with [`requiredWhen`](#requiredwhen) (typically keyed on the same condition that reveals it). This keeps the headless schema from over-requiring fields the rendered form never mounts. `pattern`/format rules on a hidden field still fire when it holds a value.

---

## Complete example

```json
{
  "sections": [
    {
      "fields": [
        { "name": "authType", "type": "select" },
        {
          "name": "token",
          "type": "input/text",
          "validation": {
            "requiredWhen": {
              "field": "authType",
              "operator": "eq",
              "value": "bearer",
              "message": "Provide the access token"
            }
          }
        },
        {
          "name": "url",
          "type": "input/text",
          "required": true,
          "validation": {
            "required": "The web address is required",
            "pattern": {
              "regex": "^https?://",
              "allowInterpolation": true,
              "message": "Use a valid http(s) address"
            }
          }
        }
      ]
    }
  ]
}
```
