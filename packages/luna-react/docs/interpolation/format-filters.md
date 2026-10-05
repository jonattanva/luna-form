# Format Filters

Format filters transform interpolated values into locale-aware strings using a pipe syntax inspired by Vue and Angular.

This page is the filter reference. What a placeholder resolves against in the first place — and it is not the same set everywhere — is [Interpolation](overview.md).

## Where filters can be used

Filters work in any string passed through Luna Form's interpolation engine, including:

- Field `description` (static or applied via a `state` change action)
- Field `label`
- `value` event payloads
- `source.url` and `source.body`

## Syntax

```
{key | filter:arg1:arg2}
```

- `key` is the value to look up in the interpolation context. Supports dot notation (`{user.amount}`).
- After `|` comes one or more filters separated by additional `|` pipes.
- Each filter accepts optional positional arguments separated by `:`.

Multiple filters can be chained; the output of the previous filter becomes the input of the next.

## Language

Filters format in the form's `lang`, the tag that also picks its translations
and names its months:

```tsx
<Form sections={sections} config={config} lang="es-ES" />
```

It applies wherever a filter is written — a label, a description, a `value` or
`source` payload — so one setting keeps them consistent. Without `lang`, or with
one that is no language tag or names no language the runtime has, filters write
English, on every machine. See
[Interpolation](overview.md#the-language-filters-use).

## Fallback rules

- **Unknown filter name**: the entire placeholder is preserved literally (`{value | foo}` stays as `{value | foo}`).
- **Invalid input** (NaN for numeric filters, unparseable date for date filters): the filter returns `String(value)` and the surrounding template still renders.
- **Missing key**: the placeholder is preserved literally.

## Reference

### `currency`

Formats a number as currency.

- **Syntax**: `{value | currency:CODE}`
- **Args**:
  - `CODE` (string, default `"USD"`) — ISO 4217 currency code.
- **Backend**: `Intl.NumberFormat(locale, { style: 'currency', currency: CODE })`.
- **Examples**:
  - `1234.56` with `currency:USD` and `lang: en-US` → `$1,234.56`.
  - `1234.56` with `currency:EUR` and `lang: es-ES` → `1234,56 €`.

### `percent`

Formats a fractional number as a percentage.

- **Syntax**: `{value | percent}`
- **Backend**: `Intl.NumberFormat(locale, { style: 'percent' })`.
- **Examples**:
  - `0.25` with `lang: en-US` → `25%`.
- **Note**: input is interpreted as a fraction (`1` is `100%`).

### `number`

Formats a number with locale-aware thousands separators.

- **Syntax**: `{value | number}`
- **Backend**: `Intl.NumberFormat(locale)`.
- **Examples**:
  - `1234567` with `lang: en-US` → `1,234,567`.
  - `1234567` with `lang: es-ES` → `1.234.567`.

### `date`

Formats a date or ISO string with a named style.

- **Syntax**: `{value | date:STYLE}`
- **Args**:
  - `STYLE` (string, default `"short"`) — one of `short`, `medium`, `long`, `full`, `relative`. Any other value is passed directly to `date-fns`'s `format` as a pattern.
- **Backend**: `Intl.DateTimeFormat` with `dateStyle` for the named styles, `Intl.RelativeTimeFormat` for `relative`, and `date-fns`'s `format` for a pattern.
- **Accepts**: `Date`, ISO string, or numeric timestamp (ms).
- **`relative`** is measured from [`context.now`](overview.md#the-instant-relative-dates-use), the instant the host passes, never from the clock of the machine that renders it. Without it the date is shown in the `medium` style.
- **Examples**:
  - `"2026-05-10"` with `date:long` and `lang: en-US` → `May 10, 2026`.
  - `"2026-05-10"` with `date:long` and `lang: es-ES` → `10 de mayo de 2026`.
  - `"2026-10-12T12:00:00Z"` with `date:relative`, `context.now` at `"2026-10-05T12:00:00Z"` and `lang: en-US` → `in 7 days`; with no `context.now` → `Oct 12, 2026`.

### `duration`

Produces a localized human-readable duration in years, months, days, hours, minutes, and seconds.

- **Syntax**: `{value | duration}` or `{value | duration:UNIT}`
- **Args**:
  - `UNIT` (string, default `"ms"`) — input unit when the value is a number. One of `ms`, `s`, `min`, `h`, `d`.
- **Backend**: `Intl.RelativeTimeFormat` for a date, and `date-fns` (`formatDuration`, `intervalToDuration`) for a number.
- **Behavior depends on input type**:
  - **Number** (or numeric string): treated as a duration in `UNIT` units, converted to milliseconds, then formatted as a breakdown (`"1 day 2 hours"`).
  - **`Date` or non-numeric ISO string**: distance between the date and [`context.now`](overview.md#the-instant-relative-dates-use) with a suffix (`"3 months ago"`, `"in 2 days"`). Without `context.now` the date is shown in the `medium` style.
- **Multipliers to milliseconds**:

  | Unit  | Multiplier |
  | ----- | ---------- |
  | `ms`  | 1          |
  | `s`   | 1,000      |
  | `min` | 60,000     |
  | `h`   | 3,600,000  |
  | `d`   | 86,400,000 |

- **Examples**:
  - `{age | duration:s}` with `3600` → `1 hour`.
  - `{wait | duration:min}` with `90` → `1 hour 30 minutes`.
  - `{ms | duration}` with `93_600_000` → `1 day 2 hours`.
  - `{createdAt | duration}` with `"2026-07-07T12:00:00Z"` and `context.now` at `"2026-10-05T12:00:00Z"` → `3 months ago`.

## Supported languages

The named date styles, `relative`, `currency`, `percent` and `number` are written by `Intl`, in any well-formed BCP 47 tag the runtime supports. In English the named styles read as they always did: `10/2/26`, `Oct 2, 2026`, `October 2, 2026`, `Friday, October 2, 2026`.

`relative` writes the distance in the largest unit that holds it once rounded: seconds, minutes, hours, days up to a month, months up to a year, and then years. `in 40 seconds`, `in 3 hours`, `in 1 month`; 59 minutes and 40 seconds is `1 hour ago`, and no distance at all is `now` (`ahora` in Spanish).

A date pattern (`date:dd/MM/yyyy`) and a `duration` of a number are written by `date-fns`, which the library ships in English and Spanish. A tag matches by its base language (`es-AR` writes Spanish), and any other language gets English names and units.
