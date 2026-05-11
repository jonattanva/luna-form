# Format Filters

Format filters transform interpolated values into locale-aware strings using a pipe syntax inspired by Vue and Angular.

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

## Locale resolution

Locale-aware filters read the locale from `config.env.locale`. If not set, filters fall back to the runtime default (typically the browser's locale).

```ts
const config = {
  env: {
    locale: 'es-ES',
  },
  // ...
}
```

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
  - `1234.56` with `currency:USD` and `locale: en-US` → `$1,234.56`.
  - `1234.56` with `currency:EUR` and `locale: es-ES` → `1234,56 €`.

### `percent`

Formats a fractional number as a percentage.

- **Syntax**: `{value | percent}`
- **Backend**: `Intl.NumberFormat(locale, { style: 'percent' })`.
- **Examples**:
  - `0.25` with `locale: en-US` → `25%`.
- **Note**: input is interpreted as a fraction (`1` is `100%`).

### `number`

Formats a number with locale-aware thousands separators.

- **Syntax**: `{value | number}`
- **Backend**: `Intl.NumberFormat(locale)`.
- **Examples**:
  - `1234567` with `locale: en-US` → `1,234,567`.
  - `1234567` with `locale: es-ES` → `1.234.567`.

### `date`

Formats a date or ISO string with a named style.

- **Syntax**: `{value | date:STYLE}`
- **Args**:
  - `STYLE` (string, default `"short"`) — one of `short`, `medium`, `long`, `full`, `relative`. Any other value is passed directly to `date-fns`'s `format` as a pattern.
- **Backend**: `date-fns` (`format`, `formatDistanceToNow` for `relative`).
- **Accepts**: `Date`, ISO string, or numeric timestamp (ms).
- **Examples**:
  - `"2026-05-10"` with `date:long` and `locale: en-US` → `May 10, 2026`.
  - A future date with `date:relative` and `locale: en-US` → `in 7 days`.

### `duration`

Produces a localized human-readable duration in years, months, days, hours, minutes, and seconds.

- **Syntax**: `{value | duration}` or `{value | duration:UNIT}`
- **Args**:
  - `UNIT` (string, default `"ms"`) — input unit when the value is a number. One of `ms`, `s`, `min`, `h`, `d`.
- **Backend**: `date-fns` (`formatDistanceToNow`, `formatDuration`, `intervalToDuration`).
- **Behavior depends on input type**:
  - **Number** (or numeric string): treated as a duration in `UNIT` units, converted to milliseconds, then formatted as a breakdown (`"1 day 2 hours"`).
  - **`Date` or non-numeric ISO string**: distance between the date and "now" with a suffix (`"3 months ago"`, `"in 2 days"`).
- **Multipliers to milliseconds**:

  | Unit  | Multiplier |
  |-------|------------|
  | `ms`  | 1          |
  | `s`   | 1,000      |
  | `min` | 60,000     |
  | `h`   | 3,600,000  |
  | `d`   | 86,400,000 |

- **Examples**:
  - `{age | duration:s}` with `3600` → `1 hour`.
  - `{wait | duration:min}` with `90` → `1 hour 30 minutes`.
  - `{ms | duration}` with `93_600_000` → `1 day 2 hours`.
  - `{createdAt | duration}` with an ISO date in the past → `3 months ago`.

## Supported locales

Out of the box, the following locales map to a `date-fns/locale` bundle for `date` (relative and pattern styles) and `duration`:

- `en`, `en-US` → `enUS`
- `es`, `es-ES`, `es-MX` → `es`

Other locale codes match by language prefix (e.g. `es-AR` → `es`). If no match is found, `enUS` is used as fallback.

`Intl`-backed filters (`currency`, `percent`, `number`) accept any well-formed BCP 47 locale tag supported by the runtime.
