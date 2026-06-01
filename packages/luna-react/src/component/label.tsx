import {
  isCheckbox,
  isRadio,
  isString,
  translate,
  type Field,
  type Style,
} from '@luna-form/core'
import { twMerge } from 'tailwind-merge'

export function Label(
  props: Readonly<{
    children?: React.ReactNode
    field: Field
    style?: Style
    translations?: Record<string, string>
  }>
) {
  const showOptionalLabel = props.style?.showOptionalLabel ?? true
  const normal = isRadio(props.field) || isCheckbox(props.field)

  return (
    <label
      data-slot="field-label"
      data-normal={normal}
      className={twMerge(
        'flex w-fit items-center text-sm leading-snug font-medium select-none',
        'data-[normal=true]:font-normal [[data-slot=column]_&]:md:w-full',
        'group-data-[readonly=true]:cursor-not-allowed group-data-[readonly=true]:opacity-50'
      )}
      htmlFor={props.field.name}
      title={isString(props.children) ? props.children : undefined}
    >
      <span className="[[data-slot=column]_&]:md:truncate">
        {props.children}
      </span>
      {showOptionalLabel && !props.field.required && (
        <span className="ml-2 flex-shrink-0 text-sm text-zinc-600 dark:text-zinc-400">
          {translate('(Optional)', props.translations)}
        </span>
      )}
    </label>
  )
}
