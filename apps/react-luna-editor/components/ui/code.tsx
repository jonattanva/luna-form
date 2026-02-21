export function Code(props: Readonly<{ response: Record<string, unknown> }>) {
  return (
    <pre className="mt-1.5 w-full overflow-auto rounded-md p-4 text-xs">
      <code className="text-gray-900 dark:text-gray-100">
        {JSON.stringify(props.response, null, 2)}
      </code>
    </pre>
  )
}
