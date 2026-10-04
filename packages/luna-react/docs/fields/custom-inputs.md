# Custom Inputs

A field `type` that this library does not ship can be implemented by the host
application and registered under its own name. This is how a form gets a people
picker, a credential selector, or any control that only makes sense inside one
product.

## Registering

```ts
import {
  defineConfig,
  defineCustomInput,
  defineInput,
} from 'react-luna-form/config'
import { PeoplePicker } from './components/people-picker'

export default defineConfig({
  inputs: [
    defineInput(Input),
    defineCustomInput('people/picker', PeoplePicker),
  ],
})
```

`defineCustomInput(types, component)` takes one name or an array of names. Every
name becomes a key in `config.inputs`.

**The lookup is an exact string match.** There is no prefix resolution: naming a
field `people/picker` does not fall back to `people`, and naming it
`select/mine` does not fall back to `select`. `defineConfig` writes one entry per
registered string, and rendering reads `config.inputs[field.type]` directly.

**A type nothing registers renders nothing at all.** The lookup returns
`undefined`, the field is skipped, and the form renders without it — on the
server and on the client alike. There is no error, no warning and no
placeholder, so a typo in a `type` looks exactly like a field somebody chose not
to include. Check the spelling against your `defineConfig` when a field does not
appear.

## What your component receives

Props are applied in this order:

```tsx
<Component
  {...dataAttributes} // advanced.data, as data-* attributes
  {...commonProps} // id, name, placeholder, disabled, required, and what the field family adds
  {...ariaAttributes} // advanced.aria, and aria-invalid, aria-errormessage
  {...inputProps} // the prepared value or defaultValue
  onBlur={onBlur}
  onChange={onChange}
/>
```

`advanced.data` comes first, so an attribute the form writes for its own rules,
such as the `data-format` of a date, keeps the form's value whatever
`advanced.data` declares under the same name.

`onChange` and `onBlur` are applied **last**, after every spread. A component
that forwards its props unchanged gets them for free. A component that declares
its own handlers must call the ones it received, or the form never learns the
value changed: validation will not run, and neither will any `change` event the
field declares.

A `readonly` field arrives `disabled` and without a `name`. Its value is still
submitted, but by the form, in hidden inputs of its own: nothing your component
renders for it is sent, so it is sent once, whatever your component renders.
While a field is disabled or read-only, a change your component sends is not
applied, so a part of it left enabled cannot change the value.

## Forwarding `id` is what gives the field its name

The label is rendered by this library, outside your component, as
`<label htmlFor={field.name}>`. The matching `id` arrives in your props.

If your component does not put that `id` on the element the user actually
focuses, the label points at nothing. The field still works with a mouse, so
nothing looks broken — but it has no accessible name, screen readers announce it
as unlabelled, and a test that reaches fields by their label cannot find it.

```tsx
// Correct: the id reaches the real input.
function PeoplePicker({ ...props }: React.ComponentProps<'input'>) {
  return <input {...props} />
}

// Wrong: the id lands on a wrapper the label does not point to.
function PeoplePicker({ id, ...props }: React.ComponentProps<'input'>) {
  return (
    <div id={id}>
      <input {...props} />
    </div>
  )
}
```

The same applies when you build on a component library: whatever primitive
renders the focusable element is where the `id` belongs.

## Clearing a value on a select-family type

If you register a custom input under a `select` variant, be aware that an
`onChange('')` is **discarded**, not applied. Radix and similar components
re-emit `onChange("")` when a trigger remounts, and an empty string is never a
real selection, so the library drops it rather than wipe a value the user
already chose.

The consequence for a custom input: emitting an empty string to clear the field
does nothing. Emit a sentinel value your own code recognises, and translate it
back where you read the form.

This applies only to select-family fields. Text fields pass an empty string
through unchanged.

## Change events are debounced on text fields

For `input/*` and `textarea`, a declared `change` event fires 300 ms after the
last keystroke, not on every one. If you are testing a custom text input that
triggers a change event, wait for that window rather than asserting immediately.

Select-family fields dispatch straight away.

## Server and client

The same registered component is used by both render paths. If your custom
input needs browser APIs, state or effects, mark it `'use client'` as you would
any other component — the library does not do it for you.

## Date components

A component registered for `input/date` gets the field's day and its rules as
plain props, and only renders. The form reads what it emits, checks every rule
itself, on submit and on the server, and submits the value. Any calendar can
render the field, and a native `<input type="date">` needs nothing at all.

### What it receives

| Prop            | Example                                        | What it is                                                                                                                           |
| --------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `value`         | `"2026-10-02"`, `["2026-10-01", "2026-10-05"]` | The day as `yyyy-MM-dd`, from the client `Form`. A [range](input.md#a-range-of-days) is `[from, to]`, `''` for an end not picked yet |
| `defaultValue`  | the same                                       | The same, from the server `Form`                                                                                                     |
| `data-format`   | `"dd/MM/yyyy"`                                 | How to show the day, in date-fns tokens                                                                                              |
| `data-mode`     | `"range"`                                      | Only on a range                                                                                                                      |
| `min`, `max`    | `"2026-10-01"`                                 | [The first and the last day](input.md#the-first-and-the-last-day), both included                                                     |
| `data-reserved` | `"2026-12-24,2026-12-25"`                      | [Days nobody can pick](input.md#days-nobody-can-pick)                                                                                |
| `name`          | `"stay"`                                       | Absent, in the client `Form`, on a range and on a read-only field: the form submits those itself                                     |

Read the props with `readDateProps` instead of by attribute name, so the
component keeps working whatever the form puts on them next:

```ts
import { readDateProps } from 'react-luna-form/config'

const { format, mode, min, max, reserved } = readDateProps(props)
```

`mode` is `'single'` or `'range'`. `min` and `max` come back only when they are
days, so a component can test them for `undefined` and nothing else. `reserved`
is always a list, empty when nothing is reserved, sorted and with each day once.
It is the same array for as long as the days are, so a component can memoize on
it.

### What it emits

- One day: `onChange({ target: { value } })` with `yyyy-MM-dd` for a day the
  user picked, or with the text as the user typed it. The form reads text in
  the field's format, and keeps anything else as typed so that validation can
  say what is wrong with it.
- A range: `onChange({ target: { value: [from, to] } })`, with `''` for an end
  not picked yet, or `''` once nothing is picked.
- `onBlur` when the user leaves the component: that is when the form validates
  the field.

A calendar should offer no day outside `min` and `max` nor any in `reserved`,
and a read-only or disabled field nothing to pick from. The form holds a wrong
day back anyway, and ignores the change a locked field's component sends, but a
person should not be able to pick it.

### A calendar, in a few lines

One day picked in react-day-picker, which is what shadcn's `Calendar` renders:

```tsx
'use client'

import { format as formatDay, isValid, parse } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import { readDateProps } from 'react-luna-form/config'

// A day, read in local time: see the first mistake below.
function toDay(iso?: string) {
  const day = iso ? parse(iso, 'yyyy-MM-dd', new Date()) : undefined
  return day && isValid(day) ? day : undefined
}

function toIso(day?: Date) {
  return day ? formatDay(day, 'yyyy-MM-dd') : ''
}

export function CalendarDate(
  props: Readonly<{
    'data-format'?: string
    'data-reserved'?: string
    defaultValue?: string
    max?: string
    min?: string
    onChange?: (event: { target: { value: string } }) => void
    value?: string
  }>
) {
  const { min, max, reserved } = readDateProps(props)
  const booked = new Set(reserved)
  const first = toDay(min)
  const last = toDay(max)

  return (
    <DayPicker
      mode="single"
      selected={toDay(props.value ?? props.defaultValue)}
      onSelect={(day) => props.onChange?.({ target: { value: toIso(day) } })}
      disabled={[
        ...(first ? [{ before: first }] : []),
        ...(last ? [{ after: last }] : []),
        (day: Date) => booked.has(toIso(day)),
      ]}
      startMonth={first}
      endMonth={last}
    />
  )
}
```

A range is the same with `mode="range"`, `selected={{ from, to }}` and
`onSelect={(range) => ...}` emitting `[toIso(range.from), toIso(range.to)]`.

### Mapping to common libraries

| luna-form gives     | react-day-picker (shadcn `Calendar`)                           | MUI X                                                               | `<input type="date">`                        |
| ------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------- |
| `value`, one day    | `selected={toDay(value)}`                                      | `value={dayjs(value)}`                                              | `value` as it is                             |
| `value`, a range    | `mode="range"`, `selected={{ from, to }}`                      | `DateRangePicker` (Pro) with `[dayjs(from), dayjs(to)]`             | none: two date fields and a `custom` rule    |
| `onChange`          | from `onSelect`, with `format(day, 'yyyy-MM-dd')`              | from `onChange`, with `day.format('YYYY-MM-DD')`                    | native                                       |
| `min`, `max`        | `disabled={[{ before }, { after }]}`, `startMonth`, `endMonth` | `minDate`, `maxDate`                                                | native                                       |
| `data-reserved`     | `disabled` with a function that looks the day up in a set      | `shouldDisableDate={(day) => booked.has(day.format('YYYY-MM-DD'))}` | not shown; the form checks it all the same   |
| `data-mode="range"` | `excludeDisabled`, `numberOfMonths={2}`                        | `DateRangePicker`                                                   | not supported                                |
| `data-format`       | the text box: `format(day, dataFormat)`                        | `format`, in dayjs tokens                                           | ignored: the browser shows the user's locale |

### Mistakes that are easy to make

1. **`new Date("2026-10-02")` is midnight UTC**, which is the day before
   anywhere west of Greenwich: a calendar fed that marks the wrong day. Read a
   `yyyy-MM-dd` day in local time, with `parse(iso, 'yyyy-MM-dd', new Date())`
   or `new Date(year, month - 1, day)`.
2. **In range mode, react-day-picker's `min` and `max` are numbers:** how many
   days the range must or may span, not its first and last day. Spread the
   form's props onto `<Calendar>` and a date lands where a count is expected:
   hand it only what the component works out.
3. **`startMonth` and `endMonth` only limit navigation.** The days outside the
   bounds are disabled with `disabled`.
4. **MUI takes dayjs tokens, `advanced.format` is in date-fns tokens:**
   `dd/MM/yyyy` is `DD/MM/YYYY` there. Translate the format rather than pass it
   through.
5. **Disabling a day in the calendar validates nothing.** A typed date, a value
   from the host and a payload posted to the server never pass through the
   calendar; the form checks them, so the component does not have to.

## Checklist

Before shipping a custom input:

- Its `type` string matches `defineCustomInput` exactly, character for character
- The `id` it receives reaches the focusable element
- It forwards or calls the `onChange` and `onBlur` it receives
- If it is a select variant, it does not rely on `''` to clear
- If it renders `input/date`, it reads and emits `yyyy-MM-dd`, or `[from, to]`
  for a range, offers no day outside `min` and `max` nor any in `reserved`, and
  nothing to pick while it is disabled
