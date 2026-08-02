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

### 2. Year Selector (`select/year`)

Renders a dropdown with a range of years.

- **Default behavior**: Shows the current year plus the next 5 years.
- **Customization**: Use `advanced.length.min` and `advanced.length.max` to define the start and end years relative to the current year.

```json
{
  "name": "expiry_year",
  "type": "select/year",
  "label": "Expiration Year",
  "advanced": {
    "length": {
      "min": 0,
      "max": 10
    }
  }
}
```

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

Provides a comprehensive list of global timezones.

```json
{
  "name": "user_timezone",
  "type": "select/timezone",
  "label": "Your Timezone",
  "defaultValue": "America/New_York"
}
```

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

The option labels of these selectors are produced by the framework, not written in the schema, so they are **not** resolved against the `translations` dictionary the way an inline [array source](select.md#translating-options) is.

- `select/month`, `select/day`, `chips/day` and `chips/month` take their names from the form's `lang`, resolved through `Intl`. Without `lang` they fall back to the runtime locale, and a malformed tag (`es_MX`, `español`) falls back too rather than failing.
- `select/year` renders plain numbers.
- `select/active` renders `Yes` and `No`, and `select/timezone` renders its region groups and zone names in English.

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

To control the wording, declare an explicit `source`. It overrides the built-in options and, being an array, its labels go through the dictionary:

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
