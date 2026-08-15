# Change Event Documentation

The `change` event in Luna Form allows you to trigger a sequence of actions whenever the value of a specific field is modified. A `change` event is configured as an array of objects, where each object defines a distinct action.

Luna Form evaluates the array sequentially, applying the declared updates or conditions.

## Value Interpolation

In many actions (like `value`, `source`, and `state`), you may want to use the value of the field that triggered the change. You can use the special string `{value}` to capture and inject this value dynamically into strings or objects.

Placeholders also support format filters with pipe syntax (`{value | filter:arg}`) for locale-aware formatting of currency, dates, percentages, and durations. See [Format Filters](../interpolation/format-filters.md) for the full reference.

### Passing a structure rather than text

A placeholder is normally replaced _inside_ a string, so what comes out is text. When the template is **nothing but one placeholder** and the value behind it is an object or an array, the `value` action hands that value over untouched instead:

```json
{
  "action": "value",
  "value": { "rows": "{preset_rows}" }
}
```

If the triggering field's data carries `preset_rows` as an array, `rows` receives the array itself — not `"[object Object]"`, and not the literal `"{preset_rows}"`.

Three cases do **not** qualify and stay text, exactly as before:

- text around the placeholder — `"rows: {preset_rows}"`;
- a format filter — `"{preset_rows | currency:USD}"`, which formats into text by definition;
- a scalar behind the placeholder — `{value}` over the number `25` is still `"25"`.

This is what makes an array of rows expressible in a definition at all, and it is how a `list` gets filled. See [Targeting a list](#targeting-a-list).

## Target Resolution in Lists

When working with fields inside a `list`, targets are resolved globally (from the form root) by default. To target another field within the **same list item**, use the following syntax:

`"listName/fieldName"`

This tells Luna Form to find the current iteration of `listName` and update the `fieldName` within that specific row.

**Example:**
If you have a list named `users` and you want one field to update another field called `nickname` in same row:

```json
{
  "name": "fullname",
  "event": {
    "change": [
      {
        "action": "value",
        "value": {
          "users/nickname": "{value}"
        }
      }
    ]
  }
}
```

If you specify `"nickname"` (without the list prefix and slash), it will attempt to update a field named `nickname` at the root of the form.

## Supported Actions

The `change` event array supports three action types, indicated by the `action` property: `value`, `state`, and `source`.

---

### 1. Value Action (`ValueEvent`)

The `value` action is used to explicitly set or update the value of one or more fields elsewhere in the form when the current field changes.

**Properties:**

- `action` (string): Must be set to `"value"`.
- `value` (object): A key-value mapping where each key represents a target field name, and the value is the new data to apply to that field. You can use string interpolation like `{value}` to pass the changed value.
- `onlyIfTargetEmpty` (boolean, optional): If `true`, the target field's value will only be updated if it is currently empty. Useful for applying default or propagated values without overwriting user input. Ignored when the target is a `list` — a list has no single value to call empty.

**Example:**

```json
{
  "event": {
    "change": [
      {
        "action": "value",
        "onlyIfTargetEmpty": true,
        "value": {
          "billingAddress": "{value}",
          "hasProvidedAddress": true
        }
      }
    ]
  }
}
```

#### Targeting a list

A `list` is a valid target. Give it an array of objects and it becomes exactly those rows — one object per row, each key matching a field name inside the list:

```json
{
  "label": "Preset",
  "name": "preset",
  "type": "select",
  "advanced": { "transient": true },
  "source": [
    { "label": "Empty", "value": "empty", "preset_rows": [] },
    {
      "label": "Two rows",
      "value": "two",
      "preset_rows": [
        { "key": "alpha", "amount": "1" },
        { "key": "beta", "amount": "2" }
      ]
    }
  ],
  "event": {
    "change": [{ "action": "value", "value": { "rows": "{preset_rows}" } }]
  }
}
```

Points worth knowing:

- **It assigns, it does not add.** The list ends up with the rows you gave it and nothing else; the values of the rows that went away are discarded. To append, send the current array plus the new element — the sender is the one that knows what is already there.
- **`advanced.length` still applies.** A shorter array leaves the remainder standing and empty up to `min` and anything past `max` is dropped — the same clamp an initial `value` gets at mount, so a list holds the same rows however they arrived.
- **Rows that survive keep their identity.** They are matched by position, so growing a list does not remount the rows already on screen, and a caret sitting in one of them stays put.
- **A row that only carries some of the keys leaves the rest empty**, rather than keeping what the previous row in that position had.
- **Assigning what is already there does nothing.** No rebuild, and no report to the consumer. Deduplication is still the sender's job, though: this only recognises an assignment that matches the list as a whole, and by the time it does the event has already been raised.

A **nested** list works the same way, reached with the relative syntax described in [Target Resolution in Lists](#target-resolution-in-lists). A field inside a row of `group` fills the `items` list in its own row with `"group/items"`; the plain name would not reach it, because once rendered a nested list is called by its path (`group.0.items`).

#### Rows that hold rows

A row's key can name a field that is itself a `list`, in which case its value is that list's rows rather than a value. The whole tree is assigned in one event, as deep as the lists go:

```json
{
  "action": "value",
  "value": {
    "groups": [
      {
        "name": "First",
        "checks": [
          { "key": "alpha", "amount": "1" },
          { "key": "beta", "amount": "2" }
        ]
      },
      { "name": "Second", "checks": [{ "key": "gamma", "amount": "3" }] }
    ]
  }
}
```

Every rule above holds one level down as well: an inner list assigns rather than adds, honours its own `advanced.length`, and keeps the identity of the rows that survive. Two more only come up here:

- **A row that names an inner list without giving it rows empties it.** `"checks": []`, a `checks` key holding something that is not rows, and no `checks` key at all all mean the same thing — none — rather than leaving behind what the row in that position had.
- **The consumer is told once for the whole tree**, under the outer list's name, with the inner rows already in it. The inner lists then report their own paths (`groups.0.checks`) as they take their rows, the same way they do when a row is added or removed by hand.

This is what the relative syntax cannot do. `"groups/checks"` reaches the inner list of the row the sender is sitting in, and `"groups.0.checks"` reaches the first one; neither can say "every group", so a control that appends a group has to assign the outer list and carry the inner rows along with it.

The picker above is marked [`transient`](#transient-controls) because its job is to fill the list, not to hold a value of its own.

#### Transient controls

A field whose entire job is to write somewhere else can declare `"advanced": { "transient": true }`. It fires its change events and keeps nothing: it is not stored, and the consumer is never told about it.

Without it, the control also saves whatever it emitted, and a value the user can neither see nor edit ends up in the submitted form and in whatever the consumer persists.

Two consequences to expect:

- **It shows nothing back**, because there is no value to show. On a visible text input, typing will not stick.
- **Choosing the same value twice in a row acts twice**, where an ordinary field treats the repeat as a no-op. For a command that is the point — pressing a button again is meant to do the thing again.

It does not go with `required` or `validation`, which would demand a value that by definition never arrives and block the submit with nothing on screen to explain why.

---

### 2. State Action (`StateEvent`)

The `state` action modifies the interactive state or visibility of other fields based on the changed value.

**Properties:**

- `action` (string): Must be set to `"state"`.
- `target` (string | array of strings): The field name, or an array of field names, that the state modifications should be applied to.
- `state` (object): An object containing the new state to apply. Properties are independent of field names — the form may safely contain a field whose `name` is `"description"`, `"disabled"` or `"hidden"`; `target` identifies the field, the keys inside `state` configure it.
  - `disabled` (boolean, optional): Whether the field should be disabled.
  - `hidden` (boolean, optional): Whether the field should be hidden from view. **Note:** When a field becomes hidden (`hidden: true`), its current value is automatically cleared from the form state to ensure no non-applicable data is submitted.
  - `description` (string | object, optional): A new description to render for the target field. Supports interpolation, format filters, and **Markdown** (specifically links). e.g. `"Check our [terms](https://example.com) for details."`.
- `when` (string | array of strings | [Condition object](#the-condition-object), optional): A condition that specifies when this state should be applied.
  - If a **string** is provided, it matches exactly against the field's new value.
  - If an **array of strings** is provided, it performs an **OR match** (the state is applied if the field's new value matches _any_ string in the array).
  - If a **Condition object** is provided, it evaluates complex logic.

**Example:**

```json
{
  "event": {
    "change": [
      {
        "action": "state",
        "target": ["creditCardNumber", "cvvCode"],
        "state": {
          "disabled": false,
          "hidden": false
        },
        "when": "credit_card"
      },
      {
        "action": "state",
        "target": "paypalEmail",
        "state": {
          "hidden": false
        },
        "when": {
          "operator": "eq",
          "value": "paypal"
        }
      }
    ]
  }
}
```

**Updating description with interpolation and filters:**

```json
{
  "label": "Price",
  "name": "price",
  "type": "input/text",
  "event": {
    "change": [
      {
        "action": "state",
        "target": "price",
        "state": {
          "description": "Total to pay: {value | currency:USD}"
        },
        "when": {
          "operator": "neq",
          "value": ""
        }
      }
    ]
  }
}
```

---

### 3. Source Action (`SourceEvent`)

The `source` action dispatches a request to a remote data source to fetch and populate data into a target field. This is commonly used for cascading selections (e.g., selecting a Country fetches its related States).

**Properties:**

- `action` (string): Must be set to `"source"`.
- `target` (string): The target field that will receive the data resolved from the source request (like a "select" field for States).
- `source` (DataSource object): The configuration object for fetching remote data (typically includes `url`, mapping keys, namespace, etc.).

**Example:**

```json
{
  "event": {
    "change": [
      {
        "action": "source",
        "target": "stateField",
        "source": {
          "url": "/api/states?countryId={value}"
        }
      }
    ]
  }
}
```

---

## Sequencing Actions

Because `change` takes an array, multiple different events can be sequenced together to build complex logic flows.

**Chained Example:**

```json
{
  "name": "paymentMethod",
  "type": "radio",
  "event": {
    "change": [
      {
        "action": "value",
        "value": {
          "transactionFee": "0.00"
        }
      },
      {
        "action": "state",
        "target": "creditCardGroup",
        "state": {
          "hidden": true
        },
        "when": ["paypal", "bank_transfer"]
      }
    ]
  }
}
```

---

## The `Condition` Object

In the `state` action (and potentially other areas), the `when` property can be defined as a `Condition` object for more complex logical evaluations, rather than a simple equality check.

### Properties:

- `operator` (string, optional): The logical operator to apply. Defaults to `"eq"` (equals). Supported operators are:
  - `"eq"`: Equals
  - `"neq"`: Not equals
  - `"in"`: In array (value is within the specified list)
  - `"nin"`: Not in array
  - `"gt"`: Greater than
  - `"gte"`: Greater than or equal
  - `"lt"`: Less than
  - `"lte"`: Less than or equal
- `value` (string | number | array): The target value to compare against the field's current value.
- `field` (string, optional): If specified, the condition evaluates the value of _another_ field instead of the field that triggered the change event.

### Examples of Conditions

**1. Greater Than Operator (`gt`):**
Enable a "Discount Code" field only if the "Total Amount" is greater than 100.

```json
{
  "action": "state",
  "target": "discountCode",
  "state": { "disabled": false },
  "when": {
    "operator": "gt",
    "value": 100
  }
}
```

**2. Not In Array Operator (`nin`):**
Hide a "State/Province" field if the selected "Country" is not in a specific list.

```json
{
  "action": "state",
  "target": "stateProvince",
  "state": { "hidden": true },
  "when": {
    "operator": "nin",
    "value": ["US", "CA", "MX"]
  }
}
```

---
