# react-luna-form

Reference for the JSON that drives a luna form. These files ship inside the
published package, so what you are reading always describes the version you have
installed.

Forms are declared as data, not composed as components: a `sections` array of
field descriptors is the single source for what renders **and** for the Zod
schema that validates it. Most mistakes come from assuming otherwise.

Start at [setup.md](setup.md) if you are wiring the form up for the first
time: installing, styling, entry points, `defineConfig`, and the difference
between the client and server `Form`.

## Where to look

| You are                                                                      | Read                                                               |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Grouping fields into a titled, collapsible or numbered section               | [structure/sections.md](structure/sections.md)                     |
| Putting fields side by side, or a label beside its control                   | [structure/layout.md](structure/layout.md)                         |
| Reusing one piece of JSON across the form                                    | [structure/definition.md](structure/definition.md)                 |
| Declaring a text, number, date or password field                             | [fields/input.md](fields/input.md)                                 |
| Declaring a `select`, `radio` or `chips` field, or filling one from a source | [fields/select.md](fields/select.md)                               |
| Declaring a repeatable group of fields                                       | [fields/list.md](fields/list.md)                                   |
| Looking for a date range, a color or another ready-made picker               | [fields/specialized-selectors.md](fields/specialized-selectors.md) |
| Implementing a field type this library does not ship                         | [fields/custom-inputs.md](fields/custom-inputs.md)                 |
| Filling a `select` from an API                                               | [fields/data-source.md](fields/data-source.md)                     |
| Making a field required, or validating against another field                 | [validation/overview.md](validation/overview.md)                   |
| Handling the submit, a server action or the error summary                    | [forms/submit.md](forms/submit.md)                                 |
| Showing, hiding, clearing or filling a field when another one changes        | [events/change.md](events/change.md)                               |
| Writing a `{placeholder}` in a label, a description or an event              | [interpolation/overview.md](interpolation/overview.md)             |
| Formatting an interpolated value as currency, a date or a duration           | [interpolation/format-filters.md](interpolation/format-filters.md) |

## Three things that surprise people

Read the relevant page before writing the field, not after debugging it.

- **A field type nothing implements renders nothing at all.** `config.inputs`
  is an exact map, with no prefix resolution: a `type` that was never
  registered resolves to `undefined` and the field is skipped, on the server
  and on the client alike. No error, no placeholder — the field is simply
  absent from the form.
- **`defineConfig({ validation })` replaces the defaults, it does not merge.**
  Passing `{ change: false }` also turns off `blur`, `submit` and
  `showError` — the form loses its error summary and nothing says why. Pass
  every key you still want.
- **A `change` event also runs at mount.** A field that arrives with a value or
  a `defaultValue` fires its `change` events once, so anything they reveal,
  clear or fetch happens before the user touches the form. See
  [events/change.md](events/change.md).

## Entry points

| Import                   | Use                                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| `react-luna-form`        | The `Form` component and client hooks                                                       |
| `react-luna-form/config` | `defineConfig`, `defineInput`, `defineCustomInput` and the rest of the registration helpers |
| `react-luna-form/schema` | Building and inspecting the Zod schema derived from `sections`                              |
| `react-luna-form/server` | Server-safe helpers, usable under the `react-server` condition                              |
