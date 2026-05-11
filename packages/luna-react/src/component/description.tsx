export function Description(
  props: Readonly<{ children: string | React.ReactNode }>
) {
  return (
    <p className="-mt-2 text-xs leading-normal font-normal text-zinc-600 dark:text-zinc-400">
      {props.children}
    </p>
  )
}
