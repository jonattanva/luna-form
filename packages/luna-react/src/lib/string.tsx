import { formatMarkdown as markdown } from '@luna-form/core'

export function formatMarkdown(text?: string): React.ReactNode {
  return markdown(
    text,
    (index: number, url: string, text?: string): React.ReactNode => {
      return (
        <a
          className="underline"
          href={url}
          key={`${url}-${index}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {text}
        </a>
      )
    }
  )
}
