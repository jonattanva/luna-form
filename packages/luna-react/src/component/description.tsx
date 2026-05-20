export function Description(
  props: Readonly<{ children: string | React.ReactNode; title?: string }>
) {
  return (
    <p
      className="-mt-2 text-xs leading-normal font-normal text-zinc-600 dark:text-zinc-400 [[data-slot=column]_&]:md:line-clamp-2 [[data-slot=column]_&]:md:min-h-[2lh]"
      title={props.title}
    >
      {props.children}
    </p>
  )
}
