import type { Nullable } from '@luna-form/core'

export function FieldError(
  props: Readonly<{
    errors?: Nullable<string[]>
    name?: string
  }>
) {
  if (!props.errors || props.errors.length === 0) {
    return null
  }

  return (
    <ul
      className="text-sm text-red-600 dark:text-red-500"
      id={props.name ? `${props.name}-error` : undefined}
    >
      {props.errors?.map((error, index) => (
        <li key={props.name ? `${props.name}-error-${index}` : index}>
          {error}
        </li>
      ))}
    </ul>
  )
}
