# Input Fields (`input/*`)

The `input/*` field types in Luna Form map to standard HTML `<input>` elements. These fields are used for capturing text, numbers, dates, times, and other generic data values from the user.

## Supported Types

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
- **`description`** _(string | object, optional)_: Help text or extra context for the form field.
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
