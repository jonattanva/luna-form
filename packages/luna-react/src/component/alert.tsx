import type { Nullable } from '@luna-form/core'

export function Alert(
  props: Readonly<{
    title: string
    description?: string
    details?: Nullable<Record<string, string[]> | string[]>
  }>
) {
  const details = Array.isArray(props.details)
    ? props.details
    : props.details
      ? Object.values(props.details).flat()
      : null

  return (
    <div
      data-slot="alert"
      role="alert"
      className="relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border bg-transparent px-4 py-3 text-sm text-red-500 has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 *:data-[slot=alert-description]:text-red-500/90 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" x2="12" y1="8" y2="12" />
        <line x1="12" x2="12.01" y1="16" y2="16" />
      </svg>
      <div
        data-slot="alert-title"
        className="col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight"
      >
        {props.title}
      </div>
      <div
        data-slot="alert-description"
        className="col-start-2 grid justify-items-start gap-1 text-sm"
      >
        {props.description && <p>{props.description}</p>}
        {details && (
          <ul className="list-inside list-disc text-sm">
            {details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
