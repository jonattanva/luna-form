import { formatMarkdown } from '../lib/string'
import {
  interpolateIfNeeded,
  isString,
  translate,
  type Description as DescriptionType,
} from '@luna-form/core'
import type { Config } from '../type'

export function Description(
  props: Readonly<{ children: string | React.ReactNode; title?: string }>
) {
  return (
    <p
      className="-mt-2 text-xs leading-normal font-normal text-zinc-600 dark:text-zinc-400 [[data-slot=column]_&]:md:line-clamp-2"
      title={props.title}
    >
      {props.children}
    </p>
  )
}

export type DescriptionTextProps = Readonly<{
  config?: Config
  context?: Record<string, unknown>
  text?: DescriptionType
  translations?: Record<string, string>
}>

// A description as far as this tree can take it: the text, interpolated and
// translated. A description that declares a title is a collapsible help on the
// client, and the title becomes the tooltip here -- opening and closing is
// state, and the shared tree has to render without any.
export function DescriptionText(props: DescriptionTextProps) {
  const message = isString(props.text) ? props.text : props.text?.message
  if (!message) {
    return null
  }

  const interpolated = interpolateIfNeeded(
    message,
    { context: props.context, env: props.config?.env },
    { locale: props.config?.env?.locale as string | undefined }
  )

  return (
    <Description title={isString(props.text) ? undefined : props.text?.title}>
      {formatMarkdown(translate(interpolated, props.translations))}
    </Description>
  )
}
