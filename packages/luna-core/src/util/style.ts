import type { Style } from '../type'

export function mergeStyle(globalStyle?: Style, localStyle?: Style): Style {
  const result: Style = { ...globalStyle }

  // Undefined is not an opinion, and a spread cannot tell the two apart:
  // `{ ...{ compact: true }, ...{ compact: undefined } }` keeps the key and
  // drops the value, so a section that declared no `compact` of its own turned
  // the form-wide default off instead of inheriting it. An explicit `false`
  // still wins -- that is a local opinion, and opting out is the point of it.
  for (const key of Object.keys(localStyle ?? {}) as Array<keyof Style>) {
    const value = localStyle?.[key]
    if (value !== undefined) {
      result[key] = value
    }
  }

  return result
}
