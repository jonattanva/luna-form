import { formatMarkdown as markdown } from '@luna-form/core'

export type MarkdownPart =
  | string
  | {
      text?: string
      type: 'link'
      url: string
    }

export function formatMarkdown(text?: string): MarkdownPart[] {
  const result = markdown(
    text,
    (_index: number, url: string, text?: string) => ({
      text,
      type: 'link' as const,
      url,
    })
  )

  if (!result) {
    return []
  }

  return Array.isArray(result) ? result : [result]
}
