# Data Sources

The options of a `select`, `radio` or `chips` can be written in the schema or
fetched. This page is the fetched half: the shape of a `DataSource`, when a
request is actually made, and what happens when one is not.

Declaring options inline is covered in [select.md](select.md#1-static-options),
and mapping a fetched row onto `{ label, value }` in
[Property Mapping Reference](select.md#property-mapping-reference).

## The shape

```json
{
  "name": "country",
  "type": "select",
  "label": "Country",
  "source": {
    "url": "/api/countries",
    "method": "GET",
    "namespace": "data.results",
    "headers": { "X-Tenant": "acme" },
    "cache": "no-store"
  }
}
```

| Key         | Type                 | Does                                               |
| ----------- | -------------------- | -------------------------------------------------- |
| `url`       | `string`, required   | relative or absolute                               |
| `method`    | `string`             | defaults to `GET`                                  |
| `namespace` | `string`             | dot path to the array inside the response          |
| `headers`   | `HeadersInit`        | merged over `Accept: application/json`             |
| `body`      | `object \| BodyInit` | query parameters on a `GET`, a JSON body otherwise |
| `cache`     | `RequestCache`       | passed through to `fetch`                          |

## `body` changes meaning with the method

On a `GET`, each key of `body` is appended to the URL as a query parameter, and
keys holding `undefined` are dropped rather than sent as the string
`"undefined"`. On anything else the body is serialized as JSON and
`Content-Type: application/json` is added for you.

## `namespace` reaches into the response

An API that answers with the array itself needs nothing. One that wraps it needs
the dot path to it:

```json
{ "url": "/api/countries", "namespace": "data.results" }
```

If the response is already an array, `namespace` is ignored. If the path does
not lead to an array, the field renders with no options — the same outcome as an
empty response.

## When a request is made, and when it is not

Four ways to end up with an empty field and no request:

- **The source is an array.** Inline options are used as they are.
- **The URL still holds a placeholder.** A cascading source keyed on another
  field is not fetched until that placeholder resolves. This is deliberate and
  it is also what a typo produces — see
  [Interpolation](../interpolation/overview.md#an-unresolved-placeholder-cancels-a-request).
- **The URL is blocked** by [`fetcher.remotePatterns`](../setup.md#fetcherremotepatterns).
  This one is logged; the others are silent. Relative URLs are internal and
  always allowed.
- **The field is disabled.** Nothing is fetched, and a disabled `select` whose
  value is an object renders that object as its only option — so a saved
  selection is still readable on a form that cannot be edited.

Requests are keyed by the source itself, so two fields declaring the same one
share a single request and its cache entry.

## Failures

A non-2xx response throws with the parsed body, and the error is logged rather
than rendered: the field shows an empty list. A response that is not JSON fails
the same way, since the body is always parsed as JSON.

A URL containing the literal `null` or `undefined` in a path or query segment is
rejected before the request goes out — the usual sign that a placeholder
resolved to nothing.

## Changing a source at run time

A [`source` change event](../events/change.md#3-source-action-sourceevent)
installs a new `DataSource` on another field, with `{value}` and the rest of the
selected option interpolated into its `url` and `body`.

Several events aimed at the same target **merge** rather than replace: query
parameters from each URL are combined, `body` and `headers` are merged key by
key, and for anything else the most recent event wins. Two fields can each
contribute a parameter to one dependent source that way.

Options that arrive from a source are data, not authored copy, so they are not
resolved against the dictionary — see
[Translating Options](select.md#translating-options).

## Sharing one source between fields

A source used in more than one place belongs in a
[definition](../structure/definition.md), named once and referenced:

```json
{
  "source": { "$ref": "#/definition/sources.countries" }
}
```

A reference that does not resolve is left as written, and a `source` that is
still a `$ref` is never fetched.
