import { Description } from './description'
import { formatMarkdown } from '../lib/string'

export function FormattedDescription(props: Readonly<{ text?: string }>) {
  const content = formatMarkdown(props.text)
  if (content) {
    return <Description>{content}</Description>
  }
  return null
}
