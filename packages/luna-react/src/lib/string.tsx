import {
  formatMarkdown as markdown,
  formatTemplate as template,
  type TemplateScope,
} from '@luna-form/core'

function renderLink(index: number, url: string, text?: string) {
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

export function formatMarkdown(text?: string): React.ReactNode {
  return markdown(text, renderLink)
}

// Text with placeholders in it. Only the template's own links render as links:
// what a placeholder resolves to is shown as text, whatever it looks like.
export function formatTemplate(
  text: string | undefined,
  scope: TemplateScope
): React.ReactNode {
  return template(text, scope, renderLink)
}
