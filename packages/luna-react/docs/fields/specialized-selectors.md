# Specialized Selectors

Specialized selectors in Luna Form come with pre-defined data sources, such as months, years, or timezones. These allow you to quickly implement common form fields without manually defining a `source` array.

## Date & Time Selectors

### 1. Month Selector (`select/month`)

Renders a dropdown with the 12 months of the year.

```json
{
  "name": "expiry_month",
  "type": "select/month",
  "label": "Expiration Month",
  "required": true
}
```

An optional month nobody picked is not submitted at all, and a required one asks for a value, the way an [`input/number`](input.md#empty-and-required-numbers) does.

### 2. Year Selector (`select/year`)

Renders a dropdown with the years from `advanced.length.min` to `advanced.length.max`, both included, written as whole numbers:

```json
{
  "name": "graduation_year",
  "type": "select/year",
  "label": "Graduation Year",
  "advanced": { "length": { "min": 1980, "max": 2030 } }
}
```

The form keeps no clock, so which year it is now is the host's to say, the way it says [which day is today](input.md#the-first-and-the-last-day) to a date. Pass the years in [`context`](../structure/definition.md#what-the-host-knows-context) and point the bounds at them:

```json
{
  "name": "expiry_year",
  "type": "select/year",
  "label": "Expiration Year",
  "advanced": {
    "length": {
      "min": { "$ref": "#/context/years.current" },
      "max": { "$ref": "#/context/years.inTen" }
    }
  }
}
```

```ts
// In the application, counted where the business is, not where the server runs.
const year = Number(
  new Intl.DateTimeFormat('en', {
    timeZone: 'America/Bogota',
    year: 'numeric',
  }).format(new Date())
)

const context = { years: { current: year, inTen: year + 10 } }
```

At 03:00 UTC on 1 January the year is already the next one in UTC and still the old one in Bogota, so the host decides where it is counted. The server renders and validates with the years it is given, the same ones the browser gets.

A year select needs both bounds. Without one, or with one that is no whole number, such as `"2026"` written as text or a `$ref` the context does not hold, it offers no year, and a development build names it in the console. A minimum after the maximum is named the same way.

The schema checks the same bounds, so a year outside them, from a host value or a submit made by hand, is held back with `validation.length.min` or `validation.length.max` as the message, or a default such as `Too small: expected number to be >=2026`. An optional year nobody picked is not submitted at all, and a required one asks for a value, the way an [`input/number`](input.md#empty-and-required-numbers) does.

### 3. Day Selector (`select/day`)

Renders a dropdown with days 1 through 31.

```json
{
  "name": "birth_day",
  "type": "select/day",
  "label": "Day"
}
```

### 4. Timezone Selector (`select/timezone`)

Provides every time zone the runtime knows, from `Intl.supportedValuesOf('timeZone')`, grouped by region. A field submits the zone's IANA name, such as `America/Bogota`.

```json
{
  "name": "meeting_zone",
  "type": "select/timezone",
  "label": "Time zone",
  "advanced": { "suggested": { "$ref": "#/context/user.timeZone" } }
}
```

```tsx
// Worked out once per request, on the server.
const context = {
  now: new Date().toISOString(),
  user: { timeZone: session.timeZone },
}

<Form sections={sections} context={context} config={config} />
```

- **`advanced.suggested`** is the zone offered first, alone in a "Suggested" group. The host knows it, from a profile, a cookie or a header, so it usually arrives through [`context`](../structure/definition.md#what-the-host-knows-context), and the server and the browser suggest the same one. Without it there is no "Suggested" group. A value that is no zone the runtime knows suggests nothing, and a development build names it in the console.
- **[`context.now`](../interpolation/overview.md#the-instant-relative-dates-use)** is the instant the zones are labelled for. A zone's offset depends on it, `Madrid - Central European (UTC+01:00)` in January and `(UTC+02:00)` in July, and so does its name, which some zones have changed over the years. Without it each zone is labelled by its city alone, `Madrid`.

The list is the runtime's own, so two engines can list different zones: Node and Chromium list `Asia/Calcutta` and leave out `UTC`, which can still be suggested.

---

## Utility Selectors

### 5. Active/Binary Selector (`select/active`)

A simple binary toggle, typically rendered as "Yes" and "No".

```json
{
  "name": "is_active",
  "type": "select/active",
  "label": "Account Active?",
  "defaultValue": "true"
}
```

---

## specialized Chips

These types render as buttons (tags) instead of dropdowns.

### 6. Day Chips (`chips/day`)

Renders chips for the 7 days of the week.

```json
{
  "name": "available_days",
  "type": "chips/day",
  "label": "Select Days",
  "advanced": {
    "multiple": true
  }
}
```

### 7. Month Chips (`chips/month`)

Renders chips for the 12 months of the year.

```json
{
  "name": "subscription_months",
  "type": "chips/month",
  "label": "Subscription Months"
}
```

---

## Localization

The option labels of these selectors are produced by the framework, not written in the schema, so most of them are resolved through the form's `lang` rather than against the `translations` dictionary the way an inline [array source](select.md#translating-options) is.

- `select/month`, `select/day`, `chips/day` and `chips/month` take their names from the form's `lang`, resolved through `Intl`. Without `lang` they fall back to the runtime locale, and a malformed tag (`es_MX`, `español`) falls back too rather than failing.
- `select/year` renders plain numbers.
- `select/timezone` renders its region groups and zone names in English.
- `select/active` is the exception: `Yes` and `No` are authored copy rather than locale data, so they **are** resolved against the dictionary, using their English text as the key — the same way the built-in `(Optional)` suffix is. The library ships the Spanish for both, so `lang: "es"` alone is enough; see [built-in translations](list.md#built-in-translations).

```json
{
  "lang": "es",
  "sections": [
    {
      "fields": [{ "name": "month", "type": "select/month" }]
    }
  ]
}
```

The dropdown lists `enero` through `diciembre`, while the submitted value stays the month number. Setting `lang` also keeps the server and client renders on the same locale; without it each side resolves its own default, which can differ.

`select/active` instead reads its two labels from the dictionary, and the library already ships the Spanish for them:

```json
{
  "lang": "es",
  "sections": [
    {
      "fields": [{ "name": "active", "type": "select/active" }]
    }
  ]
}
```

The dropdown lists `Sí` and `No`, while the submitted value stays the boolean. A `lang` with no built-in dictionary renders them in English, and a form that wants different wording declares the keys itself:

```json
{
  "lang": "es",
  "translations": { "es": { "Yes": "Activo", "No": "Inactivo" } }
}
```

To control the wording further — or to localize any of the locale-driven selectors — declare an explicit `source`. It overrides the built-in options and, being an array, its labels go through the dictionary:

```json
{
  "name": "active",
  "type": "select/active",
  "source": [
    { "value": "true", "label": "active_yes" },
    { "value": "false", "label": "active_no" }
  ]
}
```

For `select/timezone` the override must keep the group shape (`{ "label": "...", "items": [...] }`) that the grouped selector expects.
