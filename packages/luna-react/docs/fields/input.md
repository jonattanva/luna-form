# Input Fields (`input/*`, `textarea`, `checkbox`)

The `input/*` field types in Luna Form map to standard HTML `<input>` elements. These fields are used for capturing text, numbers, dates, times, and other generic data values from the user.

## Supported Types

- `input`: Same as `input/text`. The rendered `type` is taken from the part after the last `/`, and a bare `input` falls back to `text`.
- `input/text`: Standard text input (`<input type="text">`).
- `input/email`: Email address input with built-in format validation (`<input type="email">`).
- `input/password`: Password input with text masked (`<input type="password">`).
- `input/number`: Numeric input (`<input type="number">`).
- `input/tel`: Telephone number input (`<input type="tel">`).
- `input/date`: Date picker component.
- `input/time`: Time picker component.

---

## Core Properties

Luna Form's input fields inherit the standard logical properties available to all fields:

- **`name`** _(string, required)_: The unique identifier for the field in the form output.
- **`type`** _(string, required)_: Evaluates the type of input to render (e.g., `"input/text"`, `"input/password"`).
- **`label`** _(string, optional)_: The human-readable label shown to the user.
- **`defaultValue`** _(any, optional)_: The initial value of the field when the form is mounted and no external value is provided.
- **`description`** _(string | object, optional)_: Help text or extra context for the form field. Supports **Markdown** (specifically links).
  - Can be a direct string.
  - Or an object payload: `{ title: string, message: string, collapsed?: boolean }`.
- **`placeholder`** _(string, optional)_: The temporary placeholder text shown when the input is empty.
- **`required`** _(boolean, optional)_: If `true`, standard browser/HTML5 validation makes the field mandatory.
- **`disabled`** _(boolean, optional)_: If `true`, the field is non-interactive and blocked from events.
- **`readonly`** _(boolean, optional)_: If `true`, the field's value is locked and cannot be modified by the user.
- **`hidden`** _(boolean, optional)_: If `true`, the field is hidden from the user interface.
- **`order`** _(number, optional)_: A numeric order determining the field's position relative to adjacent fields.

---

## Advanced Configuration (`advanced` object)

The `advanced` property dictates finer HTML details, interactive structures, and native HTML attributes.

### Common Options

- **`autocomplete`** _(string)_: Standard HTML autocomplete attribute (e.g., `"username"`, `"off"`).
- **`cols`** _(number)_: Layout column span for CSS grid alignment.
- **`horizontal`** _(boolean)_: Overrides configuration layout to render label and input horizontally.
- **`reverse`** _(boolean)_: If `true`, reverses the flex direction.
- **`aria`** _(object)_: Map of specific ARIA attributes for screen readers (e.g., `{ "aria-label": "Custom label" }`).
- **`data`** _(object)_: Map of specific HTML data attributes (e.g., `{ "data-test-id": "my-field" }`).
- **`transient`** _(boolean)_: If `true`, the field fires its change events and keeps nothing of its own — it is neither stored nor reported to the consumer. For a control whose whole job is to write to _another_ field. See [Transient controls](../events/change.md#transient-controls).

### Text & Numeric Options (`input/text`, `input/email`, `input/tel`, `input/password`, `input/number`)

These basic field types support extra manipulation properties inside the `advanced` block:

- **`length`** _({ min?: number, max?: number })_: Applies HTML structural limits (`minlength` / `maxlength`, or `min` / `max` depending on the input type).
- **`transform`** _(string | string[])_: Safely intercepts user inputs and manipulates content dynamically. Options include:
  - `"lowercase"`
  - `"uppercase"`
  - `"remove-space"`
  - `"remove-accent"`

### Temporal Options (`input/date`, `input/time`)

Date and time inputs omit transformations and instead expose a `format` property directly under `advanced` for displaying values properly:

- **Date format** _(used with `input/date`)_: `"yyyy-MM-dd"`, `"MM/dd/yyyy"`, `"dd/MM/yyyy"`, or `"MMMM d, yyyy"`.
- **Time format** _(used with `input/time`)_: `"HH:mm"`, `"HH:mm:ss"`, `"hh:mm a"`, or `"hh:mm:ss a"`.

---

## Validation (`validation` object)

The `validation` object resolves form errors overriding generic defaults, mapping the constraint rule name directly to the specific error message string.

- **`required`** _(string)_: Specifies the error message exposed when the element is marked exactly as `required: true` and the field is empty.
- **`email`** _(string)_: Error message specifically asserting an invalid email format.
- **`length`** _({ min?: string, max?: string })_: Specific string messages shown when input lengths are breached.
- **`custom`** _(CustomValidation | CustomValidation[])_: Powerful conditional-based logic blocks. An array specifying:
  - `field`: Optional target reference string.
  - `operator`: Logical evaluation operations (e.g., `eq`, `neq`, `gt`, `lt`).
  - `message`: The resulting validation string.
- **`requiredWhen`** _(WhenRule | WhenRule[])_: Makes the field required only when a condition over a sibling field holds.
- **`pattern`** _(PatternRule)_: Validates the value against a regular expression (with optional interpolation bypass).
- **`rules`** _(AssertRule[])_: A list of gated assertions (`oneOf`, `min`/`max`, `pattern`, …).

_See the full [Validation reference](../validation/overview.md) for `requiredWhen`, `pattern`, `rules`, the operator vocabulary, and headless (server-side) validation._

---

## Events (`event` object)

You can attach logic-rich cascading events seamlessly directly inside the field schema.

- **`event.change`** _(ChangeEvent[])_: Triggers actions when logic runs. Common actions include emitting `value`, interacting with dependencies (`state`), or triggering data refetches (`source`). _Refer to the [Change Event Documentation](../events/change.md) for robust logic breakdowns._

---

## Complete Example Reference

```json
{
  "name": "username",
  "type": "input/text",
  "label": "User Nickname",
  "placeholder": "e.g. john_doe",
  "required": true,
  "description": {
    "title": "Rule",
    "message": "No spaces. No special characters.",
    "collapsed": true
  },
  "advanced": {
    "transform": ["lowercase", "remove-space"],
    "length": {
      "min": 4,
      "max": 20
    }
  },
  "validation": {
    "required": "You must provide a nickname to continue.",
    "length": {
      "min": "Your nickname needs at least 4 letters."
    }
  }
}
```

---

## `textarea`

Multi-line text. It takes the same core properties as an `input/*` field, and
two of the `advanced` options above apply to it: `length` and `autocomplete`.
Everything else in `advanced` is ignored for this type.

```json
{
  "name": "notes",
  "type": "textarea",
  "label": "Notes",
  "advanced": {
    "length": { "max": 500 }
  }
}
```

`length.min` and `length.max` are emitted as the `minLength` and `maxLength`
attributes on the rendered element.

Like the `input/*` family, a declared `change` event on a `textarea` is
debounced: it fires 300 ms after the last keystroke, not on every one.

---

## `checkbox`

A single boolean. It is the one field family whose value is not carried by
`value`: the rendered element receives `checked` instead.

```json
{
  "name": "accepted",
  "type": "checkbox",
  "label": "I accept the terms",
  "required": true
}
```

A missing value reads as unchecked rather than as an error.

**Do not use `defaultValue: false`.** A checkbox turns `defaultValue` into
`defaultChecked` by asking whether the value is present, not whether it is true,
and `false` is present. The box renders **checked**, which is the opposite of
what the declaration says. Omit `defaultValue` for an unchecked box, and use
`defaultValue: true` for a checked one.

Passing `false` as part of the form’s `value` is fine; it is only the
`defaultValue` shorthand that inverts.

For a group of options rather than a single flag, use `chips` or `radio` — see
[select.md](select.md).
