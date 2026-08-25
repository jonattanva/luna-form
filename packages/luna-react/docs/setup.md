# Setup

How a form is configured and rendered. The pages under `fields/`,
`validation/` and `events/` describe the JSON; this one describes the code
around it.

## Entry points

| Import                   | Contains                                                                                  |
| ------------------------ | ----------------------------------------------------------------------------------------- |
| `react-luna-form`        | `Form` (client), `withDeclaredFields`, and the `Sections`, `Source` and `ZodSchema` types |
| `react-luna-form/server` | `Form` (server) and `Fallback`                                                            |
| `react-luna-form/config` | `defineConfig` and the `define*` registration helpers                                     |
| `react-luna-form/schema` | `buildFormSchema` and `collectIssues`                                                     |

## Configuring

`defineConfig` is called once, usually in a `luna.config.ts` at the root of the
application, and its result is passed to every `Form`.

```ts
import { defineConfig, defineInput, defineSelect } from 'react-luna-form/config'

export default defineConfig({
  inputs: [defineInput(Input), defineSelect(Select)],
})
```

### `inputs` (required)

The components that render each field type. Registration is by exact type
string; a type nothing registers renders nothing at all. The helpers cover the
types this library ships:

| Helper              | Registers                                                                                                       |
| ------------------- | --------------------------------------------------------------------------------------------------------------- |
| `defineInput`       | `input`, `input/date`, `input/email`, `input/number`, `input/password`, `input/tel`, `input/text`, `input/time` |
| `defineSelect`      | `select`, `select/active`, `select/day`, `select/month`, `select/timezone`, `select/year`                       |
| `defineChips`       | `chips`, `chips/day`, `chips/month`                                                                             |
| `defineRadio`       | `radio`                                                                                                         |
| `defineCheckbox`    | `checkbox`                                                                                                      |
| `defineTextArea`    | `textarea`                                                                                                      |
| `defineCustomInput` | whatever names you give it — see [fields/custom-inputs.md](fields/custom-inputs.md)                             |

### `validation`

When to validate and whether to summarise errors. All four default to `true`.

```ts
validation: { blur: true, change: true, showError: true, submit: true }
```

**This object replaces the defaults, it does not merge into them.** Passing
`{ change: false }` also turns off `blur`, `submit` and `showError`, so the form
stops validating on blur and loses its error summary with no indication why.
Pass every key you still want.

### `fetcher.remotePatterns`

Which hosts a field's remote `source` may call. The rules:

| Value   | Effect                               |
| ------- | ------------------------------------ |
| omitted | **every host is allowed**            |
| `[]`    | every external URL is blocked        |
| a list  | an external URL must match one entry |

A pattern may constrain `protocol`, `hostname` and `port`; every part is
optional and an omitted part matches anything. Relative URLs count as internal
and are always allowed.

```ts
fetcher: {
  remotePatterns: [{ protocol: 'https', hostname: 'api.example.com' }]
}
```

A blocked URL is not an error. The library logs
`URL blocked by remotePatterns: <url>` and the field renders with no options at
all, which on screen looks like an empty select rather than a rejected request.
Check the console when a remote source comes back empty.

### `style`, `alert`, `env`

- `style` takes `compact`, `horizontal` and `showOptionalLabel`.
- `alert` is the component that renders the error summary, when `showError`
  is on.
- `env` is a flat record of values available to interpolation, in labels and in
  descriptions. Its `locale` key is also what those two read to format values.

## Rendering

### `Form` from `react-luna-form`

The client form. It owns its own state, so it is the one to use for anything
interactive.

| Prop                                      | Purpose                                                                |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| `sections`                                | the field descriptors — the form itself                                |
| `config`                                  | the result of `defineConfig`                                           |
| `value`                                   | the current values                                                     |
| `action`                                  | server action invoked on submit, receives the form data and the schema |
| `onSuccess`                               | called with the parsed data after `action` succeeds                    |
| `onValueChange`                           | called with `{ name, value }` on every change                          |
| `readOnly`                                | renders every field disabled                                           |
| `translations`                            | per-locale strings for labels, options and messages                    |
| `lang`                                    | the locale to resolve `translations` against                           |
| `context`                                 | arbitrary values available to interpolation                            |
| `definition`, `advanced.step`, `children` | multi-step and custom controls                                         |

### `Form` from `react-luna-form/server`

The same descriptors rendered without client state. It accepts the same props
minus the interactive ones: there is no `action`, `onSuccess` or
`onValueChange`. Use it for a form that only needs to be displayed.

### `Fallback`

A `Suspense` boundary whose fallback is the form itself in `readOnly` mode:

```tsx
<Fallback config={config} sections={sections}>
  <SomethingAsync />
</Fallback>
```

The placeholder is the real layout rather than a generic skeleton, so nothing
shifts when the content arrives.

## `withDeclaredFields`

A form treats a name missing from its `value` object as a field the caller did
not mention, and leaves that input showing whatever it was showing. That is
correct while values are only ever being added, and wrong the moment one is
lost: reverting to an earlier state does not empty a key, it removes it, and the
input goes on displaying text that exists nowhere else.

```tsx
import { withDeclaredFields } from 'react-luna-form'

;<Form
  sections={sections}
  config={config}
  value={withDeclaredFields(sections, value)}
/>
```

Naming the field is the difference between saying nothing about it and saying it
holds nothing, and only the second empties the input. Wrapping the value is the
opt-in: pass the result and the object becomes the form's state.

Absence is resolved with the same lookup the form uses, so a name that is a path
(`basicAuth.username` against a nested object) is handled correctly rather than
shadowed by a flat key.

## `react-luna-form/schema`

`buildFormSchema(sections)` derives the Zod schema from the same descriptors
that render the form, which is what keeps the rendered fields and the validated
shape from drifting apart. `collectIssues(error)` flattens a Zod error into
`{ path, message }` entries.

Use them to validate on the server against the same rules the form applies in
the browser.
