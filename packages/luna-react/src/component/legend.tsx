import { formatMarkdown } from '../lib/string'

export function Legend(
  props: Readonly<{
    description?: string
    step?: number
    title?: string
  }>
) {
  const content = (
    <div className="flex flex-col">
      {props.title && (
        <legend className="mb-3 font-medium text-zinc-800 dark:text-zinc-200">
          {formatMarkdown(props.title)}
        </legend>
      )}
      {props.description && (
        <p className="-mt-2 text-sm leading-normal font-normal text-zinc-600 dark:text-zinc-400">
          {formatMarkdown(props.description)}
        </p>
      )}
    </div>
  )

  if (props.step) {
    return (
      <div className="flex flex-row items-start gap-4">
        <div className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full">
          <span className="text-sm font-bold">{props.step}</span>
        </div>
        {content}
      </div>
    )
  }

  return content
}
