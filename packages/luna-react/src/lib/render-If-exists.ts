export function renderIfExists<T>(
  value: T | undefined | null,
  render: (value: T) => React.ReactNode
): React.ReactNode {
  if (!value) {
    return null
  }
  return render(value)
}
