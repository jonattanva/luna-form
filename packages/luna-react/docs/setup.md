# Setup

How a form is configured and rendered. The pages under `fields/`,
`validation/` and `events/` describe the JSON; this one describes the code
around it.

## Installing

```bash
pnpm add react-luna-form
```

The package carries no dependencies of its own: everything it needs is a peer
dependency, so your application resolves one copy of React, Zod and the rest.

| Peer                    | Version             | Used for                                    |
| ----------------------- | ------------------- | ------------------------------------------- |
| `react`, `react-dom`    | `^19.0.0`           | rendering, and `useActionState` on submit   |
| `zod`                   | `^4.0.0`            | the schema derived from `sections`          |
| `jotai`, `jotai-family` | `^2.0.0` / `^1.0.0` | the value, error and source stores          |
| `swr`                   | `^2.0.0`            | fetching a field's remote `source`          |
| `date-fns`              | `^4.0.0`            | date and time formatting, `duration` filter |
| `fast-equals`           | `^6.0.0`            | change detection in the stores              |
| `tailwind-merge`        | `^3.5.0`            | merging the classes the components render   |

None of them is optional, and none is bundled. A package manager that installs
peers automatically (npm 7+, or pnpm with `auto-install-peers=true`) brings
them in for you; anywhere else, install them alongside the library. A missing
peer surfaces as a module resolution error at import time, not as a form that
renders badly.

## Styling

The components render Tailwind utility classes and **the build ships no CSS**.
With [Tailwind CSS v4](https://tailwindcss.com) installed, point it at the
package so the classes inside the published bundle are generated:

```css
@import 'tailwindcss';

@source '../node_modules/react-luna-form';
```

Without that `@source` line every class the library renders is scanned out as
unused: the markup is correct, the labels and inputs are all there, and none of
the layout is — which reads as a broken build rather than a missing line of
CSS.

Every element also carries a `data-slot` attribute — `field`, `field-label`,
`field-control`, `field-set`, `field-set-content`, `field-content`,
`field-group`, `field-separator`, `column`, `list-item-card` — so a design
system can restyle the structure without patching the library. The components
you register yourself are yours to style; these slots cover the scaffolding
around them.

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

Which hosts a field's remote `source` may call — the source itself is documented in [fields/data-source.md](fields/data-source.md). The rules:

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

| Prop            | Purpose                                                                                                         |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| `sections`      | the field descriptors — the form itself                                                                         |
| `config`        | the result of `defineConfig`                                                                                    |
| `value`         | the current values                                                                                              |
| `action`        | server action invoked on submit, receives the form data and the schema — see [forms/submit.md](forms/submit.md) |
| `onSuccess`     | called with the parsed data after `action` succeeds                                                             |
| `onValueChange` | called with `{ name, value }` on every change                                                                   |
| `readOnly`      | renders every field disabled                                                                                    |
| `translations`  | per-locale strings for labels, options and messages                                                             |
| `lang`          | the locale to resolve `translations` against                                                                    |
| `context`       | arbitrary values available to interpolation                                                                     |
| `definition`    | the JSON that [`$ref`](structure/definition.md) entries resolve against                                         |
| `advanced.step` | numbers the [sections](structure/sections.md#advancedstep-numbers-the-sections)                                 |
| `children`      | the form's control area — see [forms/submit.md](forms/submit.md#nothing-submits-without-a-control)              |

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
