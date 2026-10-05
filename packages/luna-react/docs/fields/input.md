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
- **`disabled`** _(boolean, optional)_: If `true`, the field is non-interactive and blocked from events, and its value is not submitted.
- **`readonly`** _(boolean, optional)_: If `true`, the field's value is locked and cannot be modified by the user, but it is still submitted. The control renders disabled, the one lock every input component understands, and the form sends the value itself; a change the control sends anyway is not applied. A field that is both `readonly` and `disabled` is not submitted.
- **`hidden`** _(boolean, optional)_: If `true`, the field is hidden from the user interface.
- **`order`** _(number, optional)_: A numeric order determining the field's position relative to adjacent fields.

---

## Advanced Configuration (`advanced` object)

The `advanced` property dictates finer HTML details, interactive structures, and native HTML attributes.

### Common Options

- **`autocomplete`** _(string)_: Standard HTML autocomplete attribute (e.g., `"username"`, `"off"`).
- **`cols`** _(number)_: Layout column span for CSS grid alignment.
- **`horizontal`** _(boolean)_: Overrides configuration layout to render label and input horizontally.
- **`reverse`** _(boolean)_: `checkbox` only, and it exists to turn a default **off**. A checkbox renders its box first and its label after it; `reverse: false` swaps them, `true` changes nothing, and on any other field type the key is not read. See [Layout](../structure/layout.md#advancedreverse-checkbox-only).
- **`aria`** _(object)_: Map of specific ARIA attributes for screen readers (e.g., `{ "aria-label": "Custom label" }`).
- **`data`** _(object)_: Map of specific HTML data attributes (e.g., `{ "data-test-id": "my-field" }`).
- **`keepValue`** _(boolean)_: If `true`, hiding the field leaves its value behind instead of taking it — the field is put away rather than dropped. See [Keeping a value through a hide](../events/change.md#keeping-a-value-through-a-hide).
- **`transient`** _(boolean)_: If `true`, the field fires its change events and keeps nothing of its own — it is neither stored nor reported to the consumer. For a control whose whole job is to write to _another_ field. See [Transient controls](../events/change.md#transient-controls).

### Text & Numeric Options (`input/text`, `input/email`, `input/tel`, `input/password`, `input/number`)

These basic field types support extra manipulation properties inside the `advanced` block:

- **`length`** _({ min?: number, max?: number })_: Applies HTML structural limits (`minlength` / `maxlength`, or `min` / `max` depending on the input type). Each bound is a number, or a `$ref` the host resolves to one; see [A bound that is no number](#a-bound-that-is-no-number). On an `input/date` the bounds are days instead; see [The first and the last day](#the-first-and-the-last-day).
- **`step`** _(number)_ (`input/number` only): A number is whole unless it declares a step, which is the browser's own default of 1. The step is rendered on the input, so its arrows move by it, and validation accepts only values on it, counted from `length.min` when there is one, as the browser does: `0.01` for a price, `0.5` for halves, `0.001` for three decimals. A step has to be a number above 0. The browser ignores 0 and below, and so does the form; text such as `"any"` is no step either, and it is never rendered. Either way the number stays whole.
- **`transform`** _(string | string[])_: Safely intercepts user inputs and manipulates content dynamically. Options include:
  - `"lowercase"`
  - `"uppercase"`
  - `"remove-space"`
  - `"remove-accent"`

### Empty and required numbers

A required `input/number` accepts `0` and negative numbers: required means a value is present, not that it is at least 1. An optional one left empty is not submitted at all, rather than submitted as `0`, and its `length` bounds only apply to a value that is there. `select/year` and `select/month` read an empty selection the same way.

### A bound that is no number

On the types above, on a [`textarea`](#textarea), and on a type the form does not know, which it checks as text, a `length` bound is a number. A day such as `"2026-10-05"` is not one, nor is text that reads as one, such as `"3"`, nor a `$ref` the context does not hold or holds as `undefined`. Such a bound is a rule the form cannot read, so the field takes no value: anything in it is held back with `This value cannot be checked`, whatever else the field would have checked, such as the address of an `input/email` or the `step` of a number. An optional field left empty still passes, and a required one still asks for a value.

That is deliberate, as it is for [a date](#the-first-and-the-last-day): a server that validates with `buildFormSchema` and forgets its `context` would otherwise let through what the bound was there to keep out, with nothing in production to say so. The input is not handed such a bound, and a development build names it in the console, in the browser and on the server alike, once for each field:

```text
[Luna Form] when: advanced.length.min is "2026-10-05", which is no number, so the field takes no value
```

A minimum above the maximum, which no value passes, is named the same way.

### Temporal Options (`input/date`, `input/time`)

Date and time inputs omit transformations and instead expose a `format` property directly under `advanced` for displaying values properly:

- **Date format** _(used with `input/date`)_: `"yyyy-MM-dd"`, `"MM/dd/yyyy"`, `"dd/MM/yyyy"`, or `"MMMM d, yyyy"`.
- **Time format** _(used with `input/time`)_: `"HH:mm"`, `"HH:mm:ss"`, `"hh:mm a"`, or `"hh:mm:ss a"`.

### What a date holds

An `input/date` holds a day as `yyyy-MM-dd`, whatever its `format`, or two of them in [a range](#a-range-of-days). That is the value the form hands its component, reports through `onValueChange`, submits, and validates on the server with `buildFormSchema`. With [submit validation off](../forms/submit.md#turning-submit-validation-off), the action gets the raw `FormData` instead, where a single day is whatever its control holds; a range and a read-only field still carry `yyyy-MM-dd`, in the hidden inputs the form adds. `format` only says how the field shows the day, and reaches the component as its `data-format` prop (see [Date components](custom-inputs.md#date-components)).

- A value the host passes in, or a `defaultValue`, is read in either shape: `yyyy-MM-dd`, or the field's `format`. A host that keeps what the form submitted can pass it straight back.
- A `format` with month or day names reads them in English or in Spanish, the languages the form writes them in, so `octubre 2, 2026`, which a form in Spanish shows, reads back as `2026-10-02`.
- Text that is no day, typed in another format, with a year short of four digits, or naming a day that does not exist such as February 30, is kept as typed and holds the submit back with `validation.date`.
- An optional date left empty is not submitted at all, the way an empty number is not.
- In a description, `{value}` is the `yyyy-MM-dd` text. To show it another way, use a filter such as `{value | date:long}`.
- Everything that compares a date sees `yyyy-MM-dd` too: a `when`, a `custom` or `rules` validation, a change event. Write the dates they compare against that way, as in `"value": "2026-10-01"`.

### The first and the last day

`advanced.length` bounds an `input/date` the way it bounds a number: `min` is the first day a person may pick and `max` the last, both included, written as `yyyy-MM-dd` whatever the field's `format`. `validation.length.min` and `.max` are the messages for a day outside them; without one, the message names the bound the way the field shows a day.

```json
{
  "name": "check_in",
  "type": "input/date",
  "advanced": {
    "format": "dd/MM/yyyy",
    "length": { "min": "2026-10-05", "max": "2026-10-20" }
  },
  "validation": { "length": { "min": "We open on October 5" } }
}
```

The component gets the bounds as `min` and `max`, which a native `<input type="date">` uses as they are and a calendar reads back with `readDateProps` (see [Date components](custom-inputs.md#date-components)). The form checks them itself, so a day typed, passed in by the host or posted to the server outside them holds the submit back whatever the component allowed.

The form keeps no clock, so which day is today is the host's to say. Pass it in [`context`](../structure/definition.md#what-the-host-knows-context) and point the bound at it:

```json
"advanced": { "length": { "min": { "$ref": "#/context/today" } } }
```

```tsx
const context = useMemo(() => ({ today }), [today])

<Form sections={sections} context={context} config={config} />
```

The host decides the day and the time zone it is counted in, and a server that validates with `buildFormSchema(sections, translations, definition, context)` gets the same answer as the browser. Keep `context` the same object until the day changes: every field renders again when it is a new one (see [What the host knows](../structure/definition.md#what-the-host-knows-context)).

A bound that is no `yyyy-MM-dd` day, such as `"05/10/2026"`, or a `$ref` the context does not hold or holds as `undefined`, is a rule the form cannot read, so the field takes no day: every day is held back with `This date cannot be checked`, and an optional field left empty still passes. That is deliberate. A server that validates with `buildFormSchema` and forgets its `context` would otherwise let every day through, with nothing in production to say so. The component is not handed such a bound, and a development build names it in the console wherever the form reads the bounds, in the browser and on the server alike: once for each field, and again whenever a new `context` resolves them anew. A minimum later than the maximum, which no day passes, is named the same way.

### Days nobody can pick

`advanced.reserved` lists days nobody may pick, as `yyyy-MM-dd`: a night already booked, a holiday. `validation.reserved` is the message for one of them; without it, the message is `This date is not available`. The bounds are checked first, so a reserved day outside them gets the bound's message.

```json
{
  "name": "night",
  "type": "input/date",
  "advanced": { "reserved": ["2026-12-24", "2026-12-25"] },
  "validation": { "reserved": "That night is taken" }
}
```

What is booked is usually the host's to know, so the list usually comes through [`context`](../structure/definition.md#what-the-host-knows-context):

```json
"advanced": { "reserved": { "$ref": "#/context/booked" } }
```

The component gets the days as `data-reserved`, sorted, once each and joined by commas, and reads them back as a list with `readDateProps` (see [Date components](custom-inputs.md#date-components)). The form checks them itself, and a server that validates with `buildFormSchema(sections, translations, definition, context)` checks the list it is given at that moment. That holds back a submit made with an old list on screen; two submits for the same day at the same moment are told apart only by the application, when it saves.

An entry that is no `yyyy-MM-dd` day, or a list that is not one, such as a `$ref` the context does not hold, is a rule the form cannot read too: the field takes no day, with `This date cannot be checked`, rather than let a booked night through. A development build names both, the way it names a bound.

### A range of days

`advanced.mode: "range"` makes an `input/date` hold two days, the first and the last, as `[from, to]`, both `yyyy-MM-dd`. That pair is what the component gets, what the host is told and what the action receives. A range of one day has the same day at both ends.

```json
{
  "name": "stay",
  "type": "input/date",
  "advanced": { "mode": "range", "reserved": { "$ref": "#/context/booked" } },
  "validation": { "range": "Pick the first and the last night" }
}
```

```js
{
  stay: ['2026-11-02', '2026-11-06']
}
```

- Each end answers to the rules of a single day: the bounds, the reserved days, and `validation.date` for one that is no day. The days between the ends belong to the range too, so a reserved one anywhere inside holds it back.
- An end missing, or a last day before the first, holds the submit back with `validation.range`; without it, the message is `Invalid date range`.
- Nothing picked is no range: an optional one is not submitted, and a required one asks with `validation.required`.
- The form submits the two days itself, in two hidden inputs, so the component's control has no `name` and nothing it renders is sent. A host passes a range the way it gets one back, as `[from, to]`.
- A native `<input type="date">` holds one day. A range needs a component that picks two (see [Date components](custom-inputs.md#date-components)), or two date fields compared with a `custom` validation and `gte`.
- In a description, `{value}` stays as written: it takes one value, and a range is two.
- A range is a list of two days. `exists`, `empty`, `truthy` and `contains` read it the way they read any list, but the operators that order (`gt`, `gte`, `lt`, `lte`), and `eq` or `in` against a single day, never hold on it, so a `custom` rule that orders a range holds every submit back. Compare single dates instead.

### A booking, end to end

A stay that starts today at the earliest, within a year, and on no night already booked. The form declares the rules; the host knows the facts, and hands them over in `context`:

```json
{
  "name": "stay",
  "type": "input/date",
  "label": "Stay",
  "required": true,
  "advanced": {
    "format": "dd/MM/yyyy",
    "mode": "range",
    "length": {
      "min": { "$ref": "#/context/dates.today" },
      "max": { "$ref": "#/context/dates.inOneYear" }
    },
    "reserved": { "$ref": "#/context/booked" }
  },
  "validation": {
    "required": "Pick your stay",
    "range": "Pick the first and the last night",
    "length": {
      "min": "A stay cannot start in the past",
      "max": "We take bookings a year ahead"
    },
    "reserved": "A night in it is taken"
  }
}
```

Which day is today depends on where it is counted, so the host counts it where the business does, not where the server runs:

```ts
// In the application, not in the form.
import { addYears, format, parse } from 'date-fns'

// 'en-CA' writes a day as yyyy-MM-dd.
const day = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Bogota',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

export function formDates(now: Date) {
  const today = day.format(now)
  const next = addYears(parse(today, 'yyyy-MM-dd', new Date()), 1)
  return { today, inOneYear: format(next, 'yyyy-MM-dd') }
}
```

The page works the context out once per request, so it is the same object for as long as the form is on screen, and the server validates the submit with a context worked out when it arrives:

```tsx
const context = {
  dates: formDates(new Date()),
  booked: await bookedNights(roomId),
}

<Form sections={sections} context={context} config={config} action={book} />
```

```ts
// In the action: the same rules, against the nights booked by now.
const schema = buildFormSchema(sections, translations, definition, {
  dates: formDates(new Date()),
  booked: await bookedNights(roomId),
})
const result = schema.safeParse(form) // { stay: ['2026-11-02', '2026-11-06'] }
```

That holds back a stay chosen from a list that was old by the time it was sent. Two submits for the same night at the same moment are told apart only by the application, when it saves: the form is the first line, not the guarantee.

---

## Validation (`validation` object)

The `validation` object resolves form errors overriding generic defaults, mapping the constraint rule name directly to the specific error message string.

- **`required`** _(string)_: Specifies the error message exposed when the element is marked exactly as `required: true` and the field is empty.
- **`email`** _(string)_: Error message specifically asserting an invalid email format.
- **`date`** _(string)_: `input/date` only. The message shown when the field holds text that is no day. Without it, the message is `Invalid date`.
- **`length`** _({ min?: string, max?: string })_: Specific string messages shown when a value breaches `advanced.length`: a text too short or too long, a number out of range, a day before the first or after the last.
- **`reserved`** _(string)_: `input/date` only. The message shown for a day its `advanced.reserved` lists. Without it, the message is `This date is not available`.
- **`range`** _(string)_: `input/date` ranges only. The message shown for a range with an end missing, or whose last day comes before its first. Without it, the message is `Invalid date range`.
- **`step`** _(string)_: The message shown when an `input/number` is off its step: a decimal on a number that declares no step, or a value off the `advanced.step` it declares. The form's dictionary translates it, as it does every other message.
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
attributes on the rendered element, and validation checks the same bounds. A
bound that is no number is neither: see
[A bound that is no number](#a-bound-that-is-no-number).

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

A checkbox reads its state by truthiness, not by presence. `defaultValue: true`
starts it checked; `false`, an omitted value, `null` and `0` all start it clear.
A value passed to the form is read the same way, and both render paths agree.

For a group of options rather than a single flag, use `chips` or `radio` — see
[select.md](select.md).
