export function Description(
  props: Readonly<{ children: string | React.ReactNode }>
) {
  return (
    <p className="-mt-2 text-xs leading-normal font-normal text-slate-600 dark:text-slate-400">
      {props.children}
    </p>
  )
}
