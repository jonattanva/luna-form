import { formatMarkdown } from '../lib/string'

export function Legend(
  props: Readonly<{
    title?: string
    description?: string
  }>
) {
  return (
    <>
      <legend className="mb-3 font-medium text-slate-800 dark:text-slate-200">
        {formatMarkdown(props.title)}
      </legend>
      <p className="-mt-2 text-sm leading-normal font-normal text-slate-600 dark:text-slate-400">
        {formatMarkdown(props.description)}
      </p>
    </>
  )
}
