import { AlertCircleIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from './alert'

export function AlertForm(props: {
  title: string
  description?: string
  details?: Record<string, string[]> | string[] | null
}) {
  const details = Array.isArray(props.details)
    ? props.details
    : props.details
      ? Object.values(props.details).flat()
      : null

  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>{props.title}</AlertTitle>
      {props.description && (
        <AlertDescription>
          {props.description}
          {details && (
            <ul className="list-inside list-disc text-sm">
              {details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          )}
        </AlertDescription>
      )}
    </Alert>
  )
}
