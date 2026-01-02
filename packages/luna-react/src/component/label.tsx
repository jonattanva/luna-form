import { isCheckbox, isRadio, type Field } from '@luna-form/core'
import { twMerge } from 'tailwind-merge'

export function Label(
  props: Readonly<{
    children?: React.ReactNode
    field: Field
  }>
) {
  const normal = isRadio(props.field) || isCheckbox(props.field)

  return (
    <label
      data-slot="field-label"
      data-normal={normal}
      className={twMerge(
        'flex w-fit items-center gap-2 text-sm leading-snug font-medium select-none',
        'data-[normal=true]:font-normal',
        'group-data-[readonly=true]:cursor-not-allowed group-data-[readonly=true]:opacity-50'
      )}
      htmlFor={props.field.name}
    >
      {props.children}
      {!props.field.required && (
        <span className="text-sm text-slate-600 dark:text-slate-400">
          (Optional)
        </span>
      )}
    </label>
  )
}
