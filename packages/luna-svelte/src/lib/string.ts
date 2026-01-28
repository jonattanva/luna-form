import { formatMarkdown as markdown } from '@luna-form/core'

export type MarkdownPart = string | { url: string; text: string; index: number }

export function formatMarkdown(text?: string): MarkdownPart[] {
  const result = markdown(
    text,
    (index: number, url: string, text?: string): MarkdownPart => {
      return { url, text: text || url, index }
    }
  )

  if (!result) return []
  if (typeof result === 'string') return [result]
  return result as MarkdownPart[]
}
