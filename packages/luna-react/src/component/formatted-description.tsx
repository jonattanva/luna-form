import { Description } from './description'
import { formatMarkdown } from '../lib/string'
import { interpolateIfNeeded, translate } from '@luna-form/core'
import type { Config } from '../type'

export function FormattedDescription(
  props: Readonly<{
    config?: Config
    context?: Record<string, unknown>
    text?: string
    translations?: Record<string, string>
  }>
) {
  const interpolateOpts = {
    context: props.context,
    env: props.config?.env,
  }

  const text = translate(
    interpolateIfNeeded(props.text, interpolateOpts),
    props.translations
  )

  const content = formatMarkdown(text)
  if (content) {
    return <Description>{content}</Description>
  }

  return null
}
