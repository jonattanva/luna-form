# Change Event Documentation

The `change` event in Luna Form allows you to trigger a sequence of actions whenever the value of a specific field is modified. A `change` event is configured as an array of objects, where each object defines a distinct action.

Luna Form evaluates the array sequentially, applying the declared updates or conditions.

## Value Interpolation

In many actions (like `value`, `source`, and `state`), you may want to use the value of the field that triggered the change. You can use the special string `{value}` to capture and inject this value dynamically into strings or objects.

Placeholders also support format filters with pipe syntax (`{value | filter:arg}`) for locale-aware formatting of currency, dates, percentages, and durations. See [Format Filters](../interpolation/format-filters.md) for the full reference.

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
- `onlyIfTargetEmpty` (boolean, optional): If `true`, the target field's value will only be updated if it is currently empty. Useful for applying default or propagated values without overwriting user input.

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

---

### 2. State Action (`StateEvent`)

The `state` action modifies the interactive state or visibility of other fields based on the changed value.

**Properties:**

- `action` (string): Must be set to `"state"`.
- `target` (string | array of strings): The field name, or an array of field names, that the state modifications should be applied to.
- `state` (object): An object containing the new state to apply. Properties are independent of field names — the form may safely contain a field whose `name` is `"description"`, `"disabled"` or `"hidden"`; `target` identifies the field, the keys inside `state` configure it.
  - `disabled` (boolean, optional): Whether the field should be disabled.
  - `hidden` (boolean, optional): Whether the field should be hidden from view.
  - `description` (string | object, optional): A new description to render for the target field. Supports interpolation and format filters, e.g. `"Total to pay: {value | currency:USD}"`.
- `when` (string | array of strings | [Condition object](#the-condition-object), optional): A condition that specifies when this state should be applied. If the condition evaluates to true (or the field's new value matches the string/array), the state properties are applied.

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
